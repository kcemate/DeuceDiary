# Write a Sentry error tracking setup guide for Expo React Nat
Agent: riley
Generated: 2026-03-02T21:25:53.972904

## Sentry Error Tracking Setup Guide for Expo React Native + Express.js

This guide outlines the steps to integrate Sentry for error tracking in your Expo React Native and Express.js application. It covers installation, configuration, source maps, release tracking, and alert rules.

**Prerequisites:**

*   Node.js and npm (or yarn) installed.
*   An Sentry account.  Sign up at [https://sentry.io/](https://sentry.io/)
*   Expo CLI installed.
*   Express.js app setup.

**1. Installation:**

**For React Native:**

*   **Expo SDK:** Make sure you're using an Expo SDK version that supports Sentry. (Generally, SDK 40+ is recommended)
*   **Install Sentry SDK:**

    ```bash
    npm install @sentry/react-native
    # or
    yarn add @sentry/react-native
    ```

**For Express.js:**

*   **Install Sentry SDK:**

    ```bash
    npm install @sentry/node
    # or
    yarn add @sentry/node
    ```


**2. Configuration:**

**React Native (Expo):**

*   **`sentry/envs`:** Create a file named `.sentry/envs.json` at the root of your Expo project.  This configures environment-specific Sentry settings.

    ```json
    {
      "environments": {
        "development": {
          "name": "development",
          "url": "YOUR_SENTRY_ DEVELOPMENT_URL",
          "release_track": "development",
          "active": true
        },
        "staging": {
          "name": "staging",
          "url": "YOUR_SENTRY_ STAGING_URL",
          "release_track": "staging",
          "active": false
        },
        "production": {
          "name": "production",
          "url": "YOUR_SENTRY_ PRODUCTION_URL",
          "release_track": "production",
          "active": true
        }
      }
    }
    ```

    *   Replace `YOUR_SENTRY_ URL` with your actual Sentry URL for each environment.
    *   `release_track` is used for release-based filtering.

*   **Import Sentry:** Import the Sentry SDK in your main app file (e.g., `App.js`).

    ```javascript
    import * as Sentry from '@sentry/react-native';

    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN',
      // Optional:  Set a sample rate
      // sampleRate: 0.8,
      // Optional:  Custom instrumentation
      // beforeExceptionBlock: (e, promise) => {
      //   // Custom handling before Sentry catches the error
      // },
    });
    ```

    *   Replace `YOUR_SENTRY_DSN` with your Sentry DSN (Data Source Name). You can find it in your Sentry project dashboard.  It looks like `sentry.io/<your_org>/<your_project>`.
    *   `sampleRate` controls the percentage of errors that are automatically captured. A lower rate reduces load but might miss some less frequent errors.
    *   `beforeExceptionBlock` provides a hook to customize how Sentry handles errors. This is useful for retry logic, logging additional context, or suppressing specific error types.

*   **Enable Automatic Instrumentation:**  Sentry automatically instruments many React Native components.

**Express.js:**

*   **
