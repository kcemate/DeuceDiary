# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T07:00:14.793067

Okay, here's a comprehensive Sentry setup guide specifically tailored for Expo React Native projects integrated with an Express.js backend. It covers the necessary steps and best practices.

**Understanding the Setup**

* **Expo:** Expo simplifies React Native development but has some limitations regarding native module integrations. We'll use the Expo SDK and managed workflow.
* **Express.js:** Your Express backend handles API logic, database interactions, and more.
* **Sentry:** Sentry is a robust error tracking and performance monitoring platform. It helps you identify, prioritize, and fix issues in your application.

**Key Considerations**

* **Expo SDK Version:** Ensure your Expo SDK version is compatible with Sentry's requirements. Newer SDKs generally have better support.
* **Native Modules:** Sentry primarily works by capturing errors within your JavaScript code. If your app relies heavily on native modules, Sentry may not capture *all* errors.
* **Privacy:**  Be mindful of user privacy and data.  Ensure you comply with relevant regulations (like GDPR, CCPA).  Configure Sentry to only capture the data you need.

**Step-by-Step Guide**

**1. Project Setup (If not already done)**

* **Create an Expo Project:** If you don't have one, create a new Expo project:
   ```bash
   npx create-expo-app my-app
   cd my-app
   ```

* **Install Sentry Package:**
   ```bash
   npm install @sentry/react-native
   # or
   yarn add @sentry/react-native
   ```

**2. Sentry Configuration**

* **Create a Sentry Account:** If you don't have one, sign up at [https://sentry.io/](https://sentry.io/).

* **Create a Sentry Project:**
    * In your Sentry dashboard, create a new project for your application.  Give it a descriptive name (e.g., "MyExpoApp").

* **Get Your Sentry Publish Key:**
    * In the Sentry dashboard, for your project, navigate to the "API" section.
    * Copy the "Publish Key" (it looks like `SENTRY_PUBLIC_KEY`). *Keep this secure!*

**3. Integrate Sentry into Your Expo React Native App**

* **Import Sentry:** In your main app file (usually `App.js` or `App.tsx`), import Sentry:
   ```javascript
   import Sentry from '@sentry/react-native';
   ```

* **Initialize Sentry:**  Initialize Sentry using your Sentry publish key.
   ```javascript
   import React from 'react';
   import { AppNavigator } from './navigation'; // Or your navigation component
   import { SafeAreaProvider } from 'react-native-safe-area';

   Sentry.init({
     dsn: 'YOUR_SENTRY_DSN', // Replace with your DSN
     // Optional configurations:
     // autoSetTTL: 120, // Set default error TTL to 120 seconds
     // enableSourceMaps: true, // Enable source maps for easier debugging
   });

   const App = () => {
     return (
       <SafeAreaProvider>
         <AppNavigator />
       </SafeAreaProvider>
     );
   };

   export default App;
   ```

* **DSN (Data Source Name):** The DSN is a unique identifier for your Sentry project. You can construct it dynamically.  Here's how:

   ```javascript
   const dsn = `https://YOUR_SENTRY_PUBLIC_KEY@YOUR_SENTRY_DOMAIN.s
