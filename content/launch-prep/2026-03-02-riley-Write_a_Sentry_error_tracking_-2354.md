# Write a Sentry error tracking setup guide for Expo React Nat
Agent: riley
Generated: 2026-03-02T23:54:15.461796

## Sentry Error Tracking Setup Guide for Expo React Native + Express.js

This guide outlines the steps to integrate Sentry error tracking into your Expo React Native app and your accompanying Express.js backend. It covers installation, configuration, source maps, release tracking, and alert rules.

**Prerequisites:**

*   You have a Sentry account ([https://sentry.io/](https://sentry.io/)).
*   You have Node.js and npm or yarn installed.
*   You have Expo CLI installed and configured.

**1. Installation:**

**React Native (Expo):**

Install the `@sentry/react-native` package:

```bash
npm install @sentry/react-native --save
# or
yarn add @sentry/react-native --save
```

**Express.js:**

Install the `@sentry/node` package:

```bash
npm install @sentry/node --save
# or
yarn add @sentry/node --save
```

**2. Configuration:**

**React Native (Expo):**

*   **Create a Sentry Managed Client:** The easiest approach is to use Sentry's managed client. This simplifies configuration and updates.

    ```bash
    npx @sentry/cli init --app <YOUR_APP_NAME> --org <YOUR_ORG_NAME> --repo <YOUR_REPO_NAME>
    ```

    *   Replace `<YOUR_APP_NAME>` with a descriptive name for your app (e.g., "my-expo-app").
    *   Replace `<YOUR_ORG_NAME>` with your Sentry organization name.
    *   Replace `<YOUR_REPO_NAME>` with the name of your Git repository.

    This will generate a `sentry.expo.config.js` file in your project's root.

*   **Configure `sentry.expo.config.js`:**

    ```javascript
    // sentry.expo.config.js
    import * as Expo from 'expo';
    import * as Sentry from '@sentry/react-native';

    export default {
      // ... other Expo configurations ...
      app: {
        projectId: 'YOUR_PROJECT_ID', // Replace with your Sentry project ID
        traces: true,          // Enable traces for performance monitoring
        // Optional:  Customizable behavior
        // disableProducts: ['mobile/crashlytics'], // Disable specific Sentry products
      },
    };
    ```

    *   Replace `YOUR_PROJECT_ID` with the actual Sentry project ID you created.
    *   `traces: true` enables Sentry's traces feature for detailed performance monitoring.  Consider disabling this if you're heavily focused on error monitoring and want to reduce noise.
    *   Review and customize other options according to your needs (e.g., `disableProducts`).

*   **Initialize Sentry in your App Component (App.js):**

    ```javascript
    import React from 'react';
    import { ExpoRoot } from './expo-root'; // Replace with your main Expo root component
    import * as Sentry from '@sentry/react-native';

    Sentry.init({
      dsn: 'YOUR_DSN', // Replace with your Sentry DSN
      // ... other Sentry configuration options ...
    });

    export default () => {
      return (
        <ExpoRoot />
      );
    };
    ```

    *   Replace `YOUR_DSN` with your Sentry DSN (Data Source Name).  You can find this in your Sentry project settings.  It typically looks like `sentry
