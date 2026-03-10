import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Share2, Download } from "lucide-react";
import { getThroneRank, getStreakTier } from "@/lib/gamification";

function getStreakTagline(streak: number): string {
  if (streak === 0) return "Ready to start the streak";
  if (streak === 1) return "Day one. The throne awaits.";
  if (streak < 3) return "Just getting warmed up";
  if (streak < 7) return "The habit is forming";
  if (streak < 14) return "Week one locked in 💪";
  if (streak < 30) return "Officially unstoppable";
  if (streak < 60) return "Iron constitution. Steel resolve.";
  if (streak < 90) return "A force of bathroom nature";
  if (streak < 180) return "Three months of total dominance";
  if (streak < 365) return "Half a year on the throne";
  return "Absolute throne legend 👑";
}

interface ShareCardData {
  username: string | null;
  currentStreak: number;
  longestStreak: number;
  totalLogs: number;
  memberSince: string | null;
  squadCount: number;
}

export function ShareCardModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const userId = user?.id;

  const { data } = useQuery<ShareCardData>({
    queryKey: [`/api/share/streak/${userId}`],
    enabled: open && !!userId,
  });

  const shareUrl = userId
    ? `${window.location.origin}/api/og/streak/${userId}`
    : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({ title: "Link copied!" });
    } catch {
      toast({ title: "Failed to copy", variant: "destructive" });
    }
  };

  const handleNativeShare = async () => {
    if (!navigator.share) {
      handleCopy();
      return;
    }
    try {
      await navigator.share({
        title: `${data?.username || "I"}'m on a ${data?.currentStreak}-day streak!`,
        text: `Join my streak on Deuce Diary`,
        url: shareUrl,
      });
    } catch {
      // user cancelled — no action needed
    }
  };

  const rank = getThroneRank(data?.totalLogs ?? 0);
  const streakTier = getStreakTier(data?.currentStreak ?? 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Share Your Streak</DialogTitle>
        </DialogHeader>

        {/* Share Card Preview */}
        <div
          className="rounded-3xl text-center mx-auto w-full relative overflow-hidden"
          style={{
            background: "linear-gradient(160deg, hsl(38, 38%, 96%) 0%, hsl(38, 28%, 91%) 100%)",
            border: "1.5px solid hsl(45, 55%, 72%)",
            boxShadow: "0 2px 16px hsl(45 60% 60% / 0.12), 0 1px 3px hsl(25 20% 20% / 0.08)",
          }}
        >
          {/* Gold accent bar at top */}
          <div
            className="h-1.5 w-full rounded-t-3xl"
            style={{ background: "linear-gradient(90deg, hsl(45,88%,48%) 0%, hsl(38,90%,58%) 100%)" }}
          />

          <div className="p-8">
            {/* Streak tier badge */}
          <div className="flex justify-center mb-3">
            <span
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
              style={{
                background: "hsl(45, 88%, 48%)",
                color: "hsl(25, 30%, 8%)",
                opacity: data?.currentStreak ? 1 : 0.4,
              }}
            >
              <span>{streakTier.icon}</span>
              {streakTier.label} Streak
            </span>
          </div>

          <div className="text-5xl leading-none">🔥</div>
          <div
            className="text-7xl font-black leading-none mt-2 mb-1"
            style={{
              color: "hsl(45, 88%, 48%)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {data?.currentStreak ?? 0}
          </div>
          <div
            className="text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: "hsl(25, 12%, 42%)" }}
          >
            Day Streak
          </div>

          {/* Fun tagline */}
          <div
            className="text-[13px] italic mb-4"
            style={{ color: "hsl(25, 30%, 38%)" }}
          >
            {getStreakTagline(data?.currentStreak ?? 0)}
          </div>

          <div className="text-xl font-extrabold" style={{ color: "hsl(25, 30%, 8%)" }}>
            {data?.username || "Anonymous"}
          </div>

          {/* Rank title below username */}
          <div
            className="text-sm font-semibold mb-5"
            style={{ color: "hsl(25, 12%, 42%)" }}
          >
            {rank.rank.icon} {rank.rank.title}
          </div>

          <div
            className="flex justify-center gap-6 rounded-2xl py-3 px-2"
            style={{ background: "hsl(38, 25%, 88%)" }}
          >
            <div className="text-center">
              <div className="text-base leading-none mb-0.5">💩</div>
              <div className="text-lg font-black leading-none" style={{ color: "hsl(25, 30%, 8%)", fontVariantNumeric: "tabular-nums" }}>
                {data?.totalLogs ?? 0}
              </div>
              <div className="text-[9px] font-bold uppercase tracking-wider mt-0.5" style={{ color: "hsl(25, 12%, 42%)" }}>
                Logs
              </div>
            </div>
            <div className="w-px self-stretch" style={{ background: "hsl(38, 18%, 80%)" }} />
            <div className="text-center">
              <div className="text-base leading-none mb-0.5">🏆</div>
              <div className="text-lg font-black leading-none" style={{ color: "hsl(25, 30%, 8%)", fontVariantNumeric: "tabular-nums" }}>
                {data?.longestStreak ?? 0}
              </div>
              <div className="text-[9px] font-bold uppercase tracking-wider mt-0.5" style={{ color: "hsl(25, 12%, 42%)" }}>
                Best Streak
              </div>
            </div>
            <div className="w-px self-stretch" style={{ background: "hsl(38, 18%, 80%)" }} />
            <div className="text-center">
              <div className="text-base leading-none mb-0.5">👥</div>
              <div className="text-lg font-black leading-none" style={{ color: "hsl(25, 30%, 8%)", fontVariantNumeric: "tabular-nums" }}>
                {data?.squadCount ?? 0}
              </div>
              <div className="text-[9px] font-bold uppercase tracking-wider mt-0.5" style={{ color: "hsl(25, 12%, 42%)" }}>
                Squads
              </div>
            </div>
          </div>

          {/* Brand watermark */}
          <div className="mt-5 pt-4" style={{ borderTop: "1px solid hsl(38, 18%, 84%)" }}>
            <div className="text-[12px] font-bold" style={{ color: "hsl(25, 30%, 28%)" }}>
              🚽 Deuce Diary
            </div>
            <div className="text-[10px] mt-0.5" style={{ color: "hsl(25, 12%, 52%)" }}>
              Drop a log. Leave a mark.
              {data?.memberSince && (
                <> · Member since {new Date(data.memberSince).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</>
              )}
            </div>
          </div>
          </div>{/* end p-8 */}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-2">
          <Button
            variant="outline"
            className="rounded-xl font-bold px-3"
            onClick={handleCopy}
            title="Copy link"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            className="flex-1 rounded-xl font-bold"
            onClick={handleNativeShare}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Card
          </Button>
          {shareUrl && (
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Preview card"
            >
              <Button variant="outline" className="rounded-xl font-bold px-3" asChild>
                <span>
                  <Download className="w-4 h-4" />
                </span>
              </Button>
            </a>
          )}
        </div>
        <p className="text-center text-[11px] mt-1" style={{ color: "hsl(25, 12%, 52%)" }}>
          Share your streak · embarrass your friends
        </p>
      </DialogContent>
    </Dialog>
  );
}
