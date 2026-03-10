import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { getUserDisplayName } from "@/lib/userUtils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Smile } from "lucide-react";

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
}

// Poop-themed emoji set for Deuce Diary
const commonEmojis = ['💩', '🚽', '🔥', '❤️', '😂', '👍', '🤢', '💀', '👏', '🤣'];

export function Reactions({ entryId }: ReactionsProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [animatingEmoji, setAnimatingEmoji] = useState<string | null>(null);

  const { data: reactions = [] } = useQuery<Reaction[]>({
    queryKey: ['/api/entries', entryId, 'reactions'],
    enabled: !!entryId,
  });

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
      setTimeout(() => setAnimatingEmoji(null), 400);
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

  // Group reactions by emoji
  const groupedReactions = reactions.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = [];
    }
    acc[reaction.emoji].push(reaction);
    return acc;
  }, {} as Record<string, Reaction[]>);

  const userHasReacted = (emoji: string) =>
    reactions.some(r => r.emoji === emoji && r.userId === user?.id);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Existing reactions */}
        {Object.entries(groupedReactions).map(([emoji, reactionList]) => {
          const mine = userHasReacted(emoji);
          const names = reactionList.map(r => getUserDisplayName(r.user)).join(', ');
          const isAnimating = animatingEmoji === emoji;

          return (
            <Tooltip key={emoji}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleEmojiClick(emoji)}
                  className={[
                    "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-sm font-medium",
                    "min-h-[36px] min-w-[44px] transition-all duration-150 active:scale-90",
                    mine
                      ? "bg-[hsl(45,88%,48%)] text-white ring-2 ring-[hsl(45,88%,38%)] shadow-sm"
                      : "bg-muted hover:bg-muted/80 text-foreground",
                    isAnimating ? "scale-125" : "scale-100",
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
          <PopoverContent className="w-auto p-2" align="start">
            <div className="grid grid-cols-5 gap-1">
              {commonEmojis.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => handleEmojiClick(emoji)}
                  className={[
                    "h-10 w-10 flex items-center justify-center rounded-lg text-xl",
                    "transition-all duration-100 hover:bg-muted active:scale-90",
                    userHasReacted(emoji) ? "bg-[hsl(45,88%,48%)]/20 ring-1 ring-[hsl(45,88%,48%)]" : "",
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
