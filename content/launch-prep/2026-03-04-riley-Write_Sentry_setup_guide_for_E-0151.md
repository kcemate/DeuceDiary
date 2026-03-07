# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-04T01:51:25.187655

Okay, let's create a comprehensive Sentry setup guide specifically tailored for an Expo React Native app integrated with an Express backend. This guide will cover the essential steps to integrate Sentry into both your React Native app and your Express server.

**Understanding the Integration**

* **React Native App:** We'll use the `sentry-expo` package to send error reports, crash reports, and other telemetry from your React Native app to Sentry.
* **Express Server:** We'll use the Sentry Node.js SDK to track server-side errors (database issues, API errors, etc.) and send those to Sentry.
* **Unified Reporting:** Ideally, you want both the React Native and server-side errors reported in the same Sentry project for a holistic view of your application's health.

**Prerequisites**

* **Sentry Account:** You need a Sentry account. Create one at [https://sentry.io/](https://sentry.io/).
* **Sentry Project:** Create a new Sentry project within your account. Note the project key (a string of characters).  You'll need this key for configuration.
* **Node.js & npm/yarn:**  Ensure you have Node.js and a package manager (npm or yarn) installed.
* **Expo CLI:**  Have the Expo CLI installed globally: `npm install -g expo-cli`

**Step 1: Install Sentry Packages**

In your React Native project directory, install the necessary packages:

```bash
npm install sentry-expo sentry-node --save
# or using yarn
yarn add sentry-expo sentry-node
```

* **`sentry-expo`:**  The Expo-specific package for React Native integration.
* **`sentry-node`:**  The Node.js SDK for tracking server-side errors.

**Step 2: Configure Sentry in your React Native App**

1. **Create a Sentry Client:**
   - In your React Native app's entry file (e.g., `App.js` or `index.js`), create a Sentry client:

     ```javascript
     import Sentry from 'sentry-expo';

     Sentry.init({
       dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
       trackPerformance: true, // Enable performance tracking (optional)
       enableSourceMaps: true, // Enable source maps for easier debugging (recommended)
       // Additional configuration options can be found here: https://docs.sentry.io/platforms/javascript/guides/client/
     });
     ```

2. **Get your Sentry DSN:**
   -  In your Sentry dashboard, navigate to your project.
   -  Under "Project settings" -> "SDK defaults" -> "Install SDK," you'll find your DSN (Data Source Name). It looks like: `https://<your-project-id>.sentry.io/`  Replace `<your-project-id>` with your actual Sentry project ID.

3. **Install `sentry-node` in your React Native App:**

    ```javascript
    import Sentry from 'sentry-expo';
    import { SentryNode } from 'sentry-node';

    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN',
      trackPerformance: true,
      enableSourceMaps: true,
    });

    //  SentryNode Initialization (For Server-Side Tracking)
    const sentryNode = new SentryNode({
        dsn: 'YOUR_SENTRY_DSN',
        environment: 'react-native', //
