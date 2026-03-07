# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-04T08:39:16.664331

## Sentry Setup Guide for Expo React Native + Express

This guide outlines the steps to integrate Sentry into your Expo React Native app and your Express backend, allowing you to track errors and monitor your application's health effectively.

**Prerequisites:**

*   **Sentry Account:** You'll need a Sentry account. Sign up at [https://sentry.io/](https://sentry.io/).
*   **Expo CLI:** Ensure you have Expo CLI installed globally: `npm install -g expo-cli`
*   **Node.js and npm:** Have Node.js and npm (or yarn) installed.
*   **Express Server:** You have a running Express server.

**Step 1:  Create a Sentry Project**

1.  Log in to your Sentry dashboard.
2.  Click "Create project".
3.  Choose a project name (e.g., "MyExpoApp").
4.  Select "JavaScript" as the framework.
5.  Choose the "Application" tracking level (usually "Automatic" is fine to start).
6.  Click "Create".

**Step 2:  Install Sentry SDKs**

**A. React Native App (Expo):**

1.  Navigate to your Expo project directory in your terminal: `cd your-expo-app`
2.  Install the Sentry SDK for React Native:

    ```bash
    npm install @sentry/react-native
    # or using yarn:
    # yarn add @sentry/react-native
    ```

**B. Express Server:**

1.  Navigate to your Express server directory in your terminal: `cd your-express-server`
2.  Install the Sentry SDK for Node.js:

    ```bash
    npm install @sentry/node
    # or using yarn:
    # yarn add @sentry/node
    ```

**Step 3: Configure Sentry in the React Native App**

1.  **Get Your Sentry Project ID:**  On the Sentry dashboard, you'll find your project ID in the top-left corner.  It looks like `XXXXXXXXX`.
2.  **Configure the Sentry SDK:**  In your React Native app's main entry point (e.g., `App.js`), import and initialize the Sentry SDK.

    ```javascript
    import * as Sentry from '@sentry/react-native';

    // Set the Project ID (replace with your actual ID)
    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN', // Replace with your DSN (details below)
      // Set sample rate if you want to track only a portion of events
      // sampleRate: 0.8,
      // Customize the SDK with advanced options
      // ignoreErrorBoundaries: true,
    });

    // Optional:  Capture errors outside of try/catch blocks
    Sentry.setRelease(process.env.RELEASE_VERSION);
    ```

    **DSN (Data Source Name):**

    The DSN is the core of your Sentry configuration. It links your app to your project.  You can generate it from your Sentry dashboard.  It has the following format:

    `https://YOUR_PROJECT_ID@YOUR_ENVIRONMENT.sentry.io/`

    *   `YOUR_PROJECT_ID`:  Replace this with the ID you got in Step 1.
    *   `YOUR_ENVIRONMENT`: This represents the environment your app is running in (e.g., "development", "staging", "production").  Sentry supports environment tracking.

**Step 4: Configure Sentry in
