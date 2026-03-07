# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T09:37:28.874938

## Sentry Setup Guide for Expo React Native + Express

This guide outlines the steps to integrate Sentry into your Expo React Native application and your Express.js backend.  It covers installation, configuration, and some best practices.

**Assumptions:**

*   You have a basic Expo project set up.
*   You have Node.js and npm/yarn installed.
*   You have a Sentry account and API key.

**Steps:**

**1. Install Sentry SDKs:**

You'll need to install the Sentry SDKs for both your React Native client and your Express.js backend.

*   **React Native:**

    ```bash
    npm install @sentry/react-native
    # or
    yarn add @sentry/react-native
    ```

*   **Express.js:**

    ```bash
    npm install @sentry/node
    # or
    yarn add @sentry/node
    ```

**2. Configure Sentry React Native Client:**

*   **Import the SDK:**  Import the Sentry SDK into your main React Native component (e.g., `App.js` or `index.js`).

    ```javascript
    import Sentry from '@sentry/react-native';
    ```

*   **Initialize Sentry:**  Call the `init` function with your Sentry SDK and your Sentry project ID.

    ```javascript
    import React from 'react';
    import { AppRegistry } from 'react-native';
    import App from './App'; // Your main app component
    import Sentry from '@sentry/react-native';

    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
      // Optional:  Include these for enhanced debugging.  Disable in production!
      enableSourceMaps: true, // Helps with stack traces
      trackPerformance: true, // Tracks performance metrics
      //Example of custom action:
      //trackUserInteractions: true // Automatically tracks user interactions (UI actions)
    });

    AppRegistry.registerComponent('MyApp', () => App);
    ```

    **Important:**  Replace `YOUR_SENTRY_DSN` with your actual Sentry DSN (Data Source Name).  Your DSN will look something like: `https://<YOUR_PROJECT_ID>@sentry.io/<YOUR_COMMIT_ID>` or `https://<YOUR_PROJECT_ID>.sentry.io/`

*   **Handling Errors:** This is the most crucial part.  You need to wrap your code in error handling to send events to Sentry.

    ```javascript
    import React, { Component } from 'react';
    import { View, Text, Button } from 'react-native';

    class MyComponent extends Component {
      constructor(props) {
        super(props);
        this.state = {
          error: null
        };
      }

      componentDidCatch(error, info) {
        // Send the error to Sentry
        Sentry.captureException(error, info);

        // Optionally, display a user-friendly error message
        this.setState({ error: 'An error occurred!' });
      }

      render() {
        if (this.state.error) {
          return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text>{this.state.error}</Text>
            </View>
          );
        }

        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
