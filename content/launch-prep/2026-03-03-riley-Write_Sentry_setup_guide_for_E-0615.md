# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T06:15:15.004022

## Sentry Setup Guide for Expo React Native + Express

This guide outlines the steps to integrate Sentry into your Expo React Native app and your Express backend for robust error tracking and monitoring.

**Prerequisites:**

*   **Sentry Account:** You'll need a Sentry account. Sign up at [https://sentry.io/](https://sentry.io/).
*   **Expo CLI:** Make sure you have Expo CLI installed globally: `npm install -g expo-cli`
*   **Node.js & npm/yarn:**  Ensure you have Node.js and a package manager (npm or yarn) installed.

**Steps:**

**1. Create a Sentry Project:**

*   Log in to your Sentry account.
*   Create a new project. Give it a descriptive name (e.g., "MyExpoApp").
*   Note the **Sentry SDK Key** and **Project ID**. You'll need these in the following steps.

**2. Install Sentry Dependencies:**

*   **React Native App (Expo):**

    ```bash
    npm install @sentry/react-native
    # or
    yarn add @sentry/react-native
    ```

*   **Express Backend:**

    ```bash
    npm install @sentry/node
    # or
    yarn add @sentry/node
    ```

**3. Configure the React Native App:**

*   **`sentry/config/Expo.js`:**  Create this file in your project's root directory (or modify your existing `.env` file with these settings).

    ```javascript
    // .env or Expo.js
    SENTRY_PROJECT_ID=YOUR_PROJECT_ID
    SENTRY_DSN=YOUR_DSN
    SENTRY_SAMPLE_RATE=100  // Optional:  Percentage of events to capture (default 100)
    ```

    *   `SENTRY_PROJECT_ID`:  Replace `YOUR_PROJECT_ID` with the Project ID you noted earlier.
    *   `SENTRY_DSN`: Replace `YOUR_DSN` with the DSN (Data Source Name) you get from Sentry.  The DSN is a string that contains your project ID, the URL to the Sentry servers, and other configuration options.  You can find your DSN in the Sentry dashboard after creating your project.
    *   `SENTRY_SAMPLE_RATE`:  This is optional. By default, Sentry captures 100% of events. You can reduce this to a percentage (e.g., 50) to sample events and reduce data volume.  This is helpful for testing and development.

*   **Initialize Sentry in your App:**

    ```javascript
    import * as Sentry from '@sentry/react-native';
    import { AppContext, NativeProvider } from './app'; // Update this path

    export default () => {
      Sentry.init({
        dsn: process.env.SENTRY_DSN,
        // ignoreErrorTypes: [ 'TypeError' ], // Optional: Ignore specific error types
        // before(error, capturedCallback) {
        //   // Custom logic before capturing the error
        // },
        // after(response) {
        //   // Custom logic after processing the response
        // }
      });

      return (
        <NativeProvider>
          <AppContext>
            {/* Your App Content */}
          </AppContext>
        </NativeProvider>
      );
    };
    ```

    *   Replace `YOUR_DSN` with your actual DSN.
    *   `
