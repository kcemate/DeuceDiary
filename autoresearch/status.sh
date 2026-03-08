#!/usr/bin/env bash
# Agent Status Board — quick view of all running work
# Usage: ./status.sh

PROJECT_DIR="$HOME/Projects/DeuceDiary"

echo "╔══════════════════════════════════════════════════╗"
echo "║          DEUCE DIARY — AGENT STATUS BOARD        ║"
echo "╠══════════════════════════════════════════════════╣"
echo "║  $(date '+%Y-%m-%d %H:%M:%S %Z')                        ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

# Active Claude Code agents
AGENTS=$(ps aux | grep "claude.*print" | grep -v grep)
AGENT_COUNT=$(echo "$AGENTS" | grep -c "claude" 2>/dev/null || echo "0")

echo "🤖 ACTIVE AGENTS: $AGENT_COUNT"
echo "─────────────────────────────────"
if [ "$AGENT_COUNT" -gt 0 ]; then
  echo "$AGENTS" | while read -r line; do
    PID=$(echo "$line" | awk '{print $2}')
    CPU=$(echo "$line" | awk '{print $3}')
    MEM=$(echo "$line" | awk '{print $4}')
    # Extract agent name from prompt
    NAME=$(echo "$line" | grep -oE "You are [A-Za-z]+" | head -1 | sed 's/You are //')
    [ -z "$NAME" ] && NAME="Unknown"
    RUNTIME=$(ps -o etime= -p "$PID" 2>/dev/null | tr -d ' ')
    echo "  ├─ $NAME (PID $PID) — CPU: ${CPU}% MEM: ${MEM}% Runtime: $RUNTIME"
  done
else
  echo "  (none running)"
fi

echo ""
echo "📊 SYSTEM RESOURCES"
echo "─────────────────────────────────"
CPU_IDLE=$(top -l 1 -n 0 2>/dev/null | grep "CPU usage" | grep -oE '[0-9.]+% idle' || echo "?")
MEM=$(top -l 1 -n 0 2>/dev/null | grep "PhysMem" | sed 's/PhysMem: /  /')
echo "  CPU: $CPU_IDLE"
echo "  $MEM"

echo ""
echo "📝 RECENT COMMITS (last 2h)"
echo "─────────────────────────────────"
COMMITS=$(cd "$PROJECT_DIR" && git log --oneline --since="2 hours ago" 2>/dev/null)
if [ -n "$COMMITS" ]; then
  echo "$COMMITS" | head -10 | while read -r line; do
    echo "  ├─ $line"
  done
else
  echo "  (none)"
fi

echo ""
echo "🧪 TEST STATUS"
echo "─────────────────────────────────"
TEST_OUTPUT=$(cd "$PROJECT_DIR" && npm test 2>&1)
PASSED=$(echo "$TEST_OUTPUT" | grep "Tests" | tail -1 | grep -oE '[0-9]+ passed' || echo "? passed")
FAILED=$(echo "$TEST_OUTPUT" | grep "Tests" | tail -1 | grep -oE '[0-9]+ failed' || echo "0 failed")
echo "  $PASSED | $FAILED"

echo ""
echo "🔄 CRON HEALTH"
echo "─────────────────────────────────"
# Check for erroring crons via the log
CRON_ERRORS=$(openclaw cron list 2>/dev/null | grep -c "error" || echo "?")
echo "  Crons with errors: $CRON_ERRORS"

echo ""
echo "🚀 PRODUCTION"
echo "─────────────────────────────────"
HEALTH=$(curl -s --max-time 5 https://deuce-diary-web-production.up.railway.app/api/health 2>/dev/null)
if [ -n "$HEALTH" ]; then
  echo "  Railway: 🟢 UP"
else
  echo "  Railway: 🔴 DOWN or unreachable"
fi

echo ""
