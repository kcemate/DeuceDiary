# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-04T14:46:23.160721

## Sentry Setup Guide for Expo React Native + Express

This guide walks you through setting up Sentry for your Expo React Native app and your Express backend, providing robust error tracking and performance monitoring.

**Prerequisites:**

*   **Sentry Account:**  You'll need a Sentry account. Sign up at [https://sentry.io/](https://sentry.io/).
*   **Expo CLI:** Make sure you have Expo CLI installed globally: `npm install -g expo-cli`
*   **Node.js & npm/yarn:** Ensure you have Node.js and a package manager (npm or yarn) installed.

**1. Sentry Project Setup:**

1.  **Create a Sentry Project:** In your Sentry dashboard, create a new project for your application. Give it a meaningful name (e.g., "MyAwesomeApp").
2.  **Install Sentry SDK for React Native:**
    *   Navigate to your Expo project directory in your terminal.
    *   Install the Sentry SDK: `npm install @sentry/react-native` or `yarn add @sentry/react-native`
3.  **Configure Sentry:**
    *   Create a `.sentry/sentry.properties` file in the root of your Expo project.  This file contains your Sentry project details.  Replace `YOUR_SENTRY_DSN` with the DSN (Data Source Name) provided by Sentry. You can find this on your project dashboard after creating it.
    *   Example `.sentry/sentry.properties`:
        ```properties
        environment=development
        release=1.0.0
        app=MyAwesomeApp  # Your app name
        key=YOUR_SENTRY_DSN
        ```
    *   **Important:**  Replace `YOUR_SENTRY_DSN` with your actual Sentry DSN.  The `key` should *never* be committed to your repository.  This is sensitive information.

**2. Integrating Sentry into Your Expo React Native App:**

1.  **Import Sentry:**  Import `Sentry` in your app's entry point (usually `App.js` or `index.js`).
2.  **Initialize Sentry:**  Initialize Sentry within the `App` component or a suitable top-level component.

    ```javascript
    import { Sentry } from 'sentry-react-native';

    import React from 'react';
    import { AppRegistry } from 'react-native';
    import App from './App'; // Your main app component

    // Replace with your project ID
    const PROJECT_ID = 'YOUR_SENTRY_PROJECT_ID'; 

    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN', // Use the DSN from your .sentry/sentry.properties file
      // Optionally, set an app version
      release: '1.0.0',
      // Optionally, track JavaScript exceptions (recommended)
      enableJavaScriptMessaging: true,
    });

    AppRegistry.registerComponent('MyAwesomeApp', () => App);
    ```

    *   **`YOUR_SENTRY_PROJECT_ID`:**  This is the Project ID from your Sentry project dashboard.  This is *not* the DSN.
    *   **`YOUR_SENTRY_DSN`:**  This is the Data Source Name (DSN) you configured in the `.sentry/sentry.properties` file.

**3. Sentry Setup for Your Express Backend:**

1.  **Install Sentry SDK for Node.js:**
    *   Navigate to your Express backend project
