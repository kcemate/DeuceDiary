# Write a Sentry error tracking setup guide for Expo React Nat
Agent: riley
Generated: 2026-03-02T22:21:25.412534

## Sentry Error Tracking Setup Guide for Expo React Native + Express.js

This guide will walk you through setting up Sentry error tracking for your Expo React Native app and your accompanying Express.js backend. We'll cover installation, configuration, source maps, release tracking, and alert rules.

**Prerequisites:**

*   An Sentry account (free tier is sufficient for most projects)
*   Node.js and npm/yarn installed
*   Expo CLI installed and configured

**1. Sentry Setup (Backend - Express.js)**

*   **Create a Sentry Project:**
    *   Log into your Sentry account.
    *   Click "Create project" and follow the prompts. Choose "Single app" and give your project a descriptive name.
    *   Note down the **Sentry SDK Key** (also called "Publish Key") – you'll need this later.

*   **Install the Sentry Node.js SDK:**
    ```bash
    npm install @sentry/node
    # or
    yarn add @sentry/node
    ```

*   **Configure the Sentry SDK:**
    Create a file (e.g., `sentry.js`) in your Express.js project to configure the SDK.
    ```javascript
    const Sentry = require('@sentry/node');

    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN', // Replace with your DSN
      // Optional: Set integrations
      integrations: [
        {
          level: 'info',
          className: 'YourClassName', //  Useful for specific error reporting
          // ... other integrations
        }
      ],
    });

    // Example middleware to log requests
    app.use((req, res, next) => {
      Sentry.captureMessage('Request Received', {
        level: 'info',
        extra: {
          requestUrl: req.url,
          method: req.method,
          headers: req.headers,
        },
      });
      next();
    });

    // Add your other Express.js middleware here
    ```

*   **Generate the DSN:**
    *   Navigate to your Sentry project dashboard.
    *   Under "Projects" -> "Configuration", you'll find a "DSN" (Data Source Name).  This is a URL you'll use in your `sentry.js` file.  It contains your project key and other configuration.  It typically looks like this: `https://YOUR_SENTRY_PROJECT_ID.sentryplus.io/`  (Replace `YOUR_SENTRY_PROJECT_ID` with your actual project ID).

*   **Test the setup:**  Introduce a dummy error into your Express.js app (e.g., a division by zero) to verify that errors are being captured in Sentry.

**2. Sentry Setup (Frontend - Expo React Native)**

*   **Install the Sentry SDK:**
    ```bash
    expo install @sentry/react-native
    ```

*   **Configure the Sentry SDK:**  Add the following code to your root app file (e.g., `App.js` or `App.tsx`):

    ```javascript
    import Sentry from '@sentry/react-native';

    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN', // Replace with your DSN
      // Optionally, customize the SDK:
      //  traceset: 'MyTraceset', // For tracing specific flows
      //  sample: 0.5, //  Sample 50% of errors
    });
