import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export function StreakInsuranceButton() {
  const { user } = useAuth();
  const { toast } = useToast();

  const isPremium = user?.subscription === "premium";
  const alreadyUsed = !!user?.streakInsuranceUsed;

  const useInsuranceMutation = useMutation({
    mutationFn: () =>
      apiRequest("/api/user/streak-insurance", {
        method: "PUT",
      }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/groups"] });
      toast({
        title: data.extended ? "🔥 Streak Saved!" : "🛡️ Insurance Activated",
        description: data.message,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Insurance Failed",
        description: error.message || "Couldn't activate streak insurance.",
        variant: "destructive",
      });
    },
  });

  if (!isPremium) {
    return (
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">🛡️</span>
          <div>
            <h3 className="font-bold text-foreground">Streak Insurance</h3>
            <p className="text-xs text-muted-foreground">Miss a day? We've got you. Premium only.</p>
          </div>
        </div>
        <Link href="/premium">
          <Button variant="outline" className="w-full rounded-xl font-bold">
            Upgrade to Use Insurance
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">🛡️</span>
        <div>
          <h3 className="font-bold text-foreground">Streak Insurance</h3>
          <p className="text-xs text-muted-foreground">
            {alreadyUsed
              ? "Used this month — resets next month."
              : "Restore a broken streak. 1 use per month."}
          </p>
        </div>
        <span
          className={`ml-auto text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
            alreadyUsed
              ? "text-muted-foreground bg-muted"
              : "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20"
          }`}
        >
          {alreadyUsed ? "Used" : "Active"}
        </span>
      </div>

      <Button
        onClick={() => useInsuranceMutation.mutate()}
        disabled={alreadyUsed || useInsuranceMutation.isPending}
        variant={alreadyUsed ? "secondary" : "default"}
        className="w-full rounded-xl font-bold"
      >
        {useInsuranceMutation.isPending
          ? "Activating…"
          : alreadyUsed
          ? "Insurance Used This Month"
          : "🛡️ Use Streak Insurance"}
      </Button>
    </div>
  );
}
