// TODO: Battle Shits — Full lobby UI (tk_bww2)
// This is a placeholder. Full implementation coming.
//
// Planned features:
// - List active matches, pending challenges
// - "Challenge a Friend" button → pick squad member
// - "Random Opponent" matchmake button
// - Quick Match / Standard Match toggle
// - Match cards with status, opponent, score preview

import React from "react";
import { useQuery } from "@tanstack/react-query";

export default function BattleLobby() {
  const { data: matches = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/battle/matches"],
    queryFn: async () => {
      const res = await fetch("/api/battle/matches");
      if (!res.ok) throw new Error("Failed to fetch matches");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Battle Shits 💣</h1>
      <p className="text-muted-foreground mb-6">1v1 Battleship with real-world drops</p>

      {/* TODO: Challenge button */}
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        <p className="text-lg font-medium">Coming Soon</p>
        <p className="text-sm mt-1">Battle Shits is under construction</p>
        {matches.length > 0 && (
          <p className="text-sm mt-2">{matches.length} active match(es)</p>
        )}
      </div>
    </div>
  );
}
