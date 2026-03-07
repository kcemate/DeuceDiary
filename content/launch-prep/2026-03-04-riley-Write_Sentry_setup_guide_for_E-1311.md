# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-04T13:11:37.609162

## Sentry Setup Guide for Expo React Native + Express

This guide outlines how to integrate Sentry into your Expo React Native project alongside your Express backend.  It covers installation, configuration, and best practices for effective monitoring.

**Prerequisites:**

*   **Expo CLI:** Ensure you have Expo CLI installed globally: `npm install -g expo-cli`
*   **Node.js and npm/yarn:**  You'll need Node.js and npm (or yarn) to manage dependencies.
*   **Sentry Account:** You’ll need a Sentry account. Create one at [https://sentry.io/](https://sentry.io/) and generate a project key.

**1. Install Sentry Packages**

First, install the necessary Sentry packages for both your React Native and Express apps:

*   **React Native (Expo):**
    ```bash
    npm install @sentry/react-native
    # or
    yarn add @sentry/react-native
    ```

*   **Express Backend:**
    ```bash
    npm install @sentry/node
    # or
    yarn add @sentry/node
    ```

**2. Configure React Native App**

*   **`sentry/config/Expo.ts` (Create this file):**  This file contains the configuration specific to your Expo React Native app.

    ```typescript
    import { SentryOptions } from '@sentry/react-native';

    export const options: SentryOptions = {
      dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
      trackPerformance: true, // Optional: Track performance metrics
      trackUserTypes: true, // Optional: Track user types (e.g., "premium", "free")
      // Optional:  Add additional options here
    };
    ```
    *   **`dsn`:**  Replace `YOUR_SENTRY_DSN` with your actual Sentry DSN (Data Source Name). You can find this in your Sentry dashboard.  The DSN looks like this: `sentry.io/<your_project_id>/?key=<your_project_key>`.

**3. Configure Express Backend**

*   **`sentry/config/Node.ts` (Create this file):** This file configures Sentry for your Express backend.

    ```typescript
    import { SentryOptions } from '@sentry/node';

    export const options: SentryOptions = {
      dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
      tracesSampleRate: 0.1, // Optional:  Percentage of traces to sample (default is 0.1)
      // Optional: Add additional options here
    };
    ```
    *   **`dsn`:**  Same as in the React Native configuration, replace `YOUR_SENTRY_DSN` with your Sentry DSN.

**4. Integrate Sentry Packages into your Projects**

*   **React Native App:**

    ```javascript
    import { Sentry } from '@sentry/react-native';

    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN',
      // ... any other options from Expo.ts
    });
    ```

*   **Express Backend:**

    ```javascript
    const Sentry = require('@sentry/node');

    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN',
      // ... any other options from Node.ts
    });

    // Example Usage:
    app.get('/example', (req,
