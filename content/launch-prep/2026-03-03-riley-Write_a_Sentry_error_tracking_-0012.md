# Write a Sentry error tracking setup guide for Expo React Nat
Agent: riley
Generated: 2026-03-03T00:12:49.892415

## Sentry Error Tracking Setup Guide for Expo React Native + Express.js

This guide outlines the process of integrating Sentry into your Expo React Native and Express.js application for robust error tracking and performance monitoring.

**1. Prerequisites:**

* **Node.js & npm/yarn:** Ensure you have a recent version of Node.js and a package manager installed.
* **Expo CLI:** You should be familiar with using the Expo CLI for managing your project.
* **Sentry Account:**  Create a free Sentry account at [https://sentry.io/](https://sentry.io/).

**2. Installation:**

**a) React Native (Expo):**

* **`sentry-expo`:**  This is the recommended Expo SDK package for integrating Sentry.
   ```bash
   npx expo install sentry-expo
   ```

**b) Express.js:**

* **`sentry`:** Install the Node.js Sentry SDK in your Express.js project.
   ```bash
   npm install sentry
   # or
   yarn add sentry
   ```

**3. Configuration:**

**a) React Native (Expo):**

* **Configure `sentry-expo`:**  Create a `SentryClient` instance and pass it to the `Sentry.init()` function.  Import the SDK first.

   ```javascript
   import * as Sentry from 'sentry-expo';
   import * as RNBackgroundFetch from 'react-native-background-fetch'; // If using Background Fetch
   import * as ExpoLocation from 'expo-location';

   // Replace with your Sentry project ID
   const SENTRY_PROJECT_ID = 'YOUR_SENTRY_PROJECT_ID';

   const App = () => {
     Sentry.init({
       dsn: `https://YOUR_SENTRY_PROJECT_ID.sentry.io/`,
       // Optional: Set the SDK version for better tracking
       // enableErrorAttachments: true, // Defaults to false. Recommended.
       // ignoreError: (err, stackTrace) => {
       //   return true; // Ignore specific errors if needed.
       // }
     });

     // Example:  Handle Errors (if not handled elsewhere)
     try {
       // Your app logic here
       console.log("App is running...");
     } catch (error) {
       Sentry.captureException(error, {
         extra: {
           error_code: error.code,
           component_name: error.stack ? error.stack.split('\n')[0].split(' ')[0] : 'Unknown', // Extract component name
         }
       });
     }

     return (
       // Your app content
     );
   };

   export default App;
   ```

   * **`dsn`:**  Your Sentry DSN (Data Source Name). This is your Project ID followed by `.sentry.io`.  You'll find this in your Sentry dashboard.
   * **`enableErrorAttachments: true`:** Highly recommended.  This automatically captures screenshots of the error stack trace, which is invaluable for debugging.
   * **`ignoreError`:**  You can optionally provide a function to ignore specific errors if you don't want to report them to Sentry (e.g., for transient errors).  Be very careful when using this.
   * **`extra`:**  Pass extra information about the error to Sentry for richer context. This is particularly useful for component names, user IDs, and other relevant details.

**b) Express.js:**

* **Initialize Sentry:**  Import and initialize the `sentry
