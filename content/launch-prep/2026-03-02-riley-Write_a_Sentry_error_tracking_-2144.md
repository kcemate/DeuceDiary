# Write a Sentry error tracking setup guide for Expo React Nat
Agent: riley
Generated: 2026-03-02T21:44:24.002650

## Sentry Error Tracking Setup Guide for Expo React Native + Express.js

This guide outlines how to integrate Sentry error tracking into your Expo React Native application and your accompanying Express.js backend.  It covers installation, configuration, source maps, release tracking, and alert rules.

**Prerequisites:**

*   An active Sentry account. Sign up at [https://sentry.io/](https://sentry.io/)
*   Node.js and npm (or yarn) installed.

**1. Installation**

* **React Native Expo:**
    * Install the Sentry SDK for React Native:
        ```bash
        npm install @sentry/react-native
        # or
        yarn add @sentry/react-native
        ```

* **Express.js:**
    * Install the Sentry SDK for Node.js:
        ```bash
        npm install @sentry/node
        # or
        yarn add @sentry/node
        ```

**2. Configuration**

* **Sentry DSN (Data Source Name):**  This is your unique identifier for your Sentry project. You can find it on your Sentry dashboard after creating a project.  It typically looks like `https://xxxxxxxx.sendry.io/1234567890abcdef`.

* **React Native Configuration:**
    * **`sentry/config/ReactNativeConfig.js`:** Create a file in your Expo project's `src` directory (e.g., `src/sentry`) to hold your React Native Sentry configuration:

    ```javascript
    import * as Sentry from '@sentry/react-native';

    // Project information
    const SENTRY_PROJECT_ID = 'YOUR_SENTRY_PROJECT_ID'; // Replace with your Sentry project ID

    export default {
      project: SENTRY_PROJECT_ID,
      // Optionally include a user identifier
      // user: (userId) => userId,  // Example:  User ID from auth
      environment: 'development', // Or 'production'
      enableFlashEventTracking: true, // Enable tracking all UI events (consider performance)
      // Additional configuration options can be found here:
      // https://docs.sentry.io/platforms/react-native/guides/quickstart/
    };
    ```

* **Express.js Configuration:**
    * **`src/sentry/config/NodeConfig.js`:** Create a similar file for your Express.js application:

    ```javascript
    import * as Sentry from '@sentry/node';

    // Project information
    const SENTRY_PROJECT_ID = 'YOUR_SENTRY_PROJECT_ID'; // Replace with your Sentry project ID

    export default {
      project: Sentry.default.init({
        dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
        tracesSampleRate: 1.0, // Track 100% of traces
        // Optionally include a user identifier
        // before(resolve, reject) { resolve({ user: 'user_id' }); } // Example:  User ID from auth
        // Add more options from https://docs.sentry.io/reference/javascript/config/
      }),
    };
    ```

**3. Integrating Sentry into React Native**

* **Initialize Sentry:**  In your main `App.js` or root component, initialize Sentry.

   ```javascript
   import React from 'react';
   import { AppNavigator } from './navigation'; // Your navigation
   import { Sentry } from '@sentry/react-native';
