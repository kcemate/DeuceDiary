# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T20:56:56.928839

## Sentry Setup Guide for Expo React Native + Express

This guide outlines the steps to integrate Sentry into your Expo React Native app and your Express backend for comprehensive error tracking.

**Prerequisites:**

* **Node.js & npm/yarn:** Make sure you have Node.js and npm (or yarn) installed.
* **Expo CLI:**  Ensure you have the Expo CLI installed: `npm install -g expo-cli` or `yarn global add expo-cli`
* **Sentry Account:**  Create a free account on [Sentry](https://sentry.io/)

**Steps:**

**1. Install Sentry Packages:**

   * **For React Native (Expo):**
     ```bash
     npm install @sentry/react-native
     # or
     yarn add @sentry/react-native
     ```

   * **For Express (Backend):**
     ```bash
     npm install @sentry/node
     # or
     yarn add @sentry/node
     ```

**2. Configure Sentry SDKs:**

   * **React Native (Expo):**
     * **Create a Sentry Configuration File:**  Create a file (e.g., `sentry.config.js`) within your Expo project to hold your Sentry configuration.
     * **Add Configuration:**
       ```javascript
       module.exports = {
         dsn: 'YOUR_SENTRY_DSN', // Replace with your DSN
         // Optional:  Set project name
         // project: 'YOUR_PROJECT_NAME',
       };
       ```
       **Important:**  Your **DSN (Data Source Name)** is a unique identifier for your Sentry account. You can find it in your Sentry dashboard after creating a project.  It typically looks like `sentry.io/<your_project_id>/<your_environment>`.

     * **Import and Initialize Sentry in your App:**
       ```javascript
       import * as Sentry from '@sentry/react-native';
       import { SentryConfig } from './sentry.config.js'; // Import your configuration

       Sentry.init({
         ...SentryConfig,
       });

       //  For automatic context and reporting:
       Sentry.setAnonymous(true); //  Set to true to anonymize reports (recommended)

       // You can also manually set context:
       //  Sentry.captureException(new Error("Something went wrong!"));
       ```

   * **Express (Backend):**
     * **Create a Sentry Configuration File:** Create a file (e.g., `sentry.config.js`) in your Express project to hold your Sentry configuration.
     * **Add Configuration:**
       ```javascript
       module.exports = {
         dsn: 'YOUR_SENTRY_DSN', // Replace with your DSN
       };
       ```
     * **Install Sentry Middleware:**  Install the Sentry Node.js SDK: `@sentry/node`.
     * **Configure Middleware in your Express App:**
       ```javascript
       const Sentry = require('@sentry/node');
       const config = require('./sentry.config.js');

       Sentry.init({
         dsn: config.dsn,
         // Optional:  Add tags or integrations here
       });

       // Example:  Middleware to catch errors before they reach the client
       app.use((err, req, res, next) => {
         console.error(err.stack);
         Sentry.captureException(err, {
           request: req,
         });
         res.status(500).send
