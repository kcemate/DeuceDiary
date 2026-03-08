#!/usr/bin/env bash
# Scout — Local model finds issues, Claude Code fixes them
# Phase 1: qwen3.5:9b audits files cheaply ($0)
# Phase 2: Batches findings into a single Claude Code session ($$)
# Usage: ./scout.sh [scope_dir] [file_pattern] [model]

set -euo pipefail

SCOPE_DIR="${1:-server}"
FILE_PATTERN="${2:-*.ts}"
MODEL="${3:-qwen3.5:9b}"

PROJECT_DIR="$HOME/Projects/DeuceDiary"
FINDINGS_FILE="$PROJECT_DIR/autoresearch/findings.md"
LOG_FILE="$PROJECT_DIR/autoresearch/scout.log"

cd "$PROJECT_DIR"

log() {
  local msg="[$(date '+%H:%M:%S')] [scout] $1"
  echo "$msg"
  echo "$msg" >> "$LOG_FILE"
}

call_ollama() {
  local prompt="$1"
  curl -s --max-time 300 "http://localhost:11434/api/chat" \
    -d "$(jq -n --arg model "$MODEL" --arg prompt "$prompt" '{
      model: $model,
      messages: [
        { role: "user", content: ($prompt + "\n\n/no_think") }
      ],
      stream: false,
      options: { temperature: 0.3, num_predict: 4096 }
    }')" 2>/dev/null | jq -r '.message.content // empty' 2>/dev/null || echo ""
}

# Find files
FILES=()
while IFS= read -r f; do
  FILES+=("$f")
done < <(find "$SCOPE_DIR" -name "$FILE_PATTERN" ! -path "*node_modules*" ! -path "*__tests__*" ! -path "*dist*" 2>/dev/null)

log "========================================="
log "SCOUT — Phase 1: Local audit ($MODEL)"
log "Scope: $SCOPE_DIR/$FILE_PATTERN (${#FILES[@]} files)"
log "========================================="

# Clear previous findings
cat > "$FINDINGS_FILE" << 'EOF'
# Autoresearch Scout Findings

Issues discovered by local model audit. Each finding includes file, line range, category, and description.
Fix all of these. Run `npm test` after each fix to verify nothing breaks.

---

EOF

TOTAL_FINDINGS=0

for TARGET in "${FILES[@]}"; do
  FILE_LINES=$(wc -l < "$TARGET" | tr -d ' ')
  
  # Skip tiny files
  if [ "$FILE_LINES" -lt 10 ]; then
    continue
  fi
  
  log "Scanning: $TARGET ($FILE_LINES lines)"
  
  FILE_CONTENT=$(head -400 "$TARGET")

  PROMPT="You are a senior TypeScript code reviewer. Audit this file and find REAL issues — not style preferences.

Look for:
1. BUGS — logic errors, off-by-one, null dereference, unhandled promises
2. SECURITY — missing auth checks, SQL injection, unsanitized input, info leaks
3. ERROR HANDLING — missing try/catch, swallowed errors, wrong status codes
4. VALIDATION — missing input checks, type coercion bugs, boundary issues
5. PERFORMANCE — N+1 queries, unnecessary awaits, missing indexes hints

Do NOT report:
- Style issues (naming, formatting)
- Missing comments or docs
- 'Could be improved' suggestions without a concrete bug
- Issues in test files

For each real issue found, output EXACTLY this format (one per issue):

### FINDING
- **File:** $TARGET
- **Lines:** approximate line numbers
- **Category:** BUG | SECURITY | ERROR_HANDLING | VALIDATION | PERFORMANCE
- **Severity:** HIGH | MEDIUM | LOW
- **Description:** What's wrong and how to fix it

If no real issues found, output: NO_ISSUES

File: $TARGET
\`\`\`typescript
$FILE_CONTENT
\`\`\`"

  RESPONSE=$(call_ollama "$PROMPT")
  
  if [ -z "$RESPONSE" ]; then
    log "  SKIP: Empty response"
    continue
  fi
  
  if echo "$RESPONSE" | grep -q "NO_ISSUES"; then
    log "  Clean ✅"
    continue
  fi
  
  # Count findings in response
  COUNT=$(echo "$RESPONSE" | grep -c "### FINDING" || echo "0")
  
  if [ "$COUNT" -gt 0 ]; then
    log "  Found $COUNT issues"
    echo "$RESPONSE" >> "$FINDINGS_FILE"
    echo "" >> "$FINDINGS_FILE"
    TOTAL_FINDINGS=$((TOTAL_FINDINGS + COUNT))
  else
    log "  No structured findings"
  fi
  
  sleep 1
done

log "========================================="
log "SCOUT Phase 1 complete: $TOTAL_FINDINGS findings across ${#FILES[@]} files"
log "Findings saved to: $FINDINGS_FILE"
log "========================================="

if [ "$TOTAL_FINDINGS" -eq 0 ]; then
  log "No issues found. Skipping Phase 2."
  openclaw system event --text "Scout done: scanned ${#FILES[@]} files, no issues found." --mode now 2>/dev/null || true
  exit 0
fi

# Phase 2: Hand off to Claude Code
log "========================================="
log "SCOUT — Phase 2: Claude Code fixing $TOTAL_FINDINGS findings"
log "========================================="

FINDINGS_CONTENT=$(cat "$FINDINGS_FILE")

claude --permission-mode bypassPermissions --print "You are Jordan, backend engineer for Deuce Diary.

The scout agent (local model) audited the codebase and found $TOTAL_FINDINGS issues. Fix ALL of them.

$FINDINGS_CONTENT

Rules:
- Fix each finding in order
- Run 'npm test' after every 3-4 fixes to catch regressions early
- If a finding is a false positive (code is actually correct), skip it and note why
- Do NOT touch test files
- Commit after each batch of related fixes

When completely finished, run: openclaw system event --text 'Scout+Fix done: fixed issues from $TOTAL_FINDINGS findings' --mode now"

log "Phase 2 complete."
