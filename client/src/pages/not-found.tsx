import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

const FLUSH_MESSAGES = [
  "Whatever you were looking for got flushed. It's gone. Let it go.",
  "This URL clogged the pipes. Nothing made it through.",
  "We searched every stall. This page is not in any of them.",
  "Looks like someone flushed this page. Classic.",
  "404: Page failed to drop. Happens to the best of us.",
];

const THRONE_FACTS = [
  "The average person spends 3 whole years of their life on the toilet.",
  "Ancient Romans used a communal sponge on a stick. This page is cleaner than that.",
  "A healthy gut produces about 1 cup of gas per day. You could be logging that.",
  "The toilet was invented in 1596. Some habits are worth tracking.",
  "Constipation costs the US healthcare system $235M per year. Awareness is key.",
];

const randomFlushMsg = FLUSH_MESSAGES[Math.floor(Math.random() * FLUSH_MESSAGES.length)];
const randomFact = THRONE_FACTS[Math.floor(Math.random() * THRONE_FACTS.length)];

export default function NotFound() {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  const handleGoHome = () => {
    if (isAuthenticated) {
      setLocation("/");
    } else {
      window.location.href = "/api/login";
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Spinning toilet emoji */}
        <div
          className="text-8xl mb-4 inline-block"
          style={{ animation: "spin 6s linear infinite" }}
        >
          🚽
        </div>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
        `}</style>

        <h1 className="text-5xl font-extrabold text-foreground mb-2">404</h1>
        <h2 className="text-xl font-bold text-foreground mb-3">
          This throne is out of order.
        </h2>
        <p className="text-muted-foreground mb-8 max-w-xs mx-auto leading-relaxed">
          {isLoading
            ? "Checking the plumbing..."
            : isAuthenticated
              ? randomFlushMsg
              : "You need to log in before you can find a seat."}
        </p>

        {/* Throne fact card */}
        <div
          className="rounded-xl px-4 py-3 mb-6 text-left"
          style={{
            background: "hsl(38, 30%, 92%)",
            border: "1px solid hsl(38, 20%, 82%)",
          }}
        >
          <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
            🚽 Throne Fact
          </p>
          <p className="text-xs text-foreground leading-snug">{randomFact}</p>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            onClick={handleGoHome}
            className="btn-shimmer text-white font-bold rounded-2xl px-8 py-4 text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98]"
          >
            {isAuthenticated ? "Back to the Throne Room" : "Log In"}
          </Button>

          {isAuthenticated && (
            <Button
              variant="ghost"
              className="text-muted-foreground text-sm font-medium"
              onClick={() => setLocation("/profile")}
            >
              View my profile instead →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
