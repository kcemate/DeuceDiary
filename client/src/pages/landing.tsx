import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";

export default function Landing() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Login failed");
        return;
      }
      // Invalidate auth query so the app picks up the new session
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    } catch {
      setError("Network error — is the server running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Welcome */}
        <div className="text-center">
          <div className="text-6xl mb-4">🚽</div>
          <h1 className="text-3xl font-extrabold text-foreground mb-2 tracking-tight">Deuce Diary</h1>
          <p className="text-sm text-muted-foreground italic mb-2">Drop a thought. Leave a mark.</p>
          <p className="text-muted-foreground text-center">
            Your best ideas happen on the throne. Share them with your squad.
          </p>
        </div>

        {/* Features — colored left borders */}
        <div className="space-y-3">
          <div className="bg-card border border-border border-l-4 border-l-primary rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">👥</span>
              <div>
                <h3 className="font-bold text-foreground">Build Your Squad</h3>
                <p className="text-sm text-muted-foreground">Round up your crew. Your best ideas need witnesses.</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border border-l-4 border-l-amber-500 rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🚽</span>
              <div>
                <h3 className="font-bold text-foreground">Drop Your Deuces</h3>
                <p className="text-sm text-muted-foreground">Log your throne-time thoughts, where, and when</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border border-l-4 border-l-blue-500 rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">⚡</span>
              <div>
                <h3 className="font-bold text-foreground">Live from the Throne</h3>
                <p className="text-sm text-muted-foreground">Get pinged the moment your squad drops one</p>
              </div>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-3">
          <Input
            type="text"
            placeholder="What do your dudes call you?"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            autoFocus
            className="rounded-xl border-border bg-card py-3 text-base"
          />
          {error && <p className="text-sm text-destructive font-medium">{error}</p>}
          <Button
            type="submit"
            disabled={loading || !username.trim()}
            className="btn-shimmer w-full text-white font-bold py-4 text-lg rounded-2xl shadow-lg shadow-primary/25 disabled:opacity-50 disabled:animate-none"
          >
            {loading ? "Signing in…" : "Enter the Throne Room"}
          </Button>
        </form>

        <div className="text-center text-xs text-muted-foreground pt-4">
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          <span className="mx-1">&middot;</span>
          <Link href="/terms" className="hover:underline">Terms</Link>
        </div>
      </div>
    </div>
  );
}
