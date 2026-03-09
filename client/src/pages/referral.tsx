import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Copy, Share2, Users, Award, Clock, RefreshCw } from "lucide-react";
import { BackHeader } from "@/components/back-header";

const SHARE_MESSAGES = [
  "I track my poops and I'm not ashamed. Join me on Deuce Diary — the Strava of poop tracking.",
  "Just logged my 💩 on Deuce Diary. Yes it's an app. Yes it's amazing. Join me:",
  "My poop game has never been more organized. Deuce Diary — track, share, compete.",
  "Finally an app that takes my bathroom habits as seriously as I do. Join Deuce Diary:",
  "I'm on a 🔥 streak (the poop kind). Join me on Deuce Diary and start yours:",
];

interface ReferralInfo {
  code: string;
  referralCount: number;
  referralLink: string;
}

interface ReferralStats {
  totalReferrals: number;
  premiumConversions: number;
  pendingConversions: number;
}

interface LeaderboardEntry {
  username: string | null;
  profileImageUrl: string | null;
  referralCount: number;
  premiumConversionCount: number;
}

export default function Referral() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [applyCode, setApplyCode] = useState("");
  const [messageIndex, setMessageIndex] = useState(() =>
    Math.floor(Math.random() * SHARE_MESSAGES.length)
  );

  const { data: referral, isLoading } = useQuery<ReferralInfo>({
    queryKey: ["/api/referral"],
  });

  const { data: stats } = useQuery<ReferralStats>({
    queryKey: ["/api/referrals/stats"],
  });

  const { data: leaderboard = [] } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/referrals/leaderboard"],
  });

  const applyMutation = useMutation({
    mutationFn: () =>
      apiRequest<{ referrerUsername: string }>("/api/referral/apply", {
        method: "POST",
        body: JSON.stringify({ code: applyCode.trim().toUpperCase() }),
      }),
    onSuccess: (data: { referrerUsername: string }) => {
      toast({
        title: "Code applied!",
        description: `You and ${data.referrerUsername} are linked`,
      });
      setApplyCode("");
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "Session expired. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Couldn't apply code",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    },
  });

  const getShareText = () => {
    if (!referral) return "";
    return `${SHARE_MESSAGES[messageIndex]}\n\n${referral.referralLink}`;
  };

  const shuffleMessage = () => {
    setMessageIndex((prev) => (prev + 1) % SHARE_MESSAGES.length);
  };

  const copyToClipboard = async () => {
    if (!referral) return;
    try {
      await navigator.clipboard.writeText(getShareText());
      toast({ title: "Copied to clipboard!" });
    } catch {
      toast({
        title: "Couldn't copy",
        description: "Try selecting the link manually.",
        variant: "destructive",
      });
    }
  };

  const shareLink = async () => {
    if (!referral) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Deuce Diary",
          text: SHARE_MESSAGES[messageIndex],
          url: referral.referralLink,
        });
      } catch {
        // user cancelled — ignore
      }
    } else {
      copyToClipboard();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="pt-6 pb-24">
      <BackHeader to="/profile" label="Profile" />
      {/* Hero */}
      <div className="text-center mb-6">
        <p className="text-6xl mb-4">🎁</p>
        <h1
          className="text-3xl font-extrabold text-foreground mb-2"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Refer Friends
        </h1>
        <p className="text-muted-foreground">
          Share the throne. Spread the movement.
        </p>
      </div>

      {/* Reward Progress */}
      {(() => {
        const count = referral?.referralCount ?? 0;
        const goal = 3;
        const progress = Math.min(count / goal, 1);
        const unlocked = count >= goal;
        return (
          <div className={`border rounded-2xl p-5 mb-6 ${unlocked ? "bg-accent/15 border-accent/50" : "bg-accent/5 border-accent/20"}`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-foreground">
                {unlocked ? "🎉 Premium Unlocked!" : "Unlock Porcelain Premium"}
              </p>
              <span className="text-xs font-bold text-accent">
                {Math.min(count, goal)}/{goal} friends
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-2">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${Math.max(progress * 100, count > 0 ? 8 : 0)}%`,
                  background: unlocked
                    ? "linear-gradient(90deg, var(--accent), #d4a846)"
                    : "linear-gradient(90deg, var(--primary), var(--accent))",
                }}
              />
            </div>
            {/* Milestone dots */}
            <div className="flex justify-between px-1 mb-1">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex flex-col items-center">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      count >= n
                        ? "bg-accent text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {count >= n ? "✓" : n}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              {unlocked
                ? "You earned 30 days of Porcelain Premium. Keep sharing to stay golden!"
                : `Invite ${goal - count} more friend${goal - count === 1 ? "" : "s"} to earn 30 days of Porcelain Premium`}
            </p>
          </div>
        );
      })()}

      {/* Share Card */}
      <div className="bg-card border-2 border-accent/40 rounded-2xl p-6 mb-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent/50 via-accent to-accent/50" />
        <p className="text-4xl font-extrabold text-primary tracking-widest font-mono mt-2 mb-1">
          {referral?.code}
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          {referral?.referralCount === 0
            ? "No friends joined yet \u2014 share your code!"
            : `${referral?.referralCount} friend${referral?.referralCount === 1 ? "" : "s"} joined`}
        </p>

        {/* Message preview */}
        <div className="bg-muted/50 rounded-xl p-3 mb-4 text-left relative">
          <p className="text-xs text-muted-foreground italic pr-8 leading-relaxed">
            &ldquo;{SHARE_MESSAGES[messageIndex]}&rdquo;
          </p>
          <button
            onClick={shuffleMessage}
            className="absolute top-2 right-2 p-1.5 rounded-lg hover:bg-muted transition-colors"
            title="Try a different message"
          >
            <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={copyToClipboard}
            variant="outline"
            className="flex-1 rounded-xl font-bold"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button
            onClick={shareLink}
            className="flex-1 rounded-xl font-bold"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Your Stats */}
      <div className="relative bg-gradient-to-b from-muted/50 to-transparent p-4 -mx-4 mb-6 rounded-2xl">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 px-0">
          Your Referral Stats
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card border border-border rounded-2xl p-4 text-center">
            <Users className="h-4 w-4 text-primary mx-auto mb-1" />
            <p className="stat-number text-2xl text-primary">{stats?.totalReferrals ?? 0}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-1">Referred</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4 text-center">
            <Award className="h-4 w-4 text-accent mx-auto mb-1" />
            <p className="stat-number text-2xl text-accent">{stats?.premiumConversions ?? 0}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-1">Converted</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4 text-center">
            <Clock className="h-4 w-4 text-secondary mx-auto mb-1" />
            <p className="stat-number text-2xl text-secondary">{stats?.pendingConversions ?? 0}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-1">Pending</p>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
          Top Referrers
        </h3>
        {leaderboard.length > 0 ? (
          <div className="space-y-3">
            {leaderboard.map((entry, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className={`text-sm font-extrabold w-6 text-center ${i < 3 ? "text-accent" : "text-muted-foreground"}`}>
                  {i === 0 ? "\uD83E\uDD47" : i === 1 ? "\uD83E\uDD48" : i === 2 ? "\uD83E\uDD49" : `${i + 1}`}
                </span>
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
                  {entry.profileImageUrl ? (
                    <img src={entry.profileImageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-muted-foreground">
                      {(entry.username ?? "?")[0]?.toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium text-foreground flex-1 truncate">
                  {entry.username ?? "Anonymous"}
                </span>
                <div className="text-right">
                  <span className="text-sm font-bold text-primary">{entry.referralCount}</span>
                  <span className="text-xs text-muted-foreground ml-1">refs</span>
                  {entry.premiumConversionCount > 0 && (
                    <span className="text-xs text-accent ml-2">{entry.premiumConversionCount} conv</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-4xl mb-2">🏆</p>
            <p className="text-sm text-muted-foreground">No referrals yet. Be the first!</p>
          </div>
        )}
      </div>

      {/* Apply a Code */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
          Apply a Code
        </h3>
        <div className="flex gap-2">
          <Input
            placeholder="Enter friend's code"
            value={applyCode}
            onChange={(e) => setApplyCode(e.target.value)}
            className="flex-1 rounded-xl font-mono uppercase"
          />
          <Button
            onClick={() => applyMutation.mutate()}
            disabled={!applyCode.trim() || applyMutation.isPending}
            className="rounded-xl font-bold"
          >
            {applyMutation.isPending ? "..." : "Apply"}
          </Button>
        </div>
      </div>

    </div>
  );
}
