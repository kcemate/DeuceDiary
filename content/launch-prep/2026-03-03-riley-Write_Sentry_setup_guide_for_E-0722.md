# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T07:22:45.496501

```bash
# Prerequisites:
# - Node.js and npm/yarn installed
# - Expo CLI installed (e.g., `npm install -g expo-cli`)
# - Expo Go app installed on your mobile device

## 1. Install Sentry

First, install Sentry for your project:

```bash
npm install --save @sentry/react-native
# or
yarn add @sentry/react-native
```

## 2. Configure Sentry in your Expo Project

There are a few ways to configure Sentry. The recommended approach is using the `expo-sentry` library:

```bash
npm install --save expo-sentry
# or
yarn add expo-sentry
```

Now, you need to initialize Sentry within your main app file (usually `App.js` or `index.js`).

```javascript
import React from 'react';
import { AppRegistry } from 'react-native';
import App from './App'; // Your main App component
import { name as appName } from './app.json';
import { Sentry } from 'expo-sentry';

Sentry.init({
  // Replace with your Sentry DSN (Data Source Name)
  dsn: 'YOUR_SENTRY_DSN',

  // Optional:  Configure auto-track
  // autoTrack: true,

  // Optional:  Customize the SDK
  // SDK: {
  //   tracesSampleRate: 0.2, // Sample 20% of traces
  // },

  // Optional:  Custom error mappings.  This is highly recommended.
  // beforeErrorBail(error, stackTrace) {
  //   console.log("Custom beforeErrorBail:", error, stackTrace);
  // },
  // afterErrorBail(error, stackTrace) {
  //   console.log("Custom afterErrorBail:", error, stackTrace);
  // },
});


AppRegistry.registerComponent(appName, () => App);
```

**Explanation:**

* **`YOUR_SENTRY_DSN`**:  This is the most important part.  You'll get this from your Sentry account.  It's a unique identifier for your Sentry project.  Sign up for Sentry at [https://sentry.io/](https://sentry.io/) and create a project. You'll find your DSN there.
* **`autoTrack: true`**:  This enables automatic tracking of all errors in your app.  It's convenient but might send a lot of low-severity errors.  Consider customizing the SDK.
* **`SDK`**: Allows you to configure the Sentry SDK.
    * `tracesSampleRate`:  Controls the percentage of traces (API calls) that are sampled for performance analysis.
* **`beforeErrorBail` and `afterErrorBail`**:  These functions let you add custom logic before or after an error is bailed. This is crucial for handling specific errors in a way that's relevant to your app.  Example: Log more context, perform a rollback operation, or send a notification.

## 3. Build and Run Your Expo App

Now you can build and run your Expo app as usual:

```bash
npm start
# or
yarn start
```

This will open the Expo Go app on your device.  Your app will now automatically send errors to Sentry.

## 4. Verify Your Setup in the Sentry Dashboard

Go to your Sentry dashboard ([https://sentry.io/](https://sentry.io/)) and navigate to your project.  You should start seeing errors logged from your
