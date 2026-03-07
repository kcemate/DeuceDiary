# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-05T08:11:11.720780

## Sentry Setup Guide for Expo React Native + Express

This guide outlines the steps to integrate Sentry into your Expo React Native app and your accompanying Express backend. It covers installation, configuration, and best practices.

**Prerequisites:**

*   **Sentry Account:** You'll need a Sentry account.  Sign up at [https://sentry.io/](https://sentry.io/).
*   **Expo CLI:** Ensure you have Expo CLI installed globally (`npm install -g expo-cli`)
*   **Node.js & npm/yarn:**  A working Node.js installation with npm or yarn.
*   **Expo Project:** You have an existing Expo React Native project.

**Steps:**

**1. Install Sentry Packages:**

Install the necessary Sentry packages in your Expo React Native project:

```bash
npm install @sentry/react-native @sentry/node
# or with yarn
yarn add @sentry/react-native @sentry/node
```

**2. Configure Sentry in React Native:**

*   **Create a Sentry Configuration:**

    Create a file named `sentry.expo.config.js` (or `sentry.config.js`) in the root of your Expo project. This file will hold your Sentry configuration.

    ```javascript
    module.exports = {
      app: {
        projectId: 'YOUR_SENTRY_PROJECT_ID', // Replace with your Sentry project ID
        // Enable source maps for better error reporting
        enableSourceMaps: true,
      },
    };
    ```

    **Important:** Replace `YOUR_SENTRY_PROJECT_ID` with the unique ID of your Sentry project. You can find this in your Sentry dashboard.

*   **Install Expo CLI Package:**

    Run this command to install the Expo CLI package which will help you configure Sentry:

    ```bash
    npx expo install @sentry/react-native-initialization
    ```

*   **Initialize Sentry in your App Component:**

    Import and initialize Sentry in your main `App.js` (or your equivalent root component) like this:

    ```javascript
    import * as React from 'react';
    import { AppRegistry } from 'react-native';
    import Sentry from '@sentry/react-native';

    export default App = (() => {
      Sentry.init({
        dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
        // Set sample rate to reduce noise.  This is optional.
        // sampleRate: 0.8,
      });

      AppRegistry.registerComponent('MyApp', () => App); // Replace MyApp with your app name
      return App;
    })();
    ```

    **Replacing `YOUR_SENTRY_DSN`:**

    The **DSN (Data Source Name)** is the key to connecting Sentry to your app.  It's a URL that tells Sentry where to send crash reports and other events.

    You can generate a DSN using the Sentry dashboard:

    1.  Log in to your Sentry dashboard.
    2.  Click the "Add Project" button.
    3.  Follow the prompts to create a project.
    4.  On the project settings page, find the "Instrumentation" section.
    5.  Click "Add Snippet" and select "SDK DSN".
    6.  Copy the generated DSN string.

*   **Run your Expo app:**

    ```bash
    expo start
    # or
    npm start
    ```

**3. Configure Sentry in
