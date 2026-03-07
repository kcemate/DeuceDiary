# Write a Sentry error tracking setup guide for Expo React Nat
Agent: riley
Generated: 2026-03-03T00:31:23.545478

## Sentry Error Tracking Setup Guide for Expo React Native + Express.js

This guide will walk you through setting up Sentry error tracking for your Expo React Native application integrated with an Express.js backend. It covers installation, configuration, source maps, release tracking, and alert rules.

**Prerequisites:**

*   **Sentry Account:** You need a Sentry account. Sign up at [https://sentry.io/](https://sentry.io/).
*   **Node.js & npm:** Make sure you have Node.js and npm installed.
*   **Expo Project:** You have an existing Expo React Native project.

**1. Installation**

**a) React Native Side (Expo):**

```bash
npm install @sentry/react-native
```

**b) Express.js Side:**

```bash
npm install @sentry/node
```

**2. Configuration**

**a) React Native (Expo):**

1.  **Create a Sentry SDK:**

    ```javascript
    import * as Sentry from '@sentry/react-native';

    // Replace with your Sentry project ID
    const SENTRY_PROJECT_ID = 'YOUR_SENTRY_PROJECT_ID';

    Sentry.init({
      dsn: `https://${SENTRY_PROJECT_ID}.sentry.io/`,
      // Optional: Set custom integrations
      // integrations: [
      //   new Sentry.Integrations.Breadcrumbs(),
      //   new Sentry.Integrations.Session(),
      // ],
    });
    ```

    *   **`dsn`:** This is your Sentry Data Source Name (DSN).  It's the URL provided by Sentry.
    *   **`integrations`:**  (Optional)  Add integrations to enhance your error reporting.  Consider Breadcrumbs and Session integrations.

2.  **Handle Errors:**

    Make sure you're handling errors gracefully in your React Native components.  Sentry will automatically capture errors if you're not. Consider using `try...catch` blocks or custom error handling logic.

3.  **Expo Development Builds:**  Ensure Sentry is enabled during development.  It automatically captures errors in development builds.

**b) Express.js Side:**

1.  **Create a Sentry SDK:**

    ```javascript
    const Sentry = require('@sentry/node');

    // Replace with your Sentry project ID
    const SENTRY_PROJECT_ID = 'YOUR_SENTRY_PROJECT_ID';

    Sentry.init({
      dsn: `https://${SENTRY_PROJECT_ID}.sentry.io/`,
      // Optional: Set custom integrations
      // integrations: [
      //   new Sentry.Integrations.Breadcrumbs(),
      //   new Sentry.Integrations.Session(),
      // ],
    });
    ```

    *   Same `dsn` configuration as React Native.

2.  **Handle Errors:**

    Implement error handling middleware in your Express.js app.  Sentry will automatically capture errors if you're not explicitly handling them.

    ```javascript
    const express = require('express');
    const app = express();

    // ... your routes ...

    app.use((err, req, res, next) => {
      console.error(err.stack);  // Log to console for debugging
      Sentry.captureException(err, req, res);
      res.status(500).send('Something broke!');
    });
    ```

**3. Source Maps**

*   **Why they're important:**  Source maps allow S
