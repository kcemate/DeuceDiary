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

const randomFlushMsg = FLUSH_MESSAGES[Math.floor(Math.random() * FLUSH_MESSAGES.length)];

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

        <Button
          onClick={handleGoHome}
          className="btn-shimmer text-white font-bold rounded-2xl px-8 py-4 text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98]"
        >
          {isAuthenticated ? "Back to the Throne Room" : "Log In"}
        </Button>

        {isAuthenticated && (
          <p className="text-[11px] text-muted-foreground mt-4">
            If this page used to exist,{" "}
            <a
              href="https://github.com/anthropics/claude-code/issues"
              className="underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              let us know
            </a>
            .
          </p>
        )}
      </div>
    </div>
  );
}
