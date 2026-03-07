# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-06T13:50:40.485482

## Sentry Setup Guide for Expo React Native + Express

This guide outlines the steps for integrating Sentry into your Expo React Native app and your Express backend, providing comprehensive error tracking and alerting.

**Prerequisites:**

*   **Sentry Account:** You'll need a Sentry account. Sign up at [https://sentry.io/](https://sentry.io/).
*   **Expo Project:**  You should have an existing Expo React Native project.
*   **Node.js & npm/yarn:** Make sure you have Node.js and npm or yarn installed.
*   **Expo CLI:** Ensure you're using the latest version of Expo CLI: `npm install -g expo-cli` or `yarn global add expo-cli`

**Steps:**

**1. Install Sentry Packages:**

*   **React Native (Expo):**
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

**2. Configure Sentry in Expo React Native App:**

*   **Create a Sentry Initial Screen:** In your main `App.js` or your root component, import and initialize the Sentry SDK:

    ```javascript
    import { Sentry } from 'react-native-sentry';

    // Replace with your Sentry project ID
    const SENTRY_PROJECT_ID = 'YOUR_SENTRY_PROJECT_ID';

    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN',
      // Optional: Set sample rate
      // sampleRate: 0.1,
      // Optional:  Custom error mappings
      // trackUserActions: true,  // Enable user tracking
    });
    ```

*   **Get Your Sentry DSN:**

    *   Log in to your Sentry account.
    *   Go to "Add Project" -> "New Project."
    *   You'll be provided with a DSN (Data Source Name), which looks like this:  `https://YOUR_PROJECT_ID.sentry.io/`
    *   Copy the entire DSN string.

*   **Replace Placeholders:** Replace `YOUR_SENTRY_PROJECT_ID` and `YOUR_SENTRY_DSN` with your actual Sentry Project ID and DSN.

*   **Basic Error Handling (Recommended):**
    Sentry automatically captures most errors you throw in your React Native components. However, it's good practice to wrap your code with try...catch blocks:

    ```javascript
    try {
      // Your code that might throw an error
      console.log('Doing something...');
    } catch (error) {
      Sentry.captureException(error, {
        extra: {
          // Add any relevant extra information about the error
          componentName: error.componentName || 'Unknown',
          stackTrace: error.stackTrace,
        },
      });
    }
    ```

**3. Configure Sentry in Express Backend:**

*   **Import Sentry:** In your Express application, import the `@sentry/node` module:

    ```javascript
    const Sentry = require('@sentry/node');
    ```

*   **Set Up Sentry SDK:**  Initialize the Sentry SDK in your Express application, typically at the top of your main application file.

    ```javascript
    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN',
      //
