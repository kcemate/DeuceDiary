# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-06T12:22:33.156616

## Sentry Setup Guide for Expo React Native + Express

This guide outlines the steps to integrate Sentry with your Expo React Native app and your associated Express backend. This combination allows you to monitor errors from both client-side and server-side code, providing a comprehensive view of your application's health.

**Prerequisites:**

*   **Sentry Account:** You need a Sentry account. Sign up at [https://sentry.io/](https://sentry.io/).
*   **Expo CLI:** Ensure you have Expo CLI installed globally: `npm install -g expo-cli`
*   **Node.js & npm/yarn:**  Make sure you have Node.js and npm or yarn installed.
*   **Expo Project:** You should have an existing Expo React Native project.

**Steps:**

**1. Install Sentry Packages:**

*   **In your React Native app directory:**

    ```bash
    npm install @sentry/react-native
    # OR
    yarn add @sentry/react-native
    ```

*   **In your Express backend directory:**

    ```bash
    npm install @sentry/node
    # OR
    yarn add @sentry/node
    ```

**2. Configure Sentry in React Native:**

*   **Install the Sentry SDK:**  Import the Sentry SDK and initialize it in your root component (e.g., `App.js`).

    ```javascript
    // App.js
    import Sentry from '@sentry/react-native';

    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
      tracesetMinSamples: 1, // Optional:  Minimum number of traces to collect.
      // Example of custom event name for specific error logging
      // sampleRate: 0.8
    });

    export default App;
    ```

*   **Replace `YOUR_SENTRY_DSN`:**  This is your Sentry DSN (Data Source Name). You can find it in your Sentry dashboard. It looks like: `sentry.io/<your-project-id>/<your-org-id>`  Make sure to include the `sentry.io/` prefix.

*   **Implement Error Handling (Crucial):**  React Native Sentry requires you to wrap your code in a `try...catch` block to capture errors effectively.  However, Sentry handles this automatically when you use the SDK correctly.  The SDK intercepts errors and sends them to Sentry.

    ```javascript
    import React, { Component } from 'react';
    import { View, Text, Button } from 'react-native';

    class App extends Component {
      componentDidCatch(error, info) {
        // This block is called after an error occurs.
        // You can log the error to your console, send it to an analytics service, etc.
        console.error("Caught an error:", error);
        console.log("Error info:", info);
        //Sentry.reportEvent('App Error', error, info); //Optional:  Report specific errors
      }

      render() {
        return (
          <View>
            <Text>Hello, Sentry!</Text>
            <Button
              title="Click Me"
              onPress={() => {
                try {
                  // Simulate an error
                  throw new Error("Something went wrong!");
                } catch (e) {
                  this.componentDidCatch(e, {name: 'App', stackTrace: 'Stack trace from App component'});
                }
              }}
            />
          </View>
