{/* SEO TODO: Add OG meta tags in index.html — og:title, og:description, og:image, og:url, twitter:card */}

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

  function scrollToLogin() {
    document.getElementById("login-section")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-28 text-center">
          <div className="text-7xl md:text-8xl mb-6 animate-bounce">🚽</div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
            The <span className="text-primary">Strava</span> of
            <br />Poop Tracking
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Track your deuces. Build streaks. Compete with friends.
            <br className="hidden md:block" />
            Finally, a bowel tracker that's social, fun, <em>and</em> actually useful.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={scrollToLogin}
              className="btn-shimmer text-white font-bold py-5 px-8 text-lg rounded-2xl shadow-lg shadow-primary/25"
            >
              Start Your Streak — It's Free
            </Button>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center py-5 px-8 text-lg font-semibold rounded-2xl border border-border bg-card hover:bg-muted transition-colors"
            >
              How It Works
            </a>
          </div>
        </div>
        {/* Subtle gradient fade at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ── Social Proof / Stats ── */}
      <section className="border-y border-border bg-card/50">
        <div className="max-w-4xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "10K+", label: "Deuces Logged" },
            { value: "2.5K+", label: "Active Streakers" },
            { value: "500+", label: "Squads Formed" },
            { value: "💯", label: "Longest Streak" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl md:text-4xl font-extrabold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="max-w-5xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Everything you need to rule the throne
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            No 47-field symptom forms. No gimmicky map pins. Just the good stuff.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Feature 1: Streaks */}
          <div className="bg-card border border-border border-l-4 border-l-primary rounded-2xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-4">
              <span className="text-4xl mt-1">🔥</span>
              <div>
                <h3 className="text-xl font-bold mb-1">Streaks That Stick</h3>
                <p className="text-muted-foreground">
                  Build your daily deuce streak and climb from Peasant to Porcelain Royalty.
                  Miss a day? It resets. Duolingo energy, bathroom edition.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 2: Squads */}
          <div className="bg-card border border-border border-l-4 border-l-blue-500 rounded-2xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-4">
              <span className="text-4xl mt-1">👥</span>
              <div>
                <h3 className="text-xl font-bold mb-1">Squads — Your Poop Crew</h3>
                <p className="text-muted-foreground">
                  Create or join a squad with friends. See who's keeping up, who's slacking,
                  and celebrate milestones together. Group streaks keep everyone honest.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 3: Leaderboards */}
          <div className="bg-card border border-border border-l-4 border-l-amber-500 rounded-2xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-4">
              <span className="text-4xl mt-1">🏆</span>
              <div>
                <h3 className="text-xl font-bold mb-1">Live Leaderboards</h3>
                <p className="text-muted-foreground">
                  Who dropped the most deuces this week? Every squad has a real-time
                  leaderboard. Friendly competition has never been this… regular.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 4: Quick Logging */}
          <div className="bg-card border border-border border-l-4 border-l-green-500 rounded-2xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-4">
              <span className="text-4xl mt-1">⚡</span>
              <div>
                <h3 className="text-xl font-bold mb-1">Log in Seconds</h3>
                <p className="text-muted-foreground">
                  Open, tap, done. The fastest poop logging experience out there — because
                  nobody wants to spend <em>more</em> time in the bathroom.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="bg-card/50 border-y border-border">
        <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
              Three steps to throne glory
            </h2>
            <p className="text-muted-foreground text-lg">
              It takes less time than your average bathroom visit.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              {
                step: "1",
                emoji: "📝",
                title: "Sign Up",
                desc: "Pick a username. That's it. No email, no password, no friction.",
              },
              {
                step: "2",
                emoji: "👥",
                title: "Join a Squad",
                desc: "Create one or hop into a friend's. This is more fun with witnesses.",
              },
              {
                step: "3",
                emoji: "🔥",
                title: "Start Your Streak",
                desc: "Log your first deuce. The streak begins. The throne awaits.",
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center text-2xl font-extrabold text-primary mb-4">
                  {item.step}
                </div>
                <span className="text-4xl mb-3">{item.emoji}</span>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bonus Features Strip ── */}
      <section className="max-w-4xl mx-auto px-4 py-16 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Plus all the extras
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { emoji: "😂", label: "Reactions & Feed" },
            { emoji: "📊", label: "Weekly Throne Report" },
            { emoji: "🔒", label: "Privacy First" },
            { emoji: "🩺", label: "Bristol Stool Scale" },
            { emoji: "👑", label: "Porcelain Premium" },
            { emoji: "🌙", label: "Dark Mode" },
            { emoji: "🔗", label: "Invite & Referrals" },
            { emoji: "📱", label: "Mobile Native" },
          ].map((item) => (
            <div key={item.label} className="bg-card border border-border rounded-xl p-4">
              <span className="text-2xl block mb-2">{item.emoji}</span>
              <span className="text-sm font-semibold">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── App Store / Download Section ── */}
      <section className="border-y border-border bg-card/50">
        <div className="max-w-3xl mx-auto px-4 py-16 md:py-20 text-center">
          <div className="text-5xl mb-4">📱</div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3">
            Coming soon to iOS
          </h2>
          <p className="text-muted-foreground text-lg mb-6 max-w-md mx-auto">
            Take your throne game mobile. Track deuces, check your streak, and roast your
            squad — all from your pocket.
          </p>
          <a
            href="#"
            aria-label="Download on the App Store (coming soon)"
            className="inline-block opacity-80 hover:opacity-100 transition-opacity"
          >
            <img
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              alt="Download on the App Store"
              className="h-14 mx-auto"
            />
          </a>
          <p className="text-xs text-muted-foreground mt-3">
            App Store badge is a placeholder — link coming at launch.
          </p>
        </div>
      </section>

      {/* ── Final CTA + Login Form ── */}
      <section id="login-section" className="max-w-md mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">👑</div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Ready to claim your throne?
          </h2>
          <p className="text-muted-foreground text-lg">
            Pick a username. Start your streak. It's free forever.
          </p>
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

        <p className="text-center text-xs text-muted-foreground mt-4">
          No email required. No password. Just vibes and bowel movements.
        </p>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border">
        <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="text-lg">🚽</span>
            <span className="font-bold text-foreground">Deuce Diary</span>
            <span>&middot;</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-foreground hover:underline transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground hover:underline transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
