#!/bin/bash
# Deuce Diary Autoresearch Runner
# Autonomous code improvement loop using local Ollama model
# Usage: ./runner.sh [max_experiments] [model]

set -euo pipefail

PROJECT_DIR="$HOME/Projects/DeuceDiary"
AUTORESEARCH_DIR="$PROJECT_DIR/autoresearch"
LOG_FILE="$AUTORESEARCH_DIR/experiments.log"
PROGRAM="$AUTORESEARCH_DIR/program.md"
MAX_EXPERIMENTS="${1:-20}"
MODEL="${2:-qwen3.5:9b}"
OLLAMA_URL="http://localhost:11434/api/generate"
BRANCH="autoresearch-$(date +%Y%m%d-%H%M%S)"

cd "$PROJECT_DIR"

# --- Helpers ---

log() {
  local msg="[$(date '+%Y-%m-%d %H:%M:%S')] $1"
  echo "$msg"
  echo "$msg" >> "$LOG_FILE"
}

get_test_results() {
  # Run tests, capture output, extract pass/fail counts
  local output
  output=$(npm test 2>&1) || true
  local passed=$(echo "$output" | grep -oE '[0-9]+ passed' | grep -oE '[0-9]+' || echo "0")
  local failed=$(echo "$output" | grep -oE '[0-9]+ failed' | grep -oE '[0-9]+' || echo "0")
  local duration=$(echo "$output" | grep -oE 'Duration [0-9.]+s' | grep -oE '[0-9.]+' || echo "0")
  echo "$passed|$failed|$duration"
}

get_recent_history() {
  if [ -f "$LOG_FILE" ]; then
    tail -30 "$LOG_FILE" | grep -E "KEEP|REVERT|EXPERIMENT" || echo "No history yet"
  else
    echo "No history yet"
  fi
}

