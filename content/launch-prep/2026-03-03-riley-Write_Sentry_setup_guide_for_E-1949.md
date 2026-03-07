# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T19:49:03.602945

## Sentry Setup Guide for Expo React Native + Express

This guide outlines how to integrate Sentry into your Expo React Native project with an accompanying Express backend. It covers installing dependencies, configuring Sentry SDK, and handling errors in both your React Native and Express applications.

**Prerequisites:**

*   You have a React Native project set up with Expo.
*   You have an Express backend set up.
*   You have a Sentry account and project created.  Note the **Sentry DSN (Data Source Name)** and **Project API Key**.

**Steps:**

**1.  Install Sentry Dependencies:**

*   **React Native:**
    ```bash
    npx expo install @sentry/react-native
    ```

*   **Express (Backend):**
    ```bash
    npm install @sentry/node
    ```

**2.  Configure Sentry in React Native:**

*   **Create a Sentry Configuration File (Optional but Recommended):**
    Create a file, for example, `sentry.config.js`, in your React Native project's root directory.  This helps you centralize your configuration and makes it easier to manage.

    ```javascript
    // sentry.config.js
    import * as Sentry from '@sentry/react-native';

    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
      // Optional:  Specify environment
      environment: 'development',
      // Optional: Auto track events
      // autoTrackUser: true,
      // Optional:  Ignore specific errors.  This is helpful for suppressing common errors
      // ignoreErrorTypes: ['TypeError', 'ReferenceError'],
    });
    ```

*   **Initialize Sentry in your App Component:**
    Import the Sentry SDK and call `Sentry.init()` in your main `App.js` or your root component.

    ```javascript
    // App.js
    import React from 'react';
    import { AppNavigator } from './navigation'; // Assuming you have navigation
    import { Sentry } from '@sentry/react-native';

    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
      // Optional:  Specify environment
      environment: 'development',
    });

    export default function App() {
      return (
        <AppNavigator />
      );
    }
    ```

*   **Handle Errors:**
    Sentry automatically captures unhandled errors, but it's good practice to explicitly handle and report errors.

    ```javascript
    import React, { useState } from 'react';
    import { Button, Text } from 'expo';

    const MyComponent = () => {
      const [count, setCount] = useState(0);

      const handleClick = () => {
        try {
          // Simulate an error
          throw new Error("Something went wrong!");
        } catch (error) {
          console.error("Error:", error);
          Sentry.captureException(error, {
            level: Sentry.Severity.Error,
            extra: { //Add any additional context here
              message: error.message,
              stackTrace: error.stackTrace,
              count,
            },
          });
        }
      };

      return (
        <Button title="Click Me" onPress={handleClick} />
      );
    };

    export default MyComponent;
    ```

    **Explanation:**

    *   `Sentry.captureException(error, options)`:  This function sends the error to S
