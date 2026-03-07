# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-04T12:03:25.313128

## Sentry Setup Guide for Expo React Native + Express

This guide outlines how to integrate Sentry into your Expo React Native application and your accompanying Express API.  It covers installation, configuration, and basic monitoring.

**Prerequisites:**

*   **Expo SDK:**  Ensure you're using a recent Expo SDK version (currently 48+ is recommended).
*   **Node.js and npm/yarn:**  You'll need Node.js and a package manager.
*   **Sentry Account:** Create a free Sentry account at [https://sentry.io/](https://sentry.io/).

**1. Install Sentry Packages:**

First, install the necessary packages in both your React Native and Express projects.

*   **React Native (Expo App):**

    ```bash
    npx expo install @sentry/react-native
    ```

*   **Express API:**

    ```bash
    npm install @sentry/node
    # or
    yarn add @sentry/node
    ```

**2. Configure Sentry in React Native (Expo App):**

1.  **Create a Sentry Client:**  In your main app file (e.g., `App.js` or `index.js`), create a Sentry client instance.

    ```javascript
    import Sentry from '@sentry/react-native';

    // Enable Sentry
    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
      // Example DSN: 'https://YOUR_APP_ID.sentry.io/yourorg/'
    });

    export default App;
    ```

    *   **`YOUR_SENTRY_DSN`**: This is your Sentry DSN (Data Source Name). You'll find this in your Sentry dashboard after creating a project. The DSN includes your organization, project, and usually the SDK key.
    *   **`APP_ID`**:  Sentry automatically generates an `APP_ID` when you create a project.  You can also find it in your Sentry dashboard.  Using the `APP_ID` is generally preferred for better organization and automatic updates.

2.  **Handle Errors (Optional but Recommended):** Implement a basic error handling strategy.  While Sentry will automatically capture uncaught errors, you can enhance the experience by:

    *   **Wrapping your application with a catch-all:**  This ensures Sentry captures any errors that slip through.

        ```javascript
        import React, { AppRegistry } from 'react';
        import App from './App';
        import { name as appName } from './app.json';

        function main() {
          return (
            <App 
              refId="app" // Use a unique refId for tracing
              appId="YOUR_SENTRY_APP_ID"  // Replace with your Sentry APP_ID
            />
          );
        }

        AppRegistry.registerComponent(appName, main);
        ```

    *   **Handle errors within your components:**  Use `try...catch` blocks to gracefully handle errors and log them to Sentry.

        ```javascript
        import React from 'react';

        const MyComponent = () => {
          try {
            // Code that might throw an error
            const result = 1 / 0;
            console.log('Result:', result);
          } catch (error) {
            Sentry.captureException(error, {
              extra: {
                componentName: 'MyComponent',
                message: error.message,
                stackTrace: error.stack,
