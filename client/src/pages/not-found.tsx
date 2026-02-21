import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

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
      <div className="w-full max-w-md text-center">
        <p className="text-8xl mb-4">🧻</p>
        <h1 className="text-5xl font-extrabold text-foreground mb-2">404</h1>
        <h2 className="text-xl font-bold text-foreground mb-3">This throne is out of order.</h2>
        <p className="text-muted-foreground mb-8">
          {isLoading
            ? "Checking the plumbing..."
            : isAuthenticated
              ? "Whatever you were looking for got flushed. It's gone. Let it go."
              : "You need to log in before you can find a seat."
          }
        </p>
        <Button
          onClick={handleGoHome}
          className="btn-shimmer text-white font-bold rounded-2xl px-8 py-4 text-lg shadow-lg shadow-primary/25"
        >
          {isAuthenticated ? "Back to the Throne Room" : "Log In"}
        </Button>
      </div>
    </div>
  );
}
