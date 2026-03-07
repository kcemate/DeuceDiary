# Write a Sentry error tracking setup guide for Expo React Nat
Agent: riley
Generated: 2026-03-02T20:12:41.506100

## Sentry Error Tracking Setup Guide for Expo React Native + Express.js

This guide outlines how to integrate Sentry into your Expo React Native and Express.js project for effective error tracking and monitoring.

**Key Considerations:**

* **Expo's Limitations:**  Expo's managed workflow can make direct instrumentation challenging. This guide focuses on solutions utilizing Expo's SDK and Sentry's SDK.
* **Server-Side Focus:**  This guide prioritizes tracking errors originating from your Express.js backend.  We'll provide guidance on React Native errors as well.
* **Hybrid Approach:**  We'll combine Sentry's SDK for React Native and the Sentry Node.js SDK for your Express.js server.

**1. Prerequisites:**

* **Sentry Account:** You'll need a Sentry account. Sign up at [https://sentry.io/](https://sentry.io/).
* **Expo Project:** You have an existing Expo React Native project.
* **Node.js & npm/yarn:** Ensure you have Node.js and your package manager installed.

**2. Installation:**

* **React Native (Expo):**
   ```bash
   npm install @sentry/react-native
   # or
   yarn add @sentry/react-native
   ```

* **Express.js (Backend):**
   ```bash
   npm install @sentry/node
   # or
   yarn add @sentry/node
   ```

**3. Configuration (React Native - Expo):**

1. **Initialize Sentry in `App.js` (or your entry point):**
   ```javascript
   import { Sentry } from '@sentry/react-native';

   // Initial Sentry configuration
   const SentryOptions = {
     dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
     enableSourceMaps: true, // Crucial for debugging
     tracesetSampleRate: 0.1,  // (Optional) Sample a percentage of traces for performance
   };

   // Initialize Sentry
   Sentry.init(SentryOptions);
   ```

   * **`YOUR_SENTRY_DSN`:**  This is your Sentry DSN (Data Source Name). You can find it in your Sentry dashboard. It typically looks like `sentry.io/YOUR_PROJECT_ID`.
   * **`enableSourceMaps: true`:**  **Very important!** This enables Sentry to display the original source code for your JavaScript errors, significantly improving debugging.  Expo needs to be set up to support this properly, which we'll cover below.
   * **`tracesetSampleRate` (Optional):** Adjust the sampling rate to control the amount of tracing data Sentry collects.  Lowering this can reduce performance impact.



**4. Configuration (Express.js - Backend):**

1. **Install the Node.js SDK:** (Already done in Step 2)
2. **Initialize Sentry in your Express app:**
   ```javascript
   const Sentry = require('@sentry/node');

   // Initialize Sentry
   Sentry.init({
     dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
     tracesetSampleRate: 0.1, // (Optional) Sample a percentage of traces
   });

   // Example error handler (adjust as needed)
   app.use((err, req, res, next) => {
     console.error(err);
     Sentry.captureException(err, req, res); // Capture the error
     res.status(500).send('
