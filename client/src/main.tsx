import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./index.css";

async function init() {
  // Fetch Clerk publishable key from server at runtime (avoids build-time env var issues)
  let clerkPubKey: string | undefined = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;
  
  if (!clerkPubKey) {
    try {
      const res = await fetch("/api/config");
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