pick_target_file() {
  # Pick a server file to experiment on
  # Weighted toward files with recent test failures
  local test_output
  test_output=$(npm test 2>&1) || true
  
  # Extract files mentioned in errors
  local error_files=$(echo "$test_output" | grep -oP 'server/[a-zA-Z0-9_-]+\.(ts|js)' | sort -u | head -5)
  
  if [ -n "$error_files" ]; then
    # Pick first file with errors
    echo "$error_files" | head -1
  else
    # Fallback: pick from main server files
    local files=("server/routes.ts" "server/storage.ts" "server/replitAuth.ts")
    local idx=$((RANDOM % ${#files[@]}))
    echo "${files[$idx]}"
  fi
}

call_ollama() {
  local prompt="$1"
  local response
  response=$(curl -s "$OLLAMA_URL" \
    -d "$(jq -n --arg model "$MODEL" --arg prompt "$prompt" '{
      model: $model,
      prompt: $prompt,
      stream: false,
      options: {
        temperature: 0.7,
        num_predict: 2048
      }
    }')" 2>/dev/null)
  
  echo "$response" | jq -r '.response // empty' 2>/dev/null || echo ""
}

apply_diff() {
  local file="$1"
  local new_content="$2"
  
  if [ -z "$new_content" ]; then
    return 1
  fi
  
  # Write new content
  echo "$new_content" > "$file"
  return 0
}

# --- Main Loop ---

log "========================================="
log "AUTORESEARCH SESSION START"
log "Model: $MODEL"
log "Max experiments: $MAX_EXPERIMENTS"
log "Branch: $BRANCH"
log "========================================="

# Create experiment branch
git checkout -b "$BRANCH" 2>/dev/null || git checkout "$BRANCH" 2>/dev/null || true

# Get baseline
log "Running baseline tests..."
BASELINE=$(get_test_results)
BASELINE_PASSED=$(echo "$BASELINE" | cut -d'|' -f1)
BASELINE_FAILED=$(echo "$BASELINE" | cut -d'|' -f2)
BASELINE_DURATION=$(echo "$BASELINE" | cut -d'|' -f3)
log "BASELINE: $BASELINE_PASSED passed, $BASELINE_FAILED failed, ${BASELINE_DURATION}s"

BEST_PASSED=$BASELINE_PASSED
BEST_FAILED=$BASELINE_FAILED
KEPT=0
REVERTED=0

for i in $(seq 1 "$MAX_EXPERIMENTS"); do
  log "-----------------------------------------"
  log "EXPERIMENT $i/$MAX_EXPERIMENTS"
  
  # Pick target file
  TARGET_FILE=$(pick_target_file)
  log "Target: $TARGET_FILE"
  
  if [ ! -f "$TARGET_FILE" ]; then
    log "SKIP: File $TARGET_FILE not found"
    continue
  fi
  
  # Read current file content (truncated for context window)
  FILE_CONTENT=$(head -200 "$TARGET_FILE")
  HISTORY=$(get_recent_history)
  PROGRAM_CONTENT=$(cat "$PROGRAM")
  
  # Build prompt
  PROMPT="$PROGRAM_CONTENT

## Current Test Results
- Passed: $BEST_PASSED
- Failed: $BEST_FAILED

## Recent Experiment History
$HISTORY

## Current File: $TARGET_FILE
\`\`\`typescript
$FILE_CONTENT
\`\`\`

Based on the program rules above, propose ONE improvement to this file. Return the COMPLETE new file content wrapped in a single typescript code block. No explanations — just the code.

\`\`\`typescript
// your improved version here
\`\`\`"

  # Call Ollama
  log "Calling $MODEL..."
  RESPONSE=$(call_ollama "$PROMPT")
  
  if [ -z "$RESPONSE" ]; then
    log "SKIP: Empty response from model"
    continue
  fi
  
  # Extract code block from response
  NEW_CONTENT=$(echo "$RESPONSE" | sed -n '/^```typescript/,/^```$/p' | sed '1d;$d')
  
  if [ -z "$NEW_CONTENT" ]; then
    # Try without language tag
    NEW_CONTENT=$(echo "$RESPONSE" | sed -n '/^```/,/^```$/p' | sed '1d;$d')
  fi
  
  if [ -z "$NEW_CONTENT" ] || [ ${#NEW_CONTENT} -lt 50 ]; then
    log "SKIP: Could not extract valid code from response"
    continue
  fi
  
  # Backup current file
  cp "$TARGET_FILE" "$TARGET_FILE.bak"
  
  # Apply change
  echo "$NEW_CONTENT" > "$TARGET_FILE"
  
  # Check if TypeScript compiles (quick check)
  if ! npx tsc --noEmit "$TARGET_FILE" 2>/dev/null; then
    log "REVERT: TypeScript compilation failed"
    cp "$TARGET_FILE.bak" "$TARGET_FILE"
    rm -f "$TARGET_FILE.bak"
    ((REVERTED++)) || true
    continue
  fi
  
  # Run tests
  log "Running tests..."
  RESULTS=$(get_test_results)
  NEW_PASSED=$(echo "$RESULTS" | cut -d'|' -f1)
  NEW_FAILED=$(echo "$RESULTS" | cut -d'|' -f2)
  NEW_DURATION=$(echo "$RESULTS" | cut -d'|' -f3)
  
  log "Results: $NEW_PASSED passed, $NEW_FAILED failed, ${NEW_DURATION}s (was: $BEST_PASSED passed, $BEST_FAILED failed)"
  
  # Decision: keep or revert
  if [ "$NEW_PASSED" -ge "$BEST_PASSED" ] && [ "$NEW_FAILED" -le "$BEST_FAILED" ]; then
    if [ "$NEW_PASSED" -gt "$BEST_PASSED" ] || [ "$NEW_FAILED" -lt "$BEST_FAILED" ]; then
      log "KEEP ✅ Improvement! +$((NEW_PASSED - BEST_PASSED)) passed, -$((BEST_FAILED - NEW_FAILED)) failed"
      BEST_PASSED=$NEW_PASSED
      BEST_FAILED=$NEW_FAILED
      git add "$TARGET_FILE"
      git commit -m "autoresearch($i): $TARGET_FILE — $NEW_PASSED passed, $NEW_FAILED failed" --no-verify 2>/dev/null || true
      ((KEPT++)) || true
    else
      # Same results — keep if duration improved significantly (>10%)
      if [ "$(echo "$NEW_DURATION < $BASELINE_DURATION * 0.9" | bc -l 2>/dev/null || echo 0)" = "1" ]; then
        log "KEEP ✅ Same tests but faster (${NEW_DURATION}s vs ${BASELINE_DURATION}s)"
        git add "$TARGET_FILE"
        git commit -m "autoresearch($i): $TARGET_FILE — perf improvement ${NEW_DURATION}s" --no-verify 2>/dev/null || true
        ((KEPT++)) || true
      else
        log "REVERT: No improvement (same results)"
        cp "$TARGET_FILE.bak" "$TARGET_FILE"
        ((REVERTED++)) || true
      fi
    fi
  else
    log "REVERT ❌ Regression: $NEW_PASSED passed (was $BEST_PASSED), $NEW_FAILED failed (was $BEST_FAILED)"
    cp "$TARGET_FILE.bak" "$TARGET_FILE"
    ((REVERTED++)) || true
  fi
  
  rm -f "$TARGET_FILE.bak"
  
  # Brief pause to let system breathe
  sleep 2
done

log "========================================="
log "AUTORESEARCH SESSION COMPLETE"
log "Experiments: $MAX_EXPERIMENTS"
log "Kept: $KEPT"
log "Reverted: $REVERTED"
log "Baseline: $BASELINE_PASSED passed, $BASELINE_FAILED failed"
log "Final: $BEST_PASSED passed, $BEST_FAILED failed"
log "========================================="

# Notify Giovanni
openclaw system event --text "Autoresearch done: $KEPT improvements kept, $REVERTED reverted. Tests: $BASELINE_PASSED→$BEST_PASSED passed, $BASELINE_FAILED→$BEST_FAILED failed." --mode now 2>/dev/null || true

echo ""
echo "Results on branch: $BRANCH"
echo "To review: git log --oneline $BRANCH --not main"
echo "To merge: git checkout main && git merge $BRANCH"
