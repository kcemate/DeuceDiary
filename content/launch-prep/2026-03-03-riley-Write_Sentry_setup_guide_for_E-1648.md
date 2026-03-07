# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T16:48:01.066320

Okay, here's a detailed Sentry setup guide specifically for a React Native Expo project combined with an Express backend. This guide covers the core steps and best practices.

**Understanding the Setup**

* **React Native Expo:** Expo simplifies React Native development with its managed workflow. Sentry integrates well, but you need to consider how you're capturing errors from both the JavaScript and native sides.
* **Express.js Backend:** Your Express server will likely generate errors that need to be captured.
* **Unified Approach:** The goal is to capture errors from both your Expo app and your Express API into a single Sentry instance.

**Prerequisites**

* **Node.js and npm/yarn:**  Ensure you have Node.js and a package manager (npm or yarn) installed.
* **Sentry Account:** Create a free Sentry account at [https://sentry.io/](https://sentry.io/).
* **Expo CLI:** Make sure you have Expo CLI installed globally: `npm install -g expo-cli`  or `yarn global add expo-cli`
* **Expo Project:** You should have an existing Expo React Native project.

**Steps**

**1. Install Sentry Packages:**

   In your Expo project's root directory, run the following command to install the necessary Sentry packages:

   ```bash
   npm install @sentry/react-native @sentry/node
   # OR
   yarn add @sentry/react-native @sentry/node
   ```

**2. Configure Sentry in Your Express Backend:**

   * **Create a `.sentry.js` file:**  In the root of your Express project, create a file named `.sentry.js`. This file will be responsible for initializing Sentry for your backend.

   * **Import and Initialize:** Add the following code to `.sentry.js`:

     ```javascript
     const Sentry = require('@sentry/node');

     // Replace with your Sentry project ID
     const SENTRY_PROJECT_ID = 'YOUR_SENTRY_PROJECT_ID';

     Sentry.init({
       dsn: `https://${SENTRY_PROJECT_ID}.sentry.io/` ,
       // Set sample rate (optional) - controls the percentage of transactions
       // that are automatically captured.  Higher rates mean more data, but
       // can increase Sentry costs.
       // sampleRate: 0.9,
     });
     ```

     **Important:** Replace `YOUR_SENTRY_PROJECT_ID` with your actual Sentry project ID.  You can find this in your Sentry dashboard.

   * **Enable Sentry in Your Express App:**  Import and use `Sentry.init()` in your main Express application file (e.g., `app.js` or `server.js`).

**3. Configure Sentry in Your Expo React Native App:**

   * **Install the `sentry-expo` Package:**  Install the `sentry-expo` package in your Expo project:

     ```bash
     npm install sentry-expo
     # OR
     yarn add sentry-expo
     ```

   * **Initialize Sentry in Your App:**  In your app's entry point (e.g., `App.js`), initialize Sentry.  **Crucially**, you'll need to use the `NativeModules.Sentry.init` function.

     ```javascript
     import { Sentry } from 'sentry-expo';

     // Replace with your Sentry project ID
     const SENTRY_PROJECT_ID = 'YOUR_SENTRY_PROJECT_ID';

     Sentry.init({
       dsn: `https
