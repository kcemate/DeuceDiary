# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-04T04:29:59.229560

## Sentry Setup Guide for Expo React Native + Express

This guide outlines the steps to integrate Sentry into your Expo React Native project with an Express backend.  It covers installation, configuration, and best practices.

**Prerequisites:**

*   A basic understanding of React Native, Expo, and Node.js.
*   An Sentry account (sign up at [https://sentry.io/](https://sentry.io/))
*   Node.js and npm installed.

**Steps:**

**1. Install Sentry Dependencies:**

**For React Native (Expo):**

```bash
npm install @sentry/react-native
# or
yarn add @sentry/react-native
```

**For Express (Backend):**

```bash
npm install @sentry/node
# or
yarn add @sentry/node
```

**2. Configure Sentry in Your React Native App:**

*   **Create a Sentry Client:**

    ```javascript
    import { Sentry } from '@sentry/react-native';

    const SentryOptions = {
      dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
      // Set sample rate if desired (e.g., 50 for 50% of events)
      // sampleRate: 50,
      // Release stage (for tracking release versions)
      // releaseStage: 'beta',
      // Track Javascript exceptions
      trackJavascriptExceptions: true,
    };

    Sentry.init(SentryOptions);
    ```

    *   **`YOUR_SENTRY_DSN`:**  This is your Sentry DSN. You can find it in your Sentry dashboard after creating a project. It's a unique string that identifies your project and Sentry.

    *   **`sampleRate`:**  Controls the percentage of events that are sent to Sentry.  Higher rates capture more data but can impact performance. A value of `100` sends all events.  Consider setting this to a lower rate for production.

    *   **`releaseStage`:**  (Optional) Helps you track the stage of your application's release (e.g., 'beta', 'production', 'staging').

    *   **`trackJavascriptExceptions`:**  Ensures that JavaScript exceptions are automatically captured.

*   **Wrap Your App:**

    Make sure you're wrapping your entire app in a `SentryProvider` or simply initialize Sentry at the top level of your app. The most common method is to initialize Sentry at the top level.

    ```javascript
    import { AppProvider } from './AppProvider'; // Assuming you have an AppProvider

    export default () => {
      Sentry.init(SentryOptions);
      return (
        <AppProvider>
          <App />
        </AppProvider>
      );
    };
    ```

**3. Configure Sentry in Your Express Backend:**

*   **Import the Node Sentry Client:**

    ```javascript
    const Sentry = require('@sentry/node');
    ```

*   **Configure the Sentry Client:**

    ```javascript
    const SentryOptions = {
      dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
      // Or use a logger for better debug information
      // logger: logger, // Assuming you have a logger instance
    };

    Sentry.init(SentryOptions);
    ```

*   **Implement Error Handling:**  This is crucial.  Wrap your Express routes and middleware in `try...catch` blocks to properly capture errors.

    ```
