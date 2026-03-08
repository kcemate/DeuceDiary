# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-07T16:33:11.611709

## Sentry Setup Guide for Expo React Native + Express

This guide outlines how to integrate Sentry into your Expo React Native app and your Express backend for comprehensive error tracking and debugging.

**Prerequisites:**

* **Expo CLI:**  Make sure you have the latest version of Expo CLI installed.
* **Node.js & npm/yarn:**  Ensure you have Node.js and your preferred package manager installed.
* **Sentry Account:**  Create a free Sentry account at [https://sentry.io/](https://sentry.io/).

**Steps:**

**1.  Install Sentry Packages:**

   Install the necessary Sentry packages in both your Expo app and your Express backend:

   * **Expo React Native:**
     ```bash
     npm install @sentry/react-native
     # or
     yarn add @sentry/react-native
     ```
   * **Express Backend:**
     ```bash
     npm install @sentry/node
     # or
     yarn add @sentry/node
     ```

**2. Configure Sentry in Your Expo React Native App:**

   * **Import Sentry:** Import the `Sentry` component into your root App.js file (or the equivalent root file of your app).
   * **Initialization:**  Initialize Sentry with your Sentry SDK key. You can find your SDK key in your Sentry dashboard.
   * **Environment Variables:**  It's best practice to use environment variables for your Sentry SDK key.  Set this variable in your Expo development environment.  You can typically set this in your `.env` file or your shell environment.

   ```javascript
   import * as Sentry from '@sentry/react-native';

   Sentry.init({
     dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
     // Optional configurations:
     // performanceMonitoring: true,  // Enable performance monitoring
     // enableSourceMaps: true,       // Enable source maps for easier debugging
   });

   export default Sentry.main;
   ```

   **Important:** The `YOUR_SENTRY_DSN` should be your full DSN (Data Source Name) from Sentry, which looks something like: `https://YOUR_APP_ID.sentry.io/`

**3. Configure Sentry in Your Express Backend:**

   * **Import Sentry:** Import the `Sentry` module in your Express app file (e.g., `app.js` or `server.js`).
   * **Initialization:**  Initialize Sentry with your Sentry SDK key.
   * **Middleware:** Add the Sentry middleware to your Express app to catch and report errors.
     ```javascript
     const Sentry = require('@sentry/node');

     // ... other middleware ...

     app.use(Sentry.createClientDashboardHandler({ apiKey: 'YOUR_SENTRY_API_KEY' })); //Recommended for development
     // Or, for production:
     // app.use(Sentry.default(process.env.SENTRY_API_KEY));
     ```

   **Replace `YOUR_SENTRY_API_KEY` with your Sentry API Key.** Using environment variables for the API key is highly recommended for security.  The `createClientDashboardHandler` is generally preferred for development, as it provides a dashboard for live monitoring.

**4.  Expo Development Configuration (Important!)**

   * **`app.json` / `app.config.js`:**  Ensure that Sentry is enabled for development.  You can do this by adding the `sentry/traces` key to your `app.json` or `app.
