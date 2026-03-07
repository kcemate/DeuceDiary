# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-04T02:59:21.157283

## Sentry Setup Guide for Expo React Native + Express

This guide outlines how to integrate Sentry into your Expo React Native app and your accompanying Express API.  This setup allows you to track errors in both your client-side (mobile) and server-side code, giving you a holistic view of your application's health.

**Prerequisites:**

*   **Sentry Account:** You'll need an active Sentry account. Sign up at [https://sentry.io/](https://sentry.io/).
*   **Expo Project:** Ensure you have an Expo project set up.
*   **Node.js & npm/yarn:**  Make sure you have Node.js and a package manager (npm or yarn) installed.

**Step 1: Create a Sentry Project in Sentry**

1.  Log in to your Sentry account.
2.  Click on "Create project" and choose the "Quick start" option.
3.  Give your project a descriptive name (e.g., "MyAwesomeApp").
4.  Select your application's source (you can choose "Manual configuration").
5.  Configure the basic settings (environment, release stage).  You can usually leave the default values for now.
6.  Click "Create project".
7.  **Important: Get Your Sentry SDK Key:**  Sentry will provide you with a "global" SDK key.  **Copy this key.**  You'll need it later.  It looks something like `XXXXXXXXX`.

**Step 2: Install Sentry Packages**

You'll need to install Sentry packages for both your React Native app and your Express API.

**React Native (Expo App):**

```bash
npm install @sentry/react-native
# or
yarn add @sentry/react-native
```

**Express API:**

```bash
npm install @sentry/node
# or
yarn add @sentry/node
```

**Step 3: Configure Sentry React Native App**

1.  **Create a Sentry Configuration:** Create a file (e.g., `sentry.config.js`) in your React Native project's root. This file will hold your Sentry configuration.

    ```javascript
    // sentry.config.js
    import * as Sentry from '@sentry/react-native';

    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
      // Optional: Set a release name
      release: '1.0.0',
      // Optional: Report SDK errors
      // ignoreErrorLevels: ['info', 'verbose', 'debug'],
    });
    ```

2.  **Set Your DSN:** Replace `YOUR_SENTRY_DSN` with your actual Sentry DSN.  The DSN (Data Source Name) is the most important part – it identifies your Sentry project. It follows this format:

    `https://XXXXXXXX.send.sentry.io/`

    You can find your DSN in your Sentry project dashboard.

3.  **Import and Use Sentry in Your App:**  Import the `Sentry` object from `sentry.config.js` into your main app component (e.g., `App.js`) and call `Sentry.init()` to initialize Sentry.

    ```javascript
    // App.js
    import React from 'react';
    import { AppNavigator } from './navigation'; // Replace with your navigation

    import './sentry.config'; // Import your Sentry configuration

    const App = () => {
      return (
        <AppNavigator />
