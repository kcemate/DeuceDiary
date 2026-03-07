# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T15:17:31.414939

## Sentry Setup Guide for Expo React Native + Express

This guide walks you through setting up Sentry for your Expo React Native app and your corresponding Express backend. It covers installing the necessary packages, configuring Sentry, and integrating it into your application.

**Prerequisites:**

*   **Expo CLI:** Ensure you have Expo CLI installed globally: `npm install -g expo-cli`
*   **Node.js & npm/yarn:** You'll need Node.js and a package manager like npm or yarn.
*   **Sentry Account:**  Sign up for a Sentry account at [https://sentry.io/](https://sentry.io/).

**1. Install Sentry Packages:**

You'll need to install Sentry packages for both your React Native app and your Express backend.

**React Native App:**

```bash
npm install @sentry/react-native
# or
yarn add @sentry/react-native
```

**Express Backend:**

```bash
npm install @sentry/node
# or
yarn add @sentry/node
```

**2. Configure Sentry (Web Dashboard):**

*   **Create a New Project:** In your Sentry dashboard, create a new project. Give it a descriptive name (e.g., "MyExpoApp").
*   **SDK Key:**  Sentry will generate a unique SDK key. Copy this key; you'll need it for the React Native configuration.
*   **Install Tracking (Recommended):**  Enable "Install Tracking" in the Sentry dashboard. This automatically tracks when a new user installs your app, which is extremely valuable for analytics.

**3. React Native App Configuration:**

*   **Import Sentry:** Import `Sentry` from `@sentry/react-native` in your root app file (usually `App.js` or `index.js`).
*   **Initialize Sentry:** Initialize Sentry with your SDK key:

    ```javascript
    import Sentry from '@sentry/react-native';

    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN', // Replace with your DSN
      // Optional:  Specify where to send reports (e.g., "prod", "staging", "debug")
      // environment: 'production',
    });
    ```

    **DSN (Data Source Name):**
    *   You can generate your DSN directly from the Sentry dashboard. It typically looks like this: `https://YOUR_SENTRY_PROJECT_ID.sentryplus.io/`
    *   Alternatively, you can manually construct it:  `https://<YOUR_PROJECT_ID>.sentryplus.io/`

*   **Example `App.js`:**

    ```javascript
    import React from 'react';
    import { StyleSheet, View } from 'react-native';
    import Sentry from '@sentry/react-native';

    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN',
      // Optional:  Specify where to send reports (e.g., "prod", "staging", "debug")
      // environment: 'production',
    });

    const App = () => {
      return (
        <View style={styles.container}>
          {/* Your app content here */}
          <Text>Hello, Sentry!</Text>
        </View>
      );
    };

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
    });

    export
