# Write a Sentry error tracking setup guide for Expo React Nat
Agent: riley
Generated: 2026-03-02T18:23:55.033364

## Sentry Error Tracking Setup Guide for Expo React Native + Express.js

This guide outlines how to integrate Sentry into your Expo React Native and Express.js project, providing detailed instructions on installation, configuration, source maps, release tracking, and alert rules.

**Prerequisites:**

* **Expo CLI:** You need to have the Expo CLI installed and configured.
* **Node.js & npm/yarn:** Ensure Node.js and a package manager (npm or yarn) are installed.
* **Sentry Account:** You'll need a Sentry account. Sign up at [https://sentry.io/](https://sentry.io/).

**1. Installation:**

* **React Native (Expo):**
   ```bash
   npm install @sentry/react-native
   # or
   yarn add @sentry/react-native
   ```
* **Express.js:**
   ```bash
   npm install sentry
   # or
   yarn add sentry
   ```

**2. Configuration:**

**2.1. Sentry SDK Initialization (React Native):**

Within your main App.js or the root component of your Expo app, initialize the Sentry SDK:

```javascript
import * as React from 'react';
import { AppRegistry } from 'react-native';
import { Sentry } from '@sentry/react-native';

// Your Sentry SDK URL (replace with your actual URL)
const SENTRY_DSN = 'YOUR_SENTRY_DSN';

// Initialize Sentry
Sentry.init({
  dsn: SENTRY_DSN,
  // Optional:  Customization options
  // performanceMonitoring: true, // Enable performance monitoring
  // trackUserInterfaceAppearance: true, // Track UI appearance changes
  // reporters: {
  //   // Customize the reporting destination
  //   //  Example:  'console'  (logs to console)
  // }
});

AppRegistry.registerComponent('MyApp', () => App);
```

**Replace `YOUR_SENTRY_DSN` with your actual Sentry DSN (Data Source Name).** You can obtain your DSN from your Sentry dashboard.  It typically looks like: `https://your-project-id.sentry.io/`

**2.2. Sentry SDK Initialization (Express.js):**

In your Express.js server, initialize the Sentry SDK:

```javascript
const express = require('express');
const Sentry = require('sentry');

// Replace with your actual Sentry DSN
const SENTRY_DSN = 'YOUR_SENTRY_DSN';

// Initialize Sentry
Sentry.init({
  dsn: SENTRY_DSN,
  // Optional: customize behavior
  //  trackTransactionOrigins: true // Track HTTP request origins
});

const app = express();

// Your routes and middleware here...

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
```

**3. Source Maps:**

* **Expo's Bundle Generation:** Expo creates bundle maps for your JavaScript code.  Sentry automatically leverages these maps to accurately pinpoint errors in your source code, even if it's transpiled or minified.
* **Native Modules:** If you're using native modules, ensure you are providing the corresponding native source maps to Sentry. This is crucial for debugging native code. You'll often need to configure this manually in Sentry's project settings.

**4. Release Tracking:**

Release tracking is *extremely* important for managing your app's different versions and understanding which releases are
