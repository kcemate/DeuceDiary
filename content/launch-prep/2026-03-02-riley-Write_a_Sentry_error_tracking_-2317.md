# Write a Sentry error tracking setup guide for Expo React Nat
Agent: riley
Generated: 2026-03-02T23:17:08.531417

## Sentry Error Tracking Setup Guide for Expo React Native + Express.js

This guide outlines how to set up Sentry error tracking for your Expo React Native application integrated with an Express.js backend. We'll cover installation, configuration, source maps, release tracking, and alert rules.

**Prerequisites:**

*   **Sentry Account:** You need a Sentry account. Sign up at [https://sentry.io/](https://sentry.io/)
*   **Node.js & npm/Yarn:** Ensure you have Node.js and a package manager (npm or Yarn) installed.
*   **Expo CLI:** Make sure you have the Expo CLI installed globally: `npm install -g expo-cli`

**1. Installation:**

*   **React Native (Expo):** Install the Sentry SDK for React Native using npm or Yarn:

    ```bash
    npm install sentry-expo
    # or
    yarn add sentry-expo
    ```

*   **Express.js (Backend):** Install the Sentry SDK for Node.js using npm or Yarn:

    ```bash
    npm install sentry
    # or
    yarn add sentry
    ```

**2. Configuration:**

*   **Create a Sentry Project:** In your Sentry dashboard, create a new project.  Give it a descriptive name.
*   **Get Your Sentry SDK Key:** In the Sentry dashboard, you’ll find your SDK key (also called "Write Key").  This is crucial for connecting your app to Sentry.
*   **React Native (Expo) Configuration:**

    1.  **Create an `sentry.expo.js` file:**  In your Expo project's root directory, create a file named `sentry.expo.js`. This will be your entry point for Sentry.

    2.  **Add the following code:**

        ```javascript
        import Sentry from 'sentry-expo';
        import * as RNBackgroundFetch from 'react-native-background-fetch'; // Import for background tasks

        Sentry.init({
          dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
          enableSourceMaps: true, // Important for debugging
          // Example of custom events
          // beforeErrorTracked: (error, context) => {
          //   console.log("Custom error handling:", error, context);
          //   return error;
          // }
        });

        // Optional: Handle background fetch errors (if applicable)
        RNBackgroundFetch.finish(-1); // Simulate an error
        ```

    3.  **Replace `YOUR_SENTRY_DSN`:** Replace this placeholder with your actual Sentry DSN.  The DSN (Data Source Name) looks like this: `https://YOUR_APP_ID.sentry.io/` (You can find your App ID in the Sentry dashboard).

    4.  **Integrate into your App:** Import `sentry.expo.js` into your main app file (e.g., `App.js`):

        ```javascript
        import 'react-native-gesture-handler';
        import { AppRegistry } from 'react-native';
        import App from './App';
        import './sentry.expo.js'; // Import Sentry configuration

        AppRegistry.registerComponent('MyApp', () => App);
        ```

*   **Express.js (Backend) Configuration:**

    1.  **Import the Sentry SDK:** Import the Sentry SDK into your Express.js application:

        ```javascript
        const Sentry = require('sentry');

        Sentry
