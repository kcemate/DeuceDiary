# Write a Sentry error tracking setup guide for Expo React Nat
Agent: riley
Generated: 2026-03-03T02:04:09.402142

## Sentry Error Tracking Setup Guide for Expo React Native + Express.js

This guide outlines how to integrate Sentry error tracking into your Expo React Native and Express.js application, providing comprehensive error monitoring and debugging capabilities.

**Key Considerations:**

* **Expo's Limitations:** Expo significantly limits the native module availability. Sentry's native SDK might have limited functionality. This guide focuses on using Sentry's JavaScript SDK for the React Native part and using the Express.js SDK for the backend.
* **Debugging:** Sentry is primarily for production monitoring. Use tools like React Native Debugger, Chrome DevTools for React Native, and your IDE's debugger for development.

**I. Project Setup**

1. **Sentry Account:**
   - Create a Sentry account at [https://sentry.io/](https://sentry.io/) and create a new project for your application.  Note down your **Sentry SDK Key**.

2. **React Native App Setup:**
   - **Install Sentry JavaScript SDK:**
     ```bash
     npm install @sentry/react-native
     # or
     yarn add @sentry/react-native
     ```

3. **Express.js Backend Setup:**
   - **Install Sentry JavaScript SDK:**
     ```bash
     npm install @sentry/javascript
     # or
     yarn add @sentry/javascript
     ```

**II. Configuration**

1. **React Native App Configuration (`@sentry/react-native`):**

   - **Initialize Sentry:** In your main `App.js` (or equivalent) file:

     ```javascript
     import Sentry from '@sentry/react-native';

     Sentry.init({
       dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
       // Optional:
       tracesetIgnorance: [
          // Add any trace IDs to ignore (e.g., for specific operations)
       ],
       // Optional:
       // performanceMonitoring: true, // Enable performance monitoring (requires Sentry Pro)
     });
     ```

   - **DSN (Data Source Name):** This is your Sentry project ID.  You'll find it in your Sentry dashboard after creating your project. It follows the format:  `https://YOUR_PROJECT_ID.sentry.io/`

   - **`tracesetIgnorance`:**  This is a powerful feature.  It allows you to prevent Sentry from tracking traces from specific operations, such as network requests that you know won't always be successful.  This reduces noise and focuses on critical errors.

2. **Express.js Backend Configuration (`@sentry/javascript`):**

   - **Initialize Sentry:**  In your main Express.js file (e.g., `app.js` or `server.js`):

     ```javascript
     const Sentry = require('@sentry/javascript');

     // Set the global Sentry instance
     Sentry.init({
       dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
       // Optional:
       tracesetIgnorance: [
         // Add any trace IDs to ignore for your backend routes
       ],
     });

     // Example usage within your routes:
     app.get('/api/users', (req, res) => {
       Sentry.captureMessage('User request to /api/users', {
         level: Sentry.Severity.INFO,
         extra: { userId: 123 } // Add context
       });
       // ... your route logic ...
     });
     ```
