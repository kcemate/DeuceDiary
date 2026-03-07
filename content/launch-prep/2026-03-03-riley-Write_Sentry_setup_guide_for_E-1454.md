# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T14:54:49.959698

## Sentry Setup Guide for Expo React Native + Express

This guide outlines the steps to integrate Sentry with your Expo React Native application and your Express backend.  It focuses on the best practices for a smooth setup and effective monitoring.

**Prerequisites:**

* **Node.js and npm:** Ensure you have Node.js and npm installed.
* **Expo CLI:**  Install the Expo CLI globally: `npm install -g expo-cli`
* **Sentry Account:** You'll need a Sentry account. Sign up at [https://sentry.io/](https://sentry.io/).  It's free for basic usage.
* **Expo Project:**  You should have an existing Expo React Native project.


**Steps:**

**1. Create a Sentry Project:**

* Log in to your Sentry account.
* Click "Create Project" and choose a suitable name for your project (e.g., "MyAwesomeApp").
* Select the "Web" template (this is the recommended starting point for most React Native apps).
* Configure the initial settings as needed (e.g., sampling rate - 100% is generally good for initial debugging).
* **Important:**  Copy the **Sentry SDK Key (Public Key)**. You'll need this in subsequent steps.

**2. Install Sentry Packages:**

* Navigate to your React Native project directory in your terminal.
* Install the necessary Sentry packages for both your React Native app and your Express backend.

   ```bash
   npm install @sentry/react-native @sentry/node
   ```

**3. Configure the React Native App:**

* **Navigate to your React Native project directory:** `cd your-project-directory`

* **Create a `.sentry/config.ts` file:**  This file configures Sentry for your React Native app.

   ```typescript
   // .sentry/config.ts
   import { initialize } from '@sentry/react-native';

   import { SentryOptions } from '@sentry/react-native/types';

   const SENTRY_DSN = 'YOUR_SENTRY_DSN'; // Replace with your DSN

   const sentryOptions: SentryOptions = {
     dsn: SENTRY_DSN,
     // Optional:  Enable automatic instrumentation for native modules.  Highly recommended.
     enableAutoSessionTracking: true,
     // Optional: Track native JavaScript exceptions
     tracesSampleRate: 100,
     // Optional: Enable performance monitoring
     performanceSampleRate: 100,
     // Optional:  Track custom events
     //  trackPerformanceFn: (scope, ...args) => { ... }
   };

   initialize(sentryOptions);
   ```

   * **Replace `YOUR_SENTRY_DSN`:**  This is the key part! Paste your Sentry Public Key here.  The DSN (Data Source Name) will be automatically generated.

   * **`enableAutoSessionTracking: true`:** This automatically tracks user sessions, providing valuable context for errors.  Highly recommended.

   * **`tracesSampleRate` and `performanceSampleRate`:**  Adjust these based on your needs.  100% is recommended for initial debugging.

* **Important:**  Make sure you've imported the `initialize` function from `@sentry/react-native`.

**4. Configure the Express Backend:**

* **Create a `.sentry/config.ts` file (similar to the React Native one) for your Express backend:**  This is crucial for capturing errors originating from your backend code.

   ```typescript
   // .sentry/config.ts (for
