#!/usr/bin/env python3
"""
Autoreason tournament for Deuce Diary Battle Shits engagement improvements.
Based on NousResearch/autoreason: Self-Refinement That Knows When to Stop.

Method:
  Task Prompt → Incumbent A
                    ↓
          ┌─── Critic (fresh agent) ───→ Critique
          │
          ├─── Author B (fresh agent) ──→ Revision (B)
          │
          └─── Synthesizer (fresh) ─────→ Synthesis (AB)
                    ↓
            Judge Panel (3 fresh agents, Borda count)
                    ↓
                Winner → new A  (or converge if A wins k=2 times)
"""

import asyncio
import json
import os
import sys
import time
from pathlib import Path


# ── Load env ──────────────────────────────────────────────────────────
def load_dotenv(path):
    if not Path(path).exists():
        return
    for line in Path(path).read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, val = line.partition("=")
        os.environ.setdefault(key.strip(), val.strip())


load_dotenv(Path(__file__).parent / ".env")

import litellm

litellm.suppress_debug_info = True

# ── Ollama direct API ────────────────────────────────────────────────
OLLAMA_BASE = "http://127.0.0.1:11434"
OLLAMA_MODEL = "glm-5.1:cloud"

# ── Config ─────────────────────────────────────────────────────────────
MODEL = "openai/glm-5.1:cloud"  # Routed via Ollama's OpenAI-compatible endpoint
AUTHOR_TEMP = 0.8
CRITIC_TEMP = 0.5
JUDGE_TEMP = 0.3
MAX_TOKENS = 4000
NUM_JUDGES = 3
CONVERGENCE_K = 2  # A wins k times in a row → converge
MAX_PASSES = 8

BATTLE_FILE = Path(__file__).parent / "client/src/pages/battle-match.tsx"
RESULTS_DIR = Path(__file__).parent / "docs/autoreason-battle"
RESULTS_DIR.mkdir(parents=True, exist_ok=True)

# ── System Prompts ─────────────────────────────────────────────────────
AUTHOR_SYSTEM = (
    "You are a senior frontend engineer and game designer specializing in "
    "mobile multiplayer experiences. You produce production-quality React + "
    "Tailwind + shadcn/ui code. Focus on engagement loops, retention hooks, "
    "and frictionless UX. Every change must improve retention, monetization "
    "potential, or user satisfaction. Do not add features that don't exist in "
    "the app's current scope."
)

CRITIC_SYSTEM = (
    "You are a critical game UX reviewer focused on engagement and retention. "
    "Your only job is to find real problems with this battle game code. "
    "Focus on: friction in core loop, unclear feedback, missing progression, "
    "mobile usability gaps, confusing UI states, lack of social/viral hooks, "
    "and missed engagement opportunities. Be specific and concrete. "
    "Do not suggest fixes."
)

AUTHOR_B_SYSTEM = (
    "You are a senior frontend engineer revising a battle game screen based on "
    "specific criticisms. Address each valid criticism directly with actual code "
    "changes. Do not make changes that aren't motivated by an identified problem. "
    "Produce the COMPLETE updated file — never truncate or abbreviate."
)

SYNTHESIZER_SYSTEM = (
    "You are a senior frontend engineer. You are given two versions of a battle "
    "game screen as equal inputs. Take the strongest elements from each and "
    "produce a coherent synthesis. This is not a compromise — pick the best "
    "version per section. Produce the COMPLETE file — never truncate or abbreviate."
)

JUDGE_SYSTEM = (
    "You are an independent game UX evaluator. You have no authorship stake in "
    "any version. Evaluate which version best maximizes engagement and retention "
    "while maintaining the brand voice (fun, irreverent, competitive). Consider: "
    "core loop clarity, feedback immediacy, progression systems, social hooks, "
    "mobile UX, and overall 'fun factor'."
)

