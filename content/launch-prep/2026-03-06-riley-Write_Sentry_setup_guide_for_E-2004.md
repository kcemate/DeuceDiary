# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-06T20:04:05.270473

## Sentry Setup Guide for Expo React Native + Express

This guide outlines how to integrate Sentry with your Expo React Native app and your Express backend.  It covers installation, configuration, and basic monitoring.

**Prerequisites:**

*   **Expo CLI:**  Make sure you have Expo CLI installed globally (`npm install -g expo-cli`).
*   **Node.js & npm/yarn:**  Ensure you have Node.js and npm or yarn installed.
*   **Sentry Account:** You'll need a Sentry account. Sign up at [https://sentry.io/](https://sentry.io/).

**Steps:**

**1. Install Sentry Packages:**

*   **React Native:**
    ```bash
    npm install @sentry/react-native
    # or
    yarn add @sentry/react-native
    ```

*   **Express (Backend):**
    ```bash
    npm install @sentry/node
    # or
    yarn add @sentry/node
    ```

**2.  Configure Sentry React Native App:**

*   **Create a Sentry SDK:**  In your Expo React Native project, create a Sentry SDK object.  It's good practice to do this in a separate file, like `sentry.js` or `sentryConfig.js`.

    ```javascript
    import * as Sentry from '@sentry/react-native';

    // Enable automatic context extension (recommended)
    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
      // Performance monitoring (optional)
      performanceTracing: true,
      // Integrations (optional)
      // integrations: [new Sentry.Integrations.Browser()],
      // Enable automatic context extension (recommended)
      allowDebug: true, //  Enable for easier debugging (remove for production)
    });
    ```

    *   **`YOUR_SENTRY_DSN`:** Replace this with your actual Sentry DSN. You can find it on your Sentry dashboard after creating an organization. The DSN (Data Source Name) is the key to connecting your app to Sentry.
    *   **`performanceTracing: true`:**  Enables performance monitoring, which is highly recommended for identifying slow components.
    *   **`allowDebug: true`:** This is *optional* but helpful during development.  It allows Sentry to send more detailed logs when you encounter errors in your development environment.  **Remove this in production** to minimize logs and potential security concerns.
    *   **Integrations:** Sentry offers various integrations for different environments.  Consider using integrations for Browser, iOS, Android, or specific services.

*   **Import and Use the SDK:**  Import the `Sentry` object in your main app component (e.g., `App.js`) and call `Sentry.init()`:

    ```javascript
    import React from 'react';
    import { StyleSheet, View } from 'react-native';
    import Sentry from './sentryConfig'; // Import your Sentry SDK

    const App = () => {
      return (
        <View style={styles.container}>
          {/* Your app content */}
        </View>
      );
    };

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
      },
    });

    export default App;
    ```

*   **Sentry Autoscroll (Recommended):**  Sentry Autoscroll automatically scrolls the screen to the top of the view where an error occurred. This makes it
