# Write a Sentry error tracking setup guide for Expo React Nat
Agent: riley
Generated: 2026-03-02T22:58:35.031227

## Sentry Error Tracking Setup Guide for Expo React Native + Express.js

This guide outlines how to integrate Sentry error tracking into your Expo React Native application and your accompanying Express.js backend.  It covers installation, configuration, source maps, release tracking, and alert rules.

**Prerequisites:**

*   Node.js and npm/yarn installed
*   An active Sentry account ([https://sentry.io/](https://sentry.io/)) - Sign up for a free account.
*   Expo CLI installed and configured ([https://docs.expo.dev/workflow/cli/](https://docs.expo.dev/workflow/cli/))

**1. Installation:**

*   **React Native (Expo):**

    ```bash
    expo install sentry-expo
    ```

*   **Express.js Backend:**

    ```bash
    npm install sentry
    # or
    yarn add sentry
    ```

**2. Configuration:**

*   **React Native (Expo):**

    *   **Create a Sentry Project:** In your Sentry dashboard, create a new project for your Expo app.  You'll need a unique project key.

    *   **Configure `sentry-expo`:**  Create an `App.js` or your main entry point and add the following code:

        ```javascript
        import * as Sentry from 'sentry-expo';

        Sentry.init({
          dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
          // Optional: Track interactions
          trackPerformance: true,
          // Optional: Enable auto-batch
          enableAutoBatchCallback: true,
        });
        ```

    *   **Obtain your DSN:**  Your DSN (Data Source Name) is the URL provided by Sentry. It looks like: `https://[YOUR_PROJECT_ID].sentry.io/`

    *   **Important:** Make sure to replace `YOUR_SENTRY_DSN` with your actual DSN.

*   **Express.js Backend:**

    *   **Initialize Sentry:**  In your Express.js app's main file (e.g., `index.js`, `app.js`), initialize Sentry:

        ```javascript
        const Sentry = require('sentry');

        Sentry.init({
          dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
          // Optional: Track requests
          trackRequestPerformance: true,
          // Optional:  Set sample rate (e.g., 100 for all requests)
          sampleRate: 100,
        });

        // ... Your Express.js app code ...
        ```

    *   **Replace `YOUR_SENTRY_DSN`** with your actual DSN.

**3. Source Maps:**

*   **Essential for Debugging:**  Source maps are critical for correctly mapping errors from your JavaScript code back to the original source files in your Expo project. Without them, Sentry will only show you the compiled JavaScript, making debugging very difficult.

*   **Expo's Automatic Source Maps:**  Expo automatically generates source maps.  You typically don't need to configure anything manually.

*   **Verification:**  Ensure your Expo development environment is set up to generate source maps.  By default, Expo does this.  You can verify this by running your app in development and inspecting the network requests.  You should see requests for source maps.

**4. Release Tracking:**

*   **Understanding Releases:**  Release tracking allows you to group errors based on specific versions or builds of your application.
