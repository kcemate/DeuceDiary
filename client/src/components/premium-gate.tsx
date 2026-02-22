import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import type { ReactNode } from "react";

interface PremiumGateProps {
  featureName: string;
  children: ReactNode;
}

export function PremiumGate({ featureName, children }: PremiumGateProps) {
  const { user } = useAuth();
  const isFree = (user as any)?.subscription !== "premium";

  if (!isFree) return <>{children}</>;

  return (
    <div className="relative">
      {/* Blurred content underneath */}
      <div className="pointer-events-none select-none blur-sm opacity-40">
        {children}
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm rounded-2xl">
        <span className="text-5xl mb-4">👑</span>
        <p className="text-lg font-bold text-foreground text-center mb-2">
          Unlock {featureName} with Premium
        </p>
        <Link href="/premium">
          <Button className="btn-shimmer rounded-xl font-bold px-8 py-2 text-white">
            Upgrade to Premium
          </Button>
        </Link>
      </div>
    </div>
  );
}
