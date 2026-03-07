# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T12:38:52.247713

## Sentry Setup Guide for Expo React Native + Express

This guide outlines how to integrate Sentry into your Expo React Native project that utilizes an Express backend. It covers installation, configuration, and best practices.

**Prerequisites:**

*   **Node.js & npm (or yarn):** Ensure you have Node.js and npm (or yarn) installed.
*   **Expo CLI:** You need the Expo CLI installed.
*   **Sentry Account:** Create a free Sentry account at [https://sentry.io/](https://sentry.io/)
*   **Express Backend:** You should have a basic Express backend running.

**Steps:**

**1. Install Sentry SDKs:**

*   **React Native:** In your Expo project, install the Sentry SDK for React Native:
    ```bash
    expo install @sentry/react-native
    ```

*   **Express Backend:**  Install the Sentry SDK for Node.js:
    ```bash
    npm install @sentry/node  # or yarn add @sentry/node
    ```

**2. Configure Sentry in Your React Native App:**

*   **Create a Sentry Configuration File:**  Create a file named `sentry.config.js` (or similar) in the root of your Expo project.  This file will hold your Sentry configuration.

*   **Add Your Sentry Project ID:** Replace `<YOUR_PROJECT_ID>` with your actual Sentry Project ID. You can find this ID on your Sentry dashboard after creating a project.

    ```javascript
    module.exports = {
      project: 'YOUR_PROJECT_ID',
      // You can customize other options here, like:
      //   traceset: {
      //     //  Enable/disable traces, etc.
      //   },
      //   integrations: {
      //     //  Integrate with other services (e.g., Amplitude)
      //   },
    };
    ```

*   **Integrate Sentry into your App:**  Import the Sentry configuration and initialize Sentry within your main App component (usually `App.js`).

    ```javascript
    import Sentry from '@sentry/react-native';
    import { config } from './sentry.config.js';

    Sentry.init({
      ...config,
      //  You can override individual options if needed
    });

    export default Sentry.wrap(App); // Wrap your App component
    ```

**3. Configure Sentry in Your Express Backend:**

*   **Import and Initialize Sentry:**  In your Express app, import and initialize the Sentry SDK:

    ```javascript
    const Sentry = require('@sentry/node');

    // Set the Project ID
    Sentry.init({
      project: 'YOUR_PROJECT_ID',
      // Optional:  Customize other settings like:
      //  traceset: {
      //    // Custom traces for your backend code
      //  },
      //  integrations: {
      //   // Integrate with other services
      //  }
    });

    // Example:  Add error handler
    process.on('uncaughtException', (err, context) => {
      Sentry.captureException(err, context);
    });

    process.on('unhandledRejection', (reason, promise) => {
      Sentry.captureRejection(reason, promise);
    });
    ```

**4. Running Your App & Verify Sentry Integration:**

*   **Run your Expo app:** `expo start` and follow the instructions to run your app on an emulator/simulator or your
