# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T20:11:46.682726

## Sentry Setup Guide for Expo React Native + Express

This guide outlines the steps to integrate Sentry into your Expo React Native app and your Express backend, ensuring you catch errors and performance issues quickly.

**Prerequisites:**

* **Node.js & npm/yarn:** Make sure you have Node.js and npm or yarn installed.
* **Expo CLI:** Installed and configured correctly.
* **Sentry Account:** You'll need a Sentry account. Create one at [https://sentry.io/](https://sentry.io/).
* **Sentry SDK:** You'll need the Sentry SDK for React Native and the Express SDK.

**1.  Sentry Setup for React Native (Expo App)**

   * **Install the Sentry SDK:**

     ```bash
     npm install @sentry/react-native
     # or
     yarn add @sentry/react-native
     ```

   * **Initialize Sentry in your Expo App:**

     ```bash
     npx @sentry/init -D
     # or
     yarn sentry/init -D
     ```

     This command will ask you for your Sentry project ID.  You can find this in your Sentry dashboard after creating a project.  Paste it in and press Enter.  This creates a `sentry.expo.js` file in the root of your project.

   * **Import and Configure Sentry in your App:**

     Import `Sentry` and `Application` from `@sentry/react-native` into your main app component (e.g., `App.js`) and initialize Sentry:

     ```javascript
     import React from 'react';
     import { StyleSheet, View } from 'react-native';
     import { Sentry } from '@sentry/react-native';
     import AppNavigator from './navigation/AppNavigator'; // Your navigation

     // Replace 'YOUR_PROJECT_ID' with your actual Sentry project ID
     Sentry.init({
       dsn: 'YOUR_PROJECT_ID',
       trackPerformance: true, //  Track JS performance (optional)
       trackUserActions: true, //  Track user actions (optional)
       //  Other configurations as needed (e.g., release stage)
     });

     const App = () => {
       return (
         <View style={styles.container}>
           <AppNavigator />
         </View>
       );
     };

     const styles = StyleSheet.create({
       container: {
         flex: 1,
       },
     });

     export default App;
     ```

   * **Automatic Error Reporting:** By default, `@sentry/react-native` automatically captures errors from your React Native app.  If you're not seeing errors, ensure you've correctly set the `dsn`.


**2. Sentry Setup for Express Backend**

   * **Install the Sentry SDK:**

     ```bash
     npm install @sentry/node
     # or
     yarn add @sentry/node
     ```

   * **Initialize Sentry in your Express app:**

     ```javascript
     const express = require('express');
     const app = express();
     const Sentry = require('@sentry/node');

     // Replace with your Sentry project ID
     const sentryDSN = 'YOUR_PROJECT_ID';

     // Enable Sentry
     Sentry.init({
       dsn: sentryDSN,
       // Optional:  Configure logging levels for Sentry
       logLevels: ['debug', 'info', 'warn', 'error'],
     });

     // Your Express Routes Here...
