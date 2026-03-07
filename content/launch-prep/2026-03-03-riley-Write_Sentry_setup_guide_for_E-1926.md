# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T19:26:24.887856

Okay, here's a comprehensive Sentry setup guide specifically tailored for an Expo React Native application with an Express backend. It covers the key steps and considerations to get you up and running quickly.

**Understanding the Architecture**

Before we start, let's understand the setup:

*   **Expo React Native:**  We'll be integrating Sentry into your Expo project.
*   **Express.js Backend:**  Your backend will be handling API requests, database interactions, and potentially other server-side logic.
*   **Sentry:**  Sentry is a powerful error tracking and performance monitoring service.

**Prerequisites**

*   **Sentry Account:** You'll need a Sentry account. Create one at [https://sentry.io/](https://sentry.io/).
*   **Expo Development Environment:**  You should have Expo CLI installed and configured.
*   **Node.js & npm (or Yarn):**  Make sure you have Node.js and a package manager installed.
*   **Expo Go App (Recommended):** Having the Expo Go app on your phone will make debugging easier.

**Steps**

1.  **Create a Sentry Project:**

    *   Log in to your Sentry account.
    *   Click "Create project."
    *   Choose "Manual project setup" (since we're integrating into an Expo app).
    *   Enter a project name (e.g., "MyExpoApp").
    *   Choose your programming language (JavaScript).
    *   Click "Create."
    *   You'll be taken to your project dashboard.  Copy the **Sentry SDK Key (Public Key)** - you'll need this in the next step.

2.  **Install Sentry in Your Expo React Native App:**

    ```bash
    npm install @sentry/react-native
    # or
    yarn add @sentry/react-native
    ```

3.  **Configure Sentry in `App.js` (or your root component):**

    ```javascript
    import React from 'react';
    import { SafeAreaView } from 'react-native';
    import { Sentry } from '@sentry/react-native';

    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN', // Replace with your DSN
      // Optional configurations:
      // performanceMonitoring: true,
      // enableSourceMaps: true, // Useful for debugging
    });

    const App = () => {
      return (
        <SafeAreaView>
          {/* Your app content here */}
          <Text>Hello, Sentry!</Text>
        </SafeAreaView>
      );
    };

    export default App;
    ```

    *   **Replace `YOUR_SENTRY_DSN`:** This is crucial!  Replace this placeholder with your actual DSN. The DSN (Data Source Name) has this format: `https://<public_key>:<secret_key>@sentry.io/<project_id>`
        *   **Public Key:**  From your Sentry project dashboard.
        *   **Secret Key:**  Also from your Sentry project dashboard.  Keep this secret!
        *   **Project ID:**  Automatically generated when you create the project.

4.  **Configure Your Express Backend:**

    You'll need to integrate Sentry into your Express backend as well. The process is similar:

    ```javascript
    const Sentry = require('@sentry/node');

    // ... your Express app setup ...

    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN', // Replace with your D
