import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiUrl } from "@/lib/api-base";
import { SignInButton, SignUpButton, useAuth as useClerkAuth } from "@clerk/clerk-react";

// Hardcoded true — useAuth.ts does the same. The env var isn't available
// inside Docker build (Railway injects it at runtime only), so reading
// import.meta.env here always resolves to false in production builds.
const CLERK_ENABLED = true;

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

// Avatar color palette seeded by username for consistency
const AVATAR_COLORS = [
  { bg: "#D4EDDA", text: "#1A5C2E" }, // green
  { bg: "#FFF3CD", text: "#7D4E00" }, // gold
  { bg: "#D1ECF1", text: "#0C5460" }, // teal
  { bg: "#F8D7DA", text: "#721C24" }, // rose
  { bg: "#E2D9F3", text: "#4B2EA2" }, // purple
  { bg: "#FDEBD0", text: "#6E2C00" }, // orange
  { bg: "#D6EAF8", text: "#154360" }, // blue
];

function avatarColor(username: string) {
  const idx = username.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
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
  const { getToken } = useClerkAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDemo, setShowDemo] = useState(true);
  const [visibleActivity, setVisibleActivity] = useState(0);
  const [ctaTab, setCtaTab] = useState<"new" | "existing">("new");

  const { data: preview, isLoading: previewLoading, error: previewError } = useQuery<GroupPreview>({
    queryKey: [`/api/groups/preview/${code}`],
    enabled: !!code,
  });

  // Stagger-reveal activity entries when preview loads
  useEffect(() => {
    if (!preview?.recentActivity?.length) return;
    const count = preview.recentActivity.length;
    const timers = Array.from({ length: count }, (_, i) =>
      setTimeout(() => setVisibleActivity(i + 1), i * 200 + 400)
    );
    return () => timers.forEach(clearTimeout);
  }, [preview]);

  // Auto-join when authenticated user lands on invite page
  const [autoJoinAttempted, setAutoJoinAttempted] = useState(false);
  useEffect(() => {
    if (!isAuthenticated || authLoading || !code || !preview || autoJoinAttempted) return;
    setAutoJoinAttempted(true);
    setLoading(true);
    (async () => {
      try {
        const token = await getToken();
        const res = await fetch(apiUrl(`/api/join/${code}`), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Failed to join group");
          return;
        }
        queryClient.invalidateQueries({ queryKey: ["/api/groups"] });
        const alreadyMember = data.message === "Already a member of this group";
        toast({
          title: alreadyMember ? "Already in!" : "You're in! 🚽",
          description: `${alreadyMember ? "You're already a member of" : "Joined"} "${data.group?.name}"`,
        });
        setLocation("/");
      } catch {
        setError("Network error — is the server running?");
      } finally {
        setLoading(false);
      }
    })();
  }, [isAuthenticated, authLoading, code, preview, autoJoinAttempted]);

  async function handleJoinWithLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(apiUrl("/api/login"), {
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
      const token = await getToken();
      const res = await fetch(apiUrl(`/api/join/${code}`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to join group");
        return;
      }
      const data = await res.json();
      await queryClient.invalidateQueries({ queryKey: ["/api/groups"] });

      const alreadyMember = data.message === "Already a member of this group";
      toast({
        title: alreadyMember ? "Already in!" : "You're in! 🚽",
        description: `${alreadyMember ? "You're already a member of" : "Joined"} "${data.group?.name}"`,
      });
      setLocation("/");
    } catch {
      setError("Network error — is the server running?");
    } finally {
      setLoading(false);
    }
  }

  // ── 404 state ──
  if (previewError || (!previewLoading && !preview)) {
    return (
      <div
        className="min-h-screen bg-[#FBF6EF] text-[#2C1A0E] flex flex-col items-center justify-center p-4"
        data-theme="cream"
      >
        <div className="max-w-sm w-full text-center space-y-5">
          <div className="text-7xl animate-bounce">🚽</div>
          <div className="bg-white rounded-2xl border border-[#E8DFD0] shadow-sm p-6 space-y-3">
            <h1 className="text-xl font-extrabold text-[#2C1A0E]">Invite Not Found</h1>
            <p className="text-sm text-[#8B7355]">
              This invite link has expired or never existed.
              <br />Ask your squad to send a fresh one.
            </p>
            <div className="pt-1 space-y-2">
              <Button
                onClick={() => setLocation("/")}
                className="w-full rounded-full bg-green-600 hover:bg-green-700 text-white font-bold"
              >
                Go to Deuce Diary
              </Button>
              <p className="text-[10px] text-[#C4B49A]">Invites expire after 7 days</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const streakTier = preview ? getStreakTier(preview.currentStreak) : null;

  return (
    <div className="min-h-screen bg-[#FBF6EF] text-[#2C1A0E]" data-theme="cream">
      <div className="max-w-md mx-auto px-4 py-8 pb-28 space-y-5">

        {/* ── Header ── */}
        <div className="text-center pt-4">
          <div className="text-6xl mb-3">🚽</div>
          {previewLoading ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-7 bg-[#E8DFD0] rounded-full w-3/4 mx-auto" />
              <div className="h-4 bg-[#F0E8DC] rounded-full w-1/2 mx-auto" />
            </div>
          ) : preview ? (
            <>
              <h1 className="text-2xl font-extrabold text-[#2C1A0E] leading-tight">
                <span className="text-green-700">{preview.name}</span> wants you in. 🎯
              </h1>
              <p className="text-[#8B7355] text-sm mt-1.5">
                {preview.memberCount}{" "}
                {preview.memberCount === 1 ? "person is" : "people are"} already logging — join the squad.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-extrabold text-[#2C1A0E] leading-tight">
                Your squad is holding a seat for you.
              </h1>
              <p className="text-[#8B7355] text-sm mt-1">
                Check out the group first — no signup required to peek.
              </p>
            </>
          )}
          <p className="text-[10px] text-[#C4B49A] uppercase tracking-widest mt-2 font-semibold">
            The Strava of poop tracking
          </p>
        </div>

        {/* ── Social Proof Stats Bar ── */}
        {preview && (
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: preview.deuceCount, label: "Total Deuces", icon: "💩" },
              { value: preview.currentStreak, label: "Day Streak", icon: "🔥" },
              { value: preview.memberCount, label: "Members", icon: "👥" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-[#E8DFD0] p-3 text-center shadow-sm"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <p className="text-lg">{stat.icon}</p>
                <p className="text-xl font-extrabold text-[#2C1A0E] leading-none mt-0.5">{stat.value}</p>
                <p className="text-[10px] text-[#A89070] uppercase tracking-wide mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Group Preview Card ── */}
        {previewLoading ? (
          <div className="bg-white rounded-2xl border border-[#E8DFD0] p-6 animate-pulse space-y-3">
            <div className="h-5 bg-[#F0E8DC] rounded w-2/3" />
            <div className="h-4 bg-[#F0E8DC] rounded w-1/2" />
            <div className="h-4 bg-[#F0E8DC] rounded w-1/3" />
          </div>
        ) : preview ? (
          <div className={[
            "bg-white rounded-2xl border border-[#E8DFD0] shadow-sm overflow-hidden",
            "animate-in fade-in slide-in-from-bottom-3 duration-500",
          ].join(" ")}>
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

            </div>

            {/* Members */}
            {preview.members.length > 0 && (
              <div className="px-5 py-3 border-b border-[#F0E8DC]">
                <p className="text-[10px] font-bold text-[#A89070] uppercase tracking-widest mb-2">
                  The Crew
                </p>
                <div className="flex items-center gap-3">
                  {/* Overlapping avatar stack */}
                  <div className="flex -space-x-2">
                    {preview.members.slice(0, 5).map((m, i) => {
                      const { bg, text } = avatarColor(m.username);
                      return (
                        <div
                          key={i}
                          title={`${m.username} · ${m.deuceCount} 💩`}
                          style={{ backgroundColor: bg, color: text, zIndex: 5 - i }}
                          className={[
                            "relative w-9 h-9 rounded-full border-2 border-white",
                            "flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm",
                          ].join(" ")}
                        >
                          {m.username[0].toUpperCase()}
                        </div>
                      );
                    })}
                    {preview.members.length > 5 && (
                      <div
                        className={[
                          "relative w-9 h-9 rounded-full border-2 border-white bg-[#F0E8DC]",
                          "flex items-center justify-center text-[10px] font-bold text-[#8B7355] flex-shrink-0",
                        ].join(" ")}
                        style={{ zIndex: 0 }}
                      >
                        +{preview.members.length - 5}
                      </div>
                    )}
                  </div>
                  {/* Member names list */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#2C1A0E] truncate">
                      {preview.members.slice(0, 3).map(m => m.username).join(", ")}
                      {preview.members.length > 3 && ` + ${preview.members.length - 3} more`}
                    </p>
                    <p className="text-[10px] text-[#A89070]">
                      {preview.members.reduce((sum, m) => sum + m.deuceCount, 0)} 💩 total between the crew
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Recent activity */}
            <div className="px-5 py-3">
              <p className="text-[10px] font-bold text-[#A89070] uppercase tracking-widest mb-2">
                Live Feed
              </p>
              {preview.recentActivity.length > 0 ? (
                <div className="space-y-2.5">
                  {preview.recentActivity.map((entry, i) => (
                    <div
                      key={i}
                      className={`flex gap-2 transition-all duration-300 ${
                        i < visibleActivity ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                      }`}
                    >
                      <div className={[
                        "w-7 h-7 rounded-full bg-green-100",
                        "flex items-center justify-center text-sm flex-shrink-0",
                      ].join(" ")}>
                        {["🚽", "💪", "🔥", "🏆", "✨"][i % 5]}
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
              ) : (
                <p className="text-xs text-[#A89070] italic">No activity yet — be the first to log! 💩</p>
              )}
            </div>
          </div>
        ) : null}

        {/* ── App Preview (Demo) ── */}
        {/* Show by default; auto-dismiss once real group activity is visible */}
        {showDemo && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <p className="text-[10px] text-[#A89070] font-bold uppercase tracking-widest">
                App Preview — what your feed looks like
              </p>
              <button
                onClick={() => setShowDemo(false)}
                className="text-[10px] text-[#C4B49A] hover:text-[#5C4A35] transition-colors underline"
              >
                Hide
              </button>
            </div>
            <DemoFeedCard />
          </div>
        )}

        {!showDemo && (
          <button
            onClick={() => setShowDemo(true)}
            className="w-full text-center text-xs text-[#C4B49A] hover:text-[#8B7355] transition-colors"
          >
            👀 Show app preview
          </button>
        )}

        {/* ── Value strip ── */}
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { icon: "🔥", label: "Daily streak" },
            { icon: "🏆", label: "Squad leaderboard" },
            { icon: "🚽", label: "No email needed" },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl border border-[#E8DFD0] py-2.5 px-1 shadow-sm">
              <p className="text-lg">{item.icon}</p>
              <p className="text-[10px] font-semibold text-[#5C4A35] mt-0.5 leading-tight">{item.label}</p>
            </div>
          ))}
        </div>

        {/* ── Action area ── */}
        <div id="cta-form" className="bg-white rounded-2xl border border-[#E8DFD0] shadow-sm p-5 space-y-4">
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
                className={[
                  "w-full bg-green-600 hover:bg-green-700 text-white font-bold",
                  "py-4 text-base rounded-full shadow-md shadow-green-600/20 disabled:opacity-50",
                ].join(" ")}
              >
                {loading ? "Joining..." : "🚽 Take a Seat"}
              </Button>
              <p className="text-center text-[10px] text-[#A89070]">
                Signed in as <strong>{user?.username}</strong>
              </p>
            </div>
          ) : CLERK_ENABLED ? (
            // ── Clerk mode: redirect to Clerk sign-in/sign-up, return to invite ──
            <div className="space-y-3">
              <SignUpButton
                mode="redirect"
                forceRedirectUrl={`/invite/${code}`}
              >
                <Button className={[
                  "w-full bg-green-600 hover:bg-green-700 text-white font-bold",
                  "py-4 text-base rounded-full shadow-md shadow-green-600/20",
                ].join(" ")}>
                  🚽 Take a Seat — It's Free
                </Button>
              </SignUpButton>
              <SignInButton
                mode="redirect"
                forceRedirectUrl={`/invite/${code}`}
              >
                <Button
                  variant="outline"
                  className="w-full border-[#E8DFD0] text-[#2C1A0E] font-bold py-4 text-base rounded-full"
                >
                  🔑 I Already Have an Account
                </Button>
              </SignInButton>
              <p className="text-center text-[10px] text-[#A89070]">
                No email. No password. Just vibes and bowel movements.
              </p>
            </div>
          ) : (
            // ── Dev mode: username form ──
            <div className="space-y-3">
              {/* New vs Returning tab toggle */}
              <div className="flex rounded-xl bg-[#F5EDE0] p-1 gap-1" role="tablist" aria-label="Account type">
                <button
                  role="tab"
                  aria-selected={ctaTab === "new"}
                  aria-controls="tab-panel-new"
                  onClick={() => { setCtaTab("new"); setError(""); setUsername(""); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    ctaTab === "new" ? "bg-white text-green-700 shadow-sm" : "text-[#8B7355] hover:text-[#5C4A35]"
                  }`}
                >
                  I'm New Here
                </button>
                <button
                  role="tab"
                  aria-selected={ctaTab === "existing"}
                  aria-controls="tab-panel-existing"
                  onClick={() => { setCtaTab("existing"); setError(""); setUsername(""); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    ctaTab === "existing" ? "bg-white text-[#2C1A0E] shadow-sm" : "text-[#8B7355] hover:text-[#5C4A35]"
                  }`}
                >
                  I Have an Account
                </button>
              </div>

              {ctaTab === "new" ? (
                <form id="tab-panel-new" role="tabpanel" onSubmit={handleJoinWithLogin} className="space-y-3">
                  <Input
                    id="username-input"
                    type="text"
                    placeholder="Pick a username (no email needed)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    autoFocus
                    className={[
                      "rounded-xl border-[#E8DFD0] bg-[#FBF6EF] text-[#2C1A0E] py-3 text-base",
                      "placeholder:text-[#C4B49A] focus:border-green-500 focus:ring-green-500",
                    ].join(" ")}
                  />
                  {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
                  <Button
                    type="submit"
                    disabled={loading || !username.trim()}
                    className={[
                      "w-full bg-green-600 hover:bg-green-700 text-white font-bold",
                      "py-4 text-base rounded-full shadow-md shadow-green-600/20 disabled:opacity-50",
                    ].join(" ")}
                  >
                    {loading ? "Creating account..." : "🚽 Take a Seat — It's Free"}
                  </Button>
                  <p className="text-center text-[10px] text-[#A89070]">
                    No email. No password. Just vibes and bowel movements.
                  </p>
                </form>
              ) : (
                <form id="tab-panel-existing" role="tabpanel" onSubmit={handleJoinWithLogin} className="space-y-3">
                  <Input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    autoFocus
                    className={[
                      "rounded-xl border-[#E8DFD0] bg-[#FBF6EF] text-[#2C1A0E] py-3 text-base",
                      "placeholder:text-[#C4B49A] focus:border-green-500 focus:ring-green-500",
                    ].join(" ")}
                  />
                  {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
                  <Button
                    type="submit"
                    disabled={loading || !username.trim()}
                    className={[
                      "w-full bg-[#2C1A0E] hover:bg-[#3D2616] text-white font-bold",
                      "py-4 text-base rounded-full shadow-md disabled:opacity-50",
                    ].join(" ")}
                  >
                    {loading ? "Signing in..." : "🔑 Sign In & Join"}
                  </Button>
                  <p className="text-center text-[10px] text-[#A89070]">
                    Already a Deuce Diary member? Just enter your username.
                  </p>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Sticky Bottom CTA bar (mobile) ── */}
      {!authLoading && !isAuthenticated && preview && (
        <div className={[
          "fixed bottom-0 left-0 right-0 z-50",
          "bg-white/95 backdrop-blur-sm border-t border-[#E8DFD0] px-4 py-3 safe-area-pb",
        ].join(" ")}>
          <div className="max-w-md mx-auto space-y-1.5">
            <p className="text-center text-[10px] text-[#A89070] font-semibold">
              {preview.currentStreak >= 3
                ? `🔥 ${preview.currentStreak}-day streak · ${preview.memberCount} logging · Free`
                : `${preview.memberCount} ${preview.memberCount === 1 ? "person" : "people"} already logging · Free`}
            </p>
            <Button
              onClick={() => {
                document.getElementById("cta-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
                const input = document.getElementById("username-input") as HTMLInputElement;
                input?.focus();
              }}
              className={[
                "w-full bg-green-600 hover:bg-green-700 text-white font-bold",
                "py-3.5 text-base rounded-full shadow-lg shadow-green-600/30",
              ].join(" ")}
            >
              🚽 Join {preview.name} — Take a Seat
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
