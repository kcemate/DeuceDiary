# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-04T06:23:17.584364

## Sentry Setup Guide for Expo React Native + Express

This guide outlines the steps to integrate Sentry into your Expo React Native application and your Express backend.  It covers the key aspects, including installing packages, configuring Sentry, and handling errors effectively.

**Prerequisites:**

*   **Sentry Account:** You need an account on Sentry ([https://sentry.io/](https://sentry.io/)). Create an account if you don't already have one.
*   **Expo CLI:** Ensure you have the Expo CLI installed and configured.
*   **Node.js and npm/yarn:**  Make sure you have Node.js and your package manager (npm or yarn) installed.
*   **Express Application:** You should have a functional Express application that serves as your backend.

**Steps:**

**1. Install Sentry Packages:**

*   **React Native:**  Install the Sentry SDK for React Native:

    ```bash
    npm install @sentry/react-native
    # or
    yarn add @sentry/react-native
    ```

*   **Express (Backend):**  Install the Sentry SDK for Node.js (Express):

    ```bash
    npm install @sentry/node
    # or
    yarn add @sentry/node
    ```

**2. Configure Sentry in your React Native App:**

*   **Create a Sentry Configuration:**  Sign in to your Sentry account and create a new project.  You'll receive an API key.
*   **Initialize the SDK:**  In your Expo React Native project, you need to initialize the Sentry SDK.  This typically involves creating an initialization function and passing it to the `Sentry.init()` call. Here's an example:

    ```javascript
    import * as Sentry from '@sentry/react-native';

    // Your Sentry API Key
    const SENTRY_API_KEY = 'YOUR_SENTRY_API_KEY';

    // Initialize Sentry
    Sentry.init({
      dsn: SENTRY_API_KEY,
      // Optionally add tracking capabilities
      trackPerformance: true,
      // Optionally set a sample rate (e.g., 50)
      // sampleRate: 50,
    });

    // Example Error Handling -  Essential!
    Sentry.setReporter(reporter => {
      reporter.setFlushTimeout(2000); // Adjust flush timeout as needed
    });
    ```

*   **Error Handling:**  This is *crucial*.  React Native Sentry needs to be able to capture errors.  The most effective way to do this is using `Sentry.setReporter` as shown above.  This sets up the Sentry reporter.  `reporter.setFlushTimeout` allows Sentry to wait a bit before sending, preventing occasional transient errors from being missed.  Adjust the timeout value as needed to balance performance and accuracy.

    *   **Use `try...catch` Blocks:** Wrap potentially error-prone code in `try...catch` blocks and use `Sentry.captureException()` to send the caught error to Sentry.

        ```javascript
        try {
          // Your code that might throw an error
          const result = await someAsyncFunction();
          console.log("Result:", result);
        } catch (error) {
          console.error("Error:", error);
          Sentry.captureException(error, {
            stacktrace: true, // Include stack trace for better context
          });
        }
        ```

*   **Automatic Capture (Expo Modules):**  Expo modules automatically capture errors when they occur.  However, it'
