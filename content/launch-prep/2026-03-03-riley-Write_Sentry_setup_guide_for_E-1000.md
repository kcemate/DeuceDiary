# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T10:00:10.721290

## Sentry Setup Guide for Expo React Native + Express

This guide walks you through setting up Sentry for your Expo React Native app and your accompanying Express server. It covers installation, configuration, and best practices.

**Prerequisites:**

*   **Expo CLI:** Ensure you have Expo CLI installed globally: `npm install -g expo-cli`
*   **Node.js and npm/yarn:**  Have a working Node.js environment.
*   **Sentry Account:** You'll need a Sentry account.  Sign up at [https://sentry.io/](https://sentry.io/).

**Steps:**

**1. Project Setup (Expo React Native):**

*   **Create or Open Your Expo Project:**
    ```bash
    expo init my-app
    cd my-app
    ```
*   **Install Sentry SDK for React Native:**
    ```bash
    expo install @sentry/react-native
    ```

**2.  Sentry Configuration (React Native App):**

*   **Create a `.sentry/config.js` file:**  This file will hold your Sentry configuration.  Create this file in the root of your Expo project.
    ```javascript
    // .sentry/config.js
    module.exports = {
      project: 'YOUR_SENTRY_PROJECT_ID', // Replace with your Sentry Project ID
      environment: 'production', // Or 'development' for debugging
      release: '1.0.0', // Set your release version
      tracesSampleRate: 1.0, // Tracing sample rate (1.0 means all traces)
      // Optional settings:
      // disableServerComments: true,  // Disable comments on the server
      // integrations: [
      //   {
      //     name: 'slack',
      //     webhooks: ['YOUR_SLACK_WEBHOOK_URL'],
      //   },
      // ],
    };
    ```
    *   **`project`:**  Replace `YOUR_SENTRY_PROJECT_ID` with the unique project ID you created in your Sentry dashboard.
    *   **`environment`:**  Set this to 'production' for live builds. Use 'development' or 'staging' for testing.
    *   **`release`:**  This should be the version number of your application.
    *   **`tracesSampleRate`:**  Determines how many traces are captured. A value of `1.0` captures all traces, which can impact performance.  Start with a lower value (e.g., `0.1`) for testing and increase it as needed.
    *   **Optional Integrations:**  Sentry offers integrations with services like Slack, Rollbar, and more. Configure these in the `integrations` array if desired.

*   **Initialize Sentry in Your App:**
    ```javascript
    import * as Sentry from '@sentry/react-native';

    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN', // Replace with your DSN
      tracesSampleRate: 1.0,
      // ... other configurations from your .sentry/config.js ...
    });
    ```
    *   **`dsn`:**  This is your Sentry Data Source Name.  Sentry will generate this automatically based on your `.sentry/config.js` settings.

*   **Add Sentry Error Tracking:**  Implement error tracking throughout your app.
    ```javascript
    import { Alert } from 'react-native';
    import Sentry from '@sentry/react-native';

    try {
      //
