import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { mutationErrorHandler } from "@/lib/authUtils";

interface InviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
}

const copyIconPath =
  "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2" +
  "m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z";

export function InviteModal({ open, onOpenChange, groupId }: InviteModalProps) {
  const [inviteLink, setInviteLink] = useState("");
  const { toast } = useToast();

  const createInviteMutation = useMutation({
    mutationFn: () =>
      apiRequest<{ id: string; inviteLink: string }>(`/api/groups/${groupId}/invite`, {
        method: "POST",
        body: JSON.stringify({}),
      }),
    onSuccess: (response: { id: string }) => {
      const inviteId = response.id;
      if (!inviteId) {
        toast({
          title: "Error",
          description: "Failed to generate invite link - no ID received",
          variant: "destructive",
        });
        return;
      }
      setInviteLink(`${window.location.origin}/join/${inviteId}`);
      toast({ title: "Success", description: "Invite link generated successfully!" });
    },
    onError: mutationErrorHandler(toast, "Failed to generate invite link"),
  });

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      toast({
        title: "Success",
        description: "Invite link copied to clipboard!",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join my Deuce Diary group",
          text: "Join my group to share throne thoughts!",
          url: inviteLink,
        });
      } catch (err) {
        // User canceled sharing or share failed
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setInviteLink("");
    }
    onOpenChange(newOpen);
  };

  // Generate invite link when modal opens
  useEffect(() => {
    if (open && !inviteLink && !createInviteMutation.isPending) {
      createInviteMutation.mutate();
    }
  }, [open, inviteLink, createInviteMutation]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite a Dude</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="invite-link">Invite Link</Label>
            <div className="flex items-center space-x-2 mt-2">
              <Input
                id="invite-link"
                value={inviteLink || "Generating..."}
                readOnly
                className="bg-muted"
              />
              <Button
                onClick={copyToClipboard}
                disabled={!inviteLink}
                variant="outline"
                size="sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={copyIconPath}
                  />
                </svg>
              </Button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Share this link with your dude. Link expires in 7 days.
            </p>
            <Button
              onClick={shareLink}
              disabled={!inviteLink}
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              Share Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
