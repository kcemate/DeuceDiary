import { useEffect, useRef, useState } from "react";
import { useAuth } from "./useAuth";
import { getAuthToken } from "@/lib/auth-token";
import { API_BASE } from "@/lib/api-base";

interface WebSocketMessage {
  type: string;
  message: string;
  msgId?: string;
  entry?: {
    id: string;
    userId: string;
    groupId: string;
    location: string;
    thoughts: string;
    loggedAt: string;
  };
  userId?: string;
}

export type ConnectionState = "idle" | "connecting" | "connected" | "reconnecting";

export function useWebSocket() {
  const { isAuthenticated } = useAuth();
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<ConnectionState>("idle");
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Guard to prevent stale closures from triggering reconnects after logout
  const shouldReconnectRef = useRef(false);
  // Exponential backoff: tracks how many consecutive failures have occurred
  const reconnectAttemptRef = useRef(0);
  // Group IDs to join when (re)connected — buffered during disconnection so
  // joinGroup calls made while offline are replayed automatically on reconnect.
  const pendingGroupJoinsRef = useRef<Set<string>>(new Set());
  // Rolling window of recently seen msgIds — prevents duplicate notifications
  // when the same broadcast is somehow delivered more than once (e.g. during
  // rapid reconnects). Capped at 100 entries to avoid unbounded growth.
  const seenMsgIdsRef = useRef<Set<string>>(new Set());

  const flushPendingGroupJoins = (ws: WebSocket) => {
    for (const groupId of pendingGroupJoinsRef.current) {
      ws.send(JSON.stringify({ type: "join_group", groupId }));
    }
  };

  const connect = async () => {
    // Don't open a second connection if one is already open or connecting
    if (
      wsRef.current &&
      (wsRef.current.readyState === WebSocket.OPEN ||
        wsRef.current.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    // On native (Capacitor), API_BASE is "https://deucediary.com" — use that for WS too
    // On web, API_BASE is "" so we use window.location.host as before
    let wsUrl: string;
    if (API_BASE) {
      const wsProtocol = API_BASE.startsWith("https") ? "wss:" : "ws:";
      wsUrl = `${wsProtocol}//${API_BASE.replace(/^https?:\/\//, "")}/ws`;
    } else {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      wsUrl = `${protocol}//${window.location.host}/ws`;
    }

    // Attach Clerk token as query param for authenticated connections
    const token = await getAuthToken();
    if (token) {
      wsUrl += `?token=${encodeURIComponent(token)}`;
    }

    setConnectionState("connecting");

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setConnectionState("connected");
        reconnectAttemptRef.current = 0; // reset backoff on successful connect
        // Replay any group joins buffered while we were disconnected
        flushPendingGroupJoins(ws);
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          // Drop duplicate messages using the server-stamped msgId
          if (message.msgId) {
            if (seenMsgIdsRef.current.has(message.msgId)) return;
            seenMsgIdsRef.current.add(message.msgId);
            // Evict oldest entries when the window grows beyond 100
            if (seenMsgIdsRef.current.size > 100) {
              const first = seenMsgIdsRef.current.values().next().value;
              if (first !== undefined) seenMsgIdsRef.current.delete(first);
            }
          }
          setLastMessage(message);
        } catch {
          // ignore malformed messages
        }
      };

      ws.onclose = () => {
        setIsConnected(false);

        // Only reconnect if the ref says we should — avoids stale-closure
        // scheduling a reconnect after logout clears the flag.
        if (shouldReconnectRef.current) {
          setConnectionState("reconnecting");
          const attempt = reconnectAttemptRef.current;
          // Exponential backoff: 2s, 4s, 8s, 16s, capped at 30s
          // ±25% jitter prevents thundering herd when many clients reconnect simultaneously
          const baseDelay = Math.min(2000 * 2 ** attempt, 30000);
          const jitter = baseDelay * 0.25 * (Math.random() * 2 - 1);
          const delay = Math.round(baseDelay + jitter);
          reconnectAttemptRef.current = attempt + 1;
          reconnectTimeoutRef.current = setTimeout(() => {
            if (shouldReconnectRef.current) {
              connect();
            }
          }, delay);
        }
      };

      ws.onerror = () => {
        setIsConnected(false);
      };
    } catch {
      // ignore connection errors — reconnect logic will retry
    }
  };

  const disconnect = () => {
    // Stop any pending reconnect first
    shouldReconnectRef.current = false;
    reconnectAttemptRef.current = 0;
    pendingGroupJoinsRef.current.clear();

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
    setConnectionState("idle");
  };

  const joinGroup = (groupId: string) => {
    // Always record the group so it can be replayed after reconnect
    pendingGroupJoinsRef.current.add(groupId);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "join_group",
        groupId,
      }));
    }
    // If not connected, the join will be sent automatically in ws.onopen
  };

  useEffect(() => {
    if (isAuthenticated) {
      shouldReconnectRef.current = true;
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  // Eagerly reconnect when the user returns to the tab — cancels any pending
  // backoff timer and retries immediately so the connection is ready faster.
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && shouldReconnectRef.current) {
        // Cancel any pending delayed reconnect
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
        // If not already open/connecting, reconnect now
        const state = wsRef.current?.readyState;
        if (state !== WebSocket.OPEN && state !== WebSocket.CONNECTING) {
          reconnectAttemptRef.current = 0; // reset backoff so next failure starts fresh
          connect();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    isConnected,
    connectionState,
    lastMessage,
    joinGroup,
    connect,
    disconnect,
  };
}
