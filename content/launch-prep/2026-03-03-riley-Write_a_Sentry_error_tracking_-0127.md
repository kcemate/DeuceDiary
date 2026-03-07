# Write a Sentry error tracking setup guide for Expo React Nat
Agent: riley
Generated: 2026-03-03T01:27:00.883422

## Sentry Error Tracking Setup Guide for Expo React Native + Express.js

This guide outlines a robust Sentry error tracking setup for your Expo React Native app integrated with an Express.js backend. It covers installation, configuration, source maps, release tracking, and alert rules.

**1. Project Setup & Prerequisites**

* **Expo Project:** You have an existing Expo React Native project.
* **Express.js Backend:**  You have an Express.js backend serving your application's API.
* **Node.js & npm/Yarn:**  Ensure Node.js and your package manager (npm or Yarn) are installed.
* **Sentry Account:** You have a Sentry account.  Sign up at [https://sentry.io/](https://sentry.io/)

**2. Installation**

**a) React Native (Expo):**

```bash
npm install @sentry/react-native
# or
yarn add @sentry/react-native
```

**b) Express.js Backend:**

```bash
npm install @sentry/node
# or
yarn add @sentry/node
```

**3. Configuration**

**a) React Native:**

1. **Initialize Sentry:** In your main app file (e.g., `App.js`):

   ```javascript
   import * as React from 'react';
   import { AppRegistry } from 'react-native';
   import App from './App'; // Your main App component
   import { name as appName } from './app.json';
   import Sentry from '@sentry/react-native';

   Sentry.init({
     dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
     enableSourceMaps: true, // Recommended for debugging
     trackUserActions: true, // Optional - Track user interactions
     // Optional: Customize tracking
     // namespaces: {
     //   'user': 'your-namespace-user',
     //   'product': 'your-namespace-product'
     // },
   });

   AppRegistry.registerComponent(appName, () => App);
   ```

   * **`YOUR_SENTRY_DSN`:**  This is your Sentry Data Source Name (DSN).  You can find it in your Sentry dashboard after creating a project.  It typically looks like `https://YOUR_APP_ID.sentry.io/`
   * **`enableSourceMaps: true`:**  Crucial for debugging!  This allows Sentry to map errors to the exact source code of your React Native components.
   * **`trackUserActions: true`:**  Optional, but highly recommended.  This tracks user actions (e.g., button presses, navigation) which can provide valuable context for errors.
   * **`namespaces`:**  (Optional)  Allows you to categorize errors within your Sentry project.  Useful for large projects.

2. **Environment Variables:**  Store your Sentry DSN in an environment variable for security and flexibility. You can use Expo's environment variables or a more sophisticated solution like `dotenv`.

   * **Expo Environment Variables:**  Set in `App.js`:  `Sentry.init({ dsn: process.env.SENTRY_DSN });`  and then set the environment variable in your Expo development environment.

**b) Express.js Backend:**

1. **Initialize Sentry:** In your main Express file (e.g., `server.js` or `app.js`):

   ```javascript
   const express = require('express');
   const app = express();
   const Sentry = require('@sentry/
