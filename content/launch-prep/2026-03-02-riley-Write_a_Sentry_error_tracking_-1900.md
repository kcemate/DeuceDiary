# Write a Sentry error tracking setup guide for Expo React Nat
Agent: riley
Generated: 2026-03-02T19:00:12.722377

## Sentry Error Tracking Setup Guide for Expo React Native + Express.js

This guide outlines how to integrate Sentry error tracking into your Expo React Native and Express.js application, providing comprehensive tracking and alerting for a robust development and production experience.

**Prerequisites:**

*   **Sentry Account:**  You need an active Sentry account. Sign up at [https://sentry.io/](https://sentry.io/)
*   **Node.js and npm/yarn:** Make sure you have Node.js and a package manager installed.
*   **Expo CLI:** You should have Expo CLI installed and configured.

**1. Installation:**

**a) React Native Expo App:**

*   Navigate to your Expo React Native project directory.
*   Install the `@sentry/react-native` package:

    ```bash
    npm install @sentry/react-native
    # or
    yarn add @sentry/react-native
    ```

**b) Express.js Server:**

*   Install the `@sentry/node` package:

    ```bash
    npm install @sentry/node
    # or
    yarn add @sentry/node
    ```

**2. Configuration:**

**a) React Native Expo App:**

*   **Create a Sentry Configuration File:** Create a file named `sentry.expo.config.js` (or `.ts`) at the root of your project.  This file will contain your Sentry SDK configuration.

    ```javascript
    // sentry.expo.config.js
    module.exports = {
      app: {
        ios: {
          dev: {
            bundleId: 'com.yourcompany.yourapp', // Replace with your app's bundle ID
          },
          prod: {
            bundleId: 'com.yourcompany.yourapp', // Replace with your app's bundle ID
          },
        },
        android: {
          dev: {
            package: 'com.yourcompany.yourapp', // Replace with your app's package name
          },
          prod: {
            package: 'com.yourcompany.yourapp', // Replace with your app's package name
          },
        },
      },
      expo: {
        name: "YourAppName", // Replace with your app's name
        slug: "your-app-slug", // Replace with your app's slug
        extra: {
          SENTRY_RELEASE: 'v1.0.0', // Initial release version (important for tracking)
          SENTRY_ENVIRONMENT: 'production', // Or 'development'
          SENTRY_AUTH_TOKEN: 'YOUR_SENTRY_AUTH_TOKEN', // Replace with your Sentry Auth Token
        },
      },
    };
    ```

    **Important:**
    *   Replace placeholders like `com.yourcompany.yourapp`, `YourAppName`, `your-app-slug` with your actual values.
    *   **`SENTRY_AUTH_TOKEN`:**  This is your Sentry Auth Token, found in your Sentry dashboard under Team Settings > API Keys.  **Never commit this token to your repository.** Use environment variables (as shown) to manage it securely.

*   **Import and Initialize Sentry:** Import the Sentry SDK in your main App component and initialize it.

    ```javascript
    // App.js
    import * as Sentry from '@sentry/react-native';
    import { AppRegistry } from 'react-native';
    import AppNavigator from './navigation/AppNavigator';

    Sentry.init({
      dsn: 'YOUR_SENTRY_
