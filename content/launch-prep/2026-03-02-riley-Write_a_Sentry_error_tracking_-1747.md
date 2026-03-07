# Write a Sentry error tracking setup guide for Expo React Nat
Agent: riley
Generated: 2026-03-02T17:47:29.611817

## Sentry Error Tracking Setup Guide for Expo React Native + Express.js

This guide outlines how to integrate Sentry error tracking into your Expo React Native app and your Express.js backend. It covers installation, configuration, source maps, release tracking, and alert rules.

**Prerequisites:**

*   **Sentry Account:** You'll need a Sentry account. Sign up at [https://sentry.io/](https://sentry.io/)
*   **Expo Project:** You should have an existing Expo React Native project.
*   **Node.js & npm/yarn:** Ensure Node.js and your preferred package manager are installed.
*   **Express.js Project:** You should have an existing Express.js backend project.

**1. Install Sentry Packages:**

**React Native (Expo):**

```bash
npm install @sentry/react-native
# or
yarn add @sentry/react-native
```

**Express.js Backend:**

```bash
npm install @sentry/node
# or
yarn add @sentry/node
```

**2. Configure Sentry (React Native - Expo):**

*   **Get Your Sentry Project ID:**  Navigate to your Sentry dashboard and find your project ID.  You’ll need this.
*   **Create a Sentry SDK Configuration:** Create a new `.sentry/config.ts` file in the root of your Expo project (if one doesn't exist). This file will contain your Sentry SDK configuration.

    ```typescript
    import { SentrySDK } from '@sentry/react-native';

    const Sentry = new SentrySDK({
      dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
      tracesets: ['my-app-traces'], // Optional: Custom tracesets
      // Automatic inclusion of screenshots
      enableAutomaticScreenshots: true,
      // Automatically include location information
      enableLocationTracking: true,
      // Automatically include device information
      enableDeviceTracking: true,
    });

    export default Sentry;
    ```

    *   **`dsn`:**  Replace `YOUR_SENTRY_DSN` with your actual Sentry DSN. You can get this from your Sentry dashboard after creating a project. It typically follows the format: `sentry.io/<project_id>/<environment>`  (e.g., `https://abcdefghij.send.sentry.io/my-app-dev`)
    *   **`tracesets`:** (Optional) Tracesets allow you to group traces for reporting and analysis.  `my-app-traces` is just an example.
    *   **`enableAutomaticScreenshots`:**  (Recommended) Automatically capture screenshots when a crash occurs.
    *   **`enableLocationTracking` & `enableDeviceTracking`:** (Optional, but valuable)  Enable location and device tracking to provide more context for errors.

*   **Initialize Sentry in your App:**  Import the `Sentry` SDK into your main `App.js` file and initialize it.

    ```javascript
    import React from 'react';
    import { AppLoading } from 'expo';
    import { Sentry } from './.sentry/config'; // Import your config

    export default function App() {
      // Check if the app has completed loading
      if (AppLoading) {
        return <AppLoading />;
      }

      // Initialize Sentry here
      Sentry.init();

      return (
        // Your App Content
      );
    }
    ```

**3. Configure Sentry (Express.js Backend):