# ── Task Prompt ────────────────────────────────────────────────────────
TASK_PROMPT = f"""\
Improve the Deuce Diary Battle Shits match screen (client/src/pages/battle-match.tsx).

Battle Shits is the real-time multiplayer poop-battling mode — turn-based ship placement 
and attacking with funny ship names (Floater, Log, Battleshit). It drives DAU through 
competitive, social gameplay.

Current state: Functional but barebones. Core loop works but lacks engagement hooks, 
progression, and viral elements.

Goal: Maximize daily engagement and retention while keeping the silly, competitive 
brand voice intact.

Priorities:
1. Streamline core loop (reduce friction between matches)
2. Add clear progression (XP, levels, rewards)
3. Increase social/viral hooks (taunts, replays, shareables)
4. Improve feedback and satisfaction (better animations, sound cues)
5. Add light monetization readiness (cosmetics, currency)
6. Maintain mobile-first UX and accessibility

Rules:
- Only output the contents of battle-match.tsx — no other files
- Keep: existing ship types, grid mechanics, real-time sync
- Do NOT add features requiring backend changes not yet built
- Improve what exists; tighten copy and UX
- Output the COMPLETE file, never truncate
"""


# ── LLM wrapper ────────────────────────────────────────────────────────
async def call_llm(
    system,
    user,
    model=MODEL,
    temperature=0.5,
    max_tokens=min(MAX_TOKENS, 4000),
    max_retries=8,
):
    import aiohttp

    url = f"{OLLAMA_BASE}/api/chat"
    payload = {
        "model": OLLAMA_MODEL,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        "stream": False,
        "options": {
            "temperature": temperature,
            "num_predict": max_tokens,
        },
    }
    for attempt in range(max_retries):
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    url, json=payload, timeout=aiohttp.ClientTimeout(total=300)
                ) as resp:
                    if resp.status != 200:
                        text = await resp.text()
                        raise Exception(f"HTTP {resp.status}: {text[:200]}")
                    data = await resp.json()
                    return data.get("message", {}).get("content", "")
        except Exception as e:
            err = str(e).lower()
            if (
                "rate" in err
                or "429" in err
                or "overloaded" in err
                or "529" in err
            ):
                wait = min((2**attempt) * 5, 120)
                print(
                    f"      [Rate limited, retry {attempt+1}/{max_retries} in {wait}s]"
                )
                await asyncio.sleep(wait)
            else:
                if attempt < max_retries - 1:
                    wait = 10 * (attempt + 1)
                    print(
                        f"      [Error, retry {attempt+1}/{max_retries} in {wait}s: {str(e)[:100]}]"
                    )
                    await asyncio.sleep(wait)
                else:
                    raise


# ── Generate initial A ─────────────────────────────────────────────────
async def generate_a():
    current = BATTLE_FILE.read_text()
    prompt = (
        f"{TASK_PROMPT}\n\n"
        f"Here is the current battle match screen code:\n\n---\n{current}\n---\n\n"
        f"Produce the complete improved version of this file. Every change must be motivated. "
        f"If a section is already strong, keep it as-is. Output the COMPLETE file."
    )
    return await call_llm(AUTHOR_SYSTEM, prompt, temperature=AUTHOR_TEMP)


# ── Critic ──────────────────────────────────────────────────────────────
async def run_critic(version_a):
    prompt = (
        f"Here is a battle match screen implementation:\n\n---\n{version_a}\n---\n\n"
        f"Find real problems with this battle game. Focus on:\n"
        f"- Core loop friction (waiting, unclear next steps)\n"
        f"- Missing progression (no sense of advancement)\n"
        f"- Weak social hooks (nothing to share/show off)\n"
        f"- Poor feedback (delayed/unclear hit/miss/sunk signals)\n"
        f"- Mobile usability issues (touch targets, spacing)\n"
        f"- Bland UX (needs more personality/juice)\n"
        f"- Copy that doesn't engage (functional but boring)\n\n"
        f"Do NOT propose fixes. Just the problems."
    )
    return await call_llm(CRITIC_SYSTEM, prompt, temperature=CRITIC_TEMP)


