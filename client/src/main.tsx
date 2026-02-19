import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./index.css";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;

createRoot(document.getElementById("root")!).render(
  clerkPubKey ? (
    <ClerkProvider publishableKey={clerkPubKey}>
      <App />
    </ClerkProvider>
  ) : (
    <App />
  ),
);
