import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { getUserDisplayName } from "@/lib/userUtils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Smile, ChevronDown } from "lucide-react";

interface Reaction {
  id: number;
  entryId: string;
  userId: string;
  emoji: string;
  createdAt: string;
  user: {
    id: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    profileImageUrl?: string;
  };
}

interface ReactionsProps {
  entryId: string;
  /** Max reaction pills to show before collapsing (default 4) */
  maxVisible?: number;
}

// Poop-themed emoji set for Deuce Diary
const commonEmojis = ['💩', '🚽', '🔥', '❤️', '😂', '👍', '🤢', '💀', '👏', '🤣'];

/** Sort picker emojis: already-used on this entry first (by count desc), then the rest */
function getSortedPickerEmojis(grouped: Record<string, unknown[]>): string[] {
  const usedCounts: Record<string, number> = {};
  for (const emoji of commonEmojis) {
    if (grouped[emoji]) usedCounts[emoji] = grouped[emoji].length;
  }
  return [...commonEmojis].sort((a, b) => (usedCounts[b] ?? 0) - (usedCounts[a] ?? 0));
}

interface Floater {
  id: number;
  emoji: string;
  dx: number; // horizontal drift in px
}

export function Reactions({ entryId, maxVisible = 4 }: ReactionsProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAllReactions, setShowAllReactions] = useState(false);
  const [animatingEmoji, setAnimatingEmoji] = useState<string | null>(null);
  const [floaters, setFloaters] = useState<Floater[]>([]);
  const floaterCounter = useRef(0);

  const { data: reactions = [] } = useQuery<Reaction[]>({
    queryKey: ['/api/entries', entryId, 'reactions'],
    enabled: !!entryId,
  });

  const spawnFloater = (emoji: string) => {
    const id = ++floaterCounter.current;
    const dx = Math.round((Math.random() - 0.5) * 36); // -18..+18 px
    setFloaters(prev => [...prev, { id, emoji, dx }]);
    setTimeout(() => setFloaters(prev => prev.filter(f => f.id !== id)), 800);
  };

  const addReactionMutation = useMutation({
    mutationFn: async (emoji: string) => {
      return await apiRequest(`/api/entries/${entryId}/reactions`, {
        method: 'POST',
        body: JSON.stringify({ emoji }),
      });
    },
    onSuccess: (_, emoji) => {
      queryClient.invalidateQueries({ queryKey: ['/api/entries', entryId, 'reactions'] });
      setShowEmojiPicker(false);
      setAnimatingEmoji(emoji);
      spawnFloater(emoji);
      setTimeout(() => setAnimatingEmoji(null), 350);
    },
  });

  const removeReactionMutation = useMutation({
    mutationFn: async (emoji: string) => {
      return await apiRequest(`/api/entries/${entryId}/reactions`, {
        method: 'DELETE',
        body: JSON.stringify({ emoji }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/entries', entryId, 'reactions'] });
    },
  });

  const handleEmojiClick = (emoji: string) => {
    if (!user) return;
    const existingReaction = reactions.find(r => r.emoji === emoji && r.userId === user.id);
    if (existingReaction) {
      removeReactionMutation.mutate(emoji);
    } else {
      addReactionMutation.mutate(emoji);
    }
  };

  // Group reactions by emoji, sorted by count desc then alphabetical
  const groupedReactions = reactions.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) acc[reaction.emoji] = [];
    acc[reaction.emoji].push(reaction);
    return acc;
  }, {} as Record<string, Reaction[]>);

  const sortedEntries = Object.entries(groupedReactions).sort(
    ([, a], [, b]) => b.length - a.length
  );

  const userHasReacted = (emoji: string) =>
    reactions.some(r => r.emoji === emoji && r.userId === user?.id);

  const visibleEntries = showAllReactions ? sortedEntries : sortedEntries.slice(0, maxVisible);
  const hiddenCount = sortedEntries.length - maxVisible;

  return (
    <TooltipProvider delayDuration={300}>
      {/* Keyframes for floating emoji burst */}
      <style>{`
        @keyframes floatUp {
          0%   { opacity: 1; transform: translateX(0) translateY(0) scale(1); }
          60%  { opacity: 0.9; transform: translateX(calc(var(--dx, 0) * 0.6px)) translateY(-28px) scale(1.4); }
          100% { opacity: 0; transform: translateX(calc(var(--dx, 0) * 1px)) translateY(-52px) scale(0.8); }
        }
        .emoji-floater {
          position: absolute;
          pointer-events: none;
          font-size: 1.5rem;
          animation: floatUp 0.75s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          z-index: 50;
          left: 50%;
          bottom: 100%;
          transform-origin: center bottom;
        }
        @keyframes pickerSlideIn {
          from { opacity: 0; transform: translateY(6px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .picker-slide-in {
          animation: pickerSlideIn 0.18s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>

      <div className="relative flex items-center gap-1.5 flex-wrap">
        {/* Floating emoji burst portal */}
        {floaters.map(f => (
          <span key={f.id} className="emoji-floater" style={{ ['--dx' as string]: f.dx }}>{f.emoji}</span>
        ))}

        {/* Existing reactions */}
        {visibleEntries.map(([emoji, reactionList]) => {
          const mine = userHasReacted(emoji);
          const names = reactionList.map(r => getUserDisplayName(r.user)).join(', ');
          const isAnimating = animatingEmoji === emoji;

          return (
            <Tooltip key={emoji}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleEmojiClick(emoji)}
                  style={{
                    transform: isAnimating ? 'scale(1.3)' : 'scale(1)',
                    transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                  }}
                  className={[
                    "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-sm font-medium",
                    "min-h-[44px] min-w-[44px] active:scale-90",
                    mine
                      ? "bg-[hsl(45,88%,48%)] text-white ring-2 ring-[hsl(45,88%,38%)] shadow-sm"
                      : "bg-muted hover:bg-muted/80 text-foreground",
                  ].join(' ')}
                  aria-label={`${emoji} — ${names}`}
                >
                  <span className="text-base leading-none">{emoji}</span>
                  <span className="text-xs tabular-nums">{reactionList.length}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs max-w-[200px] text-center">
                {names}
              </TooltipContent>
            </Tooltip>
          );
        })}

        {/* "+N more" overflow toggle / "show less" */}
        {!showAllReactions && hiddenCount > 0 && (
          <button
            onClick={() => setShowAllReactions(true)}
            className="inline-flex items-center gap-0.5 px-2 py-1.5 rounded-full text-xs font-medium bg-muted hover:bg-muted/80 text-muted-foreground min-h-[44px] transition-colors"
          >
            +{hiddenCount}
            <ChevronDown className="h-3 w-3" />
          </button>
        )}
        {showAllReactions && sortedEntries.length > maxVisible && (
          <button
            onClick={() => setShowAllReactions(false)}
            className="inline-flex items-center gap-0.5 px-2 py-1.5 rounded-full text-xs font-medium bg-muted hover:bg-muted/80 text-muted-foreground min-h-[44px] transition-colors"
            aria-label="Show fewer reactions"
          >
            <ChevronDown className="h-3 w-3 rotate-180 transition-transform" />
          </button>
        )}

        {/* Add reaction button */}
        <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 rounded-full hover:bg-muted"
              aria-label="Add reaction"
            >
              <Smile className="h-4 w-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2 picker-slide-in" align="start">
            {/* Already reacted row */}
            {user && commonEmojis.some(e => userHasReacted(e)) && (
              <div className="mb-2 px-1">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Your reactions
                </p>
                <div className="flex gap-1 flex-wrap">
                  {commonEmojis.filter(e => userHasReacted(e)).map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => handleEmojiClick(emoji)}
                      className="h-9 w-9 flex items-center justify-center rounded-lg text-xl bg-[hsl(45,88%,48%)]/20 ring-1 ring-[hsl(45,88%,48%)] hover:bg-[hsl(45,88%,48%)]/30 active:scale-90 transition-all"
                      aria-label={`Remove ${emoji}`}
                      title="Tap to remove"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <div className="border-t my-2" />
              </div>
            )}
            {/* Quick-react: top 3 most popular on this entry */}
            {sortedEntries.length > 0 && (
              <div className="mb-2">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1 px-1">
                  Popular here
                </p>
                <div className="flex gap-1">
                  {sortedEntries.slice(0, 3).map(([emoji, list]) => (
                    <button
                      key={`quick-${emoji}`}
                      onClick={() => handleEmojiClick(emoji)}
                      className={[
                        "flex-1 h-11 flex flex-col items-center justify-center rounded-lg text-xl gap-0.5",
                        "transition-all duration-150 active:scale-90",
                        userHasReacted(emoji)
                          ? "bg-[hsl(45,88%,48%)]/20 ring-1 ring-[hsl(45,88%,48%)]"
                          : "bg-muted hover:bg-muted/70",
                      ].join(' ')}
                      aria-label={`${emoji} (${list.length})`}
                    >
                      <span>{emoji}</span>
                      <span className="text-[9px] font-bold tabular-nums text-muted-foreground leading-none">
                        {list.length}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="border-t my-2" />
              </div>
            )}
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1.5 px-1">
              React
            </p>
            <div className="grid grid-cols-5 gap-1">
              {getSortedPickerEmojis(groupedReactions).map(emoji => (
                <button
                  key={emoji}
                  onClick={() => handleEmojiClick(emoji)}
                  className={[
                    "h-10 w-10 flex items-center justify-center rounded-lg text-xl",
                    "transition-all duration-150 hover:scale-110 active:scale-90",
                    userHasReacted(emoji)
                      ? "bg-[hsl(45,88%,48%)]/20 ring-1 ring-[hsl(45,88%,48%)]"
                      : "hover:bg-muted",
                  ].join(' ')}
                  aria-label={emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </TooltipProvider>
  );
}
