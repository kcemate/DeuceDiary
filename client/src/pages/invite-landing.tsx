import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface GroupPreview {
  name: string;
  memberCount: number;
  deuceCount: number;
  currentStreak: number;
  longestStreak: number;
  members: Array<{ username: string; deuceCount: number }>;
  recentActivity: Array<{
    username: string;
    thoughts: string;
    location: string;
    loggedAt: string;
  }>;
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMin = Math.floor((now.getTime() - date.getTime()) / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffMin < 1440) return `${Math.floor(diffMin / 60)}h ago`;
  return `${Math.floor(diffMin / 1440)}d ago`;
}

function getStreakTier(streak: number): { label: string; emoji: string } | null {
  if (streak >= 30) return { label: "Diamond", emoji: "💎" };
  if (streak >= 14) return { label: "Gold", emoji: "🥇" };
  if (streak >= 7) return { label: "Silver", emoji: "🥈" };
  if (streak >= 3) return { label: "Bronze", emoji: "🥉" };
  return null;
}

// ── Demo Mode: sample data for the animated group preview ──────────────────
const DEMO_FEED = [
  {
    username: "FlushKing99",
    thoughts: "Morning constitutional. Solid 8/10. Would recommend the office stall.",
    location: "The Office",
    loggedAt: new Date(Date.now() - 12 * 60000).toISOString(),
    emoji: "💪",
  },
  {
    username: "TroneZone",
    thoughts: "Just crushed a 5-minute deuce. New personal record.",
    location: "Home Base",
    loggedAt: new Date(Date.now() - 47 * 60000).toISOString(),
    emoji: "🏆",
  },
  {
    username: "SeatWarrior",
    thoughts: "Post-gym drop. Very productive session. 🙏",
    location: "Planet Fitness",
    loggedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    emoji: "🔥",
  },
];

function DemoFeedCard() {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const timers = DEMO_FEED.map((_, i) =>
      setTimeout(() => setVisibleCount(i + 1), i * 600)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-[#E8DFD0] shadow-sm p-4 space-y-3">
      {/* Demo group header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-xl">🚽</span>
          <div>
            <p className="font-bold text-[#2C1A0E] text-sm">The Throne Room</p>
            <p className="text-xs text-[#8B7355]">3 members · 12-day streak 🔥</p>
          </div>
        </div>
        <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs font-semibold">
          🥈 Silver
        </Badge>
      </div>

      <div className="border-t border-[#F0E8DC] pt-3 space-y-3">
        {DEMO_FEED.slice(0, visibleCount).map((entry, i) => (
          <div
            key={i}
            className="flex gap-2 animate-in fade-in slide-in-from-bottom-2 duration-400"
          >
            <div className="w-8 h-8 rounded-full bg-[#F5EDE0] flex items-center justify-center text-sm flex-shrink-0">
              {entry.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-1">
                <span className="text-xs font-bold text-[#2C1A0E]">{entry.username}</span>
                <span className="text-[10px] text-[#A89070]">{formatRelativeTime(entry.loggedAt)}</span>
              </div>
              <p className="text-xs text-[#5C4A35] mt-0.5 leading-relaxed">{entry.thoughts}</p>
              <p className="text-[10px] text-[#A89070] mt-0.5">📍 {entry.location}</p>
            </div>
          </div>
        ))}
        {visibleCount < DEMO_FEED.length && (
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-[#F5EDE0] animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-1 py-1">
              <div className="h-2.5 bg-[#F0E8DC] rounded animate-pulse w-1/3" />
              <div className="h-2 bg-[#F0E8DC] rounded animate-pulse w-2/3" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InviteLanding() {
  const { code } = useParams<{ code: string }>();
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDemo, setShowDemo] = useState(false);

  const { data: preview, isLoading: previewLoading, error: previewError } = useQuery<GroupPreview>({
    queryKey: [`/api/groups/preview/${code}`],
    enabled: !!code,
  });

  async function handleJoinWithLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), inviteCode: code }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Login failed");
        return;
      }
      const data = await res.json();
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      await queryClient.invalidateQueries({ queryKey: ["/api/groups"] });

      if (data.joinedGroup) {
        toast({
          title: "You're in! 🚽",
          description: `Joined "${data.joinedGroup.name}" — welcome to the squad.`,
        });
      }
      setLocation("/");
    } catch {
      setError("Network error — is the server running?");
    } finally {
      setLoading(false);
    }
  }

  async function handleJoinAuthenticated() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/join/${code}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to join group");
        return;
      }
      const data = await res.json();
      await queryClient.invalidateQueries({ queryKey: ["/api/groups"] });

      toast({
        title: data.message === "Already a member of this group" ? "Already in!" : "You're in! 🚽",
        description: `${data.message === "Already a member of this group" ? "You're already a member of" : "Joined"} "${data.group?.name}"`,
      });
      setLocation("/");
    } catch {
      setError("Network error — is the server running?");
    } finally {
      setLoading(false);
    }
  }

  // ── 404 state ────────────────────────────────────────────────────────────
  if (previewError || (!previewLoading && !preview)) {
    return (
      <div className="min-h-screen bg-[#FBF6EF] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="text-6xl">🚽</div>
          <h1 className="text-2xl font-extrabold text-[#2C1A0E]">Invite Not Found</h1>
          <p className="text-[#8B7355]">
            This invite link has expired or doesn't exist. Ask your squad for a fresh one.
          </p>
          <Button
            onClick={() => setLocation("/")}
            className="rounded-full bg-green-600 hover:bg-green-700 text-white"
          >
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const streakTier = preview ? getStreakTier(preview.currentStreak) : null;

  return (
    <div className="min-h-screen bg-[#FBF6EF]">
      <div className="max-w-md mx-auto px-4 py-8 space-y-5">

        {/* ── Header ────────────────────────────────────────────────── */}
        <div className="text-center pt-4">
          <div className="text-6xl mb-3">🚽</div>
          <h1 className="text-2xl font-extrabold text-[#2C1A0E] leading-tight">
            Your squad is holding a seat for you.
          </h1>
          <p className="text-[#8B7355] text-sm mt-1">
            Check out the group first — no signup required to peek.
          </p>
        </div>

        {/* ── Group Preview Card ─────────────────────────────────────── */}
        {previewLoading ? (
          <div className="bg-white rounded-2xl border border-[#E8DFD0] p-6 animate-pulse space-y-3">
            <div className="h-5 bg-[#F0E8DC] rounded w-2/3" />
            <div className="h-4 bg-[#F0E8DC] rounded w-1/2" />
            <div className="h-4 bg-[#F0E8DC] rounded w-1/3" />
          </div>
        ) : preview ? (
          <div className="bg-white rounded-2xl border border-[#E8DFD0] shadow-sm overflow-hidden">
            {/* Group name + streak banner */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4 border-b border-[#F0E8DC]">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-[#2C1A0E] leading-tight">{preview.name}</h2>
                  <p className="text-sm text-[#8B7355] mt-0.5">
                    {preview.memberCount} member{preview.memberCount !== 1 ? "s" : ""}
                  </p>
                </div>
                {streakTier && (
                  <Badge className="bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold px-3 py-1">
                    {streakTier.emoji} {streakTier.label}
                  </Badge>
                )}
              </div>

              {/* Streak stat */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl">🔥</span>
                  <div>
                    <span className="text-2xl font-extrabold text-[#2C1A0E] leading-none">
                      {preview.currentStreak}
                    </span>
                    <span className="text-xs text-[#8B7355] ml-1">-day streak</span>
                  </div>
                </div>
                <div className="h-8 w-px bg-[#E8DFD0]" />
                <div className="text-center">
                  <p className="text-lg font-bold text-[#2C1A0E]">{preview.deuceCount}</p>
                  <p className="text-[10px] text-[#A89070] uppercase tracking-wide">Total Deuces</p>
                </div>
              </div>
            </div>

            {/* Members */}
            {preview.members.length > 0 && (
              <div className="px-5 py-3 border-b border-[#F0E8DC]">
                <p className="text-[10px] font-bold text-[#A89070] uppercase tracking-widest mb-2">
                  The Crew
                </p>
                <div className="flex flex-wrap gap-2">
                  {preview.members.map((m, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-[#F5EDE0] rounded-full px-3 py-1">
                      <span className="text-xs font-semibold text-[#2C1A0E]">{m.username}</span>
                      <span className="text-[10px] text-[#A89070]">· {m.deuceCount} 💩</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent activity */}
            {preview.recentActivity.length > 0 && (
              <div className="px-5 py-3">
                <p className="text-[10px] font-bold text-[#A89070] uppercase tracking-widest mb-2">
                  Recent Activity
                </p>
                <div className="space-y-2.5">
                  {preview.recentActivity.map((entry, i) => (
                    <div key={i} className="flex gap-2">
                      <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-sm flex-shrink-0">
                        🚽
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xs font-bold text-[#2C1A0E]">{entry.username}</span>
                          <span className="text-[10px] text-[#A89070]">{formatRelativeTime(entry.loggedAt)}</span>
                        </div>
                        {entry.thoughts && (
                          <p className="text-xs text-[#5C4A35] mt-0.5 line-clamp-1">{entry.thoughts}</p>
                        )}
                        {entry.location && (
                          <p className="text-[10px] text-[#A89070]">📍 {entry.location}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}

        {/* ── Demo Mode toggle ───────────────────────────────────────── */}
        {!showDemo && (
          <button
            onClick={() => setShowDemo(true)}
            className="w-full text-center text-sm text-[#8B7355] underline underline-offset-2 hover:text-[#5C4A35] transition-colors"
          >
            👀 Not sure? See a demo first
          </button>
        )}

        {showDemo && (
          <div className="space-y-2">
            <p className="text-xs text-center text-[#A89070] font-medium uppercase tracking-widest">
              This is what your feed looks like →
            </p>
            <DemoFeedCard />
            <button
              onClick={() => setShowDemo(false)}
              className="w-full text-center text-xs text-[#A89070] hover:text-[#5C4A35] transition-colors"
            >
              Got it — hide demo
            </button>
          </div>
        )}

        {/* ── Action area ───────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#E8DFD0] shadow-sm p-5 space-y-3">
          <p className="text-center text-sm font-semibold text-[#2C1A0E]">
            Ready to take a seat? 👇
          </p>

          {authLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-green-600" />
            </div>
          ) : isAuthenticated ? (
            <div className="space-y-2">
              {error && <p className="text-sm text-red-600 font-medium text-center">{error}</p>}
              <Button
                onClick={handleJoinAuthenticated}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-base rounded-full shadow-md shadow-green-600/20 disabled:opacity-50"
              >
                {loading ? "Joining..." : "🚽 Take a Seat"}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleJoinWithLogin} className="space-y-3">
              <Input
                type="text"
                placeholder="What do your dudes call you?"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                autoFocus
                className="rounded-xl border-[#E8DFD0] bg-[#FBF6EF] py-3 text-base placeholder:text-[#C4B49A] focus:border-green-500 focus:ring-green-500"
              />
              {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
              <Button
                type="submit"
                disabled={loading || !username.trim()}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-base rounded-full shadow-md shadow-green-600/20 disabled:opacity-50"
              >
                {loading ? "Joining..." : "🚽 Take a Seat — It's Free"}
              </Button>
              <p className="text-center text-[10px] text-[#A89070]">
                No email. No password. Just vibes and bowel movements.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
