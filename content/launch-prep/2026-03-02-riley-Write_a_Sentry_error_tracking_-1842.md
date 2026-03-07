# Write a Sentry error tracking setup guide for Expo React Nat
Agent: riley
Generated: 2026-03-02T18:42:04.466797

## Sentry Error Tracking Setup Guide for Expo React Native + Express.js

This guide outlines the steps to integrate Sentry error tracking into your Expo React Native application and your accompanying Express.js backend.  It covers installation, configuration, source maps, release tracking, and alert rules.

**Prerequisites:**

* **Sentry Account:** You need an active Sentry account. Sign up at [https://sentry.io/](https://sentry.io/).
* **Node.js & npm/yarn:** Ensure you have Node.js and a package manager installed.
* **Expo CLI:**  You’ll use the Expo CLI to manage your project.

**1. Installation**

**React Native (Expo):**

1. **Install the Sentry SDK:**
   ```bash
   npm install @sentry/react-native
   # or
   yarn add @sentry/react-native
   ```

**Express.js (Backend):**

1. **Install the Sentry SDK:**
   ```bash
   npm install @sentry/node
   # or
   yarn add @sentry/node
   ```

**2. Configuration**

**React Native (Expo):**

1. **Create a Sentry Project:**
   * In your Sentry dashboard, create a new project.  Give it a descriptive name.

2. **Install Sentry Expo SDK:**
   ```bash
   npx expo install @sentry/react-native-expo-adapter
   ```

3. **Initialize Sentry in your App.js (or root component):**

   ```javascript
   import * as Sentry from '@sentry/react-native';
   import { SentryOptions } from '@sentry/react-native';

   // Replace with your Sentry project ID
   const SENTRY_PROJECT_ID = 'YOUR_SENTRY_PROJECT_ID';

   const sentryOptions: SentryOptions = {
     dsn: `https://${SENTRY_PROJECT_ID}.sentry.io`, // Or use your organization dsn
     // Custom options like integration names can be set here
   };

   Sentry.init({ ...sentryOptions, beforeExceptionHandling: (e, scope) => {
     console.warn("Custom beforeExceptionHandling:", e); // Log to console for debugging
     return Sentry.captureException(e, scope);
   }});
   ```

4. **Configure the `expo:sdk:configuration` file:** (Important for auto-injection)

   Add the following to your `package.json` or `app.json` under the `expo` section (if you use `expo:sdk:configuration`):

   ```json
   "expo": {
     // ... other expo settings
     "sdk": {
       "analytics": false
     }
   }
   ```

**Express.js (Backend):**

1. **Create a Sentry Project:** (Same as above)

2. **Initialize Sentry in your Express app:**

   ```javascript
   const Sentry = require('@sentry/node');

   // Replace with your Sentry project ID
   const SENTRY_PROJECT_ID = 'YOUR_SENTRY_PROJECT_ID';

   Sentry.init({
     dsn: `https://${SENTRY_PROJECT_ID}.sentry.io`, // Or use your organization dsn
     // Set integrations (optional but recommended)
     integrations: {
       Span: require('@sentry/integrations/span'),
       Browser: require('@sentry/integrations/browser'),
     },
   });

   // Example error handling middleware
   app.use((err
