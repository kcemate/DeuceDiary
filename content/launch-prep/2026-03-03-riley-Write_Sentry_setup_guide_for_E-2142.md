# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T21:42:14.996223

## Sentry Setup Guide for Expo React Native + Express

This guide will walk you through setting up Sentry for your Expo React Native app and its associated Express backend.  This setup will allow you to monitor errors and performance issues within both your frontend and backend.

**Prerequisites:**

*   **Node.js and npm/yarn:** Make sure you have Node.js and a package manager (npm or yarn) installed.
*   **Sentry Account:**  You need a Sentry account. Sign up at [https://sentry.io/](https://sentry.io/).
*   **Expo Project:** You should have an existing Expo React Native project.

**Steps:**

**1. Install Sentry Packages:**

   **React Native (Expo App):**

   ```bash
   npm install @sentry/react-native
   # or
   yarn add @sentry/react-native
   ```

   **Express Backend:**

   ```bash
   npm install @sentry/node
   # or
   yarn add @sentry/node
   ```

**2. Configure Sentry in Your React Native App (Expo):**

   *   **Create a Sentry Client:** In your main app file (e.g., `App.js` or `index.js`), create a Sentry client instance.

     ```javascript
     import Sentry from '@sentry/react-native';

     // Replace with your Sentry project ID
     const SENTRY_PROJECT_ID = 'YOUR_SENTRY_PROJECT_ID';

     // Initialize Sentry
     Sentry.init({
       dsn: `https://${SENTRY_PROJECT_ID}.sentry.io/`,
       // Optional:  Add an example namespace for your app
       // namespaces: {
       //     app: 'My Expo App'
       // },
       // Performance Monitoring (optional)
       tracesSampleRate: 0.5, // Percentage of traces to sample
       // Flush interval (milliseconds - default is 60s)
       // autoSetInitialRum: true, // Automatically enable performance monitoring when the app starts
     });
     ```

   *   **Important:**  Replace `YOUR_SENTRY_PROJECT_ID` with your actual Sentry project ID. You can find this in your Sentry dashboard.

   *   **Enable Automatic Performance Monitoring:**  Setting `autoSetInitialRum: true` automatically enables performance monitoring when the app starts. This is highly recommended.

**3. Configure Sentry in Your Express Backend:**

   *   **Create a Sentry Client:**  In your Express app (e.g., `server.js` or `app.js`), create a Sentry client instance.

     ```javascript
     const Sentry = require('@sentry/node');

     // Replace with your Sentry project ID
     const SENTRY_PROJECT_ID = 'YOUR_SENTRY_PROJECT_ID';

     // Initialize Sentry
     Sentry.init({
       dsn: `https://${SENTRY_PROJECT_ID}.sentry.io/`,
       // Optional: Add a sample tag (e.g., environment)
       // tags: [
       //   'development',
       // ],
     });
     ```

   *   **Important:**  Replace `YOUR_SENTRY_PROJECT_ID` with your actual Sentry project ID.

**4.  Handling Errors in Your React Native App:**

   *   **Use `Sentry.captureException()`:**  Wrap your code in `try...catch` blocks and use `Sentry.captureException()` to send any errors that occur.

     ```javascript
     try {