# ── Author B (adversarial revision) ───────────────────────────────────
async def run_author_b(version_a, critique):
    prompt = (
        f"ORIGINAL TASK:\n---\n{TASK_PROMPT}\n---\n\n"
        f"CURRENT BATTLE MATCH SCREEN:\n---\n{version_a}\n---\n\n"
        f"PROBLEMS FOUND:\n---\n{critique}\n---\n\n"
        f"Revise the battle match screen to address these problems. "
        f"For each change, state which problem it fixes. "
        f"Do not make changes that aren't motivated by an identified problem. "
        f"Produce the COMPLETE revised file — never truncate."
    )
    return await call_llm(AUTHOR_B_SYSTEM, prompt, temperature=AUTHOR_TEMP)


# ── Synthesizer ────────────────────────────────────────────────────────
async def run_synthesizer(version_a, version_b):
    prompt = (
        f"ORIGINAL TASK:\n---\n{TASK_PROMPT}\n---\n\n"
        f"VERSION X:\n---\n{version_a}\n---\n\n"
        f"VERSION Y:\n---\n{version_b}\n---\n\n"
        f"Produce a synthesis that keeps the strongest elements from both. "
        f"Pick the best version of each section and make them cohere. "
        f"Produce the COMPLETE file — never truncate."
    )
    return await call_llm(SYNTHESIZER_SYSTEM, prompt, temperature=AUTHOR_TEMP)


# ── Judge Panel ────────────────────────────────────────────────────────
async def run_single_judge(version_a, version_b, version_ab, judge_id):
    proposals = (
        f"Version 1 (Incumbent A):\n---\n{version_a[:4000]}\n---\n\n"
        f"Version 2 (Revision B):\n---\n{version_b[:4000]}\n---\n\n"
        f"Version 3 (Synthesis AB):\n---\n{version_ab[:4000]}\n---\n\n"
    )
    prompt = (
        f"ORIGINAL TASK:\n---\n{TASK_PROMPT}\n---\n\n"
        f"Three versions of the battle match screen have been produced. Evaluate how well each "
        f"accomplishes the goal of maximizing engagement and retention while maintaining "
        f"brand voice.\n\n"
        f"{proposals}\n"
        f"For each version, state what it gets right and what it gets wrong. "
        f"Then rank all three from best to worst:\n\n"
        f"RANKING: [best], [second], [worst]\n\n"
        f"Where each slot is 1, 2, or 3."
    )
    return await call_llm(
        JUDGE_SYSTEM, prompt, temperature=JUDGE_TEMP, max_tokens=2000
    )


def parse_ranking(text):
    """Parse judge ranking, return list of ranked version IDs."""
    for line in text.split("\n"):
        line = line.strip()
        if line.upper().startswith("RANKING"):
            # Extract numbers after the colon
            after = line.split(":", 1)[-1] if ":" in line else line
            nums = [
                int(c) for c in after if c.isdigit() and int(c) in (1, 2, 3)
            ]
            if len(nums) >= 3:
                return nums[:3]
    # Fallback: find last line with 3 distinct numbers
    for line in reversed(text.split("\n")):
        nums = [int(c) for c in line if c.isdigit() and int(c) in (1, 2, 3)]
        if len(set(nums)) >= 3:
            return list(dict.fromkeys(nums))[:3]  # unique, ordered
    return [1, 2, 3]  # fallback


def borda_count(rankings):
    """Borda count: 1st=2pts, 2nd=1pt, 3rd=0pts. Returns {version: total_points}."""
    scores = {1: 0, 2: 0, 3: 0}
    for ranking in rankings:
        scores[ranking[0]] += 2
        scores[ranking[1]] += 1
        # 3rd gets 0
    return scores


# ── Save version ────────────────────────────────────────────────────────
def save_version(version_name, content, pass_num):
    path = RESULTS_DIR / f"pass{pass_num}_{version_name}.tsx"
    path.write_text(content)
    return path


