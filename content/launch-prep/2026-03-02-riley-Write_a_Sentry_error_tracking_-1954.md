# Write a Sentry error tracking setup guide for Expo React Nat
Agent: riley
Generated: 2026-03-02T19:54:31.290502

## Sentry Error Tracking Setup Guide for Expo React Native + Express.js

This guide outlines how to integrate Sentry error tracking into your Expo React Native app and your associated Express.js backend. It covers installation, configuration, source maps, release tracking, and alert rules.

**Prerequisites:**

*   A Sentry account ([https://sentry.io/](https://sentry.io/))
*   Node.js and npm/yarn installed
*   Expo CLI installed and configured

**Step 1: Create a Sentry Project**

1.  Log into your Sentry account.
2.  Click "Create project".
3.  Choose a project name (e.g., "MyAwesomeApp").
4.  Select a project type:
    *   **Auto-capture:**  Recommended for most apps. Sentry automatically captures errors without requiring code changes.
    *   **Manual capture:**  For more granular control and specific error tracking.
5.  Configure project settings (e.g., app name, description, tags).
6.  Click "Create project".
7.  **Copy your Sentry Project ID.** You'll need this for configuration.


**Step 2: Install Sentry SDKs**

You'll need Sentry SDKs for both your React Native and Express.js apps.

**React Native (Expo):**

```bash
# React Native Expo Module
npx expo install @sentry/react-native
```

**Express.js Backend:**

```bash
# Node.js Express
npm install @sentry/node
# OR
yarn add @sentry/node
```

**Step 3: Configure React Native (Expo) - `sentry/react-native`**

1.  **Initialize Sentry:** In your React Native project, initialize Sentry using the `@sentry/react-native` SDK.

    ```javascript
    import * as Sentry from '@sentry/react-native';

    // Replace 'YOUR_PROJECT_ID' with your actual Sentry Project ID
    Sentry.init({
      dsn: 'YOUR_PROJECT_ID',
      // You can add additional options here, like:
      // autoSetScreens: true, // Automatically enable screens tracking
      // traces: true,        // Enable traces for performance monitoring
    });
    ```

2. **Context Provider:** Wrap your entire app with Sentry's context provider. This ensures all components can be tracked.

    ```javascript
    import { SentryProvider } from '@sentry/react-native';

    export default function App() {
      return (
        <SentryProvider>
          {/* Your app content here */}
        </SentryProvider>
      );
    }
    ```

**Step 4: Configure Express.js Backend - `@sentry/node`**

1. **Initialize Sentry:**  Initialize Sentry in your Express.js application.

   ```javascript
   const Sentry = require('@sentry/node');

   // Replace 'YOUR_PROJECT_ID' with your actual Sentry Project ID
   Sentry.init({
     dsn: 'YOUR_PROJECT_ID',
     // You can add additional options here, like:
     // ignoreError: (err, stackTrace) => { // Ignore specific errors
     //   return true;
     // }
   });

   // Example: Capture errors in your route handlers
   app.get('/api/users', (req, res) => {
     try {
       // Your API logic here
       const users = [...]; // Replace with actual user retrieval
       res.json(users);
     }
