# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T14:09:27.468717

## Sentry Setup Guide for Expo React Native + Express

This guide walks you through setting up Sentry for your Expo React Native app and your Express backend, providing valuable error tracking and performance monitoring.

**Prerequisites:**

*   A Sentry account (Sign up at [https://sentry.io/](https://sentry.io/))
*   Expo CLI installed (`npm install -g expo-cli`)
*   Node.js and npm/yarn installed

**Step 1: Create a Sentry Project**

1.  Log in to your Sentry account.
2.  Click on "Create project".
3.  Choose "New project" and give it a name (e.g., "Expo App").
4.  Select "Web" as the application type (even though it's a mobile app, it's the standard Sentry configuration).
5.  Provide your project URL (this will be your app's URL).  You can update this later.
6.  Click "Create project".
7.  You'll be presented with a **Sentry SDK Key** (often called "Publish Key").  **Copy this key.** You'll need it in the next steps.

**Step 2: Install Sentry SDK for React Native**

1.  Navigate to your Expo React Native project directory in your terminal.
2.  Install the Sentry SDK:

    ```bash
    npm install @sentry/react-native
    # or
    yarn add @sentry/react-native
    ```

**Step 3: Configure Sentry in Your React Native App**

1.  **Create a `sentry.init` function:**  Create a new file (e.g., `sentry.js`) in the root of your project. This is where you'll initialize Sentry.

    ```javascript
    // sentry.js
    import * as Sentry from '@sentry/react-native';

    export const initSentry = (publicKey) => {
      Sentry.init({
        dsn: publicKey, // Replace with your Sentry DSN key
        // Optional settings:
        // ignoreErrorTypes: [ 'TypeError' ], // Ignore specific error types
        // trackPerformance: true, // Enable performance tracking
      });
    };
    ```

2.  **Initialize Sentry in your App component:** Import `initSentry` and call it in your main App component (e.g., `App.js`).

    ```javascript
    // App.js
    import React from 'react';
    import { View } from 'react-native';
    import { initSentry } from './sentry';

    const App = () => {
      // Replace 'YOUR_SENTRY_PUBLIC_KEY' with your actual Sentry key
      initSentry('YOUR_SENTRY_PUBLIC_KEY');

      return (
        <View>
          {/* Your App Content */}
        </View>
      );
    };

    export default App;
    ```

    **Important:**  Replace `'YOUR_SENTRY_PUBLIC_KEY'` with the actual Sentry DSN key you copied in Step 1.

3.  **Restart your Expo app:**  To ensure the initialization is working, restart your Expo app.  You can do this using the Expo Dev Tools or by stopping and starting the app from your emulator/simulator or device.

**Step 4: Install and Configure Sentry for Your Express Backend**

1.  **Install the Sentry SDK for Node.js:**

    ```bash
    npm install @sentry/node
    # or
    yarn add @sentry/
