# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-04T02:14:06.201273

Okay, here's a comprehensive Sentry setup guide for an Expo React Native project integrated with an Express backend. This guide covers the essential steps and provides best practices for a smooth integration.

**Prerequisites:**

*   **Expo Development Environment:** You need to have Expo CLI installed and configured.
*   **Expo Go App:** Have the Expo Go app installed on your mobile device for testing.
*   **Node.js & npm/Yarn:**  Node.js and a package manager (npm or Yarn) must be installed on your system.
*   **Express Backend:** You need an existing Express backend project.

**Steps:**

**1. Install Sentry Packages:**

   Within your Expo React Native project's root directory, install the necessary Sentry packages:

   ```bash
   npm install @sentry/react-native @sentry/node --save-dev
   # or
   yarn add @sentry/react-native @sentry/node --dev
   ```

   *   `@sentry/react-native`:  Sentry SDK for React Native.
   *   `@sentry/node`: Sentry SDK for Node.js (for your Express backend).

**2. Configure Sentry in Your React Native App:**

   *   **Create a Sentry Configuration File:**  Create a file named `sentry.config.js` (or similar) in the root of your React Native project. This file will contain your Sentry project details.

     ```javascript
     // sentry.config.js
     import * as Sentry from '@sentry/react-native';

     Sentry.init({
       dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN (Development Shared Tracking)
       // Set traceOptions for automatic tracking of React Native calls
       tracesOptions: {
         // You can customize the trace options here.
       },
       // Automatic instrumentation enabled with HMS and Native modules.
       enableNativePerformanceMonitoring: true, // Highly recommended
     });
     ```

     *   **`dsn`:** This is your Sentry DSN. You can find it in your Sentry dashboard after creating a project.  It looks something like: `https://your-project-id.sentry.io/`
     *   **`tracesOptions`:**  This configuration controls the automatic instrumentation of React Native calls, significantly improving your error tracking.
     *   **`enableNativePerformanceMonitoring`:** Enabling this will automatically track native performance metrics.

   *   **Import and Use `Sentry`:** Import the `Sentry` object in your main app file (usually `App.js` or `index.js`) and wrap your app's root component:

     ```javascript
     import React from 'react';
     import { AppRegistry } from 'react-native';
     import App from './App'; // Or your main app component
     import Sentry from '@sentry/react-native';

     AppRegistry.registerComponent('MyApp', () => App);
     Sentry.init({
       dsn: 'YOUR_SENTRY_DSN',
       // ... other configuration options
     });
     ```

**3. Configure Sentry in Your Express Backend:**

   *   **Install the Node.js Sentry Package:**

     ```bash
     npm install @sentry/node --save-dev
     # or
     yarn add @sentry/node --dev
     ```

   *   **Create a Sentry Configuration File:** Create a `sentry.js` (or similar) file in the root of your Express project.

     ```javascript
     // sentry.js
