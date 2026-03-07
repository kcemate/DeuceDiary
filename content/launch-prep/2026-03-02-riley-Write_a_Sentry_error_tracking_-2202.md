# Write a Sentry error tracking setup guide for Expo React Nat
Agent: riley
Generated: 2026-03-02T22:02:54.354869

## Sentry Error Tracking Setup Guide for Expo React Native + Express.js

This guide outlines the process of integrating Sentry into your Expo React Native and Express.js application for robust error tracking and debugging.

**Prerequisites:**

*   An Sentry account - sign up at [https://sentry.io/](https://sentry.io/)
*   Node.js and npm/yarn installed.
*   Expo CLI installed and configured.

**1. Installation:**

**a) React Native:**

*   **Install the Sentry SDK:**

    ```bash
    npm install @sentry/react-native
    # or
    yarn add @sentry/react-native
    ```

**b) Express.js:**

*   **Install the Sentry SDK for Node.js:**

    ```bash
    npm install @sentry/node
    # or
    yarn add @sentry/node
    ```

**2. Configuration:**

**a) React Native:**

*   **Initialize Sentry:**  In your root `App.js` or the entry point of your Expo app, initialize Sentry:

    ```javascript
    import * as Sentry from '@sentry/react-native';

    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
      // Optional configurations:
      // autoSetEndpoint: true, // Automatically sets the endpoint URL
      // trackPerformance: true, // Enables performance monitoring
      // enableSourceMaps: true, // Enable source maps (highly recommended)
    });
    ```

    *   **`YOUR_SENTRY_DSN`:** This is your Sentry Data Stream Name. You can find this in your Sentry dashboard after creating an app. It's a unique identifier for your application.  It typically looks like: `https://<your-account-id>.sentry.io/`
    *   **`autoSetEndpoint: true`:** (Optional)  Sentry will automatically detect and set the correct endpoint URL based on your environment.
    *   **`trackPerformance: true`:** (Optional) Enables Sentry to track performance metrics (response times, etc.). Useful for identifying bottlenecks.
    *   **`enableSourceMaps: true`:**  **Crucially important for React Native debugging.**  This allows Sentry to show you the exact line of code where the error occurred, greatly simplifying debugging.

**b) Express.js:**

*   **Initialize Sentry:**  In your Express.js application, initialize Sentry:

    ```javascript
    const Sentry = require('@sentry/node');

    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
      // Optional configurations:
      // autoSetEndpoint: true,
      // trackPerformance: true,
      // enableSourceMaps: true,
    });

    // Example: Catch errors in your route handlers
    app.get('/api/users', (req, res, next) => {
      try {
        // Your code here
        // ...
        res.status(200).json({ message: 'Users data' });
      } catch (error) {
        next(error); // Pass error to Sentry for handling
      }
    });
    ```

    *   **`YOUR_SENTRY_DSN`:**  As with React Native, replace this with your Sentry DSN.

**3. Enable Source Maps:**

*   **React Native:**  Ensure `enableSourceMaps: true` is set in your `Sentry.init()` call for
