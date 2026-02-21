import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface GroupPreview {
  name: string;
  memberCount: number;
  deuceCount: number;
}

export default function InviteLanding() {
  const { code } = useParams<{ code: string }>();
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { data: preview, isLoading: previewLoading, error: previewError } = useQuery<GroupPreview>({
    queryKey: [`/api/groups/preview/${code}`],
    enabled: !!code,
  });

  async function handleJoinWithLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    setError("");

    try {
      // Login with invite code — server auto-joins the group
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), inviteCode: code }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Login failed");
        return;
      }
      const data = await res.json();
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      await queryClient.invalidateQueries({ queryKey: ["/api/groups"] });

      if (data.joinedGroup) {
        toast({
          title: "You're in! 🚽",
          description: `Joined "${data.joinedGroup.name}" — welcome to the squad.`,
        });
      }
      setLocation("/");
    } catch {
      setError("Network error — is the server running?");
    } finally {
      setLoading(false);
    }
  }

  async function handleJoinAuthenticated() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/join/${code}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to join group");
        return;
      }
      const data = await res.json();
      await queryClient.invalidateQueries({ queryKey: ["/api/groups"] });

      toast({
        title: data.message === "Already a member of this group" ? "Already in!" : "You're in! 🚽",
        description: `${data.message === "Already a member of this group" ? "You're already a member of" : "Joined"} "${data.group?.name}"`,
      });
      setLocation("/");
    } catch {
      setError("Network error — is the server running?");
    } finally {
      setLoading(false);
    }
  }

  // Show 404-style if preview fails
  if (previewError || (!previewLoading && !preview)) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="text-6xl">🚽</div>
          <h1 className="text-2xl font-extrabold text-gray-900">Invite Not Found</h1>
          <p className="text-gray-500">
            This invite link is expired or doesn't exist. Ask your friend for a fresh one.
          </p>
          <Button onClick={() => setLocation("/")} className="rounded-full">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Big toilet emoji */}
        <div className="text-center">
          <div className="text-8xl mb-2">🚽</div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
            Your squad is waiting on the throne. 👀
          </h1>
        </div>

        {/* Group preview card */}
        {previewLoading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="animate-pulse space-y-2">
              <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        ) : preview ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-1">{preview.name}</h2>
            <p className="text-sm text-gray-500">
              {preview.memberCount} member{preview.memberCount !== 1 ? "s" : ""} and{" "}
              {preview.deuceCount} deuce{preview.deuceCount !== 1 ? "s" : ""} logged.
            </p>
          </div>
        ) : null}

        {/* Action area */}
        {authLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : isAuthenticated ? (
          // Already logged in — just show CTA
          <div className="space-y-3">
            {error && <p className="text-sm text-red-600 font-medium text-center">{error}</p>}
            <Button
              onClick={handleJoinAuthenticated}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-lg rounded-full shadow-lg shadow-green-600/25 disabled:opacity-50"
            >
              {loading ? "Joining..." : "Take a Seat"}
            </Button>
          </div>
        ) : (
          // Not logged in — show username input + CTA
          <form onSubmit={handleJoinWithLogin} className="space-y-3">
            <Input
              type="text"
              placeholder="What do your dudes call you?"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              autoFocus
              className="rounded-xl border-gray-300 bg-white py-3 text-base"
            />
            {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
            <Button
              type="submit"
              disabled={loading || !username.trim()}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-lg rounded-full shadow-lg shadow-green-600/25 disabled:opacity-50"
            >
              {loading ? "Joining..." : "Take a Seat"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
