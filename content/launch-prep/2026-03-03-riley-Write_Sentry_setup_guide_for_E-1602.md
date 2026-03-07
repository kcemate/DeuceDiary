# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T16:02:52.460466

## Sentry Setup Guide for Expo React Native + Express

This guide outlines how to integrate Sentry into your Expo React Native app and your Express backend for robust error monitoring.

**Prerequisites:**

*   **Expo CLI:** Ensure you have Expo CLI installed (`npm install -g expo-cli` or `yarn global add expo-cli`).
*   **Node.js and npm/yarn:**  Have Node.js and a package manager (npm or yarn) installed.
*   **Sentry Account:**  You'll need a Sentry account. Sign up at [https://sentry.io/](https://sentry.io/).

**Steps:**

**1. Create a Sentry Project:**

*   Log in to your Sentry account.
*   Create a new project. Give it a descriptive name related to your application (e.g., "Expo React Native App").
*   Note the **Sentry SDK key (API Key)**. This is critical for connecting your app.  You'll need this for the next steps.


**2. Install Sentry SDKs:**

*   **React Native (Expo):**
    ```bash
    npm install @sentry/react-native --save
    # or
    yarn add @sentry/react-native
    ```

*   **Express Backend:**
    ```bash
    npm install @sentry/node --save
    # or
    yarn add @sentry/node
    ```

**3. Configure the React Native Sentry SDK:**

*   **Create a `sentry.config.js` file:**  Place this file in the root of your Expo project.

    ```javascript
    // sentry.config.js
    import { SentryNode } from '@sentry/node';

    const Sentry = new SentryNode({
        dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN (API Key + app/org/project)
        // Optional:  Specify your application name
        app: 'My Expo App',
        // Optional:  Specify custom tags for your application.  Helps categorize errors.
        tags: ['react-native'],
    });

    export default Sentry;
    ```

    *   **`YOUR_SENTRY_DSN`:**  Replace this placeholder with your full Sentry DSN.  The DSN follows this format:  `sentry.io/<app>/<org>/<project>`  You can find this in your Sentry dashboard after creating a project.  It often looks like `https://xxxxxxxx.sentry.io/`

    *   **`app` (optional):** Give your application a name. This helps with filtering and identification.

    *   **`tags` (optional):**  Add tags to your application.  Tags are helpful for grouping errors based on technology or environment.


**4. Integrate Sentry into Your React Native App:**

*   **Import Sentry:** In your main app file (e.g., `App.js`), import the `Sentry` object.

    ```javascript
    import React from 'react';
    import { AppNavigator } from './navigation'; // Your navigation
    import Sentry from './sentry.config.js';

    const App = () => {
      Sentry.init({
        // No need to repeat the configuration here, it's already in sentry.config.js
      });

      return (
        <AppNavigator />
      );
    };

    export default App;
    ```

*   **`Sentry.init()`:** This is the most important step.  Call `Sentry.init()`
