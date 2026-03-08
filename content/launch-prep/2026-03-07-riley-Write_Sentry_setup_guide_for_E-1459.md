# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-07T14:59:15.513215

## Sentry Setup Guide for Expo React Native + Express

This guide outlines the steps to integrate Sentry into your Expo React Native app and your associated Express API. It covers installation, configuration, and best practices for effective monitoring.

**Prerequisites:**

*   An Expo project:  `expo init my-app`
*   An Express application:  (This guide assumes you've already set up your Express backend)
*   A Sentry account: [https://sentry.io/](https://sentry.io/)
*   Node.js and npm/yarn installed.

**Step 1: Create a Sentry Project**

1.  **Sign up for Sentry:** If you don't have one, create an account at [https://sentry.io/](https://sentry.io/).
2.  **Create a New Project:**
    *   Log in to your Sentry dashboard.
    *   Click the "Create project" button.
    *   Choose "Manual project" for maximum control.
    *   Give your project a descriptive name (e.g., `my-expo-app-sentry`).
    *   Select your application's language (JavaScript).
    *   Choose the deployment environment (e.g., "Production").
    *   Click "Create project."
3.  **Obtain Your Sentry API Key:** Once the project is created, Sentry will provide you with an API key. Copy this key – you'll need it in the next steps.

**Step 2: Install Sentry SDK in your Expo React Native App**

1.  **Navigate to your Expo project directory:** `cd my-app`
2.  **Install the Sentry SDK:**

    ```bash
    expo install @sentry/react-native
    ```

**Step 3: Configure Sentry in your Expo React Native App**

1.  **Import the Sentry SDK:** In your main app file (usually `App.js` or `index.js`), import the Sentry SDK:

    ```javascript
    import * as Sentry from '@sentry/react-native';

    // ... your existing code ...
    ```

2.  **Initialize Sentry:**  Initialize Sentry within your app's entry point.  This is *crucial* for sending events.

    ```javascript
    import React, { useEffect } from 'react';
    import { AppNavigator } from './navigation';  // Example navigation

    export default function App() {
      useEffect(() => {
        Sentry.init({
          dsn: 'YOUR_SENTRY_API_KEY@YOUR_PROJECT_URL.sentry.io', // Replace with your API key and project URL
          // Optional settings:
          // autoSetTag: true,       // Automatically set 'environment' tag
          // autoSetLevel: 'info',   // Automatically set the default event level
        });

        return () => {
          Sentry.flush(2000); // Flush any pending events before unmounting (important!)
        };
      }, []);

      return (
        <AppNavigator />
      );
    }
    ```

    *   **`YOUR_SENTRY_API_KEY`:** Replace this placeholder with the API key you copied from your Sentry project.
    *   **`YOUR_PROJECT_URL`:** Replace this with your Sentry project's URL (found on your Sentry dashboard).  It typically looks like `projects.sentry.io`.
    *   **`autoSetTag: true`:** This automatically sets the "environment" tag in Sentry to the value of your app's environment
