# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T18:41:02.386201

## Sentry Setup Guide for Expo React Native + Express

This guide outlines the steps to integrate Sentry into your Expo React Native application and your accompanying Express.js API server.  This setup will allow you to monitor errors and crashes effectively in both environments.

**Prerequisites:**

*   **Expo Development Environment:**  Ensure you have Expo CLI installed and configured.
*   **Sentry Account:** You need a Sentry account. Sign up at [https://sentry.io/](https://sentry.io/).
*   **Node.js & npm/yarn:**  Make sure you have Node.js and a package manager installed.
*   **Expo Project:** Have a fully functional Expo React Native project set up.

**Steps:**

**1. Set up Sentry in your Express.js Backend:**

   *   **Install Sentry:**
       ```bash
       npm install sentry
       # or
       yarn add sentry
       ```

   *   **Initialize Sentry:**  In your Express.js project, create a file (e.g., `sentry.js`) to handle Sentry initialization.

       ```javascript
       // sentry.js
       const Sentry = require('sentry-node');

       module.exports = (dsn) => {
           Sentry.init({
               dsn: dsn,
               traces: true,  // Enable trace API calls (recommended)
               // sample: 100, // Optionally sample a percentage of traces
               // ignoreErrorTypes: [ /* Specify error types to ignore */ ],
               // before(req, res, next) {
               //   // Add custom middleware to track requests
               // },
           });
       };
       ```

   *   **Environment Variable:**  Set your Sentry DSN (Data Source Name) as an environment variable. This is crucial.  It's how Sentry knows where to send the data.
       ```bash
       # Example (replace with your actual DSN)
       export SENTRY_DSN="https://<YOUR_PROJECT_ID>.<YOUR_ORGANIZATION>.sentry.io/s/your-app-id/"
       ```

   *   **Import & Initialize in your Express App:** In your main Express app file (e.g., `server.js` or `app.js`), import and call the `init` function.
       ```javascript
       // server.js
       const express = require('express');
       const app = express();
       const sentry = require('./sentry');

       //  Make sure to set the DSN environment variable
       const dsn = process.env.SENTRY_DSN;

       if (dsn) {
           sentry.init(dsn);
       }

       // Your Express routes and logic here...
       app.get('/', (req, res) => {
           res.send('Hello from your Express server!');
       });

       const port = process.env.PORT || 3000;
       app.listen(port, () => {
           console.log(`Server listening on port ${port}`);
       });
       ```

**2. Integrate Sentry into your Expo React Native App:**

   *   **Install Sentry:**
       ```bash
       npm install @sentry/react-native
       # or
       yarn add @sentry/react-native
       ```

   *   **Initialize Sentry:**  Create a file (e.g., `sentry.js`) within your Expo project (often in the root or `src` directory) to manage Sentry initialization.

       ```javascript
       // sent
