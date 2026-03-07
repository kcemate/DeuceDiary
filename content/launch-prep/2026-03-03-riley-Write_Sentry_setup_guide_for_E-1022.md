# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T10:22:50.765981

## Sentry Setup Guide for Expo React Native + Express

This guide outlines the steps to integrate Sentry into your Expo React Native app and your Express backend, providing robust error tracking and performance monitoring.

**Prerequisites:**

*   **Expo CLI:**  Ensure you have Expo CLI installed (`npm install -g expo-cli` or `yarn global add expo-cli`).
*   **Sentry Account:** Create a free Sentry account at [https://sentry.io/](https://sentry.io/).
*   **Node.js & npm/yarn:**  You need Node.js and a package manager (npm or yarn) installed.
*   **Expo Project:**  You have an existing Expo React Native project.

**1. Create a Sentry Project in Sentry:**

*   Log in to your Sentry account.
*   Click "Create project" and follow the instructions to set up your Sentry project.
*   Choose the "Application" option for your React Native app.
*   Set a project name (e.g., "MyAwesomeApp").
*   Select the "Expo" framework.
*   You'll be provided with a **Sentry SDK Key** (also called "Publish Key"). **Keep this key safe!**  You'll need it in your app.

**2. Install Sentry SDK for React Native (Expo):**

In your React Native Expo project, run one of the following commands:

*   **npm:** `npm install sentry-expo`
*   **yarn:** `yarn add sentry-expo`

**3. Configure Sentry SDK in your React Native App:**

In your main `App.js` or root component file, import `SentryExpo` and initialize Sentry.  Replace `<YOUR_SENTRY_SDK_KEY>` with the key you obtained from Sentry.

```javascript
import * as SentryExpo from 'sentry-expo';

export default (App) => {
  return (
    <App
      ref={appRef => { appRef.initialize({
        dsn: 'YOUR_SENTRY_SDK_KEY',
        // Set sample rate to capture a percentage of errors.  Defaults to 100%.
        // sampleRate: 80,
        // Set attachment to include extra context like device and session information.
        // attachment: ['device', 'session'],
        // Set integrations (for custom logging or other services)
        // integrations: [new SentryRumEventsActionIntegration()],
      });}}
    />
  );
};
```

**Explanation:**

*   `dsn`:  The "Data Source Name" – your Sentry SDK key.
*   `sampleRate`: (Optional) Controls the percentage of errors Sentry captures.  Setting it to 80% means only 80% of errors will be captured.  Higher values can impact performance, so start with 100% and adjust as needed.
*   `attachment`: (Optional)  Allows you to send additional context with error reports, such as device information, user sessions, or app versions.  This helps with debugging.
*   `integrations`: (Optional)  Allows you to integrate with other services like Sentry RumEventsActionIntegration().

**4. Install Sentry SDK for your Express Backend:**

*   In your Express project, install the Sentry SDK:

    *   **npm:** `npm install @sentry/node`
    *   **yarn:** `yarn add @sentry/node`

*   In your Express app, import `Sentry` and configure it.

```javascript
const Sentry = require('@sentry/node');

// Set the
