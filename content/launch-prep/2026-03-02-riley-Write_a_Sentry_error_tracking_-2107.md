# Write a Sentry error tracking setup guide for Expo React Nat
Agent: riley
Generated: 2026-03-02T21:07:18.474928

## Sentry Error Tracking Setup Guide for Expo React Native + Express.js

This guide outlines how to set up Sentry error tracking for your React Native application using Expo and your associated Express.js backend. It covers installation, configuration, source maps, release tracking, and alert rules.

**Prerequisites:**

*   A Sentry account ([https://sentry.io/](https://sentry.io/))
*   Node.js and npm/yarn installed
*   Expo project initialized

**1. Installation:**

**React Native (Expo):**

```bash
npm install @sentry/react-native
# or
yarn add @sentry/react-native
```

**Express.js Backend:**

```bash
npm install sentry
# or
yarn add sentry
```

**2. Configuration:**

**React Native (Expo):**

*   **Create an Sentry Project:**  In your Sentry dashboard, create a new project for your React Native app. Note the *Sentry SDK Key*.
*   **Configure `ExpoError`:**  You need to tell Expo how to handle errors reported by your React Native code.  Modify your `app.json` or `app.config.js` file:

    ```json
    {
      "expo": {
        ...
        "sentry": {
          "environment": "Expo",
          "sdkKey": "YOUR_SENTRY_SDK_KEY"
        }
      }
    }
    ```
    Replace `YOUR_SENTRY_SDK_KEY` with the key you obtained from the Sentry dashboard.
*   **Initialization:**  In your main app component (typically `App.js` or `App.tsx`), initialize Sentry:

    ```javascript
    import * as React from 'react';
    import { AppRegistry } from 'react-native';
    import Sentry from '@sentry/react-native';

    //  Configure Sentry
    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN', // Get this from the Sentry dashboard
      // Optional:
      // ignoreErrorTypes: ['TypeError', 'ReferenceError'], // Customize error types to ignore
      // enableSourceMaps: true, // Enable source maps (crucial for debugging)
      // releaseStage: 'development', // Set the release stage (e.g., 'development', 'production')
    });

    AppRegistry.registerComponent('MyApp', () => App);
    ```
    **Important:** Replace `YOUR_SENTRY_DSN` with your full DSN (Data Source Name) which can be found on your Sentry project dashboard (e.g., `https://<your-sentry-project>.sentry.io/`) . You can usually copy it directly from the browser's URL.  Consider using environment variables for the DSN for security.

**Express.js Backend:**

*   **Initialize Sentry:** In your Express.js app, initialize Sentry.  Typically done in your main app file (e.g., `app.js` or `index.js`):

    ```javascript
    const express = require('express');
    const Sentry = require('sentry-node');

    const app = express();
    const port = process.env.PORT || 3000;

    // Configure Sentry
    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN', // Get this from the Sentry dashboard
      // Optional:
      // ignoreErrorTypes: ['TypeError', 'ReferenceError'], // Customize error types to ignore
      // sample: 0.1, //  Sample
