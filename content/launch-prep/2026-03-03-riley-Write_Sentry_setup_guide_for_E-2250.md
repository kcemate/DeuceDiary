# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T22:50:18.523256

## Sentry Setup Guide for Expo React Native + Express

This guide outlines the steps to integrate Sentry into your Expo React Native project and your accompanying Express backend. It covers installation, configuration, and common troubleshooting.

**Prerequisites:**

*   **Expo CLI:**  Make sure you have Expo CLI installed and are using a managed workflow.
*   **Sentry Account:** You need a Sentry account. Sign up at [https://sentry.io/](https://sentry.io/).
*   **Node.js & npm/yarn:** Have Node.js and your preferred package manager (npm or yarn) installed.

**Steps:**

**1. Install Sentry Packages:**

*   **React Native:**
    ```bash
    npm install @sentry/react-native
    # OR
    yarn add @sentry/react-native
    ```

*   **Express (Backend):**
    ```bash
    npm install @sentry/node
    # OR
    yarn add @sentry/node
    ```

**2. Configure Sentry in Expo React Native:**

*   **Create Sentry SDK:** Inside your Expo project directory, create a file (e.g., `sentry.js`) and import the Sentry SDK:

    ```javascript
    import * as Sentry from '@sentry/react-native';

    // Optional: Enable auto-initialization
    Sentry.init({
      // Project ID (obtained from your Sentry dashboard)
      dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
      // Set tracking type to 'performance' if you only want to track performance data
      // trackingLevel: Sentry.Levels.INFO, // Adjust as needed (DEBUG, INFO, WARN, ERROR, CRITICAL)
    });
    ```

    *   **`YOUR_SENTRY_DSN`:**  Replace this placeholder with your actual Sentry DSN. You can find this in your Sentry dashboard under "Projects" -> [Your Project Name] -> "Add Sentry to your app" (usually a long string starting with `https://`).  A DSN (Data Source Name) includes your project ID and API key.

*   **Initialize Sentry Automatically (Recommended):**  The `Sentry.init()` call above will automatically initialize Sentry when your app starts. This is generally the easiest approach. If you don't do this, you'll need to manually initialize Sentry in your `App.js` or your root component.

*   **Example Integration in App.js:**

    ```javascript
    import React from 'react';
    import { SafeAreaView, Text } from 'react-native';
    import { Sentry } from '@sentry/react-native';

    // Configure Sentry
    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN',
    });

    const App = () => {
      return (
        <SafeAreaView>
          <Text>My Expo App</Text>
        </SafeAreaView>
      );
    };

    export default App;
    ```

**3. Configure Sentry in Your Express Backend:**

*   **Create Sentry SDK:** Similar to the React Native setup, create a file (e.g., `sentry.js`) in your Express project.

    ```javascript
    const Sentry = require('@sentry/node');

    // Set the Project ID (same as in your React Native project)
    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
      // Optionally set a tracking level
