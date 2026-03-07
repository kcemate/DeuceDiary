# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T17:10:31.370343

## Sentry Setup Guide for Expo React Native + Express

This guide outlines the steps to integrate Sentry for error tracking in your Expo React Native application and your accompanying Express backend. It covers both mobile and backend monitoring, crucial for comprehensive debugging and issue resolution.

**Prerequisites:**

*   **Expo CLI:** Ensure you have Expo CLI installed and configured.
*   **Sentry Account:**  You'll need a Sentry account.  Sign up at [https://sentry.io/](https://sentry.io/)
*   **Node.js & npm/yarn:**  A working Node.js and package manager.

**1. Sentry Backend Setup (Express)**

*   **Install Sentry SDK:**
    ```bash
    npm install sentry
    ```
*   **Configure Sentry:**
    *   Create a `.sentry.js` file in your Express project's root.  This file will contain your Sentry SDK configuration.

    ```javascript
    // .sentry.js
    module.exports = {
      dsn: 'YOUR_SENTRY_DSN', // Replace with your DSN
      // Optional:  Configure a project
      // project: 'YOUR_PROJECT_ID',
    };
    ```

    *   **Get your DSN:**  You'll find your DSN (Data Source Name) on your Sentry dashboard after creating a project.  It looks something like `sentry.io/YOUR_ORG/YOUR_PROJECT`

*   **Integrate the SDK into your Express App:**

    ```javascript
    // your_express_app.js
    const express = require('express');
    const Sentry = require('./.sentry.js');

    const app = express();

    // Initialize Sentry
    Sentry.init({
      // If you haven't created a project, you can use a dummy DSN
      // to test:
      // dsn: 'https://YOUR_PROJECT_ID.sentry.io/YOUR_ORG/',
      // or 
      dsn: Sentry.dsn, // Use the DSN from your .sentry.js
    });

    app.get('/health', (req, res) => {
      res.status(200).send('OK');
    });

    // Add error handling middleware
    app.use((err, req, res, next) => {
      console.error(err);
      Sentry.captureException(err, {
        extra: {
          req: req.body, // Include request body for context
          url: req.originalUrl,
          method: req.method,
        },
      });
      res.status(500).send('Something went wrong');
    });

    module.exports = app;
    ```

    *   **Explanation:**
        *   `Sentry.init()` initializes the Sentry SDK, passing in your DSN.
        *   The `app.use` middleware is crucial. It catches *all* errors that occur in your application.
        *   `Sentry.captureException()` logs the error to Sentry, enriching it with extra context like the request body, URL, and method.  This is incredibly helpful for debugging.

**2. Sentry Mobile Setup (Expo React Native)**

*   **Install the Sentry SDK:**
    ```bash
    npx expo install @sentry/react-native
    ```

*   **Configure Sentry:**
    *   Create a `sentry.init` function in your App.js or a dedicated configuration file.

    ```javascript
    // App.
