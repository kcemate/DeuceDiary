import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { isUnauthorizedError } from "@/lib/authUtils";

interface ReferralInfo {
  code: string;
  referralCount: number;
  referralLink: string;
}

export default function Referral() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [applyCode, setApplyCode] = useState("");

  const { data: referral, isLoading } = useQuery<ReferralInfo>({
    queryKey: ["/api/referral"],
  });

  const applyMutation = useMutation({
    mutationFn: () =>
      apiRequest("/api/referral/apply", {
        method: "POST",
        body: JSON.stringify({ code: applyCode.trim().toUpperCase() }),
      }),
    onSuccess: (data: any) => {
      toast({
        title: "Code applied!",
        description: `You and ${data.referrerUsername} are linked 🤌`,
      });
      setApplyCode("");
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "Session expired. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Couldn't apply code",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = async () => {
    if (!referral) return;
    const text = `Join me on Deuce Diary 🚽 Use my code ${referral.code} or link: ${referral.referralLink}`;
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied to clipboard!" });
    } catch {
      toast({
        title: "Couldn't copy",
        description: "Try selecting the link manually.",
        variant: "destructive",
      });
    }
  };

  const shareLink = async () => {
    if (!referral) return;
    const text = `Join me on Deuce Diary 🚽 Use my code ${referral.code} or link: ${referral.referralLink}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Deuce Diary", text });
      } catch {
        // user cancelled — ignore
      }
    } else {
      copyToClipboard();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="pt-6 pb-24">
      {/* Hero */}
      <div className="text-center mb-8">
        <p className="text-6xl mb-4">🎁</p>
        <h1
          className="text-3xl font-extrabold text-foreground mb-2"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Refer Friends
        </h1>
        <p className="text-muted-foreground">
          Share the throne. Spread the movement.
        </p>
      </div>

      {/* Referral Code Card */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-4 text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
          Your Code
        </p>
        <p className="text-3xl font-extrabold text-primary tracking-widest font-mono">
          {referral?.code}
        </p>
        <p className="text-sm text-muted-foreground mt-3">
          {referral?.referralCount === 0
            ? "No friends joined yet — share your code!"
            : `${referral?.referralCount} friend${referral?.referralCount === 1 ? "" : "s"} joined`}
        </p>
      </div>

      {/* Share Buttons */}
      <div className="space-y-3 mb-8">
        <Button
          onClick={shareLink}
          className="w-full rounded-2xl font-bold py-6 text-lg"
        >
          Share My Code
        </Button>
        <Button
          onClick={copyToClipboard}
          variant="outline"
          className="w-full rounded-2xl font-bold"
        >
          Copy Link
        </Button>
      </div>

      {/* Apply a Code */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
          Apply a Code
        </h3>
        <div className="flex gap-2">
          <Input
            placeholder="Enter friend's code"
            value={applyCode}
            onChange={(e) => setApplyCode(e.target.value)}
            className="flex-1 rounded-xl font-mono uppercase"
          />
          <Button
            onClick={() => applyMutation.mutate()}
            disabled={!applyCode.trim() || applyMutation.isPending}
            className="rounded-xl font-bold"
          >
            {applyMutation.isPending ? "..." : "Apply"}
          </Button>
        </div>
      </div>

      {/* Back Link */}
      <div className="mt-6 text-center">
        <button
          onClick={() => setLocation("/profile")}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to Profile
        </button>
      </div>
    </div>
  );
}
