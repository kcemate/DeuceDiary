# Write a Sentry error tracking setup guide for Expo React Nat
Agent: riley
Generated: 2026-03-02T17:29:18.393759

## Sentry Error Tracking Setup Guide for Expo React Native + Express.js

This guide outlines how to integrate Sentry into your Expo React Native application and your associated Express.js backend for comprehensive error tracking and release management.

**I. Prerequisites:**

* **Sentry Account:**  Sign up for a free Sentry account at [https://sentry.io/](https://sentry.io/).
* **Node.js & npm (or yarn):** Ensure you have Node.js and npm installed on your development machine.
* **Expo CLI:**  Make sure you have the Expo CLI installed globally: `npm install -g expo-cli`
* **Express.js Project:** You should have a basic Express.js project set up.

**II. Installation:**

**A. React Native (Expo App):**

1. **Install the Sentry SDK:**
   ```bash
   npm install @sentry/react-native
   # or
   yarn add @sentry/react-native
   ```

2. **Install Expo Application Tracker (Optional, recommended):** This provides additional information and context for errors that occur in your Expo app.
   ```bash
   npm install @sentry/expo-application
   # or
   yarn add @sentry/expo-application
   ```

**B. Express.js Backend:**

1. **Install the Sentry SDK:**
   ```bash
   npm install @sentry/node
   # or
   yarn add @sentry/node
   ```

**III. Configuration:**

**A. React Native (Expo App):**

1. **Initialize Sentry in `App.js` (or your root component):**
   ```javascript
   import { Sentry } from '@sentry/react-native';

   // Your Expo app initialization
   export default () => (
     <Sentry
       attribution={
         {
           projectName: 'YourAppName',
           releaseStage: 'development',  // Or 'production', etc.
           releaseChannel: 'default', // Or a specific channel
         }
       }
       // You can also provide a custom options object here for more options.
       // Example:
       // options: {
       //   // ... your custom options
       // }
     >
       {/* Your App Content */}
     </Sentry>
   );
   ```

2. **Important Sentry Options (within the `options` object):**
   * `dsn`:  Your Sentry DSN (Data Source Name). This is found in your Sentry dashboard.  It looks like `https://your-project-id.sentry.io/`
   * `tracesetEnabled`:  `true` to enable trace recording for network requests. Highly recommended.
   * `environment`:  Set to 'development' during development, and 'production' in your production environment.  This helps Sentry categorize events.
   * `release`: Set this to your app's version number. This helps with release tracking.
   * `sampleRate`: Controls how many events are captured (e.g., 100% for all, 50% for half, etc.).

**B. Express.js Backend:**

1. **Initialize Sentry in your Express app (e.g., `server.js` or your main app file):**

   ```javascript
   const express = require('express');
   const Sentry = require('@sentry/node');

   const app = express();

   // Setup Sentry
   Sentry.init({
       dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
       traceset
