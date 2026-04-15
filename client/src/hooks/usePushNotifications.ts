import { useEffect, useRef, useCallback, useState } from 'react';

const VAPID_KEY_ENDPOINT = '/api/push/vapid-key';

export function usePushNotifications() {
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
      .then((reg) => console.log('[Push] SW registered:', reg.scope))
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
      // Already subscribed — sync with server
      subscriptionRef.current = subscription;
      await syncSubscription(subscription);
      return subscription;
    }

    // Create new subscription
    const applicationServerKey = urlBase64ToUint8Array(publicKey);
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });

    subscriptionRef.current = subscription;
    await syncSubscription(subscription);
    return subscription;
  }, [isSupported, permission, requestPermission]);

  const unsubscribe = useCallback(async () => {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      // Tell server to remove
      await fetch('/api/push/subscribe', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
        credentials: 'include',
      });
    }
    subscriptionRef.current = null;
  }, []);

  return { isSupported, permission, requestPermission, subscribe, unsubscribe };
}

async function syncSubscription(subscription: PushSubscription) {
  const data = subscription.toJSON();
  await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      endpoint: data.endpoint,
      keys: data.keys,
    }),
    credentials: 'include',
  });
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