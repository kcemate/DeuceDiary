# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-04T13:34:13.522240

Okay, let's craft a comprehensive Sentry setup guide specifically tailored for Expo React Native projects integrated with an Express.js backend. This guide will cover the core steps and best practices.

**Understanding the Architecture**

Before we begin, let's clarify the setup.  You'll have:

*   **Expo React Native App:** Your front-end, built with Expo.
*   **Express.js Backend:** Your API server, providing backend logic.
*   **Sentry:** For comprehensive error monitoring and reporting.

The key integration is logging errors from both the React Native app *and* the Express server.

**Step 1: Install Sentry Packages**

First, install the necessary Sentry packages for both your Expo app and your Express server.  You'll need the `sentry-expo` package for the React Native app and the `sentry-node` package for the Express server.

1.  **Expo React Native App:**

    ```bash
    npx expo install @sentry/expo
    ```

2.  **Express.js Backend:**

    ```bash
    npm install --save @sentry/node
    ```
    or
    ```bash
    yarn add @sentry/node
    ```

**Step 2: Configure Sentry in Your Express Backend**

This is where you'll set up the Express server to send errors to Sentry.

1.  **Install the Sentry Express SDK:**

    ```bash
    npm install --save @sentry/express
    ```
    or
    ```bash
    yarn add @sentry/express
    ```

2.  **Import and Initialize the SDK:**  In your Express app's main file (usually `app.js`, `server.js`, or similar), import and initialize the `SentryExpress` middleware.

    ```javascript
    const express = require('express');
    const app = express();
    const Sentry = require('@sentry/node');

    // Set the global Sentry options (optional - adjust as needed)
    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
      tracesSampleRate: 100, // Capture 100% of traces
      // ...other options like autoSetTTL, enableAutoPause, etc.
    });

    // Middleware to handle errors
    app.use((err, req, res, next) => {
      console.error(err); // Log to console for local debugging
      Sentry.captureException(err, {
        request: req, // Send request context for more detail
      });
      res.status(500).send('Something went wrong!');
    });

    // Your Express app routes here...
    app.get('/', (req, res) => {
      res.send('Hello from Express!');
    });
    ```

    *   **`YOUR_SENTRY_DSN`**:  Replace this placeholder with your Sentry DSN (Data Source Name). You can get your DSN from the Sentry dashboard. It's a string that looks like: `sentry.io/<your-project-id>/<your-space-id>`

    *   **`request: req`**:  Sending the `request` object to Sentry provides valuable context, including headers, URL, and potentially request body, helping you understand the context of the error.

**Step 3: Configure Sentry in Your Expo React Native App**

This is where you integrate Sentry into your React Native app.

1.  **Install `sentry-expo`:**  You've already done this
