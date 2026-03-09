import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const queryClient = useQueryClient();

  const usernameMutation = useMutation({
    mutationFn: async (username: string) => {
      return await apiRequest("/api/auth/user", {
        method: "PUT",
        body: JSON.stringify({ username }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setStep(2);
    },
    onError: (error) => {
      setUsernameError(error.message || "That username is taken. Try another!");
    },
  });

  const validateUsername = (value: string): string => {
    if (value.length === 0) return "";
    if (value.length < 3) return "Too short — need at least 3 characters";
    if (value.length > 20) return "Too long — 20 characters max";
    if (!USERNAME_REGEX.test(value)) return "Letters, numbers, and underscores only";
    return "";
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    setUsernameError(validateUsername(value));
  };

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateUsername(username);
    if (error) {
      setUsernameError(error);
      return;
    }
    usernameMutation.mutate(username);
  };

  return (
    <div className="pt-8 pb-24 flex flex-col items-center">
      {/* Progress dots */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-2 rounded-full transition-all ${
              s === step ? "w-8 bg-primary" : s < step ? "w-2 bg-primary/60" : "w-2 bg-border"
            }`}
          />
        ))}
      </div>

      {/* Step 1: Username */}
      {step === 1 && (
        <Card className="w-full border border-border rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <span className="text-6xl block mb-4">🚽</span>
              <h2 className="text-2xl font-extrabold text-foreground mb-2">
                Welcome to Deuce Diary!
              </h2>
              <p className="text-muted-foreground">
                Every throne needs a name on the door. Pick your username — this is how your squad will know you.
              </p>
            </div>

            <form onSubmit={handleUsernameSubmit} className="space-y-4">
              <div>
                <Input
                  id="username"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="throne_king_42"
                  className="text-center text-lg py-5 rounded-xl"
                  maxLength={20}
                  autoFocus
                />
                {usernameError && (
                  <p className="text-destructive text-sm mt-2 text-center font-medium">
                    {usernameError}
                  </p>
                )}
                <p className="text-muted-foreground text-xs mt-2 text-center">
                  3–20 characters. Letters, numbers, underscores.
                </p>
              </div>

              <Button
                type="submit"
                disabled={!username || !!usernameError || usernameMutation.isPending}
                className="btn-shimmer w-full text-white py-5 text-lg font-bold rounded-xl"
              >
                {usernameMutation.isPending ? "Claiming..." : "Claim Your Throne Name 👑"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Solo Deuces group */}
      {step === 2 && (
        <Card className="w-full border border-border rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <span className="text-6xl block mb-4">🏠</span>
              <h2 className="text-2xl font-extrabold text-foreground mb-2">
                Your Solo Deuces group is ready
              </h2>
              <p className="text-muted-foreground">
                We set up a private group just for you — <strong>Solo Deuces</strong>. Every log lands here by default.
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 bg-muted rounded-xl p-4 border border-border">
                <span className="text-2xl">📝</span>
                <div>
                  <p className="font-bold text-foreground text-sm">Log solo</p>
                  <p className="text-muted-foreground text-xs">Track your throne sessions privately</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-muted rounded-xl p-4 border border-border">
                <span className="text-2xl">👥</span>
                <div>
                  <p className="font-bold text-foreground text-sm">Create or join a squad</p>
                  <p className="text-muted-foreground text-xs">Compete with friends on the leaderboard</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-muted rounded-xl p-4 border border-border">
                <span className="text-2xl">🔥</span>
                <div>
                  <p className="font-bold text-foreground text-sm">Build your streak</p>
                  <p className="text-muted-foreground text-xs">Log daily to keep the fire alive</p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setStep(3)}
              className="btn-shimmer w-full text-white py-5 text-lg font-bold rounded-xl"
            >
              Got it, let's go! 💪
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Log first deuce */}
      {step === 3 && (
        <Card className="w-full border border-border rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <span className="text-6xl block mb-4">💩</span>
              <h2 className="text-2xl font-extrabold text-foreground mb-2">
                Log your first deuce!
              </h2>
              <p className="text-muted-foreground">
                Your throne awaits, <strong>{username}</strong>. Christen it with your inaugural log. Every legend starts somewhere.
              </p>
            </div>

            <div className="relative overflow-hidden bg-gradient-to-br from-card to-muted p-6 rounded-xl mb-6 border border-border">
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">Total Deuces</p>
                  <p className="stat-number text-5xl text-foreground">0</p>
                </div>
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">🚽</span>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            </div>

            <Button
              onClick={onComplete}
              className="btn-shimmer w-full text-white py-5 text-lg font-bold rounded-xl"
            >
              <span className="text-2xl mr-3">🚽</span>
              Log a Deuce
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
