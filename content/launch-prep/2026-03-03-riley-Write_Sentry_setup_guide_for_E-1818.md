# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T18:18:26.635380

Okay, here's a comprehensive Sentry setup guide specifically tailored for an Expo React Native app and a connected Express.js backend. This guide will cover the key steps, best practices, and considerations.

**Understanding the Setup**

The goal is to capture exceptions and errors from both your React Native Expo app and your Express.js backend, giving you a centralized view of your application's health.  Since they are separate processes, you'll need to configure Sentry for each.

**1. Prerequisites**

*   **Sentry Account:** You'll need a Sentry account. Sign up at [https://sentry.io/](https://sentry.io/).
*   **Expo Project:** Ensure you have a working Expo React Native project.
*   **Node.js and npm/yarn:** Installed on your development machine.
*   **Express.js Backend:** You have a running Express.js application.

**2. Setting up Sentry for your Expo React Native App**

*   **Install Sentry SDK:** In your Expo React Native project, install the Sentry SDK:

    ```bash
    npm install @sentry/react-native
    # or
    yarn add @sentry/react-native
    ```

*   **Configure Sentry in `App.js` (or the root of your app):**

    ```javascript
    import React from 'react';
    import { Sentry } from '@sentry/react-native';

    // Optional:  If you want to enable performance monitoring
    // import { PerformanceMonitor } from '@sentry/performance-monitor';

    const App = () => {
      // Initialize Sentry (replace with your project ID)
      Sentry.init({
        dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
        // performanceMonitor: performanceMonitor, // If using performance monitoring
      });

      return (
        // Your App content here
      );
    };

    export default App;
    ```

    *   **`YOUR_SENTRY_DSN`**:  This is your Sentry Data Source Name. You'll find this on your Sentry dashboard after creating a project. It generally looks like `https://<your-project-id>.sentry.io/` or `https://<your-project-id>.sentry.com/`.

*   **Enable Automatic Exception Handling (Highly Recommended):**  Sentry's automatic exception handling is *essential* for Expo React Native apps. It catches uncaught exceptions and reports them to Sentry automatically.

    ```javascript
    import React from 'react';
    import { Sentry } from '@sentry/react-native';
    import { AppRegistry } from 'react-native';

    const App = () => {
      Sentry.init({
        dsn: 'YOUR_SENTRY_DSN',
        // ... other options
      });

      return (
        // Your App content
      );
    };

    AppRegistry.registerComponent('YourAppName', App);
    ```

*   **Configure Auto-Batching (Sentry >= 6.0.0):** By default, Sentry batches all exceptions. This is generally fine, but you can enable auto-batching to improve performance and reduce the number of requests to the Sentry server:

    ```javascript
    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN',
      autoSetTTL: 1000, // Set a default time-to-live for exceptions (milliseconds)
    });
    ```

*   **Expo Development Build:** Ensure you're running your Expo
