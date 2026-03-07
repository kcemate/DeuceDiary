# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-04T01:05:59.849722

## Sentry Setup Guide for Expo React Native + Express

This guide outlines the steps to integrate Sentry into your Expo React Native application and your Express backend, providing comprehensive error tracking and monitoring.

**Prerequisites:**

*   **Node.js & npm/yarn:** Ensure you have Node.js and a package manager (npm or yarn) installed.
*   **Expo CLI:**  Make sure you have Expo CLI installed globally: `npm install -g expo-cli`
*   **Sentry Account:**  You'll need a Sentry account. Sign up at [https://sentry.io/](https://sentry.io/)
*   **Expo Go App:** Have the Expo Go app installed on your mobile device.

**Steps:**

**1.  Install Sentry Dependencies:**

   *   **React Native:**  Install the Sentry SDK for React Native:

       ```bash
       npm install @sentry/react-native
       # or
       yarn add @sentry/react-native
       ```

   *   **Express (Backend):** Install the Sentry SDK for Node.js:

       ```bash
       npm install @sentry/node
       # or
       yarn add @sentry/node
       ```

**2. Configure Sentry (Backend - Express):**

   *   **Create a Sentry Project:** In your Sentry dashboard, create a new project for your Express application. This gives you the project ID (e.g., `YOUR_PROJECT_ID`).

   *   **Update Express App:**  Add the following code to your Express application's main file (e.g., `app.js` or `index.js`):

     ```javascript
     const Sentry = require('@sentry/node');

     // Set the global Sentry initializer
     Sentry.init({
       dsn: 'YOUR_PROJECT_ID', // Replace with your Sentry project ID
       // Optionally, include integrations:
       // integrations: [
       //   require('@sentry/integrations/browser') // For browser integrations
       // ]
     });

     // Your Express application code here...
     ```

   *   **Error Handling Middleware:**  Implement robust error handling middleware in your Express app to capture and send errors to Sentry.  This is *crucial*.

     ```javascript
     app.use((err, req, res, next) => {
       console.error(err.stack);  // Log to console for debugging

       // Send error to Sentry
       Sentry.captureException(err, {
         extra: {
           req: req.body, // Include request body for context
           headers: req.headers, // Include request headers
           url: req.originalUrl, // Include the original URL
         }
       });

       res.status(500).send('Something went wrong!');
     });
     ```

   *   **Important:**  Make sure your Express app always calls `Sentry.init()` at the start.

**3. Configure Sentry (React Native - Expo):**

   *   **Install Sentry SDK:**

       ```bash
       npm install @sentry/react-native
       # or
       yarn add @sentry/react-native
       ```

   *   **Update App.js (or Entry File):**  Add the following code to your main entry file (usually `App.js`) or where you initialize your React Native app:

     ```javascript
     import Sentry from '@sentry/react-native';

     Sentry.init({
       dsn: 'YOUR_PROJECT_ID', // Replace with your Sentry project
