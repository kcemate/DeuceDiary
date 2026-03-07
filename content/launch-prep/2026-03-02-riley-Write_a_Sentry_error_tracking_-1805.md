# Write a Sentry error tracking setup guide for Expo React Nat
Agent: riley
Generated: 2026-03-02T18:05:43.750171

## Sentry Error Tracking Setup Guide for Expo React Native + Express.js

This guide outlines the steps to integrate Sentry error tracking into your Expo React Native and Express.js application, providing valuable insights for debugging and improving your app's stability.

**1. Prerequisites:**

* **Expo CLI:**  Make sure you have the Expo CLI installed: `npm install -g expo-cli`
* **Sentry Account:** You'll need a Sentry account. Sign up at [https://sentry.io/](https://sentry.io/)
* **Node.js & npm/yarn:**  Ensure you have Node.js and a package manager (npm or yarn) installed.

**2. Installation:**

* **React Native (Expo):**  The recommended way to integrate Sentry into an Expo app is using the `@sentry/react-native` package.

  ```bash
  npm install @sentry/react-native
  # or
  yarn add @sentry/react-native
  ```

* **Express.js:** Install the Sentry Node.js SDK.

  ```bash
  npm install @sentry/node
  # or
  yarn add @sentry/node
  ```

**3. Configuration - React Native (Expo):**

* **Create a Sentry Configuration File:** Create a file named `sentry.expo.config.js` (or similar) in your project's root directory.  This file will contain your Sentry configuration.

  ```javascript
  // sentry.expo.config.js
  module.exports = {
    app: {
      projectId: 'YOUR_SENTRY_PROJECT_ID', // Replace with your Sentry Project ID
      sdk: {
        // Optionally customize the SDK here
        // You can set these options from the Sentry dashboard too
        // Example:
        // beforeErrorFromClient(scope, error, severity, custom) {
        //   console.log("Handling error before sending to Sentry:", error);
        //   return error;
        // }
      },
    },
  };
  ```

* **Install Expo CLI Plugin:** Install the Sentry Expo CLI plugin.

   ```bash
   npx expo install -e @sentry/react-native
   ```

* **Initialize Sentry in your React Native App:**  Import the Sentry SDK and initialize it in your root component (typically `App.js`).

   ```javascript
   // App.js
   import React from 'react';
   import { ExpoRoot } from './expo-root'; // Your ExpoRoot component
   import * as Sentry from '@sentry/react-native';

   // Replace with your Sentry Project ID
   Sentry.init({
     dsn: 'YOUR_SENTRY_DSN', //  Your Sentry DSN (Development Sans) - generated on Sentry dashboard
     // Sample Usage of custom configuration
     // beforeErrorFromClient: (scope, error, severity, custom) => {
     //   console.log('Sentry beforeErrorFromClient', error);
     //   return error;
     // },
   });

   export default () => {
     return <ExpoRoot />;
   };
   ```

   **Important:**  Replace `YOUR_SENTRY_PROJECT_ID` and `YOUR_SENTRY_DSN` with the actual values from your Sentry account.  The DSN is a URL generated on the Sentry dashboard.  It typically looks like: `https://YOUR_SENTRY_PROJECT_ID@sentry.io/`

**4. Configuration - Express.js:**

* **Add Sentry
