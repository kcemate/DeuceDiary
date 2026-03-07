# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T21:19:33.089116

## Sentry Setup Guide for Expo React Native + Express

This guide outlines the steps to integrate Sentry for error tracking in your Expo React Native application when combined with an Express backend. We'll cover installation, configuration, and best practices.

**Prerequisites:**

*   **Node.js and npm/yarn installed.**
*   **Expo CLI installed:** `npm install -g expo-cli`
*   **Express backend setup:** You should already have an Express backend running (for this example, let's assume it's named `server`).

**Steps:**

**1. Install Sentry SDKs:**

*   **React Native (Expo):**  Install the `@sentry/react-native` package.
    ```bash
    npm install @sentry/react-native
    # or
    yarn add @sentry/react-native
    ```

*   **Node.js (Express):** Install the `@sentry/node` package.
    ```bash
    npm install @sentry/node
    # or
    yarn add @sentry/node
    ```

**2. Configure Sentry in React Native (Expo):**

*   **Create a Sentry Client:** Inside your main Expo app file (e.g., `App.js`) or a dedicated configuration file (e.g., `sentry.js`), create a Sentry client.

    ```javascript
    // sentry.js
    import * as Sentry from '@sentry/react-native';

    // Replace with your Sentry project ID
    const SENTRY_PROJECT_ID = 'YOUR_SENTRY_PROJECT_ID';

    export default Sentry.init({
      dsn: `https://YOUR_SENTRY_DSN.io/YOUR_APP_ID`, // Use your DSN (replace placeholders)
      // Set sample rate if you want to track only a percentage of errors
      // sampleRate: 100, // Track all errors
      // Before sending events, you can optionally add custom context
      // before(error, capturedContext) {
      //   capturedContext.set('appName', 'My Expo App');
      // },
    });
    ```

    *   **`YOUR_SENTRY_PROJECT_ID`:**  This is the unique identifier for your Sentry project. You'll get this from your Sentry dashboard ([https://sentry.io/](https://sentry.io/)).
    *   **`YOUR_SENTRY_DSN`:** The Data Source Name (DSN) is a URL that tells Sentry how to send logs and errors.  It's generally formatted like: `https://YOUR_SENTRY_PROJECT_ID@eu.sentry.io/` (replace `eu.sentry.io` with your region if different).
    *   **`YOUR_APP_ID`:** This is a unique identifier for your application within Sentry. You can generate this by creating an app in Sentry.  It's important for associating errors to your app.
    *   **`sampleRate`:** This allows you to control the percentage of errors you want to track.  Setting it to `100` means all errors are tracked. Setting it to `50` will only track 50% of errors, which can be useful to avoid overwhelming Sentry with less critical issues.

*   **Import and Call `Sentry.init()`:**  Make sure to import and call `Sentry.init()` at the top of your app file, usually before your `App.js` render.  This ensures Sentry is properly initialized.

    ```javascript
    // App.js
    import
