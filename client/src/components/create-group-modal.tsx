import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

interface CreateGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Fun squad icon options — toilet-themed
const SQUAD_ICONS = ['🚽', '💩', '🔥', '👑', '⚡', '🏆', '💎', '🎯', '🌊', '🦁', '🐉', '🤝'];

const NAME_MAX = 90; // leave room for "🚽 " prefix (2 chars)
const DESC_MAX = 500;

export function CreateGroupModal({ open, onOpenChange }: CreateGroupModalProps) {
  const [icon, setIcon] = useState('🚽');
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [showIconPicker, setShowIconPicker] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createGroupMutation = useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      return await apiRequest("/api/groups", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Squad created! 🎉",
        description: `${icon} ${name.trim()} is ready to roll.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/groups"] });
      resetForm();
      onOpenChange(false);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create group",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setIcon('🚽');
    setName("");
    setDescription("");
    setShowIconPicker(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = name.trim();
    if (!trimmed) {
      toast({
        title: "Name required",
        description: "Give your squad a name!",
        variant: "destructive",
      });
      return;
    }

    // Prefix the icon to the group name
    const fullName = `${icon} ${trimmed}`;

    createGroupMutation.mutate({
      name: fullName,
      description: description.trim() || undefined,
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) resetForm();
    onOpenChange(newOpen);
  };

  const nameRemaining = NAME_MAX - name.length;
  const descRemaining = DESC_MAX - description.length;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Create Your Squad</DialogTitle>
          <p className="text-sm text-muted-foreground mt-0.5">
            Bring your crew together and track group streaks
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Icon + Name row */}
          <div>
            <Label className="mb-1.5 block">Squad Name</Label>
            <div className="flex gap-2">
              {/* Icon picker button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowIconPicker(v => !v)}
                  className="h-10 w-12 flex items-center justify-center rounded-md border border-input bg-background text-xl hover:bg-muted transition-colors"
                  aria-label="Pick squad icon"
                >
                  {icon}
                </button>
                {showIconPicker && (
                  <div className="absolute top-12 left-0 z-50 bg-popover border rounded-lg shadow-lg p-2 grid grid-cols-6 gap-1 w-[196px]">
                    {SQUAD_ICONS.map(e => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => { setIcon(e); setShowIconPicker(false); }}
                        className={[
                          "h-8 w-8 flex items-center justify-center rounded text-lg",
                          "hover:bg-muted transition-colors",
                          icon === e ? "bg-[hsl(45,88%,48%)]/20 ring-1 ring-[hsl(45,88%,48%)]" : "",
                        ].join(' ')}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Name input */}
              <div className="flex-1 relative">
                <Input
                  placeholder="e.g. Morning Crew"
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, NAME_MAX))}
                  className="pr-10"
                />
                <span className={[
                  "absolute right-3 top-1/2 -translate-y-1/2 text-xs tabular-nums",
                  nameRemaining <= 10 ? "text-destructive" : "text-muted-foreground",
                ].join(' ')}>
                  {nameRemaining}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="mb-1.5 block">
              Description <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <div className="relative">
              <Textarea
                id="description"
                placeholder="What's this squad about?"
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, DESC_MAX))}
                className="h-20 resize-none pr-16"
              />
              <span className={[
                "absolute right-3 bottom-2 text-xs tabular-nums",
                descRemaining <= 50 ? "text-destructive" : "text-muted-foreground",
              ].join(' ')}>
                {descRemaining}
              </span>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={createGroupMutation.isPending || !name.trim()}
          >
            {createGroupMutation.isPending ? "Creating…" : `Create ${icon} ${name.trim() || "Squad"}`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
