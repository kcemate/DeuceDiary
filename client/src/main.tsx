import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./index.css";

import { apiUrl } from "@/lib/api-base";

async function init() {
  // Service worker management: only flush stale caches, keep our push SW registered
  if ('serviceWorker' in navigator) {
    try {
      // Clear stale caches (from old PWA experiment), but DON'T unregister service workers
      // — our push notification SW (sw.js) needs to stay registered for notifications to work
      const keys = await caches.keys();
      const staleKeys = keys.filter((k) => k !== 'dd-v3');
      await Promise.all(staleKeys.map((k) => caches.delete(k)));
    } catch { /* non-critical */ }
  }

  // Fetch Clerk publishable key from server at runtime (avoids build-time env var issues)
  let clerkPubKey: string | undefined = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;
  
  if (!clerkPubKey) {
    try {
      const res = await fetch(apiUrl("/api/config"));
      if (res.ok) {
        const data = await res.json();
        clerkPubKey = data.clerkPublishableKey;
      }
    } catch {
      // fall through — app will run in dev/no-auth mode
    }
  }

  createRoot(document.getElementById("root")!).render(
    clerkPubKey ? (
      <ClerkProvider publishableKey={clerkPubKey}>
        <App />
      </ClerkProvider>
    ) : (
      <App />
    ),
  );
}

init();
