# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-06T05:46:26.526570

## Sentry Setup Guide for Expo React Native + Express

This guide outlines how to integrate Sentry into your Expo React Native app and your Express backend for comprehensive error tracking and debugging.

**Prerequisites:**

*   **Sentry Account:** You'll need a Sentry account. Create one at [https://sentry.io/](https://sentry.io/).
*   **Expo Project:**  You have an existing Expo React Native project.
*   **Node.js & npm/yarn:** Ensure you have Node.js and npm or yarn installed on your system.

**Steps:**

**1.  Install Sentry SDKs:**

   Install the necessary Sentry SDKs for both your Expo React Native app and your Express backend:

   *   **Expo React Native App:**
      ```bash
      yarn add @sentry/react-native
      ```
   *   **Express Backend:**
      ```bash
      yarn add @sentry/node
      ```

**2.  Configure Sentry in Your React Native App:**

   *   **Set Your Sentry Project ID:**  You'll find your project ID in your Sentry dashboard.  It’s a unique identifier for your project.
   *   **Initialize Sentry:** In your main App.js (or your root component), initialize the Sentry SDK.

      ```javascript
      import * as Sentry from '@sentry/react-native';

      Sentry.init({
        dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
        // Optional:  Set sample rate to reduce noise
        // sampleRate: 0.8,
        // Set attachment settings (optional, but recommended)
        // autoSetTTL: 120, // Set default TTL of 120s
        // enableSourceMaps: true, // Helpful for debugging
      });

      export default App;
      ```

      **Explanation:**

      *   `dsn`:  The Data Source Name (DSN) is a unique identifier for your Sentry project. You can find this in your Sentry dashboard.  It's generally formatted as `sentry.io/<project_id>`.
      *   `sampleRate`:  Controls the percentage of events that are captured.  A rate of `1.0` captures all events. Using a lower rate reduces noise and cost, especially when dealing with lots of events.
      *   `autoSetTTL`: Automatically sets the Time To Live (TTL) for captured events to 120 seconds by default.
      *   `enableSourceMaps`: If enabled, Sentry can attach source maps to your events, making it easier to identify the original source code where the error occurred. This is highly recommended.

**3.  Configure Sentry in Your Express Backend:**

   *   **Set Your Sentry Project ID:** Same as above, find your Sentry Project ID.
   *   **Add Sentry Middleware:**  Include the Sentry Node.js middleware in your Express app.  This captures all requests and their responses.

      ```javascript
      const Sentry = require('@sentry/node');

      // Configure Sentry
      Sentry.init({
        dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
        // Optional: Set sample rate
        // sampleRate: 0.8,
        // Attach the request to the event
        tracesSampleRate: 0.8, //  Recommended for traces
      });

      // Example Express Route
      const express = require('express');
      const app = express();

      app.get('/test', (req, res
