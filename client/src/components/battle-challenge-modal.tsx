import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { useMutationWithToast } from "@/hooks/useMutationWithToast";

interface Group {
  id: string;
  name: string;
  memberCount: number;
}

interface Member {
  userId: string;
  role: string;
  user?: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
}

interface GroupDetail {
  group: Group;
  members: Member[];
}

interface BattleChallengeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BattleChallengeModal({ open, onOpenChange }: BattleChallengeModalProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [matchType, setMatchType] = useState<"standard" | "quick">("standard");
  const [filter, setFilter] = useState("");

  const { data: groups = [] } = useQuery<Group[]>({
    queryKey: ["/api/groups"],
    enabled: open,
  });

  const { data: groupDetail, isLoading: loadingMembers } = useQuery<GroupDetail>({
    queryKey: ["/api/groups", selectedGroupId],
    queryFn: async () => {
      try {
        return await apiRequest<GroupDetail>(`/api/groups/${selectedGroupId}`);
      } catch (err) {
        console.error("[battle-challenge-modal] group detail fetch failed", err);
        throw err;
      }
    },
    enabled: open && !!selectedGroupId,
  });

  const challengeMutation = useMutationWithToast({
    mutationFn: (vars: { groupId: string; opponentId: string; matchType: string }) =>
      apiRequest<{ id: string }>("/api/battle/challenge", {
        method: "POST",
        body: JSON.stringify(vars),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/battle/matches"] });
      onOpenChange(false);
      setLocation(`/battle/${data.id}`);
    },
    successMessage: "Challenge sent! ⚔️",
    errorMessage: (err) => err.message,
    errorTitle: "Challenge failed",
  });

  if (!open) return null;

  const members = (groupDetail?.members ?? []).filter(
    (m) => m.userId !== user?.id && m.user?.username?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onOpenChange(false); }}
    >
      <div className={
        "w-full max-w-md bg-background rounded-t-3xl border-t border-border" +
        " p-6 pb-8 space-y-5 animate-slide-up max-h-[85vh] flex flex-col"
      }>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-foreground">⚔️ Issue a Challenge</h2>
            <p className="text-sm text-muted-foreground">Pick a squad mate to destroy</p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground hover:text-foreground text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Match type toggle */}
        <div className="flex rounded-xl overflow-hidden border border-border">
          <button
            className={`flex-1 py-2 text-sm font-bold transition-colors ${
              matchType === "standard"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
            onClick={() => setMatchType("standard")}
          >
            ⚓ Standard (7×3)
          </button>
          <button
            className={`flex-1 py-2 text-sm font-bold transition-colors ${
              matchType === "quick"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
            onClick={() => setMatchType("quick")}
          >
            ⚡ Quick (3×3)
          </button>
        </div>

        {/* Group selector */}
        {groups.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {groups.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGroupId(g.id)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                  selectedGroupId === g.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        )}

        {/* Auto-select first group */}
        {groups.length === 1 && !selectedGroupId && (() => { setSelectedGroupId(groups[0].id); return null; })()}

        {!selectedGroupId && groups.length > 1 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Select a squad above</p>
        ) : (
          <>
            {/* Filter */}
            <input
              type="text"
              placeholder="Search members..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={
                "w-full bg-muted/50 border border-border rounded-xl px-4 py-2 text-sm" +
                " placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              }
            />

            {/* Members list */}
            <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
              {loadingMembers ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 bg-muted/50 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : members.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-3xl mb-2">🪑</p>
                  <p className="text-sm">No squad mates found</p>
                </div>
              ) : (
                members.map((m) => {
                  const username = m.user?.username ?? "Unknown";
                  const avatar = m.user?.avatarUrl;
                  const initials = username.slice(0, 2).toUpperCase();
                  return (
                    <button
                      key={m.userId}
                      className={
                        "w-full flex items-center gap-3 p-3 rounded-xl border border-border" +
                        " hover:border-primary/40 hover:bg-muted/40 transition-all active:scale-[0.98] text-left"
                      }
                      onClick={() => {
                        if (!selectedGroupId) return;
                        challengeMutation.mutate({
                          groupId: selectedGroupId,
                          opponentId: m.userId,
                          matchType,
                        });
                      }}
                      disabled={challengeMutation.isPending}
                    >
                      <Avatar className="w-10 h-10 shrink-0">
                        {avatar ? <AvatarImage src={avatar} /> : null}
                        <AvatarFallback className="text-xs font-bold">{initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-foreground truncate">{username}</p>
                        <p className="text-xs text-muted-foreground">{m.role === "admin" ? "👑 Admin" : "Member"}</p>
                      </div>
                      <Badge variant="outline" className="shrink-0 text-xs font-bold text-primary border-primary/40">
                        Challenge ⚔️
                      </Badge>
                    </button>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
