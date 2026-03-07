# Write a Sentry error tracking setup guide for Expo React Nat
Agent: riley
Generated: 2026-03-03T01:45:35.123112

## Sentry Error Tracking Setup Guide for Expo React Native + Express.js

This guide outlines how to integrate Sentry error tracking into your Expo React Native application and your accompanying Express.js backend. It covers installation, configuration, enabling source maps, release tracking, and setting up alert rules.

**Prerequisites:**

*   You have a Sentry account. Sign up at [https://sentry.io/](https://sentry.io/)
*   You have Node.js and npm (or yarn) installed.
*   You're familiar with Expo and React Native.

**1. Install Sentry SDKs**

**a) React Native (Expo):**

```bash
npm install @sentry/react-native
# or
yarn add @sentry/react-native
```

**b) Express.js (Backend):**

```bash
npm install @sentry/node
# or
yarn add @sentry/node
```

**2. Configuration - React Native (Expo)**

**a) Create a Sentry Project:**

*   In your Sentry dashboard, create a new project for your Expo app.
*   Note the **Sentry SDK Key** – you’ll need this in the next steps.

**b) Configure `sentry/react-native`:**

*   **`Expo.Notifications.setSentrySDKKey`:** In your main app component (e.g., `App.js`), set the Sentry SDK key.

    ```javascript
    import { Expo } from 'expo';
    import * as Sentry from '@sentry/react-native';

    export default function App() {
      Sentry.init({
        dsn: 'YOUR_SENTRY_DSN', // Use DSN instead of SDK Key for better security
        // SDK Key is deprecated, using DSN is highly recommended
        // sampleRate: 1, // Optional: Sample 100% of events
        // enableSourceMaps: true, // Optional: Enable source maps (recommended)
      });

      return (
        // Your app content
      );
    }
    ```

    **Important:** Replace `YOUR_SENTRY_DSN` with your actual Sentry DSN. You can find this in your Sentry project's settings. **Do NOT use the SDK key directly, use the DSN**.

*   **Handle Errors:** Implement a central error handling mechanism to automatically report errors to Sentry.  Consider a simple wrapper around `console.error` or `try...catch`.

    ```javascript
    import { Sentry } from '@sentry/react-native';

    const handleErrors = (error, info) => {
        Sentry.addCallback(() => {
            Sentry.captureException(error, info);
        });
    };

    // Example: Wrap your code that might throw errors
    try {
        // Your code here
    } catch (error) {
        Sentry.addCallback(() => {
            Sentry.captureException(error, {
                level: 'error',
                extra: {
                    componentName: 'YourComponent',
                    stackTrace: error.stack,
                }
            });
        });
    }
    ```

    *   `error`:  The JavaScript error object.
    *   `info`:  An object containing additional context, such as device information, user ID, and request parameters.

**3. Configuration - Express.js (Backend)**

**a) Create a Sentry Project:**  (As described above)

**b) Configure `@sentry/node`:**

*   **Import the Sentry SDK:**  In your Express
