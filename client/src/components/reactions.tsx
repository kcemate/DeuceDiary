import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { getUserDisplayName } from "@/lib/userUtils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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

const commonEmojis = ['👍', '❤️', '😂', '😮', '😢', '😡', '🔥', '👏'];

export function Reactions({ entryId }: ReactionsProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/entries', entryId, 'reactions'] });
      setShowEmojiPicker(false);
    },
    onError: (error) => {
      console.error('Error adding reaction:', error);
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
    onError: (error) => {
      console.error('Error removing reaction:', error);
    },
  });

  const handleEmojiClick = (emoji: string) => {
    if (!user) {
      console.log('No user found, cannot react');
      return;
    }
    
    console.log('Handling emoji click:', emoji, 'User:', user.id);
    
    const existingReaction = reactions.find(r => r.emoji === emoji && r.userId === user.id);
    
    if (existingReaction) {
      console.log('Removing existing reaction');
      removeReactionMutation.mutate(emoji);
    } else {
      console.log('Adding new reaction');
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

  const userHasReacted = (emoji: string) => {
    return reactions.some(r => r.emoji === emoji && r.userId === user?.id);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Existing reactions */}
      {Object.entries(groupedReactions).map(([emoji, reactionList]) => (
        <Button
          key={emoji}
          variant={userHasReacted(emoji) ? "default" : "outline"}
          size="sm"
          onClick={() => handleEmojiClick(emoji)}
          className="h-8 px-2 text-sm"
          title={`${reactionList.length} reaction${reactionList.length > 1 ? 's' : ''}: ${reactionList.map(r => getUserDisplayName(r.user)).join(', ')}`}
        >
          <span className="mr-1">{emoji}</span>
          <span>{reactionList.length}</span>
        </Button>
      ))}

      {/* Add reaction button */}
      <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <Smile className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2">
          <div className="grid grid-cols-4 gap-1">
            {commonEmojis.map(emoji => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                onClick={() => handleEmojiClick(emoji)}
                className="h-8 w-8 p-0 text-base hover:bg-gray-100"
              >
                {emoji}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}