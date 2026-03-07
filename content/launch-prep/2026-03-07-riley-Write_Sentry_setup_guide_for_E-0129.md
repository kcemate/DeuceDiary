# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-07T01:29:22.694437

## Sentry Setup Guide for Expo React Native + Express

This guide outlines how to integrate Sentry into your Expo React Native application and your accompanying Express backend for comprehensive error tracking.

**Prerequisites:**

*   **Expo CLI:** Ensure you have the latest Expo CLI installed.
*   **Sentry Account:** Create a Sentry account at [https://sentry.io/](https://sentry.io/).
*   **Node.js and npm/yarn:** Ensure you have Node.js and a package manager (npm or yarn) installed.
*   **Expo Development Environment:**  Have your Expo development environment set up (emulator, simulator, or device).

**Step 1: Install Sentry Packages**

Install the necessary Sentry packages in your Expo React Native project:

```bash
npm install @sentry/react-native @sentry/node
# or
yarn add @sentry/react-native @sentry/node
```

**Step 2: Configure Sentry in your React Native App**

1.  **Create a Sentry SDK:** Create a Sentry SDK instance in your root component (e.g., `App.js` or `index.js`).

    ```javascript
    import Sentry from '@sentry/react-native';

    // Replace with your Sentry project ID
    const SENTRY_PROJECT_ID = 'YOUR_SENTRY_PROJECT_ID';

    Sentry.init({
      dsn: `https://${SENTRY_PROJECT_ID}.sentry.io/`,
      // Set environment name (e.g., 'development', 'production')
      environment: 'development',
      // Optionally, disable initial loading error
      initializers: {
        BeforeErrorBound: (({ error, lineNumber, columnNumber, componentName }) => {
          // Handle specific errors or log them
          console.warn('BeforeErrorBound:', error, lineNumber, columnNumber, componentName);
        }),
      },
    });
    ```

    *   **`dsn`:**  Your Sentry DSN (Data Source Name).  This is your project ID followed by `.sentry.io/`
    *   **`environment`:**  Set the environment name to help differentiate errors in different environments (development, staging, production).
    *   **`initializers`:**  This is an optional section that provides callbacks for error handling.  The `BeforeErrorBound` example demonstrates logging the error details.  This is good practice to capture more information.

2.  **Handle Errors (Optional but Recommended):** Implement a global error boundary or specific error handlers to capture errors effectively.  The example above in the `initializers` section shows a simple example.

**Step 3: Configure Sentry in your Express Backend**

1.  **Install Sentry Node.js SDK:**

    ```bash
    npm install @sentry/node
    # or
    yarn add @sentry/node
    ```

2.  **Initialize the Sentry SDK in your Express App:**  Within your Express application, initialize the Sentry SDK.  This is typically done in your main server file (e.g., `server.js` or `app.js`).

    ```javascript
    const express = require('express');
    const app = express();
    const Sentry = require('@sentry/node');

    // Replace with your Sentry project ID
    const SENTRY_PROJECT_ID = 'YOUR_SENTRY_PROJECT_ID';

    // Enable Sentry
    Sentry.init({
      dsn: `https://${SENTRY_PROJECT_ID}.sentry.io/`,
      // Optionally, set environment name
