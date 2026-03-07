# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-04T13:56:49.539126

## Sentry Setup Guide for Expo React Native + Express

This guide outlines how to integrate Sentry into your Expo React Native application and your associated Express backend. It covers installation, configuration, and best practices.

**Prerequisites:**

*   **Expo SDK:** Version 45 or later is recommended.
*   **Node.js & npm/Yarn:**  Ensure you have Node.js and a package manager installed.
*   **Sentry Account:** You’ll need a Sentry account. Sign up at [https://sentry.io/](https://sentry.io/).

**Steps:**

**1. Install Sentry Packages:**

*   **React Native (Expo):**
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

**2. Configure Sentry in Your React Native App:**

*   **Create a Sentry Client:**  In your main app file (e.g., `App.js` or `index.js`), create a Sentry client instance:

    ```javascript
    import Sentry from '@sentry/react-native';
    import { Platform } from 'react-native';

    // You can customize the SDK options here.
    const SentryOptions = {
      dsn: 'YOUR_SENTRY_DSN',  // Replace with your Sentry DSN
      tracesetIgnorers: [ /api/ ], // Ignore traces from your Express API routes (optional)
      //  ... other options (e.g., integrations, user, etc.)
    };

    Sentry.init({
      ...SentryOptions,
      beforeExceptionFilter(e, capturedContext) {
        // Optional: Log unhandled exceptions before sending them to Sentry
        console.error('Unhandled exception:', e);
        capturedContext.extra = { error: e };
      },
    });
    ```

    *   **`YOUR_SENTRY_DSN`:**  Replace this with your actual Sentry DSN (Data Stream Name). You can get this from your Sentry dashboard. The DSN follows this format:
        `https://[AUTH_ID]@sentry.io/[APP_ID]/[ENVIRONMENT]`
        *   `AUTH_ID`:  Your Sentry authentication ID.
        *   `APP_ID`:  Your Sentry application ID.
        *   `ENVIRONMENT`:  The name of your environment (e.g., "production", "staging", "development").
    *   **`tracesetIgnorers`:** (Optional but recommended for API routes)  This prevents Sentry from flooding your app with traces from your backend API routes. This is crucial for reducing noise and focusing on user-facing issues.  The regex `/api/` is just an example; adjust it to match your API route patterns.
    *   **`beforeExceptionFilter`:** (Optional) A function that gets executed before an exception is sent to Sentry. This allows you to add context or perform custom logging.

*   **Install Expo SDK:** Ensure you've installed the Expo SDK to enable native module support. This is typically handled through your Expo project setup.

**3. Configure Sentry in Your Express Backend:**

*   **Create a Sentry Client:** In your Express app, create a Sentry client instance:

    ```javascript
    const Sentry = require('@sentry/node');

    // You can customize the SDK options here.
    const SentryOptions = {
