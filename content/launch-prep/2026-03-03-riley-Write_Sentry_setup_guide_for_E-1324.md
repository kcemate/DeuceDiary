# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T13:24:11.486726

## Sentry Setup Guide for Expo React Native + Express

This guide outlines how to integrate Sentry into your Expo React Native app and your Express backend for comprehensive error tracking.

**Prerequisites:**

*   **Sentry Account:** You'll need a Sentry account. Sign up at [https://sentry.io/](https://sentry.io/).
*   **Expo Project:**  You should have an existing Expo React Native project.
*   **Node.js & npm/yarn:** Ensure you have Node.js and npm or Yarn installed.

**Steps:**

**1. Install Sentry Packages:**

Install the necessary packages for both your React Native app and your Express backend:

*   **React Native App:**
    ```bash
    npm install @sentry/react-native
    # or
    yarn add @sentry/react-native
    ```
*   **Express Backend:**
    ```bash
    npm install @sentry/node
    # or
    yarn add @sentry/node
    ```

**2. Configure Sentry in Your React Native App:**

*   **Import Sentry:** Import the `Sentry` component into your root application file (e.g., `App.js` or `index.js`).
*   **Initialize Sentry:**  Initialize Sentry with your Sentry project ID.  You can find your project ID in the Sentry dashboard.
*   **Wrap Your App:** Wrap your application with the `Sentry` component:

    ```javascript
    import React from 'react';
    import { Sentry } from '@sentry/react-native';

    const App = () => {
      // Replace 'YOUR_PROJECT_ID' with your actual Sentry project ID
      Sentry.init({
        dsn: 'YOUR_PROJECT_ID',
        // Optional: Performance monitoring
        tracesSampleRate: 1,
        // Optional: Enable automatic error reporting
        // autoAttach: true,
      });

      return (
        <>
          {/* Your app content here */}
        </>
      );
    };

    export default App;
    ```

*   **Configure Logging Levels (Optional):**  Adjust the logging levels in Sentry to control what information is captured.  Common levels:
    *   `info`:  General information.
    *   `warn`:  Potential issues or warnings.
    *   `error`:  Critical errors.

**3. Configure Sentry in Your Express Backend:**

*   **Import Sentry:** Import `Sentry` from `@sentry/node`.
*   **Initialize Sentry:** Initialize Sentry with your Sentry project ID.
*   **Wrap Your Application:** Wrap your Express application with the `Sentry` middleware.

    ```javascript
    const express = require('express');
    const app = express();
    const Sentry = require('@sentry/node');

    // Replace 'YOUR_PROJECT_ID' with your actual Sentry project ID
    Sentry.init({
      dsn: 'YOUR_PROJECT_ID',
      // Optional: Performance monitoring
      tracesSampleRate: 1,
    });

    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    // Example error handling middleware
    app.use((err, req, res, next) => {
      console.error(err.stack); // Log to console as well
      Sentry.captureException(err, req, res);
      res.status(500).send('Something went wrong!');
    });

    app.listen(3000,
