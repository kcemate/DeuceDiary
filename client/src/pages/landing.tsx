import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-primary"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9 2V1h6v1c2.21 0 4 1.79 4 4v2c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1V6c0-2.21 1.79-4 4-4zm0 2c-1.1 0-2 .9-2 2v1h10V6c0-1.1-.9-2-2-2H9zm-3 8v9c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-9H6zm2 2h2v5H8v-5zm6 0h2v5h-2v-5z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to Deuce Diary</h1>
          <p className="text-sm text-muted-foreground italic mb-2">Where great thoughts are born.</p>
          <p className="text-muted-foreground text-center">
            Share your best thoughts from the throne with your dudes.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">👥</span>
                <div>
                  <h3 className="font-semibold text-foreground">Create Groups</h3>
                  <p className="text-sm text-muted-foreground">Form groups to share your throne thoughts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">🚽</span>
                <div>
                  <h3 className="font-semibold text-foreground">Log Your Deuces</h3>
                  <p className="text-sm text-muted-foreground">Track thoughts, locations, and more</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">⚡</span>
                <div>
                  <h3 className="font-semibold text-foreground">Real-time Updates</h3>
                  <p className="text-sm text-muted-foreground">Get notified when your dudes log entries</p>
                </div>
              </div>
            </CardContent>
          </Card>
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
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            type="submit"
            disabled={loading || !username.trim()}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3"
          >
            {loading ? "Signing in…" : "Enter the Throne Room"}
          </Button>
        </form>
      </div>
    </div>
  );
}
