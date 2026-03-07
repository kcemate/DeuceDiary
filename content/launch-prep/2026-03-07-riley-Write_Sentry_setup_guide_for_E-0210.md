# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-07T02:10:44.210374

## Sentry Setup Guide for Expo React Native + Express

This guide outlines how to integrate Sentry into your Expo React Native app and your Express backend, providing comprehensive error tracking and monitoring.

**Prerequisites:**

*   **Sentry Account:** You'll need a Sentry account. Sign up at [https://sentry.io/](https://sentry.io/).
*   **Expo CLI:** Make sure you have Expo CLI installed globally: `npm install -g expo-cli`
*   **Node.js & npm:**  You'll need Node.js and npm installed on your system.

**1. Install Sentry Packages:**

First, install the necessary Sentry packages for both your React Native app and your Express backend:

**React Native (Expo App):**

```bash
npm install @sentry/react-native
```

**Express Backend:**

```bash
npm install @sentry/node
```

**2. Configure Sentry in Your React Native Expo App:**

*   **Create a Sentry Client:** In your main app file (e.g., `App.js` or `App.tsx`), create a Sentry client.

    ```javascript
    import * as Sentry from '@sentry/react-native';

    // Initialize Sentry
    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
      // Optional settings
      // autoSetTTL: 10, // Automatically set transaction TTL to 10s
      // enableSourceMaps: true, // Enable source maps for better error reports
    });

    export default App;
    ```

*   **Replace `YOUR_SENTRY_DSN`:**  Get your DSN (Data Source Name) from your Sentry dashboard. It looks something like:  `sentry.io/YOUR_PROJECT_ID/`

*   **Manual Initialization (Recommended):**  While the above example shows initialization in `App.js`, it's generally recommended to use Sentry's `setUpNativeErrorReporting` or `setUpNativeCrashReporting` as these are more reliable for Expo apps, especially when dealing with dynamic linking.  The following example shows the preferred method for dynamic linking.

    ```javascript
    import * as Sentry from '@sentry/react-native';

    // Install the Sentry SDK
    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
      // Optional settings
    });

    // Setup native crash reporting for dynamic linking
    Sentry.setUpNativeCrashReporting({
      //Optional configuration
      //sampleRate: 0.8, //Optional
    });
    ```

*   **Handling Errors:**  Implement error handling in your React Native components to capture and send errors to Sentry:

    ```javascript
    import React, { useState } from 'react';
    import { Button } from 'react-native';

    const MyComponent = () => {
      const [count, setCount] = useState(0);

      const handlePress = () => {
        try {
          // Simulate an error
          throw new Error('Something went wrong!');
        } catch (error) {
          console.error(error);
          Sentry.captureException(error, {
            level: Sentry.Severity.Error,
            extra: {
              message: error.message,
              stackTrace: error.stackTrace,
            },
          });
        }
      };

      return (
        <Button title="Trigger Error" onPress={handlePress} />
      );
    };

    export