# ── Main loop ───────────────────────────────────────────────────────────
async def main():
    print("═══════════════════════════════════════════════════════════════")
    print("  AUTOREASON TOURNAMENT — Deuce Diary Battle Shits")
    print("═══════════════════════════════════════════════════════════════")
    print(f"  Model: {MODEL}")
    print(f"  Judges: {NUM_JUDGES}")
    print(f"  Convergence: A wins {CONVERGENCE_K}x in a row")
    print(f"  Max passes: {MAX_PASSES}")
    print()

    # Initial version = current file
    version_a = BATTLE_FILE.read_text()
    print(f"  Loaded current battle match screen ({len(version_a)} chars)")
    save_version("A_initial", version_a, 0)

    a_consecutive_wins = 0
    history = []

    for pass_num in range(1, MAX_PASSES + 1):
        print(f"\n{'─' * 60}")
        print(f"  PASS {pass_num}")
        print(f"{'─' * 60}")
        t0 = time.time()

        # Step 1: Critic
        print("  [1/4] Running critic on A...")
        critique = await run_critic(version_a)
        (RESULTS_DIR / f"pass{pass_num}_critique.txt").write_text(critique)
        print(f"         Critique: {len(critique)} chars")

        # Step 2: Author B
        print("  [2/4] Running Author B (adversarial revision)...")
        version_b = await run_author_b(version_a, critique)
        save_version("B", version_b, pass_num)
        print(f"         Version B: {len(version_b)} chars")

        # Step 3: Synthesizer → AB
        print("  [3/4] Running Synthesizer → AB...")
        version_ab = await run_synthesizer(version_a, version_b)
        save_version("AB", version_ab, pass_num)
        print(f"         Version AB: {len(version_ab)} chars")

        # Step 4: Judge Panel
        print(f"  [4/4] Running {NUM_JUDGES} judges...")
        rankings = []
        for j in range(NUM_JUDGES):
            raw = await run_single_judge(version_a, version_b, version_ab, j)
            (RESULTS_DIR / f"pass{pass_num}_judge{j+1}.txt").write_text(raw)
            ranking = parse_ranking(raw)
            rankings.append(ranking)
            print(f"         Judge {j+1}: {ranking}")

        # Borda count
        scores = borda_count(rankings)
        print(f"\n  Borda scores: {scores}")
        winner = max(scores, key=scores.get)

        # Map winner to content
        version_map = {1: version_a, 2: version_b, 3: version_ab}
        winner_name = {1: "A", 2: "B", 3: "AB"}
        winner_content = version_map[winner]

        # Save winner
        save_version(f"winner_{winner_name[winner]}", winner_content, pass_num)

        # Check convergence
        if winner == 1:
            a_consecutive_wins += 1
        else:
            a_consecutive_wins = 0

        elapsed = time.time() - t0
        entry = {
            "pass": pass_num,
            "winner": winner_name[winner],
            "scores": scores,
            "rankings": rankings,
            "elapsed_s": round(elapsed, 1),
            "converged": False,
        }
        history.append(entry)

        print(f"\n  ✅ Winner: {winner_name[winner]} (scores: {scores})")
        print(f"  ⏱  Elapsed: {elapsed:.1f}s")

        # Update incumbent
        version_a = winner_content

        # Convergence check
        if a_consecutive_wins >= CONVERGENCE_K:
            print(f"\n  🏁 CONVERGED: A won {CONVERGENCE_K} consecutive times")
            history[-1]["converged"] = True
            break

        # Small delay between passes
        await asyncio.sleep(3)

    # ── Final output ────────────────────────────────────────────────────
    print(f"\n{'═' * 60}")
    print(f"  TOURNAMENT COMPLETE")
    print(f"{'═' * 60}")
    if history[-1]["converged"]:
        print(f"  Converged after {len(history)} passes")
    else:
        print(f"  Reached max passes ({MAX_PASSES})")

    # Write winner to battle match file
    BATTLE_FILE.write_text(version_a)
    print(f"  Winner written to {BATTLE_FILE}")

    # Save history
    (RESULTS_DIR / "history.json").write_text(json.dumps(history, indent=2))

    # Summary
    print("\n  Pass history:")
    for h in history:
        marker = " 🏁" if h["converged"] else ""
        print(
            f"    Pass {h['pass']}: Winner={h['winner']} Scores={h['scores']} {marker}"
        )

    print(f"\n  Results saved to {RESULTS_DIR}/")


if __name__ == "__main__":
    asyncio.run(main())
