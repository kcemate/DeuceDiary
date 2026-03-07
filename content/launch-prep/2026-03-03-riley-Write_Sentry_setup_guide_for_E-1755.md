# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T17:55:50.993588

## Sentry Setup Guide for Expo React Native + Express

This guide outlines how to integrate Sentry into your Expo React Native application and your associated Express server.  It covers installation, configuration, and best practices.

**Prerequisites:**

*   **Expo CLI:** Make sure you have Expo CLI installed and initialized.
*   **Sentry Account:** You need a Sentry account. Sign up at [https://sentry.io/](https://sentry.io/).
*   **Node.js & npm/yarn:** Ensure you have Node.js and a package manager (npm or yarn) installed.
*   **Expo Go App:** Have the Expo Go app installed on your mobile device for testing.

**Steps:**

**1. Install Sentry Packages:**

   **React Native (Expo):**

   ```bash
   npm install @sentry/react-native
   # OR
   yarn add @sentry/react-native
   ```

   **Express (Node.js):**

   ```bash
   npm install @sentry/node
   # OR
   yarn add @sentry/node
   ```

**2. Configure Sentry in Your React Native App (Expo):**

   *   **Create a `sentry.expo` file:**  This file will hold your Sentry configuration.  It's best to keep it in your project's root directory.

   *   **Example `sentry.expo`:**

     ```javascript
     import Sentry from '@sentry/react-native';

     export default {
       // Enable Sentry in your application
       environment: process.env.NODE_ENV || 'development',

       // Your Sentry Project ID (Get this from your Sentry dashboard)
       dsn: 'YOUR_SENTRY_DSN',

       // Optional: Set SDK version
       // SDK Version: 7.12.0
       // You can update this as your project evolves
       // This is for internal tracking and shouldn't be shared.
       version: '7.12.0',

       // Optional:  Integrate with Error Aggregation
       //  This allows you to submit aggregate error data to Sentry.
       //  This is generally beneficial for larger applications.
       //  This can be enabled or disabled
       sampleRate: 100, // 100% by default (no sampling)
     };
     ```

     *   **`dsn`:** Replace `YOUR_SENTRY_DSN` with your actual Sentry DSN (Data Source Name).  You can find this in your Sentry dashboard.  It usually looks like `sentry.io/YOUR_PROJECT_ID/`.
     *   **`environment`:**  Set the environment (e.g., 'development', 'production').  This helps Sentry categorize errors.
     *   **`version`:** (Optional)  Track your Sentry SDK version.
     *   **`sampleRate`:** (Optional)  Controls the percentage of errors that are sent to Sentry.  A `sampleRate` of 100% means all errors are sent.  A lower value (e.g., 50%) will only send a sample of errors, which can reduce noise and bandwidth costs, especially in production.

**3. Integrate Sentry into Your React Native Code:**

   *   **Import and Initialize Sentry:** In your main application file (usually `App.js` or `index.js`), import and initialize Sentry.

   *   **Example Integration:**

     ```javascript
     import React from 'react';
     import { AppRegistry } from 'react-native';
