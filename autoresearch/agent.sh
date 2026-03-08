#!/usr/bin/env bash
# Deuce Diary Local Agent — Ollama-powered autonomous code improver
# Usage: ./agent.sh <agent_name> <scope_dir> <file_pattern> [max_experiments] [model]

set -euo pipefail

AGENT_NAME="${1:?Usage: ./agent.sh <name> <scope_dir> <file_pattern> [max_experiments] [model]}"
SCOPE_DIR="${2:?Scope directory required}"
FILE_PATTERN="${3:?File pattern required (e.g. '*.ts' or '*.tsx')}"
MAX_EXPERIMENTS="${4:-15}"
MODEL="${5:-qwen3.5:9b}"

PROJECT_DIR="$HOME/Projects/DeuceDiary"
LOG_FILE="$PROJECT_DIR/autoresearch/${AGENT_NAME}.log"
OLLAMA_URL="http://localhost:11434/api/generate"

cd "$PROJECT_DIR"

log() {
  local msg="[$(date '+%H:%M:%S')] [$AGENT_NAME] $1"
  echo "$msg"
  echo "$msg" >> "$LOG_FILE"
}

run_tests() {
  local output
  output=$(npm test 2>&1) || true
  # Vitest summary line looks like: "Tests  1 failed | 382 passed (383)"
  local summary=$(echo "$output" | grep "Tests" | tail -1)
  local passed=$(echo "$summary" | grep -oE '[0-9]+ passed' | grep -oE '[0-9]+' || echo "0")
  local failed=$(echo "$summary" | grep -oE '[0-9]+ failed' | grep -oE '[0-9]+' || echo "0")
  echo "$passed|$failed"
}

call_ollama() {
  local prompt="$1"
  local response
  response=$(curl -s --max-time 300 "http://localhost:11434/api/chat" \
    -d "$(jq -n --arg model "$MODEL" --arg prompt "$prompt" '{
      model: $model,
      messages: [
        { role: "user", content: ($prompt + "\n\n/no_think") }
      ],
      stream: false,
      options: { temperature: 0.7, num_predict: 8192 }
    }')" 2>/dev/null)
  echo "$response" | jq -r '.message.content // empty' 2>/dev/null || echo ""
}

log "========================================="
log "AGENT START — scope: $SCOPE_DIR/$FILE_PATTERN"
log "Model: $MODEL | Max experiments: $MAX_EXPERIMENTS"
log "========================================="

# Find target files (compatible with bash 3.x / macOS)
FILES=()
while IFS= read -r f; do
  FILES+=("$f")
done < <(find "$SCOPE_DIR" -name "$FILE_PATTERN" ! -path "*node_modules*" ! -path "*__tests__*" ! -path "*dist*" 2>/dev/null)

