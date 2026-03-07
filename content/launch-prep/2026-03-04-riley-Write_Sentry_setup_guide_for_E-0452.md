# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-04T04:52:35.418937

## Sentry Setup Guide for Expo React Native + Express

This guide outlines the steps to integrate Sentry into your Expo React Native app and your corresponding Express backend. This approach provides comprehensive error tracking for both client-side and server-side issues.

**Prerequisites:**

*   **Expo CLI:** Ensure you have the Expo CLI installed: `npm install -g expo-cli`
*   **Node.js & npm/yarn:**  Have Node.js and your preferred package manager (npm or yarn) installed.
*   **Sentry Account:** Create a Sentry account at [https://sentry.io/](https://sentry.io/).
*   **Express Application:** You should already have a basic Express application set up.

**Steps:**

**1. Install Sentry Packages:**

First, install the necessary Sentry packages for both the React Native client and the Express backend.

*   **React Native:**
    ```bash
    npm install @sentry/react-native
    # or
    yarn add @sentry/react-native
    ```

*   **Express:**
    ```bash
    npm install @sentry/node
    # or
    yarn add @sentry/node
    ```

**2. Configure Sentry in your React Native App:**

*   **Create a Sentry SDK:**  Within your React Native application, create a Sentry SDK. It's generally good practice to create a separate `SentryConfig` file for better organization.

    ```javascript
    // SentryConfig.js
    import * as Sentry from '@sentry/react-native';

    export const initializeSentry = (apiKey, release) => {
      Sentry.init({
        dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
        release: release || 'Expo App', // Optional: Track app releases
        tracesetIgnorers: [
          // Optionally ignore specific traces (e.g., navigation traces)
          // ['navigation']
        ],
      });
    };

    export const captureException = (exception) => {
      Sentry.captureException(exception);
    };

    export const captureInfo = (message, context) => {
      Sentry.captureMessage(message, { context });
    };
    ```

    *   **`YOUR_SENTRY_DSN`**: Replace this placeholder with your actual Sentry DSN (Data Stream Name). You can find your DSN in your Sentry dashboard.
    *   **`release`**: The name of the release or version of your app.  This is crucial for correlating errors with specific builds.
    *   **`tracesetIgnorers`**: (Optional)  This allows you to exclude certain types of traces from being sent to Sentry. This can help reduce noise and cost, especially when using the paid tiers of Sentry.  For example, you might ignore navigation traces to reduce the volume of data.

*   **Import and Initialize Sentry:**  Import your `initializeSentry` function and call it at the root of your application, usually in your `App.js` or `index.js` file.  Make sure to pass your Sentry API key and release information.

    ```javascript
    // App.js or index.js
    import React from 'react';
    import { AppRegistry } from 'react-native';
    import App from './App'; // Or your main app component
    import { initializeSentry } from './SentryConfig';

    const RNApp = App;

    initializeSentry('YOUR_SENTRY_API_KEY', 'MyAwesomeExpoApp');

    AppRegistry
