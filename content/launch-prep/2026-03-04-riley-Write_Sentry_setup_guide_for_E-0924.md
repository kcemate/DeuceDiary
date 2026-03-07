# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-04T09:24:37.846163

## Sentry Setup Guide for Expo React Native + Express

This guide outlines the steps to integrate Sentry into your Expo React Native app and your Express backend. It focuses on a best-practice approach for a seamless experience.

**Prerequisites:**

*   **Sentry Account:** You'll need a Sentry account.  Sign up at [https://sentry.io/](https://sentry.io/).
*   **Expo CLI:** Ensure you have Expo CLI installed globally: `npm install -g expo-cli`
*   **Node.js & npm/yarn:**  Make sure you have Node.js and npm or yarn installed.

**1. Setting up Sentry in Sentry:**

1.  **Create a Project:**  In your Sentry dashboard, create a new project. Give it a descriptive name (e.g., "MyExpoApp").
2.  **Install SDK Keys:** Note down the `DSN` (Data Source Name) and the `Sample Rate` from your project's settings. You'll need these later.
3.  **(Recommended) Enable Performance Monitoring:**  Consider enabling Sentry's Performance monitoring to track key metrics like app load time, screen transitions, and network requests. This provides a richer picture of your app's performance.

**2. Installing Sentry Dependencies:**

*   **React Native App:**
    *   Navigate to your React Native project directory: `cd my-expo-app`
    *   Install the Sentry SDK:
        ```bash
        npm install @sentry/react-native
        # or
        yarn add @sentry/react-native
        ```
*   **Express Backend:**
    *   Navigate to your Express backend directory (e.g., `my-express-app`): `cd my-express-app`
    *   Install the Sentry SDK:
        ```bash
        npm install @sentry/node
        # or
        yarn add @sentry/node
        ```

**3. Configuring Sentry in Your React Native App:**

1.  **Import and Initialize Sentry:**  In your app's root file (e.g., `App.js`), import and initialize Sentry:

    ```javascript
    import Sentry from '@sentry/react-native';

    // Replace with your DSN
    Sentry.init({
      dsn: 'YOUR_DSN',
      // Sample Rate (optional, defaults to 100)
      // sampleRate: 50,
      trackUserActions: true, //  (Recommended) Track user actions
      // Performance Monitoring (requires enabling in Sentry dashboard)
      // performanceMonitoring: true,
    });
    ```

    **Replace `YOUR_DSN` with your actual Sentry DSN.**

2.  **Handling Errors:**  Wrap your app's entry point (usually `App.js`) in a `try...catch` block to ensure that any unhandled errors are caught and reported to Sentry.

    ```javascript
    import React, { AppState } from 'react';
    import { AppRegistry } from 'react-native';
    import App from './App';
    import Sentry from '@sentry/react-native';

    try {
      AppRegistry.registerComponent('my-expo-app', () => App);
    } catch (e) {
      Sentry.captureException(e);
    }
    ```

3.  **Custom Error Handling (Recommended):**  Consider using a centralized error handling mechanism in your app.  This allows you to:

    *   Log errors with more context.
    *   Display user
