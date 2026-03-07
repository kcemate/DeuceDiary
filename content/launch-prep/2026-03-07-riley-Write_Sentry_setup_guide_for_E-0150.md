# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-07T01:50:00.011700

## Sentry Setup Guide for Expo React Native + Express

This guide outlines how to integrate Sentry into your Expo React Native app and your Express backend for comprehensive error monitoring. We'll cover both setup and some best practices.

**1. Prerequisites:**

* **Node.js and npm/yarn installed:** Ensure you have a working Node.js environment.
* **Expo CLI Installed:** If you haven't already, install the Expo CLI globally: `npm install -g expo-cli` or `yarn global add expo-cli`.
* **Sentry Account:** You'll need a Sentry account.  Sign up at [https://sentry.io/](https://sentry.io/).
* **Sentry SDK:**  You'll need the Sentry SDK for Node.js and potentially a specific Sentry SDK for React Native.


**2.  Sentry Setup for Express Backend:**

   * **Create a Sentry Project:** In your Sentry dashboard, create a new project. Give it a descriptive name related to your application.
   * **Get Your Project Admin API Key:** After creating the project, you'll be given an "Admin API Key."  **Keep this key secure!**
   * **Install Sentry SDK for Node.js:**
     ```bash
     npm install sentry
     # or
     yarn add sentry
     ```
   * **Configure Sentry in your Express Application:**
     ```javascript
     // app.js or server.js
     const Sentry = require('sentry-node');
     // Replace with your Sentry project and API key
     const SENTRY_API_KEY = 'YOUR_SENTRY_API_KEY';
     const environment = process.env.NODE_ENV || 'development'; // Get environment from ENV

     Sentry.init({
       dsn: `https://${SENTRY_API_KEY}@sentry.io/`, // Use with Admin API Key
       // or if you have a Release Key:
       // release: 'YOUR_RELEASE_KEY',
       // enableSourceMaps: true, // Recommended for easier debugging
       // ignoreErrors: [/* Array of error classes to ignore */]
     });

     // Example Error Handling Middleware
     app.use((err, req, res, next) => {
       console.error(err.stack); // Log the error to the console
       Sentry.captureException(err, {
         extra: {
           req_url: req.url,
           method: req.method,
           headers: req.headers,
           query: req.query,
         },
       });
       res.status(500).send('Something broke!');
     });
     ```

   * **Start your Express Server:** Run your Express server (`node app.js` or `npm start`). Sentry should now start capturing errors.



**3. Sentry Setup for Expo React Native App:**

   * **Install Sentry SDK for React Native:**
     ```bash
     npm install @sentry/react-native
     # or
     yarn add @sentry/react-native
     ```
   * **Configure Sentry in your Expo React Native App:**
     ```javascript
     // App.js or your main App component
     import Sentry from '@sentry/react-native';

     // Replace with your Sentry project and API key
     const SENTRY_API_KEY = 'YOUR_SENTRY_API_KEY';

     Sentry.init({
       dsn: `https://${SENTRY_API_KEY}@sentry.io/`,
       // or if you have a Release Key:
       // release
