import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";

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
          <h1 className="text-3xl font-extrabold text-foreground mb-2 tracking-tight">Welcome to Deuce Diary</h1>
          <p className="text-sm text-muted-foreground italic mb-2">Where great thoughts are born.</p>
          <p className="text-muted-foreground text-center">
            Share your best thoughts from the throne with your dudes.
          </p>
        </div>

        {/* Features — colored left borders */}
        <div className="space-y-3">
          <div className="bg-card border border-border border-l-4 border-l-primary rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">👥</span>
              <div>
                <h3 className="font-bold text-foreground">Create Groups</h3>
                <p className="text-sm text-muted-foreground">Form groups to share your throne thoughts</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border border-l-4 border-l-amber-500 rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🚽</span>
              <div>
                <h3 className="font-bold text-foreground">Log Your Deuces</h3>
                <p className="text-sm text-muted-foreground">Track thoughts, locations, and more</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border border-l-4 border-l-blue-500 rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">⚡</span>
              <div>
                <h3 className="font-bold text-foreground">Real-time Updates</h3>
                <p className="text-sm text-muted-foreground">Get notified when your dudes log entries</p>
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
      </div>
    </div>
  );
}