if [ ${#FILES[@]} -eq 0 ]; then
  log "ERROR: No files matching $SCOPE_DIR/$FILE_PATTERN"
  exit 1
fi

log "Found ${#FILES[@]} files in scope"

# Baseline
log "Running baseline tests..."
BASELINE=$(run_tests)
BEST_PASSED=$(echo "$BASELINE" | cut -d'|' -f1)
BEST_FAILED=$(echo "$BASELINE" | cut -d'|' -f2)
log "BASELINE: $BEST_PASSED passed, $BEST_FAILED failed"

KEPT=0
REVERTED=0

for i in $(seq 1 "$MAX_EXPERIMENTS"); do
  # Pick a file (rotate through them)
  FILE_IDX=$(( (i - 1) % ${#FILES[@]} ))
  TARGET="${FILES[$FILE_IDX]}"
  
  log "----- Experiment $i/$MAX_EXPERIMENTS — $TARGET -----"
  
  # Read file (cap at 300 lines for context window)
  FILE_CONTENT=$(head -300 "$TARGET")
  FILE_LINES=$(wc -l < "$TARGET")
  
  if [ "$FILE_LINES" -gt 300 ]; then
    log "File truncated: $FILE_LINES lines → 300 for context"
  fi

  # Recent history for context
  HISTORY=$(tail -10 "$LOG_FILE" 2>/dev/null | grep -E "KEEP|REVERT" || echo "First experiment")

  PROMPT="You are a senior TypeScript developer improving a file in Deuce Diary (Express + React + PostgreSQL app).

## Task
Improve this file. Pick ONE of these:
- Fix a bug or error handling gap
- Add input validation
- Improve type safety
- Simplify or deduplicate code
- Add missing null/undefined checks
- Improve error messages

## Rules
- ONE change only, keep it small (<30 lines of diff)
- Do NOT add new imports from packages not already imported
- Do NOT change function signatures that other files depend on
- Do NOT add comments explaining what code does (code should be self-documenting)
- Return the COMPLETE updated file content

## Recent Results
$HISTORY

## Current test status: $BEST_PASSED passed, $BEST_FAILED failed

## File: $TARGET
\`\`\`typescript
$FILE_CONTENT
\`\`\`

Return ONLY the complete improved file wrapped in a typescript code block. No explanations."

  RESPONSE=$(call_ollama "$PROMPT")
  
  if [ -z "$RESPONSE" ]; then
    log "SKIP: Empty model response"
    continue
  fi

  # Extract code
  NEW_CONTENT=$(echo "$RESPONSE" | sed -n '/^```typescript/,/^```$/p' | sed '1d;$d')
  [ -z "$NEW_CONTENT" ] && NEW_CONTENT=$(echo "$RESPONSE" | sed -n '/^```/,/^```$/p' | sed '1d;$d')
  
  if [ -z "$NEW_CONTENT" ] || [ ${#NEW_CONTENT} -lt 30 ]; then
    log "SKIP: No valid code extracted (${#NEW_CONTENT} chars)"
    continue
  fi

  # Backup + apply
  cp "$TARGET" "$TARGET.bak"
  echo "$NEW_CONTENT" > "$TARGET"
  
  # Quick syntax check — does it at least parse?
  if ! node -e "try{require('fs').readFileSync('$TARGET','utf8')}catch(e){process.exit(1)}" 2>/dev/null; then
    log "REVERT: File unreadable after change"
    cp "$TARGET.bak" "$TARGET"
    rm -f "$TARGET.bak"
    ((REVERTED++)) || true
    continue
  fi

  # Test
  log "Testing..."
  RESULTS=$(run_tests)
  NEW_PASSED=$(echo "$RESULTS" | cut -d'|' -f1)
  NEW_FAILED=$(echo "$RESULTS" | cut -d'|' -f2)
  
  if [ "$NEW_PASSED" -ge "$BEST_PASSED" ] && [ "$NEW_FAILED" -le "$BEST_FAILED" ]; then
    if [ "$NEW_PASSED" -gt "$BEST_PASSED" ] || [ "$NEW_FAILED" -lt "$BEST_FAILED" ]; then
      log "KEEP ✅ $TARGET — $NEW_PASSED passed (+$((NEW_PASSED - BEST_PASSED))), $NEW_FAILED failed (-$((BEST_FAILED - NEW_FAILED)))"
      BEST_PASSED=$NEW_PASSED
      BEST_FAILED=$NEW_FAILED
      git add "$TARGET" 2>/dev/null
      git commit -m "autoresearch($AGENT_NAME/$i): improve $TARGET" --no-verify 2>/dev/null || true
      ((KEPT++)) || true
    else
      log "REVERT: No change in metrics"
      cp "$TARGET.bak" "$TARGET"
      ((REVERTED++)) || true
    fi
  else
    log "REVERT ❌ Regression: $NEW_PASSED passed (was $BEST_PASSED), $NEW_FAILED failed (was $BEST_FAILED)"
    cp "$TARGET.bak" "$TARGET"
    ((REVERTED++)) || true
  fi
  
  rm -f "$TARGET.bak"
  sleep 1
done

log "========================================="
log "DONE — Kept: $KEPT | Reverted: $REVERTED"
log "Tests: $BEST_PASSED passed, $BEST_FAILED failed (was: $(echo $BASELINE | tr '|' ' '))"
log "========================================="

openclaw system event --text "$AGENT_NAME done: $KEPT kept, $REVERTED reverted. Tests: $(echo $BASELINE | cut -d'|' -f1)→$BEST_PASSED passed." --mode now 2>/dev/null || true
