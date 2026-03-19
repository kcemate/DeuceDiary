import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { BattleChallengeModal } from "@/components/battle-challenge-modal";

interface BattleMatch {
  id: string;
  groupId: string;
  challengerId: string;
  opponentId: string;
  matchType: "standard" | "quick";
  status: "pending" | "placement" | "active" | "completed" | "forfeited" | "voided";
  winnerId?: string;
  challengerUsername?: string;
  opponentUsername?: string;
  challengerAvatarUrl?: string;
  opponentAvatarUrl?: string;
  challengerHits?: number;
  opponentHits?: number;
  totalCells?: number;
}

function statusLabel(match: BattleMatch, userId: string) {
  const isChallenger = match.challengerId === userId;
  switch (match.status) {
    case "pending":
      return isChallenger ? "Waiting for acceptance" : "You've been challenged!";
    case "placement":
      return "Place your ships";
    case "active":
      return "Battle in progress";
    case "completed":
      return match.winnerId === userId ? "Victory! 🏆" : "Defeated 💀";
    case "forfeited":
      return match.winnerId === userId ? "Opponent forfeited 🏆" : "You forfeited";
    case "voided":
      return "Void — no show";
    default:
      return match.status;
  }
}

function statusColor(match: BattleMatch, userId: string) {
  switch (match.status) {
    case "active":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "pending":
    case "placement":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "completed":
      return match.winnerId === userId
        ? "bg-primary/20 text-primary border-primary/30"
        : "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

function MatchCard({
  match,
  userId,
  onAccept,
  onDecline,
}: {
  match: BattleMatch;
  userId: string;
  onAccept?: () => void;
  onDecline?: () => void;
}) {
  const [, setLocation] = useLocation();
  const isChallenger = match.challengerId === userId;
  const opponentName = isChallenger ? match.opponentUsername : match.challengerUsername;
  const opponentAvatar = isChallenger ? match.opponentAvatarUrl : match.challengerAvatarUrl;
  const opponentInitials = (opponentName ?? "?").slice(0, 2).toUpperCase();

  const myHits = isChallenger ? match.challengerHits ?? 0 : match.opponentHits ?? 0;
  const theirHits = isChallenger ? match.opponentHits ?? 0 : match.challengerHits ?? 0;
  const total = match.totalCells ?? 0;

  const isPendingForMe = match.status === "pending" && !isChallenger;
  const isNavigable = ["placement", "active", "completed"].includes(match.status) ||
    (match.status === "pending" && isChallenger);

  return (
    <div
      className={`bg-card border border-border rounded-2xl p-4 transition-all ${
        isNavigable ? "cursor-pointer hover:border-primary/40 active:scale-[0.98]" : ""
      }`}
      onClick={() => isNavigable && setLocation(`/battle/${match.id}`)}
    >
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="w-10 h-10 shrink-0">
          {opponentAvatar ? <AvatarImage src={opponentAvatar} /> : null}
          <AvatarFallback className="text-xs font-bold">{opponentInitials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-foreground truncate">vs {opponentName ?? "Unknown"}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Badge
              variant="outline"
              className="text-[10px] font-bold px-1.5 py-0 border-border"
            >
              {match.matchType === "standard" ? "⚓ Standard" : "⚡ Quick"}
            </Badge>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${statusColor(match, userId)}`}
            >
              {statusLabel(match, userId)}
            </span>
          </div>
        </div>
        {match.status === "active" && total > 0 && (
          <div className="text-right shrink-0">
            <p className="text-xs font-bold text-foreground">{myHits}/{total}</p>
            <p className="text-[10px] text-muted-foreground">hits</p>
          </div>
        )}
      </div>

      {/* Score bar for active/completed */}
      {(match.status === "active" || match.status === "completed") && total > 0 && (
        <div className="flex gap-1 items-center">
          <span className="text-[10px] text-muted-foreground w-12 truncate">You</span>
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${Math.min(100, (myHits / total) * 100)}%` }}
            />
          </div>
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500 rounded-full transition-all"
              style={{ width: `${Math.min(100, (theirHits / total) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground w-12 text-right truncate">Them</span>
        </div>
      )}

      {/* Accept/decline for pending challenges */}
      {isPendingForMe && (
        <div className="flex gap-2 mt-3">
          <Button
            size="sm"
            className="flex-1 h-8 text-xs font-bold bg-primary hover:bg-primary/90"
            onClick={(e) => { e.stopPropagation(); onAccept?.(); }}
          >
            Accept ⚔️
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 h-8 text-xs font-bold"
            onClick={(e) => { e.stopPropagation(); onDecline?.(); }}
          >
            Decline
          </Button>
        </div>
      )}
    </div>
  );
}

export default function BattleLobby() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [matchType, setMatchType] = useState<"standard" | "quick">("standard");

  const { data: matches = [], isLoading } = useQuery<BattleMatch[]>({
    queryKey: ["/api/battle/matches"],
  });

  const { data: groups = [] } = useQuery<{ id: string; name: string }[]>({
    queryKey: ["/api/groups"],
  });

  const matchmakeMutation = useMutation({
    mutationFn: (vars: { groupId: string; matchType: string }) =>
      apiRequest<{ id: string }>("/api/battle/matchmake", {
        method: "POST",
        body: JSON.stringify(vars),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/battle/matches"] });
      toast({ title: "Random opponent found! ⚔️", description: "Battle begins now." });
      setLocation(`/battle/${data.id}`);
    },
    onError: (err: Error) => {
      toast({ title: "No opponents available", description: err.message, variant: "destructive" });
    },
  });

  const forfeitMutation = useMutation({
    mutationFn: (matchId: string) =>
      apiRequest(`/api/battle/match/${matchId}/forfeit`, { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/battle/matches"] });
      toast({ title: "Challenge declined" });
    },
  });

  const activeMatches = matches.filter((m) =>
    ["pending", "placement", "active"].includes(m.status)
  );
  const completedMatches = matches.filter((m) =>
    ["completed", "forfeited", "voided"].includes(m.status)
  );
  const pendingChallenges = matches.filter(
    (m) => m.status === "pending" && m.opponentId === user?.id
  );

  function handleMatchmake() {
    if (!groups.length) {
      toast({
        title: "Join a squad first!",
        description: "You need to be in a squad to matchmake.",
        variant: "destructive",
      });
      return;
    }
    matchmakeMutation.mutate({ groupId: groups[0].id, matchType });
  }

  return (
    <div className="pt-6 pb-28">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-foreground">⚔️ Battle Shits</h1>
        <p className="text-sm text-muted-foreground mt-1">1v1 Battleship with real-world drops</p>
      </div>

      {/* Match type toggle */}
      <div className="flex rounded-xl overflow-hidden border border-border mb-5">
        <button
          className={`flex-1 py-2.5 text-sm font-bold transition-colors ${
            matchType === "standard"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted"
          }`}
          onClick={() => setMatchType("standard")}
        >
          ⚓ Standard
        </button>
        <button
          className={`flex-1 py-2.5 text-sm font-bold transition-colors ${
            matchType === "quick"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted"
          }`}
          onClick={() => setMatchType("quick")}
        >
          ⚡ Quick Match
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mb-6">
        <Button
          className={
            "flex-1 bg-primary hover:bg-primary/90 text-primary-foreground " +
            "font-bold rounded-2xl py-5 shadow-lg shadow-primary/20"
          }
          onClick={() => setShowChallengeModal(true)}
        >
          ⚔️ Challenge Friend
        </Button>
        <Button
          variant="outline"
          className="flex-1 font-bold rounded-2xl py-5 border-border hover:border-primary/40"
          onClick={handleMatchmake}
          disabled={matchmakeMutation.isPending}
        >
          {matchmakeMutation.isPending ? "Finding..." : "🎲 Random"}
        </Button>
      </div>

      {/* Pending challenges */}
      {pendingChallenges.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-extrabold text-foreground uppercase tracking-wide mb-2">
            🔔 Incoming Challenges
          </h2>
          <div className="space-y-3">
            {pendingChallenges.map((m) => (
              <MatchCard
                key={m.id}
                match={m}
                userId={user?.id ?? ""}
                onAccept={() => setLocation(`/battle/${m.id}`)}
                onDecline={() => forfeitMutation.mutate(m.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Active matches */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : activeMatches.filter((m) => m.status !== "pending" || m.challengerId === user?.id).length > 0 ? (
        <div className="mb-5">
          <h2 className="text-sm font-extrabold text-foreground uppercase tracking-wide mb-2">
            ⚔️ Active Battles
          </h2>
          <div className="space-y-3">
            {activeMatches
              .filter((m) => !(m.status === "pending" && m.opponentId === user?.id))
              .map((m) => (
                <MatchCard key={m.id} match={m} userId={user?.id ?? ""} />
              ))}
          </div>
        </div>
      ) : null}

      {/* Completed matches */}
      {completedMatches.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-extrabold text-foreground uppercase tracking-wide mb-2">
            📜 Recent Battles
          </h2>
          <div className="space-y-3">
            {completedMatches.slice(0, 5).map((m) => (
              <MatchCard key={m.id} match={m} userId={user?.id ?? ""} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && matches.length === 0 && (
        <div className="bg-card border border-border rounded-2xl p-10 text-center mt-2">
          <p className="text-6xl mb-4">⚔️</p>
          <h3 className="text-xl font-extrabold text-foreground mb-2">No active battles.</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Challenge a squad mate and wage war on their bowel schedule.
          </p>
          <Button
            onClick={() => setShowChallengeModal(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl px-8 py-2"
          >
            Challenge a Friend
          </Button>
        </div>
      )}

      <BattleChallengeModal open={showChallengeModal} onOpenChange={setShowChallengeModal} />
    </div>
  );
}
