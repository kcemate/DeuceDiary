import { useEffect, useRef, useCallback, useState } from 'react';

const VAPID_KEY_ENDPOINT = '/api/push/vapid-key';

interface PushNotificationsOptions {
  /** Clerk getToken() — if provided, sends Bearer token instead of relying on cookies */
  getToken?: () => Promise<string | null>;
}

export function usePushNotifications({ getToken }: PushNotificationsOptions = {}) {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [isSupported] = useState(() => 'serviceWorker' in navigator && 'PushManager' in window);
  const subscriptionRef = useRef<PushSubscription | null>(null);

  // Register service worker on mount
  useEffect(() => {
    if (!isSupported) return;
    navigator.serviceWorker
      .register('/sw.js')
      .then(() => undefined)
      .catch((err) => console.warn('[Push] SW registration failed:', err));
  }, [isSupported]);

  const requestPermission = useCallback(async () => {
    if (!isSupported) return false;
    const result = await Notification.requestPermission();
    setPermission(result);
    return result === 'granted';
  }, [isSupported]);

  const subscribe = useCallback(async () => {
    if (!isSupported) return null;
    if (permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return null;
    }

    const registration = await navigator.serviceWorker.ready;

    // Get VAPID key from server
    const keyRes = await fetch(VAPID_KEY_ENDPOINT);
    if (!keyRes.ok) {
      console.warn('[Push] Failed to get VAPID key');
      return null;
    }
    const { publicKey } = await keyRes.json();

    // Check existing subscription
    let subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      subscriptionRef.current = subscription;
      try {
        await syncSubscription(subscription, getToken);
      } catch (syncErr) {
        console.error('[Push] Sync existing subscription failed:', syncErr);
        return null;
      }
      return subscription;
    }

    // Create new subscription
    const applicationServerKey = urlBase64ToUint8Array(publicKey);
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });

    subscriptionRef.current = subscription;
    try {
      await syncSubscription(subscription, getToken);
    } catch (syncErr) {
      console.error('[Push] Sync new subscription failed:', syncErr);
      return null;
    }
    return subscription;
  }, [isSupported, permission, requestPermission, getToken]);

  const unsubscribe = useCallback(async () => {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      const headers = await authHeaders(getToken);
      await fetch('/api/push/subscribe', {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ endpoint: subscription.endpoint }),
        credentials: 'include',
      });
    }
    subscriptionRef.current = null;
  }, [getToken]);

  return { isSupported, permission, requestPermission, subscribe, unsubscribe };
}

async function authHeaders(
  getToken?: () => Promise<string | null>
): Promise<Record<string, string>> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (getToken) {
    // Retry getToken up to 3 times with delay — Clerk session may not be ready yet
    let token: string | null = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      token = await getToken();
      if (token) break;
      console.warn(
        `[Push] getToken returned null (attempt ${attempt + 1}/3), retrying in 500ms...`
      );
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.error('[Push] getToken returned null after 3 attempts — push will likely 401');
    }
  }

  return headers;
}

async function syncSubscription(
  subscription: PushSubscription,
  getToken?: () => Promise<string | null>
) {
  const data = subscription.toJSON();
  const headers = await authHeaders(getToken);

  const res = await fetch('/api/push/subscribe', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      endpoint: data.endpoint,
      keys: data.keys,
    }),
    credentials: 'include',
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => 'Unknown error');
    throw new Error(`Push subscribe failed (${res.status}): ${errText}`);
  }
}

// Convert VAPID key from base64 to Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}