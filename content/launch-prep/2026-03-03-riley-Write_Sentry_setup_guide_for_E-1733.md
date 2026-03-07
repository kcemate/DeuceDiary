# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T17:33:11.711044

## Sentry Setup Guide for Expo React Native + Express

This guide outlines how to integrate Sentry into your Expo React Native application and your associated Express backend, providing comprehensive error tracking and performance monitoring.

**Prerequisites:**

*   **Sentry Account:** You need a Sentry account. Sign up at [https://sentry.io/](https://sentry.io/).
*   **Expo Project:** You have an Expo React Native project set up.
*   **Node.js & npm/yarn:** Node.js and a package manager (npm or yarn) are installed.

**Steps:**

**1. Install Sentry SDKs:**

*   **React Native:**
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

**2. Configure Sentry in Your React Native App:**

*   **Create a Sentry Configuration File:**  Create a file named `sentry.config.js` (or a similar name) in the root of your Expo project.  This file will hold your Sentry configuration.

    ```javascript
    // sentry.config.js
    import * as Sentry from '@sentry/react-native';

    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
      // Enable performance monitoring (optional)
      performTraceOrigins: ['YOUR_APP_DOMAIN'],
      // Set a custom sample rate (optional) - useful for production apps
      // sampleRate: 0.95,
    });
    ```

    *   **`dsn`:**  This is your Sentry DataStream Name. You can find this in your Sentry dashboard.
    *   **`performTraceOrigins`:** (Optional but Recommended) This tells Sentry where to start tracing requests.  It’s crucial for accurate performance monitoring.  Set it to your app's domain (e.g., `your-app-domain.com`) or a specific domain you control.  Without this, Sentry might not trace requests correctly.
    *   **`sampleRate`:** (Optional)  Allows you to control the percentage of requests Sentry tracks.  A value of `1` means all requests are tracked.  For production apps, it's common to set this to a value like `0.95` to reduce the load on Sentry.



*   **Import Sentry in your App Entry File:**
    ```javascript
    // App.js or index.js
    import React from 'react';
    import { AppRegistry } from 'react-native';
    import AppNavigator from './navigation/AppNavigator'; // Replace with your navigation
    import { Sentry } from '@sentry/react-native';

    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN',
      performTraceOrigins: ['YOUR_APP_DOMAIN'],
    });

    AppRegistry.registerComponent('MyApp', () => AppNavigator); // Replace MyApp with your app name
    ```

**3. Configure Sentry in Your Express Backend:**

*   **Import Sentry:**
    ```javascript
    // routes/your-route.js or your backend file
    import Sentry from '@sentry/node';

    // ... your route logic ...
    app.get('/your-route', (req, res, next) => {
      Sentry.captureMessage('Request received to /your
