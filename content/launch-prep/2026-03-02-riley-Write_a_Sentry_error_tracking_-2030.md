# Write a Sentry error tracking setup guide for Expo React Nat
Agent: riley
Generated: 2026-03-02T20:30:52.689160

## Sentry Error Tracking Setup Guide for Expo React Native + Express.js

This guide provides a comprehensive setup for integrating Sentry error tracking into your Expo React Native and Express.js application.  We'll cover installation, configuration, source maps, release tracking, and alert rules.

**Prerequisites:**

*   **Sentry Account:** You'll need a Sentry account. Sign up at [https://sentry.io/](https://sentry.io/).
*   **Node.js & npm/yarn:** Ensure you have Node.js and a package manager (npm or yarn) installed.
*   **Expo CLI:**  Make sure you have the Expo CLI installed globally: `npm install -g expo-cli`

**1. Installation:**

**React Native (Expo):**

*   **Install `sentry-expo`:**
    ```bash
    npm install sentry-expo --save
    # or
    yarn add sentry-expo
    ```

**Express.js (Backend):**

*   **Install `sentry`:**
    ```bash
    npm install sentry --save
    # or
    yarn add sentry
    ```

**2. Configuration (React Native - Expo):**

*   **Create a Sentry SDK:**  In your Expo project, create a Sentry SDK using `sentry-expo`:

    ```javascript
    import Sentry from 'sentry-expo';

    const SentrySDK = Sentry.defaultClient;

    // Configure Sentry SDK (customize as needed)
    SentrySDK.setReleaseStatus('production', '1.0.0'); // Replace with your release name and version
    SentrySDK.setTag('environment', 'production'); // Set the environment
    SentrySDK.setFixProject('YOUR_PROJECT_ID'); // Replace with your Sentry project ID
    // You can also set additional tags and categories here.

    // Initialisation -  Ideally, this should happen *after* your app has mounted.
    //  For Expo, you might want to initialize it during app startup.
    export default SentrySDK;
    ```
    *   **Important:**  Replace `YOUR_PROJECT_ID` with your actual Sentry project ID.  You can find this in your Sentry dashboard.
    *   **Best Practice:**  Initialize the Sentry SDK as soon as possible after your app mounts to capture errors early.

*   **Integrate into your App:** Import and initialize the Sentry SDK in your app's entry point (e.g., `App.js`):

    ```javascript
    import React from 'react';
    import { StyleSheet, View } from 'react-native';
    import SentrySDK from './SentrySDK'; // Import your SentrySDK

    export default function App() {
      SentrySDK.init({
        // Your Sentry SDK configuration options
        // You can also pass an option object directly here.
      });

      return (
        <View style={styles.container}>
          {/* Your App Content */}
        </View>
      );
    }

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
      },
    });
    ```

**3. Configuration (Express.js - Backend):**

*   **Install `sentry`:** (already done in installation step)

*   **Initialize Sentry:**  In your Express.js application, initialize the Sentry SDK.  This is crucial for capturing errors from your API endpoints.

    ```javascript
    const Sentry = require('sentry');

    Sentry
