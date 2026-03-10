import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

const STEP_LABELS = ["Your Name", "Your Base", "First Log"];

interface OnboardingProps {
  onComplete: () => void;
}

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

// Emoji mascot animation configs per step
const emojiAnimations = {
  1: {
    initial: { y: -80, opacity: 0, scale: 0.5 },
    animate: { y: 0, opacity: 1, scale: 1 },
    transition: { type: "spring", stiffness: 400, damping: 15, delay: 0.1 },
  },
  2: {
    initial: { y: 60, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { type: "spring", stiffness: 350, damping: 20, delay: 0.1 },
  },
  3: {
    initial: { rotate: -180, scale: 0, opacity: 0 },
    animate: { rotate: 0, scale: 1, opacity: 1 },
    transition: { type: "spring", stiffness: 300, damping: 18, delay: 0.1 },
  },
} as const;

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameReady, setUsernameReady] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [squadMode, setSquadMode] = useState<"none" | "create" | "join">("none");
  const [squadName, setSquadName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [celebrating, setCelebrating] = useState(false);
  const [statCount, setStatCount] = useState(0);
  const queryClient = useQueryClient();

  const goToStep = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
    if (next === 3) {
      // Animate stat count from 0 to 1 after step transition settles
      setTimeout(() => setStatCount(1), 500);
    }
  };

  const usernameMutation = useMutation({
    mutationFn: async (username: string) => {
      return await apiRequest("/api/auth/user", {
        method: "PUT",
        body: JSON.stringify({ username }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      goToStep(2);
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
    setUsernameReady(false);
    const error = validateUsername(value);
    setUsernameError(error);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!error && value.length >= 3) {
      setUsernameChecking(true);
      debounceRef.current = setTimeout(() => {
        setUsernameChecking(false);
        setUsernameReady(true);
      }, 600);
    } else {
      setUsernameChecking(false);
    }
  };

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Keyboard shortcut: Enter to advance on steps 2 and 3
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;
      const target = e.target as HTMLElement;
      // Don't intercept Enter inside input fields or textareas
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      if (step === 2) goToStep(3);
      if (step === 3 && !celebrating) handleComplete();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, celebrating]);

  const CONFETTI_PARTICLES = [
    { emoji: "💩", angle: 0 },
    { emoji: "🚽", angle: 45 },
    { emoji: "💨", angle: 90 },
    { emoji: "🎉", angle: 135 },
    { emoji: "✨", angle: 180 },
    { emoji: "💩", angle: 225 },
    { emoji: "🎊", angle: 270 },
    { emoji: "✨", angle: 315 },
  ];

  const handleComplete = () => {
    setCelebrating(true);
    setTimeout(() => {
      onComplete();
    }, 800);
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
      {/* Top row: step pills + skip */}
      <div className="w-full flex items-center justify-between mb-8">
        {/* Labeled step pills */}
        <div className="flex items-center gap-2">
          {STEP_LABELS.map((label, i) => {
            const s = i + 1;
            const isActive = s === step;
            const isDone = s < step;
            return (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-white shadow-md"
                      : isDone
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isActive ? "bg-white/20" : isDone ? "bg-primary/30" : "bg-border"
                    }`}
                  >
                    {isDone ? "✓" : s}
                  </span>
                  {label}
                </div>
                {s < 3 && (
                  <div
                    className={`h-0.5 w-4 rounded transition-all duration-300 ${
                      isDone ? "bg-primary/60" : "bg-border"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Skip link (steps 2 and 3 only) */}
        <AnimatePresence>
          {step > 1 && (
            <motion.button
              key="skip"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onClick={onComplete}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors underline-offset-2 hover:underline"
            >
              Skip for now →
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Animated steps */}
      <div className="w-full overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          {step === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Card className="w-full border border-border rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <motion.span
                      className="text-6xl block mb-4"
                      {...emojiAnimations[1]}
                    >
                      {usernameMutation.isPending ? (
                        <motion.span
                          className="inline-block"
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                        >
                          🚽
                        </motion.span>
                      ) : "🚽"}
                    </motion.span>
                    <h2 className="text-2xl font-extrabold text-foreground mb-2">
                      Welcome to Deuce Diary!
                    </h2>
                    <p className="text-muted-foreground">
                      Every throne needs a name on the door. Pick your username — this is how your squad will know you.
                    </p>
                  </div>

                  <form onSubmit={handleUsernameSubmit} className="space-y-4">
                    <div>
                      <div className="relative">
                        <Input
                          id="username"
                          value={username}
                          onChange={handleUsernameChange}
                          placeholder="throne_king_42"
                          className={`text-center text-lg py-5 rounded-xl pr-16 transition-colors duration-300 ${
                            usernameReady
                              ? "border-green-500 focus-visible:ring-green-400"
                              : usernameError
                              ? "border-destructive"
                              : ""
                          }`}
                          maxLength={20}
                          autoFocus
                        />
                        {/* Character count */}
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono">
                          {username.length}/20
                        </span>
                        {/* Validity indicator */}
                        <AnimatePresence>
                          {usernameChecking && (
                            <motion.span
                              key="checking"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
                            >
                              ⏳
                            </motion.span>
                          )}
                          {usernameReady && !usernameChecking && (
                            <motion.span
                              key="ready"
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 font-bold text-lg"
                            >
                              ✓
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                      {usernameError && (
                        <p className="text-destructive text-sm mt-2 text-center font-medium">
                          {usernameError}
                        </p>
                      )}
                      {usernameReady && !usernameError && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-green-600 text-sm mt-2 text-center font-medium"
                        >
                          Looks good — ready to claim!
                        </motion.p>
                      )}
                      {!usernameError && !usernameReady && (
                        <p className="text-muted-foreground text-xs mt-2 text-center">
                          3–20 characters. Letters, numbers, underscores.
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={!username || !!usernameError || usernameMutation.isPending}
                      className="btn-shimmer w-full text-white min-h-[52px] text-lg font-bold rounded-xl"
                    >
                      {usernameMutation.isPending ? "Claiming..." : "Claim Your Throne Name 👑"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Card className="w-full border border-border rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <motion.span
                      className="text-6xl block mb-4"
                      {...emojiAnimations[2]}
                    >
                      🏠
                    </motion.span>
                    <h2 className="text-2xl font-extrabold text-foreground mb-2">
                      Squad up or fly solo?
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Your <strong>Solo Deuces</strong> group is ready — but you can also battle friends on the leaderboard.
                    </p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {/* Create squad card */}
                    <button
                      type="button"
                      onClick={() => setSquadMode(squadMode === "create" ? "none" : "create")}
                      className={`w-full flex items-center gap-3 rounded-xl p-4 border transition-all text-left ${
                        squadMode === "create"
                          ? "bg-primary/10 border-primary"
                          : "bg-muted border-border hover:border-primary/40"
                      }`}
                    >
                      <span className="text-2xl">🏆</span>
                      <div className="flex-1">
                        <p className="font-bold text-foreground text-sm">Create a Squad</p>
                        <p className="text-muted-foreground text-xs">Start a group and invite your friends</p>
                      </div>
                      <span className="text-muted-foreground text-xs">{squadMode === "create" ? "▲" : "▼"}</span>
                    </button>
                    <AnimatePresence>
                      {squadMode === "create" && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-1 pb-2 px-1">
                            <Input
                              value={squadName}
                              onChange={(e) => setSquadName(e.target.value)}
                              placeholder="The Royal Flushers"
                              className="rounded-xl text-sm"
                              maxLength={40}
                            />
                            <p className="text-muted-foreground text-xs mt-1 text-center">You can always create a squad later from Groups</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Join squad card */}
                    <button
                      type="button"
                      onClick={() => setSquadMode(squadMode === "join" ? "none" : "join")}
                      className={`w-full flex items-center gap-3 rounded-xl p-4 border transition-all text-left ${
                        squadMode === "join"
                          ? "bg-primary/10 border-primary"
                          : "bg-muted border-border hover:border-primary/40"
                      }`}
                    >
                      <span className="text-2xl">🔗</span>
                      <div className="flex-1">
                        <p className="font-bold text-foreground text-sm">Join a Squad</p>
                        <p className="text-muted-foreground text-xs">Enter an invite code from a friend</p>
                      </div>
                      <span className="text-muted-foreground text-xs">{squadMode === "join" ? "▲" : "▼"}</span>
                    </button>
                    <AnimatePresence>
                      {squadMode === "join" && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-1 pb-2 px-1">
                            <Input
                              value={inviteCode}
                              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                              placeholder="ABC123"
                              className="rounded-xl text-sm text-center tracking-widest font-mono"
                              maxLength={10}
                            />
                            <p className="text-muted-foreground text-xs mt-1 text-center">Get the code from a friend who invited you</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Stay solo */}
                    <button
                      type="button"
                      onClick={() => setSquadMode("none")}
                      className={`w-full flex items-center gap-3 rounded-xl p-4 border transition-all text-left ${
                        squadMode === "none"
                          ? "bg-primary/10 border-primary"
                          : "bg-muted border-border hover:border-primary/40"
                      }`}
                    >
                      <span className="text-2xl">🚽</span>
                      <div>
                        <p className="font-bold text-foreground text-sm">Stay Solo for now</p>
                        <p className="text-muted-foreground text-xs">Log privately — squads can wait</p>
                      </div>
                    </button>
                  </div>

                  <Button
                    onClick={() => goToStep(3)}
                    className="btn-shimmer w-full text-white min-h-[52px] text-lg font-bold rounded-xl"
                  >
                    {squadMode === "create" && squadName ? `Create "${squadName}" & continue 💪` :
                     squadMode === "join" && inviteCode ? `Join with code ${inviteCode} 🔗` :
                     "Continue to first log! 💪"}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground mt-2">
                    Press <kbd className="px-1 py-0.5 rounded bg-muted border border-border text-[10px] font-mono">Enter</kbd> to continue
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Card className="w-full border border-border rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <motion.span
                      className="text-6xl block mb-4"
                      {...emojiAnimations[3]}
                    >
                      💩
                    </motion.span>
                    <h2 className="text-2xl font-extrabold text-foreground mb-2">
                      Log your first deuce!
                    </h2>
                    <motion.p
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-primary font-semibold text-sm mb-2"
                    >
                      You're ready to rule the throne! 👑
                    </motion.p>
                    <p className="text-muted-foreground text-sm">
                      Your throne awaits, <strong>{username}</strong>. Christen it with your inaugural log.
                    </p>
                  </div>

                  <div className="relative overflow-hidden bg-gradient-to-br from-card to-muted p-6 rounded-xl mb-6 border border-border">
                    <div className="relative z-10 flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">Total Deuces</p>
                        <motion.p
                          key={statCount}
                          initial={{ scale: 1.4, color: "var(--primary)" }}
                          animate={{ scale: 1, color: "var(--foreground)" }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                          className="stat-number text-5xl"
                        >
                          {statCount}
                        </motion.p>
                        {statCount === 1 && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs text-primary font-semibold mt-1"
                          >
                            +1 incoming!
                          </motion.p>
                        )}
                      </div>
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <span className="text-3xl">🚽</span>
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  </div>

                  <div className="relative">
                    <Button
                      onClick={handleComplete}
                      disabled={celebrating}
                      className="btn-shimmer w-full text-white min-h-[52px] text-lg font-bold rounded-xl"
                    >
                      <span className="text-2xl mr-3">🚽</span>
                      {celebrating ? "Here we go! 🎉" : "Log a Deuce"}
                    </Button>
                    <p className="text-center text-xs text-muted-foreground mt-2">
                      Press <kbd className="px-1 py-0.5 rounded bg-muted border border-border text-[10px] font-mono">Enter</kbd> to continue
                    </p>
                    {/* Confetti burst */}
                    <AnimatePresence>
                      {celebrating && CONFETTI_PARTICLES.map((p, i) => {
                        const rad = (p.angle * Math.PI) / 180;
                        const dist = 80 + (i % 3) * 30;
                        return (
                          <motion.span
                            key={i}
                            className="absolute text-2xl pointer-events-none select-none"
                            style={{ left: "50%", top: "50%", translateX: "-50%", translateY: "-50%" }}
                            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                            animate={{
                              x: Math.cos(rad) * dist,
                              y: Math.sin(rad) * dist,
                              scale: 0,
                              opacity: 0,
                            }}
                            transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.03 }}
                          >
                            {p.emoji}
                          </motion.span>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
