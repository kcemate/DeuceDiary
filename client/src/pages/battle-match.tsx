// TODO: Battle Shits — Full match UI (tk_bww2)
// This is a placeholder. Full implementation coming.
//
// Planned features:
// - Two grids side by side (mobile: tabbed — "Your Grid" / "Enemy Grid")
// - Ship placement phase: drag & drop ships, tap to rotate
// - Attack phase: tap enemy grid cell to fire
// - Real-time updates (existing WebSocket infra)
// - Token counter, power-up buttons
// - Hit/miss animations
// - Victory/defeat screen

import React from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function BattleMatch() {
  const { matchId } = useParams<{ matchId: string }>();

  const { data, isLoading, error } = useQuery<any>({
    queryKey: ["/api/battle/match", matchId],
    queryFn: async () => {
      const res = await fetch(`/api/battle/match/${matchId}`);
      if (!res.ok) throw new Error("Failed to fetch match");
      return res.json();
    },
    enabled: !!matchId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading match...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-destructive">Match not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Battle Shits 💣</h1>
      <p className="text-sm text-muted-foreground mb-2">Match: {matchId}</p>
      <p className="text-sm text-muted-foreground mb-6">Status: {data.match?.status}</p>

      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        <p className="text-lg font-medium">Coming Soon</p>
        <p className="text-sm mt-1">Full battle grid UI is under construction</p>
      </div>
    </div>
  );
}
