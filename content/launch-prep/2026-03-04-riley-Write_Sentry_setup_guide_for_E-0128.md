# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-04T01:28:47.755561

Okay, here's a detailed Sentry setup guide for an Expo React Native app combined with an Express backend, incorporating best practices and common considerations.

**Understanding the Setup**

* **Expo React Native:**  We'll use Expo's SDK for React Native, which simplifies development and deployment.
* **Express.js:** This is your Node.js backend API.
* **Sentry:** A comprehensive error tracking and performance monitoring platform.
* **Expo Application Service (EAS):**  We'll use EAS to manage your build process and deployments, greatly simplifying the Sentry integration.

**Prerequisites**

* **Expo Account:** You'll need an Expo account ([https://expo.dev/](https://expo.dev/)).
* **Node.js and npm/yarn:** Make sure you have Node.js and a package manager (npm or yarn) installed.
* **Sentry Account:**  Sign up for a Sentry account at [https://sentry.io/](https://sentry.io/).
* **Expo Application Service (EAS):** You'll need to set up and configure EAS.  Follow the official documentation: [https://docs.expo.dev/app-service/](https://docs.expo.dev/app-service/)

**Steps**

**1. Install Sentry SDK (React Native App)**

   * Navigate to your Expo React Native project directory:
     ```bash
     cd your-expo-project
     ```
   * Install the Sentry SDK:
     ```bash
     npm install @sentry/react-native
     # or
     yarn add @sentry/react-native
     ```

**2. Initialize Sentry SDK (React Native App)**

   * **Create a Sentry Client:** Inside your main application file (e.g., `App.js` or `index.js`), create a Sentry client and configure it:

     ```javascript
     import * as Sentry from '@sentry/react-native';

     // Important: Set your Sentry project ID
     Sentry.init({
       dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
       // Optional:  Automatic track user actions
       trackUserActions: true,
       // Optional:  Enable performance monitoring
       tracesSampleRate: 0.5, // Send traces for 50% of requests
     });

     // Example of tracking a custom event
     Sentry.captureEvent({
       message: 'My custom event',
       details: {
         value: 123,
       },
     });

     export default Sentry.RootCloseHandler; // Required for reliable app closing
     ```

   * **Replace `YOUR_SENTRY_DSN`:**  Get your DSN (Data Source Name) from your Sentry dashboard. It will look something like: `sentry.io/<your-project-id>/<your-org-id>`

**3. Install Sentry SDK (Express Backend)**

   * Navigate to your Express backend directory.
   * Install the Sentry SDK for Node.js:
     ```bash
     npm install @sentry/node
     # or
     yarn add @sentry/node
     ```

**4. Initialize Sentry SDK (Express Backend)**

   * In your Express application's main file (e.g., `server.js`, `app.js`), initialize Sentry:

     ```javascript
     const Sentry = require('@sentry/node');

     // Set the global Sentry client
     Sentry.init({
       dsn: 'YOUR_SENTRY_DSN', // Replace
