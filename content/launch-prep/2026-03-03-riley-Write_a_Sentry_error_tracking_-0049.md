# Write a Sentry error tracking setup guide for Expo React Nat
Agent: riley
Generated: 2026-03-03T00:49:58.212163

## Sentry Error Tracking Setup Guide for Expo React Native + Express.js

This guide outlines how to integrate Sentry error tracking into your Expo React Native and Express.js application. It covers installation, configuration, source maps, release tracking, and alert rules.

**Prerequisites:**

*   An active Sentry account: [https://sentry.io/](https://sentry.io/)
*   Node.js and npm/yarn installed.
*   Expo CLI installed.

**1. Installation:**

**a) React Native:**

```bash
npm install @sentry/react-native
# or
yarn add @sentry/react-native
```

**b) Express.js (Backend):**

```bash
npm install @sentry/node
# or
yarn add @sentry/node
```

**2. Configuration:**

**a) React Native App:**

1.  **Create a Sentry Initialization:** In your main entry point file (e.g., `App.js` or `index.js`), initialize Sentry.

    ```javascript
    import * as Sentry from '@sentry/react-native';

    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN', // Replace with your DSN
      // Optionally, you can add specific options here:
      // autoSetContext: true, // Automatically set context like device info
      // trackPerformance: true, // Enable performance tracking (requires specific options)
    });
    ```

    **Important:** Your `YOUR_SENTRY_DSN` should be a string containing your Sentry DSN (Data Source Name). You can find this DSN in your Sentry project settings.

**b) Express.js Backend:**

1.  **Install the Node.js SDK:**  (Already done in step 1b)

2.  **Initialize Sentry:** In your main application file (e.g., `app.js` or `server.js`), initialize Sentry.

    ```javascript
    const Sentry = require('@sentry/node');

    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN', // Replace with your DSN
      // Optionally, you can add specific options here:
      // autoSetContext: true, // Automatically set context like device info
    });
    ```

**3.  Setting Up Source Maps:**

*   **Expo's Challenge:** Expo's bundling process can make directly using source maps a bit tricky.  However, Sentry supports it, and here's how to maximize its effectiveness:

    *   **Enable Source Maps in Expo:** In your `package.json` file, add the following to the `expo` section:

        ```json
        "expo": {
          "sourceMaps": true
        }
        ```

    *   **Check Expo's Build Process:** Expo is designed to abstract away a lot of the native build process. To ensure source maps are correctly generated, follow Expo's recommendations for building your app.  Generally, this means running `expo build:android` or `expo build:ios` and allowing Expo to handle the native build steps.
    *   **Verify in Sentry:** After deployment, check Sentry to confirm that source maps are being used. You'll see the code paths linked in the error reports, which is crucial for debugging.

**4. Release Tracking:**

*   **Understanding Releases:**  Sentry's release tracking allows you to correlate errors with specific app versions, helping you understand which changes are causing problems.
*   **Set the Release Version:**  In your React Native app, set the release version:

    ```javascript
