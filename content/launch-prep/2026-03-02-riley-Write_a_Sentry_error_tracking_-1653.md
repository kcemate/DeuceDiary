# Write a Sentry error tracking setup guide for Expo React Nat
Agent: riley
Generated: 2026-03-02T16:53:13.714127

## Sentry Error Tracking Setup Guide for Expo React Native + Express.js

This guide outlines how to integrate Sentry into your Expo React Native and Express.js project for robust error tracking and improved debugging.

**1. Prerequisites:**

* **Node.js & npm/Yarn:** Ensure you have Node.js and a package manager installed.
* **Sentry Account:** Create a free Sentry account at [https://sentry.io/](https://sentry.io/).
* **Expo Project:** You should have an existing Expo project, either created using `expo init` or using an existing one.

**2. Installation:**

**a) React Native (Expo):**

```bash
npm install @sentry/react-native
# or
yarn add @sentry/react-native
```

**b) Express.js (Backend):**

```bash
npm install sentry
# or
yarn add sentry
```

**3. Configuration:**

**a) React Native (Expo):**

1. **Obtain Your Sentry Project ID:**  Log in to your Sentry dashboard and note down your project ID.

2. **Configure `sentry/native/config.ts` (Recommended):**
   Create a file named `sentry/native/config.ts` in your project root.  This is where you'll centralize your Sentry configuration.

   ```typescript
   import { SentrySDK } from '@sentry/react-native';

   const SENTRY_PROJECT_ID = 'YOUR_SENTRY_PROJECT_ID';

   export default (config: any) => {
     SentrySDK.init({
       dsn: `https://${SENTRY_PROJECT_ID}.sentry.io/`,
       // Set this to true if you want Sentry to track device information
       // and user metadata.  Be mindful of privacy implications!
       // enabled: true,
       // ...other configurations...
     });
   };
   ```

   * **Replace `YOUR_SENTRY_PROJECT_ID`:**  Insert your actual Sentry project ID.
   * **`enabled: true`:**  Consider enabling this to capture device information and user metadata. However, be extremely mindful of user privacy and data regulations.  Disable or limit data collection if necessary.
   * **Customize:** Explore other options like `tracesetSamplingRate`, `trackOriginalStackTraces`, etc. based on your needs.

3. **Import and Call the Configuration:**
   In your `App.js` (or wherever your application initializes):

   ```typescript
   import * as Expo from 'expo';
   import { AppRegistry } from 'react-native';
   import SentryConfig from './sentry/native/config';

   AppRegistry.registerApp('MyApp', () => App);
   SentryConfig(App); // Pass the App component
   ```

   *  The `App` component is now automatically initialized with Sentry.

**b) Express.js (Backend):**

1. **Get Your Sentry Project ID:**  Same as with React Native, get your Project ID from the Sentry dashboard.

2. **Install `sentry`:** (already done in step 2b)

3. **Initialize Sentry in your Express app:**  In your main Express file (e.g., `server.js` or `app.js`), import and initialize Sentry:

   ```javascript
   const express = require('express');
   const Sentry = require('sentry');

   const app = express();
   const port = process.env.PORT || 3000;

   // Set the global Sentry
