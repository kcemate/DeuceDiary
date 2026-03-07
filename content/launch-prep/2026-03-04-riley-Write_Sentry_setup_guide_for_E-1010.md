# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-04T10:10:09.972599

## Sentry Setup Guide for Expo React Native + Express

This guide outlines the steps to integrate Sentry into your Expo React Native application and your Express backend for robust error tracking and monitoring.

**Prerequisites:**

*   **Sentry Account:** You need a Sentry account. Sign up at [https://sentry.io/](https://sentry.io/)
*   **Expo CLI:** Make sure you have Expo CLI installed globally.
*   **Node.js & npm/Yarn:**  Ensure you have Node.js and a package manager like npm or Yarn installed.
*   **Express Server:**  You should have a running Express server for your backend.

**Steps:**

**1. Install Sentry Packages:**

Install the necessary Sentry packages for both React Native and Express.

*   **React Native (Expo):**
    ```bash
    npm install @sentry/react-native
    # OR
    yarn add @sentry/react-native
    ```

*   **Express:**
    ```bash
    npm install @sentry/node
    # OR
    yarn add @sentry/node
    ```

**2. Configure Sentry in the React Native App:**

*   **Create a Sentry SDK:**  In your main app file (e.g., `App.js` or your root component), create a Sentry SDK instance.

    ```javascript
    import Sentry from '@sentry/react-native';

    // Replace with your Sentry project ID
    const SENTRY_PROJECT_ID = 'YOUR_PROJECT_ID';

    // Initialize Sentry
    Sentry.init({
      dsn: `https://YOUR_PROJECT_ID@sentry.io/YOUR_COMMIT_ID`, // Replace with your DSN
      tracesetEnabled: true, // Enable traceset for performance monitoring
      //  Other options:
      //  environment: 'development', // Set the environment (development, staging, production)
      //  release: '1.0.0',           // Set the release version
    });

    // Optional:  Error handling - for unhandled errors not caught by Sentry
    process.on('unhandledRejection', (reason, promise) => {
      console.warn('Unhandled promise rejection:', reason);
      Sentry.captureException(reason);
    });
    ```

    *   **Replace Placeholders:**
        *   `YOUR_PROJECT_ID`: Your Sentry project ID (found on your Sentry dashboard).
        *   `YOUR_COMMIT_ID`:  Your Git commit hash. Sentry automatically populates this but it's good practice to explicitly set it.  You can get your commit ID using `git rev-parse HEAD`.
    *   **DSN:**  The Data Source Name (DSN) is the URL that Sentry uses to communicate with its servers.  It contains your project ID and the authentication information.
    *   **tracesetEnabled:** This setting enables Sentry's traceset. Traceset provides more detailed performance monitoring for your app, including frame-level timings.
    *   **Environment:**  Set the environment to reflect your application's stage (development, staging, production).
    *   **Release:**  The release version of your application.
    *   **Unhandled Rejection Handler:**  This is crucial.  It catches errors that Sentry doesn't automatically capture (e.g., errors within asynchronous callbacks) and sends them to Sentry.

**3. Configure Sentry in the Express Server:**

*   **Import Sentry:**  In your Express server's main file (e.g., `server.js`), import the
