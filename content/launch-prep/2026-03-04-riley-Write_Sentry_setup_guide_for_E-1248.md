# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-04T12:48:50.938265

## Sentry Setup Guide for Expo React Native + Express

This guide outlines the steps to integrate Sentry into your Expo React Native project with an Express backend.  This approach is common when you have a client-side (Expo React Native) app and a server-side (Express) backend.

**Prerequisites:**

* **Expo CLI:** Make sure you have Expo CLI installed globally: `npm install -g expo-cli`
* **Node.js & npm/yarn:** You’ll need Node.js and a package manager (npm or yarn) installed.
* **Sentry Account:**  You'll need a Sentry account. Create one at [https://sentry.io/](https://sentry.io/).
* **Sentry SDK:**  You'll need a Sentry SDK for React Native and Express.

**Steps:**

**1. Install Sentry Packages:**

   * **React Native (Client-Side):**
     ```bash
     npm install @sentry/react-native
     # or
     yarn add @sentry/react-native
     ```
   * **Express (Server-Side):**
     ```bash
     npm install @sentry/node
     # or
     yarn add @sentry/node
     ```

**2. Configure Sentry React Native Client:**

   * **Create a Sentry Configuration File:** Create a file, for example, `sentry.config.js`, in the root of your Expo project. This file will hold your Sentry configuration.

     ```javascript
     // sentry.config.js
     import * as Sentry from '@sentry/react-native';

     Sentry.init({
       dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
       // performanceMonitoring: true, // Enable performance monitoring
       // enableSourceMaps: true, // Helps with debugging
       // trackJavascriptExceptions: true,  // Track exceptions thrown in JavaScript code
       // beforeExceptionInitializers: [
       //   //  Add any custom exception initializers here
       // ],
       // ignoreDuplicateReports: true, //  Ignore duplicate reports
     });
     ```

     * **`YOUR_SENTRY_DSN`:** This is your Sentry DSN (Data Source Name). You'll find it on your Sentry dashboard after creating an account.  It looks something like: `https://<your-app-id>@sentry.io/<your-project-id>`
     * **`performanceMonitoring: true`:**  Enable this to track performance metrics.
     * **`enableSourceMaps: true`:**  Highly recommended for easier debugging.
     * **`trackJavascriptExceptions: true`:**  Helps you catch errors in your JavaScript code.

   * **Initialize Sentry in your Expo App:**  Import and initialize Sentry in your root app file (usually `App.js` or `App.tsx`).

     ```javascript
     // App.js or App.tsx
     import * as Sentry from '@sentry/react-native';
     import { ExpoRoot } from '@expo/expo-router';

     Sentry.init({
       dsn: 'YOUR_SENTRY_DSN',
       // ... (configure other options as needed)
     });

     export default function App() {
       return (
         <ExpoRoot />
       );
     }
     ```

**3. Configure Sentry Express Server:**

   * **Install Sentry Node SDK:** You've already done this in step 1.
   * **Configure Sentry in your Express Application:**

     ```javascript
     // server.js
