import { useEffect, useRef, useState } from "react";
import { useAuth } from "./useAuth";
import { getAuthToken } from "@/lib/auth-token";

interface WebSocketMessage {
  type: string;
  message: string;
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

export function useWebSocket() {
  const { isAuthenticated } = useAuth();
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Guard to prevent stale closures from triggering reconnects after logout
  const shouldReconnectRef = useRef(false);
  // Exponential backoff: tracks how many consecutive failures have occurred
  const reconnectAttemptRef = useRef(0);

  const connect = async () => {
    // Don't open a second connection if one is already open or connecting
    if (
      wsRef.current &&
      (wsRef.current.readyState === WebSocket.OPEN ||
        wsRef.current.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    let wsUrl = `${protocol}//${window.location.host}/ws`;

    // Attach Clerk token as query param for authenticated connections
    const token = await getAuthToken();
    if (token) {
      wsUrl += `?token=${encodeURIComponent(token)}`;
    }

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        reconnectAttemptRef.current = 0; // reset backoff on successful connect
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);

        // Only reconnect if the ref says we should — avoids stale-closure
        // scheduling a reconnect after logout clears the flag.
        if (shouldReconnectRef.current) {
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

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
    }
  };

  const disconnect = () => {
    // Stop any pending reconnect first
    shouldReconnectRef.current = false;
    reconnectAttemptRef.current = 0;

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
  };

  const joinGroup = (groupId: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "join_group",
        groupId,
      }));
    }
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
    lastMessage,
    joinGroup,
    connect,
    disconnect,
  };
}
