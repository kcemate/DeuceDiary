# Write a Sentry error tracking setup guide for Expo React Nat
Agent: riley
Generated: 2026-03-03T01:08:29.931757

## Sentry Error Tracking Setup Guide for Expo React Native + Express.js

This guide outlines how to set up Sentry for your Expo React Native app and your associated Express.js backend, focusing on robust error tracking, source map support, release tracking, and alert rules.

**Prerequisites:**

*   An active Sentry account. Sign up at [https://sentry.io/](https://sentry.io/)
*   Node.js and npm (or Yarn) installed.
*   Expo CLI installed (if you're not using Expo Go).
*   Basic understanding of React Native and Express.js.

**1. Install Sentry SDKs**

You'll need to install Sentry SDKs for both your React Native app and your Express.js backend.

*   **React Native (Expo):**

    ```bash
    npm install sentry-expo
    # or
    yarn add sentry-expo
    ```

*   **Express.js Backend:**

    ```bash
    npm install @sentry/node
    # or
    yarn add @sentry/node
    ```

**2. Configure Sentry in Your React Native App (Expo)**

*   **Create a Sentry Project:**  Within your Sentry dashboard, create a new project for your Expo React Native app.  Note the project key - you'll need it for configuration.

*   **Initialize `sentry-expo`:**  Within your React Native project directory, run the following command.  Replace `YOUR_SENTRY_PROJECT_KEY` with your actual Sentry project key.

    ```bash
    npx @sentry/expo init YOUR_SENTRY_PROJECT_KEY
    ```

    This command will:
    *   Create a `Sentry.init` function.
    *   Generate an `ExpoConfig.js` file (or modify the existing one) with the necessary Sentry integration.
    *   Create a `.sentry` folder for storing Sentry configuration.

*   **Configure `ExpoConfig.js`:** Open `ExpoConfig.js` and modify the `extra` section to include the Sentry SDK initialization.  A basic example:

    ```javascript
    // ExpoConfig.js
    /** @type {Expo.ExpoConfig} */
    const defineConfig = {
      name: 'YourAppName',
      slug: 'your-app-slug',
      version: '1.0.0',
      orientation: 'portrait',
      icon: './assets/icon.png',
      splash: {
        image: './assets/splash.png',
        resizeMode: 'contain',
      },
      updates: {
        fallbackToLocalAvailable: true,
      },
      android: {
        package: 'com.yourcompany.yourAppName',
        versionCode: 1,
      },
      ios: {
        bundleIdentifier: 'com.yourcompany.yourAppName',
      },
      extra: {
        sentry: {
          dsn: 'YOUR_SENTRY_DSN', // Replace with your DSN
          enableSourceMaps: true, // Important for debugging
        },
      },
    };

    export default defineConfig;
    ```

    *   **`sentry.dsn`**:  Replace `YOUR_SENTRY_DSN` with your Sentry DSN (Data Source Name). You can find this in your Sentry dashboard under "Projects" -> [Your Project] -> "Add Project" -> "Configuration" -> "DSN".
    *   **`sentry.enableSourceMaps: true`**:  This is *crucial* for debugging React Native errors.
