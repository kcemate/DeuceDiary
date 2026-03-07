# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-04T09:01:54.329352

Okay, let's craft a comprehensive Sentry setup guide specifically tailored for an Expo React Native app integrated with an Express backend. This guide will cover the essential steps and considerations.

**Understanding the Architecture**

Before diving in, let's quickly review the common setup:

*   **Expo React Native App:** Your client-side app, built and managed with Expo.
*   **Express Backend:** Your Node.js API, handling data, logic, and potentially communication with your React Native app.
*   **Sentry:**  The error tracking and performance monitoring service.

**Key Concepts & Considerations**

*   **Client-Side vs. Server-Side Tracking:**  You'll need to configure Sentry to capture errors from *both* your React Native app and your Express backend.
*   **Expo SDK & Native Modules:** Expo provides a managed environment.  Some native modules might need custom Sentry integrations.
*   **Environment Variables:** Using environment variables is crucial for managing your Sentry API key and other configuration settings securely.

**Step-by-Step Guide**

**1. Create a Sentry Account & Project**

*   Go to [https://sentry.io/](https://sentry.io/) and sign up for a free account.
*   Create a new project.  Give it a descriptive name (e.g., "Expo React Native App").  Note the **Sentry SDK Key (API Key)**. You'll need this for your apps.

**2.  Install Sentry Packages (React Native)**

   In your Expo React Native project's root directory, install the Sentry SDK:

   ```bash
   npm install @sentry/react-native
   # or
   yarn add @sentry/react-native
   ```

**3. Configure Sentry in Your React Native App**

   *   **Create a `sentry.init` Function:** Create a file (e.g., `sentry.js`) in your root project directory (or a dedicated `services` directory) and import the Sentry SDK.  This is where you'll initialize Sentry.

     ```javascript
     import * as Sentry from '@sentry/react-native';

     //  Configure Sentry.  Replace with your actual API key.
     Sentry.init({
       dsn: 'YOUR_SENTRY_DSN', // Or your API Key directly (not recommended for production)
       // Set sample rate if you want to capture only a portion of errors
       // sampleRate: 100, // 100% capture
     });
     ```

   *   **Import and Use in Your App Component:** Import `Sentry` from `sentry.js` and wrap your root component with it:

     ```javascript
     import React from 'react';
     import { View, Text } from 'react-native';
     import Sentry from './sentry'; // Adjust path if needed

     const App = () => {
       Sentry.set({
         project: 'YOUR_PROJECT_ID', //  Your Sentry Project ID
         // Add other custom metadata if needed
       });

       return (
         <View>
           <Text>My Expo React Native App</Text>
         </View>
       );
     };

     export default App;
     ```

   *   **Enable Automatic Context Propagation:** Sentry automatically propagates context (e.g., user information) from your React Native app to your Express backend. This is generally what you want.

**4.  Install Sentry Packages (Express Backend)**

   *   In your Express backend project, install the Sentry SDK:

     ```bash
     npm
