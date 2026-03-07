# Write a Sentry error tracking setup guide for Expo React Nat
Agent: riley
Generated: 2026-03-02T22:39:59.100383

## Sentry Error Tracking Setup Guide for Expo React Native + Express.js

This guide walks you through setting up Sentry error tracking for your Expo React Native application integrated with an Express.js backend.  It covers installation, configuration, source maps, release tracking, and alert rules.

**Prerequisites:**

*   **Expo SDK:**  You'll need an Expo SDK version that supports Sentry's Native SDK. (Currently, this is SDK 49 or higher is recommended)
*   **Node.js & npm/yarn:**  Ensure you have Node.js and a package manager (npm or yarn) installed.
*   **Sentry Account:**  Create a free Sentry account at [https://sentry.io/](https://sentry.io/).

**1. Installation:**

*   **Backend (Express.js):**
    ```bash
    npm install sentry
    ```

*   **Frontend (React Native):**
    ```bash
    npx expo install @sentry/react-native
    ```

**2. Configuration:**

*   **Backend (Express.js):**
    *   **Get Your Sentry Project ID:**  In your Sentry dashboard, you'll find your project ID.  Note this down – you’ll need it in the next step.
    *   **Initialize Sentry:** In your Express.js application, import and initialize Sentry:

        ```javascript
        const Sentry = require('sentry');

        Sentry.init({
          dsn: 'YOUR_SENTRY_DSN', // Replace with your DSN
          // Optionally, you can configure additional options here, such as:
          // autoSetUpserts: true, // Automatically updates the stacktrace with additional information
          // trackPerformance: true // Enable performance monitoring
        });
        ```

        **DSN (Data Source Name):** The DSN is a unique identifier for your Sentry project. It looks like this:
        `https://YOUR_PROJECT_ID@YOUR_ENVIRONMENT.sentry.io/`
        You can generate the DSN from your Sentry dashboard.  The `ENVIRONMENT` is often `production` or `staging`.

*   **Frontend (React Native):**
    *   **Get Your Sentry Project ID:**  Again, find your project ID in the Sentry dashboard.
    *   **Install `@sentry/react-native`:**  Make sure you've installed the native SDK.
    *   **Initialize Sentry:**  In your main App.js (or your root component), initialize Sentry:

        ```javascript
        import Sentry from '@sentry/react-native';

        Sentry.init({
          dsn: 'YOUR_SENTRY_DSN', // Replace with your DSN
          // Optionally, you can configure additional options here, such as:
          // beforeExceptionHandling(error, stack) { return someCustomLogic(error, stack); }
          // context: {
          //   projectVersion: '1.0.0', //  Set a default version
          // },
        });
        ```

**3. Source Maps:**

*   **Critical for React Native:**  Source maps are *essential* for debugging React Native errors in Sentry. They map the bundled JavaScript code back to your original source files, allowing you to see the original code errors within the Sentry interface.
*   **Enable Source Maps in Expo:**  Make sure you're using the correct build configuration to generate source maps during your Expo build. This is the default for most Expo projects, but double-check your `app.config.js` or `app.json` settings.
