# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-04T10:55:30.233412

Okay, here's a comprehensive Sentry setup guide specifically tailored for an Expo React Native application integrated with an Express backend. This guide covers all the necessary steps, including installation, configuration, and best practices.

**Understanding the Setup**

We'll be using Sentry to monitor errors across both your React Native app (Expo) and your Express backend.  This provides a holistic view of your application's health.

**Prerequisites:**

* **Sentry Account:** You'll need a Sentry account. Sign up at [https://sentry.io/](https://sentry.io/)
* **Expo Project:**  You should have an existing Expo React Native project.
* **Express Backend:** You should have an existing Express backend application.  (This guide assumes you're using Node.js for the backend)

**Step 1: Install Sentry Packages**

Install the Sentry SDKs for both React Native and Node.js (Express)

* **React Native (Expo):**

   ```bash
   npx expo install @sentry/react-native
   ```

* **Node.js (Express Backend):**

   ```bash
   npm install @sentry/node
   # or
   yarn add @sentry/node
   ```

**Step 2: Configure Sentry (Backend - Express)**

1. **Create a Sentry Project:** In your Sentry dashboard, create a new project for your backend.  Give it a descriptive name (e.g., "Express Backend").

2. **Get Your Project ID:**  The Project ID is a unique identifier for your project.  You'll find it in the Sentry dashboard.  Note this ID – you'll need it in the next steps.

3. **Configure `sentry.config.js` (or equivalent):**  Create or modify a `sentry.config.js` file in your Express backend's root directory.  This file will contain the Sentry configuration.

   ```javascript
   // sentry.config.js
   module.exports = {
     dsn: 'YOUR_SENTRY_DSN', // Replace with your DSN
     // Optional: Enable automatic release tracking
     release: 'v1.0',
     integrations: {
       // Add integrations for other services you use (e.g., Jira, Rollbar)
       // Example:
       // Jira: {
       //   url: 'https://your-jira-url.com',
       //   projectKey: 'YOUR_JIRA_PROJECT_KEY',
       // },
     },
   };
   ```

   * **DSN (Data Source Name):** The DSN is the core of your Sentry configuration. You'll obtain it from your Sentry dashboard.  It looks something like: `https://YOUR_SENTRY_PROJECT_ID@sentry.io`  (Replace `YOUR_SENTRY_PROJECT_ID` with your actual project ID.)
   * **Release:**  Set the release version of your application. This helps you correlate errors with specific deployments.

**Step 3: Initialize Sentry in Your Express Backend**

1. **Import Sentry:**  In your Express backend's main application file (e.g., `app.js` or `server.js`), import the Sentry SDK.

2. **Initialize Sentry:** Initialize the Sentry SDK using the configuration you created in `sentry.config.js`.

   ```javascript
   // app.js (or server.js)
   const Sentry = require('@sentry/node');

   // Set the DSN
   Sentry.init({
     dsn: process.env
