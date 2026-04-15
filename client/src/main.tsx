import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./index.css";

import { apiUrl } from "@/lib/api-base";

async function init() {
  // Flush any previously cached service worker (PWA experiment that caused stale HTML)
  if ('serviceWorker' in navigator) {
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
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
