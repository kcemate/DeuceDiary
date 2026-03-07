# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-04T22:49:02.638427

## Sentry Setup Guide for Expo React Native + Express

This guide outlines the steps to integrate Sentry for error tracking in your Expo React Native application and your associated Express backend.

**Prerequisites:**

*   **Expo CLI:** Ensure you have Expo CLI installed globally: `npm install -g expo-cli`
*   **Node.js & npm/yarn:**  You need Node.js and a package manager (npm or yarn) installed.
*   **Sentry Account:** You'll need a Sentry account. Sign up at [https://sentry.io/](https://sentry.io/).
*   **Sentry SDK:**  You'll need the Sentry SDK for both React Native and Express.

**Step 1: Create a Sentry Project in Sentry**

1.  Log in to your Sentry account.
2.  Click "Create project".
3.  Choose "Add project manually" (this gives you more control).
4.  Give your project a name (e.g., "MyExpoApp").
5.  Select the appropriate application type (e.g., "Web" for your Express server). You can add multiple application types to track everything.
6.  Finish the project creation process and note the **Sentry DSID** (Data Source ID).  You'll need this later.

**Step 2: Install Sentry SDKs**

*   **React Native (Expo):**

    ```bash
    npm install @sentry/react-native
    # or
    yarn add @sentry/react-native
    ```

*   **Express (Node.js):**

    ```bash
    npm install @sentry/node
    # or
    yarn add @sentry/node
    ```

**Step 3: Configure Sentry in React Native (Expo)**

1.  **Install `sentry-expo`:** This library simplifies Sentry integration with Expo.

    ```bash
    npm install sentry-expo
    # or
    yarn add sentry-expo
    ```

2.  **Import and Initialize Sentry:** In your main App.js (or the root of your Expo project) add the following:

    ```javascript
    import * as Sentry from 'sentry-expo';

    Sentry.init({
      dsid: 'YOUR_DSID', // Replace with your actual DSID
      environment: 'development', // Or 'production'
      // Optional:  Set custom instrumentation options
      // sampleRate: 0.8, // Capture 80% of errors
      // autoSetContext: true, // Automatically set context information (user ID, etc.)
      // integrations: [
      //   {
      //     name: 'express',
      //     dsid: 'YOUR_EXPRESS_DSID', // Replace with your Express DSID
      //     // Add more integrations as needed
      //   }
      // ]
    });

    export default Sentry.wrap(App); // Wrap your app with Sentry
    ```

    *   **Replace `YOUR_DSID`:**  Replace this placeholder with the DSID you obtained during project creation in Sentry.
    *   **Environment:**  Set the `environment` to `development` for debugging or `production` for live apps.
    *   **Sample Rate:**  Adjust the `sampleRate` to control the percentage of errors Sentry captures.  Lowering this can improve performance but might miss important errors.
    *   **autoSetContext:** `true` automatically sets context variables (like user ID) in Sentry reports, streamlining debugging.
    *   **Integrations:**
