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
import { mutationErrorHandler } from "@/lib/authUtils";
import { Loader2, CheckCircle2, Users } from "lucide-react";

interface CreateGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Fun squad icon options — toilet-themed (24 options, 4 rows of 6)
const SQUAD_ICONS = [
  // Throne room essentials
  '🚽', '💩', '🧻', '🪠', '🚿', '🛁',
  // Power & glory
  '🔥', '👑', '⚡', '🏆', '💎', '🎯',
  // Nature & beasts
  '🌊', '🦁', '🐉', '🦅', '🐺', '🌋',
  // Vibes
  '🤝', '💪', '🧠', '👊', '🎉', '🥇',
];

// Witty placeholder names — pick one randomly each time the modal opens
const SQUAD_NAME_PLACEHOLDERS = [
  "Morning Crew",
  "The Regulars",
  "Porcelain Squad",
  "Throne Seekers",
  "Brown Belt Club",
  "The Daily Deuces",
  "Drop & Roll",
  "Flush Force",
  "Toilet Titans",
  "Deuce Division",
];

function randomPlaceholder() {
  return SQUAD_NAME_PLACEHOLDERS[Math.floor(Math.random() * SQUAD_NAME_PLACEHOLDERS.length)];
}

const NAME_MAX = 90;
const DESC_MAX = 500;

export function CreateGroupModal({ open, onOpenChange }: CreateGroupModalProps) {
  const [icon, setIcon] = useState('🚽');
  const [name, setName] = useState("");
  const [namePlaceholder] = useState(randomPlaceholder);
  const [description, setDescription] = useState("");
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [nameError, setNameError] = useState("");
  const [createdName, setCreatedName] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createGroupMutation = useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      apiRequest("/api/groups", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["/api/groups"] });
      setCreatedName(vars.name);
    },
    onError: mutationErrorHandler(toast, "Failed to create group"),
  });

  const resetForm = () => {
    setIcon('🚽');
    setName("");
    setDescription("");
    setShowIconPicker(false);
    setNameError("");
    setCreatedName(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowIconPicker(false);

    const trimmed = name.trim();
    if (!trimmed) {
      setNameError("Give your squad a name!");
      return;
    }
    if (trimmed.length < 2) {
      setNameError("Name must be at least 2 characters");
      return;
    }

    createGroupMutation.mutate({
      name: `${icon} ${trimmed}`,
      description: description.trim() || undefined,
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) resetForm();
    onOpenChange(newOpen);
  };

  const handleNameChange = (val: string) => {
    setName(val.slice(0, NAME_MAX));
    if (nameError) setNameError("");
  };

  const nameRemaining = NAME_MAX - name.length;
  const descRemaining = DESC_MAX - description.length;

  // Success state
  if (createdName) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center text-center py-6 gap-4">
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-[hsl(45,88%,48%)]/15 flex items-center justify-center text-4xl">
                {createdName.split(' ')[0]}
              </div>
              <CheckCircle2 className="h-6 w-6 text-green-600 absolute -bottom-1 -right-1 bg-background rounded-full" />
            </div>

            <div>
              <h2 className="text-xl font-semibold">{createdName}</h2>
              <p className="text-sm text-muted-foreground mt-1">Your squad is live! 🎉</p>
            </div>

            <div
              className={
                "flex items-center gap-2 text-sm text-muted-foreground bg-muted" +
                " rounded-lg px-4 py-3 w-full justify-center"
              }
            >
              <Users className="h-4 w-4 shrink-0" />
              <span>Invite friends from your squad page</span>
            </div>

            <Button className="w-full" onClick={() => handleOpenChange(false)}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

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
              {/* Icon picker */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setShowIconPicker(v => !v)}
                  className={
                    "h-10 w-12 flex items-center justify-center rounded-md border" +
                    " border-input bg-background text-xl hover:bg-muted transition-colors"
                  }
                  aria-label="Pick squad icon"
                  aria-expanded={showIconPicker}
                >
                  {icon}
                </button>

                {showIconPicker && (
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowIconPicker(false)}
                    aria-hidden
                  />
                )}

                {showIconPicker && (
                  <div
                    className={
                      "absolute top-12 left-0 z-50 bg-popover border rounded-lg shadow-lg p-2" +
                      " grid grid-cols-6 gap-1 w-[196px] max-h-48 overflow-y-auto"
                    }
                  >
                    {SQUAD_ICONS.map(e => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => { setIcon(e); setShowIconPicker(false); }}
                        className={[
                          "h-8 w-8 flex items-center justify-center rounded text-lg",
                          "hover:bg-muted transition-colors",
                          icon === e
                            ? "bg-[hsl(45,88%,48%)]/20 ring-1 ring-[hsl(45,88%,48%)]"
                            : "",
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
                  placeholder={`e.g. ${namePlaceholder}`}
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className={["pr-10", nameError ? "border-destructive" : ""].join(' ')}
                  aria-invalid={!!nameError}
                  aria-describedby={nameError ? "name-error" : undefined}
                />
                <span className={[
                  "absolute right-3 top-1/2 -translate-y-1/2 text-xs tabular-nums pointer-events-none",
                  nameRemaining <= 10 ? "text-destructive" : "text-muted-foreground",
                ].join(" ")}>
                  {nameRemaining}
                </span>
              </div>
            </div>

            {nameError && (
              <p id="name-error" className="mt-1.5 text-xs text-destructive flex items-center gap-1">
                <span aria-hidden>⚠️</span> {nameError}
              </p>
            )}

            {/* Live preview pill */}
            {name.trim() && !nameError && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                  Preview:
                </span>
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold"
                  style={{
                    background: "hsl(45, 88%, 48%)",
                    color: "hsl(25, 30%, 8%)",
                  }}
                >
                  {icon} {name.trim()}
                </span>
              </div>
            )}
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
                className="h-20 resize-none pb-6"
              />
              <span className={[
                "absolute right-3 bottom-2 text-xs tabular-nums pointer-events-none",
                descRemaining <= 50 ? "text-destructive" : "text-muted-foreground",
              ].join(' ')}>
                {descRemaining}
              </span>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={createGroupMutation.isPending}
          >
            {createGroupMutation.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating…
              </span>
            ) : (
              `Create ${icon} ${name.trim() || "Squad"}`
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
