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
import { Copy, Share2 } from "lucide-react";
import { getThroneRank, getStreakTier } from "@/lib/gamification";

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
            className="text-xs font-bold uppercase tracking-widest mb-5"
            style={{ color: "hsl(25, 12%, 42%)" }}
          >
            Day Streak
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

          <div className="flex justify-center gap-8">
            <div>
              <div className="text-lg font-black" style={{ color: "hsl(25, 30%, 8%)", fontVariantNumeric: "tabular-nums" }}>
                {data?.totalLogs ?? 0}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "hsl(25, 12%, 42%)" }}>
                Logs
              </div>
            </div>
            <div>
              <div className="text-lg font-black" style={{ color: "hsl(25, 30%, 8%)", fontVariantNumeric: "tabular-nums" }}>
                {data?.longestStreak ?? 0}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "hsl(25, 12%, 42%)" }}>
                Best Streak
              </div>
            </div>
            <div>
              <div className="text-lg font-black" style={{ color: "hsl(25, 30%, 8%)", fontVariantNumeric: "tabular-nums" }}>
                {data?.squadCount ?? 0}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "hsl(25, 12%, 42%)" }}>
                Squads
              </div>
            </div>
          </div>

          {/* Brand watermark */}
          <div
            className="text-[11px] font-semibold mt-5"
            style={{ color: "hsl(25, 12%, 56%)" }}
          >
            🚽 Deuce Diary
          </div>
          </div>{/* end p-8 */}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-2">
          <Button
            variant="outline"
            className="flex-1 rounded-xl font-bold"
            onClick={handleCopy}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Link
          </Button>
          <Button
            className="flex-1 rounded-xl font-bold"
            onClick={handleNativeShare}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
