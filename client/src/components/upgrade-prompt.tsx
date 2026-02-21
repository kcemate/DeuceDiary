import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function UpgradePrompt() {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">👑</span>
        <h3 className="font-bold text-foreground">Unlock Porcelain Premium</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Streak insurance, gold badge, custom themes, and analytics — starting at $3.99/mo.
      </p>
      <Link href="/premium">
        <Button className="w-full rounded-xl font-bold">Upgrade</Button>
      </Link>
    </div>
  );
}
