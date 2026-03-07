# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-04T07:53:58.116366

## Sentry Setup Guide for Expo React Native + Express

This guide outlines how to integrate Sentry into your Expo React Native app and your accompanying Express API. We'll cover installation, configuration, and best practices.

**Prerequisites:**

*   **Expo CLI:** Ensure you have Expo CLI installed globally: `npm install -g expo-cli`
*   **Node.js & npm/yarn:** Ensure you have Node.js and a package manager (npm or yarn) installed.
*   **Sentry Account:** You'll need a Sentry account. Sign up at [https://sentry.io/](https://sentry.io/).

**Steps:**

**1. Install Sentry Packages:**

*   **React Native (Expo):**
    ```bash
    npm install @sentry/react-native
    # or
    yarn add @sentry/react-native
    ```

*   **Express API:**
    ```bash
    npm install @sentry/node
    # or
    yarn add @sentry/node
    ```

**2. Configure Sentry React Native App:**

*   **Create a Sentry Configuration File:** Create a file named `sentry.expo.js` (or similar) in your Expo project's root directory. This file will contain your Sentry configuration.

    ```javascript
    // sentry.expo.js
    import * as Sentry from '@sentry/react-native';

    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
      // ignoreErrorTypes: ['TypeError', 'ReferenceError'], // Optional: Ignore specific error types
      // enableSourceMaps: true,  // Recommended: Enable source maps for better debugging
      // release: 'your_app_version', //  Set your app's release version (e.g., '1.0.0')
      // trackPerformance: true, // Optional: Track app performance metrics
    });
    ```

    *   **`dsn`:** This is your Sentry Data Source Name (DSN). You can find this in your Sentry dashboard after creating a project.  It looks something like: `https://YOUR_APP_ID.sentry.io/`
    *   **`ignoreErrorTypes`:**  (Optional)  Exclude certain error types that you don't want to report. Useful for non-critical errors.
    *   **`enableSourceMaps`:** (Recommended)  Enabling source maps makes it much easier to pinpoint the exact location of errors in your code by mapping Sentry reports back to your source code.
    *   **`release`:** (Recommended) Set the release version of your app.  This helps Sentry correlate errors with specific versions.
    *   **`trackPerformance`:** (Optional) Enable performance tracking to get detailed insights into your app's performance.

*   **Import and Initialize Sentry in Your App:** Import the `Sentry` object from your configuration file and initialize it within your main app component (e.g., `App.js`).

    ```javascript
    // App.js
    import React from 'react';
    import { AppNavigator } from './navigation';
    import { Sentry } from './sentry.expo';

    const App = () => {
      return (
        <AppNavigator />
      );
    };

    Sentry.init({ // Initialize Sentry here
      dsn: 'YOUR_SENTRY_DSN',
      // ... other configurations from sentry.expo.js
    });

    export default App;
    ```

**3. Configure Sentry
