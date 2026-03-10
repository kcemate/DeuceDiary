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
      <div
        className="w-full max-w-sm text-center animate-in fade-in slide-in-from-bottom-4 duration-500 rounded-3xl overflow-hidden relative"
        style={{
          background: "linear-gradient(160deg, hsl(38,40%,97%) 0%, hsl(38,28%,93%) 100%)",
          border: "1.5px solid hsl(45, 55%, 72%)",
          boxShadow: "0 4px 24px hsl(45 60% 50% / 0.12), 0 1px 4px hsl(25 20% 20% / 0.08)",
        }}
      >
        {/* Gold accent bar */}
        <div
          className="h-1.5 w-full"
          style={{ background: "linear-gradient(90deg, hsl(45,88%,48%) 0%, hsl(38,90%,58%) 100%)" }}
        />
        <div className="px-6 py-8">
        <style>{`
          @keyframes float1 {
            0%, 100% { transform: translateY(0px) rotate(-8deg); }
            50%       { transform: translateY(-10px) rotate(-8deg); }
          }
          @keyframes float2 {
            0%, 100% { transform: translateY(0px) rotate(4deg); }
            50%       { transform: translateY(-14px) rotate(4deg); }
          }
          @keyframes float3 {
            0%, 100% { transform: translateY(0px) rotate(12deg); }
            50%       { transform: translateY(-8px) rotate(12deg); }
          }
        `}</style>

        {/* Three floating emojis */}
        <div className="flex justify-center items-end gap-3 mb-4" style={{ height: "80px" }}>
          <span style={{ fontSize: "2.5rem", animation: "float1 3.1s ease-in-out infinite", display: "inline-block", opacity: 0.7 }}>💩</span>
          <span style={{ fontSize: "4rem",   animation: "float2 2.7s ease-in-out infinite 0.3s", display: "inline-block" }}>🚽</span>
          <span style={{ fontSize: "2rem",   animation: "float3 3.5s ease-in-out infinite 0.6s", display: "inline-block", opacity: 0.65 }}>🧻</span>
        </div>

        {/* Error code with flavor */}
        <div className="mb-2">
          <h1 className="text-6xl font-black text-foreground leading-none" style={{ fontVariantNumeric: "tabular-nums" }}>
            404
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">
            Page Not Found · Plumbing Error
          </p>
        </div>

        <h2 className="text-xl font-extrabold text-foreground mb-2">
          This throne is out of order.
        </h2>
        <p className="text-muted-foreground mb-5 max-w-xs mx-auto leading-relaxed text-sm">
          {isLoading
            ? "Checking the plumbing..."
            : isAuthenticated
              ? randomFlushMsg
              : "You need to log in before you can find a seat."}
        </p>

        {/* Throne Fact card */}
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

        {/* Brand footer */}
        <div
          className="px-6 py-3 text-center"
          style={{ borderTop: "1px solid hsl(38, 18%, 86%)" }}
        >
          <p className="text-[10px] text-muted-foreground font-medium">
            🚽 Deuce Diary &middot; Drop a log. Leave a mark.
          </p>
        </div>
        </div>{/* end inner card */}
      </div>
    </div>
  );
}
