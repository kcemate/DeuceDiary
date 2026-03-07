# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-04T06:00:41.757257

## Sentry Setup Guide for Expo React Native + Express

This guide outlines the steps to integrate Sentry into your Expo React Native project with a connected Express backend. We'll cover:

*   **Installation** (React Native & Express)
* Initialize Sentry
*   **Linking Sentry in React Native**
*   **Configuring Sentry (React Native)**
*   **Setting up Sentry in Express**
*   **Verification & Logging**

**Prerequisites:**

*   Node.js and npm/yarn installed
*   Expo CLI installed and configured (`npm install -g expo-cli`)
*   An Expo project you'd like to integrate Sentry into
*   An Sentry account (create one at [https://sentry.io/](https://sentry.io/))

**1. Installation**

*   **React Native:**
    ```bash
    npm install @sentry/react-native
    # or
    yarn add @sentry/react-native
    ```
*   **Express:**
    ```bash
    npm install sentry
    # or
    yarn add sentry
    ```

**2. Initialize Sentry**

*   **Sentry.io:**  Log into your Sentry account and create a new project, giving it a descriptive name (e.g., "Expo App"). Take note of your **Sentry SDK Key**.
*   **Expo React Native Project:** Run the following command in your project's root directory:

    ```bash
    npx expo run:analytics init-sentry
    ```
    This command will prompt you for your Sentry SDK Key.  Enter it carefully.  It’s crucial for Sentry to capture and analyze your errors.

    *   **Important:**  The `init-sentry` command sets up the initial Sentry configuration within your React Native project. This includes configuring the Sentry SDK and installing necessary dependencies.

**3. Linking Sentry in React Native**

The `init-sentry` command usually handles this, but let's confirm.  You need to ensure the `@sentry/react-native` package is linked correctly.  This is now handled automatically by the `init-sentry` command.  However, if you encounter issues, you can manually link the package:

```bash
npx expo link @sentry/react-native
```

**4. Configuring Sentry (React Native)**

*   **SentryConfig:**  Sentry automatically creates a `SentryConfig` object that is used to configure Sentry.  This is located in your project’s root directory, typically in a file named `SentryConfig.js`.

*   **Customization (Optional):** The `SentryConfig` object offers customization options, such as:

    *   `tracesetInterval`: Sets the time (in seconds) after which traces are sent to Sentry.  Default is 60 seconds.
    *   `stackMitigation`:  Enables mitigation of stack traces by removing information that would allow attackers to identify potential vulnerabilities. Enabled by default.
    *   `environment`: Sets the name of the environment (e.g., "development", "staging", "production").
    *   `release`:  Set the version of your app for release tracking.

    You can modify `SentryConfig.js` to suit your needs.

    Example:

    ```javascript
    // SentryConfig.js
    import { SentryOptions } from '@sentry/react-native';

    export const SentryConfig = {
      appVersion: '1.0.0',
      environment: 'production',
      tracesetInterval: 120,
