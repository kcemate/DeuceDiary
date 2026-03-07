# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-06T13:27:35.210789

## Sentry Setup Guide for Expo React Native + Express

This guide outlines how to integrate Sentry into your Expo React Native project and your associated Express backend. This is a comprehensive approach covering both the React Native and Node.js/Express parts.

**Prerequisites:**

*   **Expo CLI:** Ensure you have the latest Expo CLI installed: `npm install -g expo-cli`
*   **Node.js & npm:**  Node.js and npm must be installed on your system.
*   **Sentry Account:**  You'll need a Sentry account. Create one at [https://sentry.io/](https://sentry.io/)
*   **Expo Project:** You should have an existing Expo React Native project.

**Steps:**

**1.  Set up Sentry in Your Node.js/Express Backend:**

   *   **Install Sentry:**
       ```bash
       npm install sentry
       ```

   *   **Create a Sentry SDK:**  Inside your Express application (e.g., `server.js` or `app.js`), import and initialize the Sentry SDK:

       ```javascript
       const Sentry = require('sentry-node');

       // Your Sentry DSN (Data Source Name) - Get this from your Sentry dashboard
       const SENTRY_DSN = 'YOUR_SENTRY_DSN';

       // Initialize Sentry
       Sentry.init({
           dsn: SENTRY_DSN,
           // Optional: Add an environment variable to categorize events
           environment: process.env.NODE_ENV || 'development',
           // Optional: Sample requests (for performance monitoring)
           tracesSampleRate: 0.1,
       });

       // Example: Log an error
       app.get('/error', (req, res) => {
           throw new Error('This is a test error!');
       });
       ```

   *   **Important:**  Replace `YOUR_SENTRY_DSN` with your actual Sentry DSN. You can find this on your Sentry dashboard after creating your project.

**2.  Integrate Sentry into your Expo React Native App:**

   *   **Install Sentry SDK:**

       ```bash
       npm install @sentry/react-native
       ```

   *   **Import and Initialize the Sentry SDK:**  In your main `App.js` (or the root of your app), import and initialize the React Native Sentry SDK:

       ```javascript
       import Sentry from '@sentry/react-native';

       // Your Sentry DSN - Same as your backend
       const SENTRY_DSN = 'YOUR_SENTRY_DSN';

       Sentry.init({
           dsn: SENTRY_DSN,
           // Optional: Add an environment variable to categorize events
           environment: process.env.NODE_ENV || 'development',
           // Optional:  Set trackingOptions for custom event tracking
           trackingOptions: {
               // You can customize tracking options here if needed
           },
       });

       // Example: Log an error
       console.error('This is a test error from React Native'); // Sentry will capture this
       ```

   *   **Replace `YOUR_SENTRY_DSN` with your actual Sentry DSN.**

**3.  Configure Sentry for Expo:**

   *   **Expo Configuration (Optional but Recommended):**  To help Expo properly manage Sentry, it's highly recommended to configure Sentry within your `app.json` or `app.config.js` file.  This allows Expo to automatically handle Sentry initialization.

       ```json
