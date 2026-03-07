# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-04T11:40:45.674896

## Sentry Setup Guide for Expo React Native + Express

This guide will walk you through setting up Sentry for your Expo React Native app and your accompanying Express.js backend. It's a common and highly recommended setup to track crashes, errors, and performance issues.

**Prerequisites:**

* **Expo CLI Installed:**  Make sure you have Expo CLI installed globally: `npm install -g expo-cli`
* **Node.js and npm/yarn:** You need Node.js and npm or yarn installed on your system.
* **Sentry Account:** Sign up for a Sentry account at [https://sentry.io/](https://sentry.io/).
* **Express.js Backend:** You should already have an Express.js backend set up for your API.

**1. Create a Sentry Project in Sentry:**

* Log in to your Sentry account.
* Click "Create project".
* Choose "Single app" for React Native.
* Give your project a descriptive name (e.g., "MyExpoApp").
* Select the programming language (JavaScript).
*  Set your app's environment (e.g., Production, Staging, Development -  Production is recommended for live apps).
* Click "Create".
* Note down your **Sentry SDK Key** and **Project ID**. You'll need these in the next steps.


**2. Install Sentry Dependencies:**

* **React Native:**
   ```bash
   npm install @sentry/react-native
   # or
   yarn add @sentry/react-native
   ```
* **Express.js Backend:**
   ```bash
   npm install @sentry/node
   # or
   yarn add @sentry/node
   ```

**3. Configure Sentry React Native App:**

* **Copy Sentry SDK:** Copy the Sentry SDK from the `@sentry/react-native` package.  This step ensures you have the correct SDK version for your Expo project.

   ```bash
   npm install -g @sentry/react-native
   ```

* **Initialize Sentry in your Expo app:**

   1. **Navigate to your Expo project directory:** `cd my-expo-app`
   2. **Create a `sentry.init` file:** Create a new file (e.g., `sentry.init.js`) inside the root of your Expo project.
   3. **Paste the SDK configuration:**
      ```javascript
      import * as Sentry from '@sentry/react-native';

      Sentry.init({
        dsn: 'YOUR_SENTRY_DSN', // Replace with your DSN
        // Set traces to true to enable tracing
        tracesEnabled: true,
        // Optionally include performance monitoring
        performanceTracingUrl: 'YOUR_PERFORMANCE_TRACING_URL', // (Optional)
      });
      ```
   4. **Replace placeholders:**
      * `YOUR_SENTRY_DSN`:  Replace this with your complete Sentry DSN. The DSN looks like this: `https://YOUR_PROJECT_ID@sentry.io/`
      * `YOUR_PERFORMANCE_TRACING_URL`: (Optional) Replace this with the URL to your Sentry performance tracing endpoint if you are using it.

   5. **Import `sentry.init`:**  Import the `sentry.init` file into your main application file (usually `App.js` or `index.js`):

      ```javascript
      import { App } from './App'; // Or your main app component
      import './sentry.init'; // Import the Sentry initialization

      export default App;
