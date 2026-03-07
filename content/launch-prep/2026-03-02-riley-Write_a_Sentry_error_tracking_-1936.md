# Write a Sentry error tracking setup guide for Expo React Nat
Agent: riley
Generated: 2026-03-02T19:36:25.478649

## Sentry Error Tracking Setup Guide for Expo React Native + Express.js

This guide outlines how to integrate Sentry into your Expo React Native and Express.js application for robust error tracking and monitoring.

**1. Prerequisites:**

* **Expo CLI:** Ensure you have Expo CLI installed: `npm install -g expo-cli`
* **Node.js & npm:**  Node.js and npm should be installed on your development machine.
* **Sentry Account:**  Create a free account on [Sentry](https://sentry.io/).

**2. Installation:**

**React Native (Expo):**

* **Install the Sentry SDK:**
  ```bash
  npm install @sentry/react-native
  ```

**Express.js (Backend):**

* **Install the Sentry Node.js SDK:**
  ```bash
  npm install @sentry/node
  ```

**3. Configuration:**

**React Native (Expo):**

* **Create a Sentry configuration file:** Create a file, e.g., `sentry.config.js`, and add your Sentry DSN (Data Source Name):
  ```javascript
  // sentry.config.js
  export default {
    dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
    // Optional:  For faster error reporting, consider enabling:
    // tracesets: ['production'] // Only send traces from production builds
  };
  ```
  * **Get your Sentry DSN:**  Go to your Sentry dashboard, click "Add Project," and follow the instructions to get your DSN.  It looks like `https://<your-app-id>.sentry.io/`

* **Import and initialize Sentry in your App.js:**
  ```javascript
  import * as React from 'react';
  import { Expo } from 'expo';
  import Sentry from '@sentry/react-native';

  export default function App() {
    // ... your App component code ...

    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN',
      // Optionally, set a release:
      release: '1.0.0',
    });

    return (
      // ... your App component JSX ...
    );
  }
  ```
  * **Note:** Ensure Sentry is initialized *before* rendering any components.



**Express.js (Backend):**

* **Import and initialize Sentry in your main Express file (e.g., `app.js`):**
  ```javascript
  const express = require('express');
  const app = express();
  const Sentry = require('@sentry/node');

  // ... your Express middleware ...

  Sentry.init({
    dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
    // Optionally, set a release:
    release: '1.0.0',
  });

  // ... your Express routes ...
  ```

**4. Source Maps:**

* **Enable Source Maps in Expo:**  Source maps are *crucial* for debugging errors in your React Native code.  By default, Expo's development builds don't always include source maps.  You need to explicitly enable them:

    * **Expo Development Build:** Ensure you're using the development build when debugging. You can do this with the Expo DevTools or by running: `expo start -dev`
    * **Configure Metro Bundler:**  By default, Metro Bundler (Expo's bundler) should automatically include source maps. However, verify that it's configured
