# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-06T14:12:20.412659

## Sentry Setup Guide for Expo React Native + Express

This guide outlines how to integrate Sentry into your Expo React Native and Express.js application for robust error tracking and monitoring.

**Prerequisites:**

*   **Expo Project:** You have an existing Expo React Native project.
*   **Node.js & npm/yarn:** Node.js and a package manager (npm or yarn) are installed.
*   **Sentry Account:** You have a Sentry account and API key.  Sign up at [https://sentry.io/](https://sentry.io/).

**Steps:**

**1. Install Sentry Packages:**

   In your Expo React Native project, install the necessary Sentry packages:

   ```bash
   # Using npm
   npm install @sentry/react-native @sentry/node

   # Using yarn
   yarn add @sentry/react-native @sentry/node
   ```

**2. Configure Sentry in your Express.js Application (Backend):**

   You need to initialize Sentry in your backend (Express.js) to track errors originating from your API routes.

   *   **Create a `.sentry.js` file:** In your backend project's root directory, create a file named `.sentry.js`. This file will hold your Sentry initialization code.

   *   **Import and Initialize Sentry:**  Add the following code to `.sentry.js`:

       ```javascript
       const Sentry = require('@sentry/node');

       Sentry.init({
         dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
         tracesIncluded: ['/api/*'], // Optionally, include only specific routes for traces
       });

       //  Example:  Handle errors gracefully and report them to Sentry
       //  (This should be wrapped in your Express routes)
       const express = require('express');
       const app = express();

       app.get('/api/test', (req, res) => {
         try {
           // Your code here
           throw new Error('Intentional error');
         } catch (error) {
           Sentry.captureException(error, {
             extra: {
               req: req, // Send request details to Sentry
               user: 'test user' // Add user context if available
             }
           });
           res.status(500).send('Internal Server Error');
         }
       });

       module.exports = app;
       ```

       *   **`YOUR_SENTRY_DSN`:**  Replace this placeholder with your actual Sentry DSN.  You can find this in your Sentry dashboard after creating an app. It typically looks like: `https://<YOUR_PROJECT_ID>.<YOUR_ENVIRONMENT>.sentry.io/`

       *   **`tracesIncluded: ['/api/*']`:** This optional configuration tells Sentry to only include traces for requests to routes starting with `/api/`. This can help reduce Sentry noise if you have a lot of traces. Adjust this as needed.  Without this, Sentry will capture all traces.

       *   **`Sentry.captureException()`:** This function is crucial. It captures errors that occur in your code and sends them to Sentry for analysis.  The `extra` object is where you can add additional context to the error report, such as request details, user information, or stack traces.
   *  **Start your Express app**  Make sure to run your backend app.  This will start sending data to Sentry.

**3. Configure Sentry in your Expo React Native Application:**

   *   **Import
