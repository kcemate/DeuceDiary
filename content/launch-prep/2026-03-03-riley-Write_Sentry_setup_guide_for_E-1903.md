# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T19:03:45.298867

## Sentry Setup Guide for Expo React Native + Express

This guide outlines the steps to integrate Sentry into your Expo React Native project with an Express backend.  It covers the key aspects of installation, configuration, and testing.

**Prerequisites:**

* **Expo CLI:** Ensure you have Expo CLI installed globally (`npm install -g expo-cli`)
* **Node.js & npm/yarn:**  Have Node.js and a package manager (npm or yarn) installed.
* **Expo Development Environment:**  You should have a development environment set up for Expo (e.g., Expo Go app on a mobile device or emulator).
* **Express Server:** You need an existing Express server (or a simple one for this setup).

**Steps:**

**1. Install Sentry Packages:**

Navigate to your Expo React Native project directory in your terminal and install the necessary Sentry packages:

```bash
npm install @sentry/react-native @sentry/node
# or with yarn
yarn add @sentry/react-native @sentry/node
```

**2.  Configure Sentry in React Native:**

   * **Create `sentry.expo` (or similar):**  Create a file named `sentry.expo` (or a name of your choice) in your project's root directory. This file will contain your Sentry configuration.
   * **Add Configuration:**  Paste the following configuration into `sentry.expo`.  Adjust the values to match your needs.

     ```javascript
     import * as Sentry from '@sentry/react-native';

     // Replace with your Sentry project ID
     const SENTRY_PROJECT_ID = 'YOUR_SENTRY_PROJECT_ID';

     Sentry.init({
       dsn: 'YOUR_SENTRY_DSN',
       // Set initializers here - recommended for faster startup
       // You can include these in the init options:
       // initialize: (Sentry, app) => {
       //   // Custom initialization logic here
       // },
       // Performance Initializer (Optional, but highly recommended)
       performanceTracking: {
          enabled: true,
          // Add custom settings here if needed
       },
     });
     ```

     * **`YOUR_SENTRY_PROJECT_ID`:**  This is a unique identifier for your Sentry project. You'll get this from the Sentry website ([https://sentry.io](https://sentry.io)).
     * **`YOUR_SENTRY_DSN`:**  This is your Sentry Data Source Name (DSN).  It's a URL that Sentry uses to connect to your project.  You can generate this DSN on the Sentry website.  It will typically look something like:
       `https://<YOUR_PROJECT_ID>@sentry.io/your-org`

   * **Import and Initialize in Your App:** Import the `Sentry` object and call `Sentry.init()` in your main app component (usually `App.js` or `index.js`).

     ```javascript
     import { AppRegistry } from 'react-native';
     import Sentry from '@sentry/react-native';

     // ... your App code ...

     AppRegistry.registerComponent('YourAppName', () => App);
     Sentry.init({
       dsn: 'YOUR_SENTRY_DSN',
     });
     ```

**3. Configure Sentry in Your Express Server:**

   * **Install `@sentry/node`:**  Install the Node.js Sentry package in your Express project.

     ```bash
     npm install @sentry/node
     #
