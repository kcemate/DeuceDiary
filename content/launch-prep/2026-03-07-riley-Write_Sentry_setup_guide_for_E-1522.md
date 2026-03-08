# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-07T15:22:48.766193

## Sentry Setup Guide for Expo React Native + Express

This guide outlines the steps to integrate Sentry with your Expo React Native application and your associated Express backend (if you have one). We'll cover installation, configuration, and testing.

**Prerequisites:**

*   **Node.js & npm/yarn:** Make sure you have Node.js and npm or yarn installed.
*   **Expo CLI:** You should have the Expo CLI installed globally: `npm install -g expo-cli`
*   **Sentry Account:**  You'll need a Sentry account. Sign up at [https://sentry.io/](https://sentry.io/).
*   **Backend (Optional):**  This guide covers both a React Native app *and* a backend, but it's primarily focused on configuring the app.

**Step 1: Create a Sentry Project**

1.  Log in to your Sentry account.
2.  Click "Create project."
3.  Choose "New project" and give it a name (e.g., "MyExpoApp").
4.  Choose "Application" as the project type.
5.  Select "JavaScript" as the SDK.
6.  Click "Create."
7.  **Important:** Copy the **Sentry SDK Key (API Key)** from the Sentry dashboard. You'll need this in your app.

**Step 2: Install Sentry SDK in your Expo React Native App**

1.  Navigate to your React Native project directory in your terminal.
2.  Install the Sentry SDK:

    ```bash
    npm install @sentry/react-native
    # or
    yarn add @sentry/react-native
    ```

**Step 3: Configure Sentry in your React Native App**

1.  **Create a `sentry.init.js` file:**  This file will initialize Sentry.  Create a new file in your project’s root directory (e.g., `sentry.init.js`).
2.  **Import and Initialize Sentry:** Add the following code to `sentry.init.js`:

    ```javascript
    import * as Sentry from '@sentry/react-native';

    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN', // Replace with your DSN (API Key)
      enableSourceMaps: true, // Recommended for easier debugging
      // Optional configuration:
      // performanceMonitoringEnabled: true, // Enable performance monitoring
    });
    ```

    *   Replace `YOUR_SENTRY_DSN` with your actual Sentry DSN. The DSN is composed of:
        *   `auth.token`: Your Sentry SDK Key (API Key)
        *   `project`: Your project slug (e.g., `my-awesome-app`)
        *   `environment`:  The environment (e.g., `development`, `production`)
        *   Example: `https://YOUR_SENTRY_DSN`

    *   `enableSourceMaps: true` is highly recommended for easier debugging.
    *   `performanceMonitoringEnabled: true` enables Sentry’s performance monitoring features.

3.  **Import and Call `sentry.init.js`:**  Import and call `sentry.init.js` in your main App component (e.g., `App.js`).  This ensures Sentry is initialized when your app starts.

    ```javascript
    import React from 'react';
    import { StyleSheet, Text, View } from 'react-native';
    import './sentry.init'; // Import the initialization file

    const App =
