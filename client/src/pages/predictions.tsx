import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { useMutationWithToast } from "@/hooks/useMutationWithToast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { PageSpinner } from "@/components/ui/spinner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/userUtils";

// --- Types ---

interface PredictionCardData {
  card: {
    id: number;
    weekStart: string;
    status: "active" | "resolved";
  };
  questions: string[];
  userPredictions: Array<{
    id: number;
    questionIndex: number;
    answer: string;
    wager: number;
    result: "correct" | "wrong" | null;
    payout: number;
  }>;
  sppBalance: number;
  members: Array<{ userId: string; displayName: string }>;
}

interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  profileImageUrl: string | null;
  balance: number;
  lifetimeEarned: number;
  lifetimeWagered: number;
}

interface SpyData {
  picks: Array<{
    userId: string;
    questionIndex: number;
    answer: string;
    wager: number;
    username: string | null;
    firstName: string | null;
    lastName: string | null;
  }>;
}

type TabId = "predict" | "leaderboard";

// --- Helpers ---

function formatWeek(iso: string) {
  const d = new Date(iso);
  const end = new Date(d);
  end.setUTCDate(end.getUTCDate() + 6);
  return `${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

// --- Sub-components ---

function SppDisplay({ balance }: { balance: number }) {
  return (
    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
      <span className="text-lg">💩</span>
      <div>
        <div className="text-xs text-muted-foreground">SPP Balance</div>
        <div className="text-sm font-bold text-amber-700">{balance} pts</div>
      </div>
    </div>
  );
}

interface PredictionFormProps {
  questions: string[];
  members: Array<{ userId: string; displayName: string }>;
  balance: number;
  cardId: number;
  groupId: string;
}

function PredictionForm({ questions, members, balance, cardId, groupId }: PredictionFormProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [wagers, setWagers] = useState<Record<number, number>>(
    Object.fromEntries(questions.map((_, i) => [i, 10])),
  );

  const totalWager = Object.values(wagers).reduce((s, w) => s + w, 0);
  const allAnswered = questions.every((_, i) => (answers[i] ?? "").trim().length > 0);
  const overBudget = totalWager > balance;

  const submitMutation = useMutationWithToast({
    mutationFn: () =>
      apiRequest(`/api/groups/${groupId}/predictions`, {
        method: "POST",
        body: JSON.stringify({
          predictions: questions.map((_, i) => ({
            questionIndex: i,
            answer: answers[i] ?? "",
            wager: wagers[i] ?? 10,
          })),
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/groups/${groupId}/predictions`] });
    },
    successMessage: "Predictions submitted!",
    errorMessage: (e) => e.message || "Failed to submit",
  });

  const isUserIdQuestion = (q: string) =>
    q.includes("Who will log first") || q.includes("Who will have the longest");

  const isYesNoQuestion = (q: string) => q.includes("Will ") && q.includes("log before");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SppDisplay balance={balance} />
        <div className={`text-sm font-medium ${overBudget ? "text-red-500" : "text-muted-foreground"}`}>
          Wagering: {totalWager} SPP
        </div>
      </div>

      {questions.map((question, i) => (
        <Card key={i} className="border">
          <CardContent className="pt-4 space-y-3">
            <div className="text-sm font-medium">
              <span className="text-muted-foreground mr-2">Q{i + 1}.</span>
              {question}
            </div>

            {/* Answer input */}
            {isUserIdQuestion(question) ? (
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={answers[i] ?? ""}
                onChange={(e) => setAnswers((a) => ({ ...a, [i]: e.target.value }))}
              >
                <option value="">Select a member…</option>
                {members.map((m) => (
                  <option key={m.userId} value={m.userId}>
                    {m.displayName}
                  </option>
                ))}
              </select>
            ) : isYesNoQuestion(question) ? (
              <div className="flex gap-2">
                {["yes", "no"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setAnswers((a) => ({ ...a, [i]: opt }))}
                    className={`flex-1 py-2 rounded-md border text-sm font-medium transition-colors
                      ${answers[i] === opt
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground border-input hover:bg-accent"
                      }`}
                  >
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </button>
                ))}
              </div>
            ) : (
              <input
                type="number"
                min={0}
                placeholder="Enter a number"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={answers[i] ?? ""}
                onChange={(e) => setAnswers((a) => ({ ...a, [i]: e.target.value }))}
              />
            )}

            {/* Wager slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Wager</span>
                <span className="font-medium text-foreground">{wagers[i]} SPP</span>
              </div>
              <Slider
                min={1}
                max={Math.min(50, balance)}
                step={1}
                value={[wagers[i] ?? 10]}
                onValueChange={([v]) => setWagers((w) => ({ ...w, [i]: v }))}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      {overBudget && (
        <p className="text-sm text-red-500 text-center">
          Total wager exceeds your SPP balance. Reduce your wagers.
        </p>
      )}

      <Button
        className="w-full"
        disabled={!allAnswered || overBudget || submitMutation.isPending}
        onClick={() => submitMutation.mutate(undefined)}
      >
        {submitMutation.isPending ? "Submitting…" : "Submit Predictions"}
      </Button>
    </div>
  );
}

interface ResultsViewProps {
  questions: string[];
  userPredictions: PredictionCardData["userPredictions"];
  members: Array<{ userId: string; displayName: string }>;
  sppBalance: number;
}

function ResultsView({ questions, userPredictions, members, sppBalance }: ResultsViewProps) {
  const byIndex = Object.fromEntries(userPredictions.map((p) => [p.questionIndex, p]));

  return (
    <div className="space-y-4">
      <SppDisplay balance={sppBalance} />
      {questions.map((question, i) => {
        const pred = byIndex[i];
        if (!pred) return null;
        const memberName = members.find((m) => m.userId === pred.answer)?.displayName;
        return (
          <Card key={i} className="border">
            <CardContent className="pt-4 space-y-2">
              <div className="text-sm font-medium">
                <span className="text-muted-foreground mr-2">Q{i + 1}.</span>
                {question}
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Your pick: <span className="text-foreground font-medium">{memberName ?? pred.answer}</span>
                  {" "}· {pred.wager} SPP wagered
                </div>
                {pred.result === null ? (
                  <Badge variant="secondary">Pending</Badge>
                ) : pred.result === "correct" ? (
                  <Badge className="bg-green-500 text-white">+{pred.payout} SPP</Badge>
                ) : (
                  <Badge variant="destructive">Wrong</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

interface LeaderboardViewProps {
  groupId: string;
  currentUserId: string;
}

function LeaderboardView({ groupId, currentUserId }: LeaderboardViewProps) {
  const { data, isLoading } = useQuery<{ leaderboard: LeaderboardEntry[] }>({
    queryKey: [`/api/groups/${groupId}/predictions/leaderboard`],
  });

  if (isLoading) return <PageSpinner minHeight="min-h-32" />;
  if (!data?.leaderboard.length) {
    return <p className="text-center text-muted-foreground py-8">No SPP data yet. Submit predictions to get started!</p>;
  }

  return (
    <div className="space-y-2">
      {data.leaderboard.map((entry) => (
        <Card key={entry.userId} className={entry.userId === currentUserId ? "border-primary" : "border"}>
          <CardContent className="pt-3 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground text-sm w-6 text-right">#{entry.rank}</span>
              <Avatar className="h-8 w-8">
                {entry.profileImageUrl && <AvatarImage src={entry.profileImageUrl} />}
                <AvatarFallback className="text-xs">{getInitials(entry.displayName)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{entry.displayName}</div>
                <div className="text-xs text-muted-foreground">
                  {entry.lifetimeEarned} earned · {entry.lifetimeWagered} wagered
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-amber-600">💩 {entry.balance}</div>
                <div className="text-xs text-muted-foreground">balance</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// --- SpyMode premium view ---

interface SpyModeProps {
  groupId: string;
  questions: string[];
  members: Array<{ userId: string; displayName: string }>;
}

function SpyMode({ groupId, questions, members }: SpyModeProps) {
  const { data } = useQuery<SpyData>({
    queryKey: [`/api/groups/${groupId}/predictions/spy`],
  });

  if (!data?.picks.length) {
    return <p className="text-xs text-muted-foreground text-center py-2">No picks submitted yet.</p>;
  }

  const byQuestion: Record<number, SpyData["picks"]> = {};
  for (const pick of data.picks) {
    if (!byQuestion[pick.questionIndex]) byQuestion[pick.questionIndex] = [];
    byQuestion[pick.questionIndex].push(pick);
  }

  return (
    <div className="space-y-3 mt-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">🕵️ Spy Mode</span>
        <Badge variant="secondary" className="text-xs">Premium</Badge>
      </div>
      {questions.map((q, i) => {
        const picks = byQuestion[i] ?? [];
        if (!picks.length) return null;
        return (
          <div key={i} className="text-xs space-y-1">
            <div className="text-muted-foreground font-medium">Q{i + 1}: {q.slice(0, 40)}…</div>
            {picks.map((p) => {
              const name =
                p.username ?? `${p.firstName ?? ""} ${p.lastName ?? ""}`.trim() || "Member";
              const memberName = members.find((m) => m.userId === p.answer)?.displayName;
              return (
                <div key={`${p.userId}-${i}`} className="flex justify-between">
                  <span className="text-muted-foreground">{name}</span>
                  <span>{memberName ?? p.answer} ({p.wager} SPP)</span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// --- Main page ---

export default function Predictions() {
  const { groupId } = useParams<{ groupId: string }>();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("predict");
  const [spyEnabled, setSpyEnabled] = useState(false);

  const { data, isLoading, error } = useQuery<PredictionCardData>({
    queryKey: [`/api/groups/${groupId}/predictions`],
    enabled: !!groupId,
  });

  const isPremium =
    user?.subscription === "premium" &&
    (!user.subscriptionExpiresAt || new Date(user.subscriptionExpiresAt) > new Date());

  if (isLoading) return <PageSpinner />;
  if (error || !data) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Failed to load predictions.
      </div>
    );
  }

  const { card, questions, userPredictions, sppBalance, members } = data;
  const hasSubmitted = userPredictions.length > 0;
  const isResolved = card.status === "resolved";

  return (
    <div className="py-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Shits & Giggles</h1>
          <p className="text-xs text-muted-foreground">Week of {formatWeek(card.weekStart)}</p>
        </div>
        <Badge variant={isResolved ? "secondary" : "default"}>
          {isResolved ? "Resolved" : "Active"}
        </Badge>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-muted p-1">
        {(["predict", "leaderboard"] as TabId[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors
              ${activeTab === tab
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
              }`}
          >
            {tab === "predict" ? "Predictions" : "Leaderboard"}
          </button>
        ))}
      </div>

      {/* Predict tab */}
      {activeTab === "predict" && (
        <>
          {isResolved || hasSubmitted ? (
            <ResultsView
              questions={questions}
              userPredictions={userPredictions}
              members={members}
              sppBalance={sppBalance}
            />
          ) : (
            <PredictionForm
              questions={questions}
              members={members}
              balance={sppBalance}
              cardId={card.id}
              groupId={groupId!}
            />
          )}

          {/* Premium spy mode */}
          {isPremium && hasSubmitted && !isResolved && (
            <Card className="border border-amber-200">
              <CardContent className="pt-3 pb-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">
                    🕵️ Spy Mode
                    <span className="ml-1 text-xs text-amber-600">Premium</span>
                  </div>
                  <button
                    onClick={() => setSpyEnabled((s) => !s)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors
                      ${spyEnabled ? "bg-amber-500" : "bg-muted"}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform
                        ${spyEnabled ? "translate-x-4" : "translate-x-0.5"}`}
                    />
                  </button>
                </div>
                {spyEnabled && (
                  <SpyMode groupId={groupId!} questions={questions} members={members} />
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Leaderboard tab */}
      {activeTab === "leaderboard" && (
        <LeaderboardView groupId={groupId!} currentUserId={user?.id ?? ""} />
      )}
    </div>
  );
}
