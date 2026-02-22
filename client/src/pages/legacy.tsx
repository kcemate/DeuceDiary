import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRoute } from "wouter";
import { apiRequest } from "@/lib/queryClient";

interface LegacyData {
  totalLogs: number;
  longestStreak: number;
  bestDay: { date: string; count: number } | null;
  memberSince: string;
  title: string;
}

const TITLE_COLORS: Record<string, string> = {
  Rookie: "text-muted-foreground",
  Regular: "text-blue-500",
  Veteran: "text-purple-500",
  Elite: "text-yellow-500",
  Legend: "text-amber-400",
};

export default function Legacy() {
  const [, params] = useRoute("/legacy/:username");
  const username = params?.username ?? "";
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery<LegacyData>({
    queryKey: ["/api/users", username, "legacy"],
    queryFn: () => apiRequest(`/api/users/${encodeURIComponent(username)}/legacy`),
    enabled: !!username,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied!", description: "Share your legacy with the world." });
    } catch {
      toast({ title: "Couldn't copy", description: url, variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="pt-12 pb-24 flex flex-col items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="pt-12 pb-24 text-center">
        <p className="text-5xl mb-4">👻</p>
        <h2 className="text-xl font-extrabold text-foreground mb-2">Throne not found</h2>
        <p className="text-sm text-muted-foreground">No legacy exists for "{username}"</p>
      </div>
    );
  }

  const titleColor = TITLE_COLORS[data.title] || "text-foreground";

  return (
    <div className="pt-8 pb-24">
      {/* Title badge */}
      <div className="text-center mb-8">
        <p className="text-6xl mb-3">🏛️</p>
        <h1 className="text-2xl font-extrabold text-foreground mb-1">@{username}</h1>
        <span className={`inline-block text-lg font-extrabold uppercase tracking-wider ${titleColor}`}>
          {data.title}
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-card border border-border rounded-2xl p-5 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Total Logs</p>
          <p className="stat-number text-3xl text-foreground">{data.totalLogs}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Longest Streak</p>
          <p className="stat-number text-3xl text-foreground">{data.longestStreak}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Best Day</p>
          {data.bestDay ? (
            <>
              <p className="stat-number text-2xl text-primary">{data.bestDay.count}</p>
              <p className="text-xs text-muted-foreground mt-1">{formatDate(data.bestDay.date)}</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">—</p>
          )}
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Member Since</p>
          <p className="text-sm font-bold text-foreground">{formatDate(data.memberSince)}</p>
        </div>
      </div>

      {/* Share button */}
      <Button
        onClick={handleShare}
        className="btn-shimmer w-full text-white py-4 text-base font-bold rounded-2xl"
      >
        Share My Legacy 🚽
      </Button>
    </div>
  );
}
