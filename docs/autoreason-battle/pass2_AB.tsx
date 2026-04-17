```tsx
import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import logger from "@/lib/logger";
import { useParams, useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PageSpinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useMutationWithToast } from "@/hooks/useMutationWithToast";
import { BattleGrid, GridCell, GridShip, GridAttack } from "@/components/battle-grid";
import { apiRequest } from "@/lib/queryClient";

// ─── Constants ──────────────────────────────────────────────────────────────

const STANDARD_GRID = { cols: 7, rows: 3 };
const QUICK_GRID = { cols: 3, rows: 3 };

const SHIPS_CONFIG = {
  standard: [
    { type: "floater", size: 2, emoji: "🚤", label: "Floater" },
    { type: "log", size: 3, emoji: "🥖", label: "The Log" },
    { type: "battleshit", size: 4, emoji: "💣", label: