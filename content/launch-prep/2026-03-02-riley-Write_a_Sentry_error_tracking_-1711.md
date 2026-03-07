# Write a Sentry error tracking setup guide for Expo React Nat
Agent: riley
Generated: 2026-03-02T17:11:16.136178

Okay, here's a comprehensive Sentry setup guide specifically tailored for an Expo React Native project integrated with an Express.js backend. This guide covers installation, configuration, source maps, release tracking, and alert rules, aiming to provide a robust error tracking solution.

**Understanding the Setup**

This setup involves integrating Sentry into both your Expo React Native app and your Express.js backend. React Native errors will be tracked directly from the mobile app, while Express errors will be tracked from the server. We'll leverage Sentry's SDK and its integrations for both environments.

**Phase 1: Installation & Setup**

1. **Node.js & npm/yarn:** Ensure you have Node.js and npm (or yarn) installed.

2. **Sentry Account:** Create a free Sentry account at [https://sentry.io/](https://sentry.io/).

3. **Install Sentry SDK (Express.js):**
   - Navigate to your Express.js project directory.
   - Install the Sentry Node.js SDK:
     ```bash
     npm install sentry --save
     # or
     yarn add sentry
     ```

4. **Install Sentry SDK (Expo React Native):**
   - Navigate to your Expo React Native project directory.
   - Install the Sentry React Native SDK:
     ```bash
     npx expo install @sentry/react-native
     # or (if you are using yarn)
     yarn add @sentry/react-native
     ```

**Phase 2: Configuration**

1. **Sentry Project Setup:**
   - In your Sentry dashboard, create a new project. Choose an appropriate name and team.

2. **Sentry SDK Initialization (Express.js):**
   - In your Express.js app's main file (e.g., `app.js` or `server.js`), import and initialize the Sentry SDK:
     ```javascript
     const Sentry = require('sentry-node');

     // Replace with your project ID
     const projectID = 'YOUR_PROJECT_ID';

     Sentry.init({
       dsn: 'YOUR_DSN', // Your DSN (Data Source Name) - generated on Sentry
       // Set an environment (helpful for filtering)
       environment: 'development',
     });

     module.exports = app; // Export your app instance
     ```
   - Generate your DSN (Data Source Name) from the Sentry dashboard.  It will look something like: `https://YOUR_PROJECT_ID.sentry.io/`

3. **Sentry SDK Initialization (React Native):**
   - In your main React Native entry file (e.g., `App.js`), import and initialize the Sentry SDK:
     ```javascript
     import * as Sentry from '@sentry/react-native';

     Sentry.init({
       dsn: 'YOUR_DSN', // Your DSN
       // Optionally set an environment
       environment: 'development',
       // Optional:  Automatic capture of console logs
       enableAutoSessionReports: true,
       // Optional:  Capture initial application state
       initialReports: true,
     });

     export default App;
     ```

**Phase 3: Source Maps**

* **Crucial for Debugging:**  Source maps are *essential* for accurately pinpointing errors in your React Native code, especially when using libraries and abstractions.
* **Express.js (Automatic):** The Sentry Node.js SDK automatically handles source maps for your Express.js backend.
* **React Native (Manual - Recommended):**
    * **React Native Debugger:**
