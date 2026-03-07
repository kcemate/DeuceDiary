# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T09:14:59.957175

Okay, here's a comprehensive Sentry setup guide specifically tailored for an Expo React Native app integrated with an Express.js backend. This guide covers the key steps, considerations, and best practices.

**Understanding the Architecture**

* **Expo React Native:**  Your client-side application.
* **Express.js:**  Your Node.js server-side backend.
* **Sentry:**  Your error monitoring and reporting service.  Sentry will capture errors from both your React Native app *and* your Express.js backend.

**Prerequisites**

* **Sentry Account:** You'll need a Sentry account. Sign up at [https://sentry.io/](https://sentry.io/).
* **Node.js and npm/yarn:** Ensure you have Node.js installed.
* **Expo CLI:** [https://expo.dev/install](https://expo.dev/install)
* **Backend Setup:** You should have a working Express.js backend application. This guide assumes you're familiar with setting up and running an Express.js server.

**Steps**

**1.  Install Sentry Packages**

   * **In your Expo React Native app:**
     ```bash
     npm install @sentry/react-native
     # or
     yarn add @sentry/react-native
     ```

   * **In your Express.js backend:**
     ```bash
     npm install @sentry/node
     # or
     yarn add @sentry/node
     ```

**2.  Configure Sentry in your React Native App**

   * **Create a Sentry Project:** In your Sentry dashboard, create a new project for your React Native app. Note the project API key.

   * **Install Sentry SDK:**  Import and initialize the Sentry SDK in your main App.js (or your root component).
     ```javascript
     import * as Sentry from '@sentry/react-native';

     // Initialize Sentry
     Sentry.init({
       dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
       // Optional:  Capture client information
       // namespaces: {
       //   app: 'My React Native App',
       // },
       // Optional:  Automatic context
       // autoSetScreens: true,
     });
     ```

     * **DSN (Data Source Name):**  You'll generate this DSN in the next step.

   * **Handle Errors (Important!):**  You *must* handle errors properly for Sentry to collect them.  The simplest approach is to wrap your code in a `try...catch` block.

     ```javascript
     import React, { useState } from 'react';
     import { Button, Text } from 'react-native';

     const App = () => {
       const [count, setCount] = useState(0);

       const increment = () => {
         try {
           setCount(count + 1);
         } catch (error) {
           console.error('Error incrementing count:', error);
           Sentry.captureException(error, {
             extra: {
               count: count, // Add relevant context
               errorType: error.name,
             },
           });
         }
       };

       return (
         <Text>Count: {count}</Text>
         <Button title="Increment" onPress={increment} />
       );
     };

     export default App;
     ```

     * **`Sentry.captureException(error, context)`:**  This is the key function. It captures the error, along with any additional context you provide
