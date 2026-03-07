# Write a Sentry error tracking setup guide for Expo React Nat
Agent: riley
Generated: 2026-03-02T23:35:41.577921

## Sentry Error Tracking Setup Guide for Expo React Native + Express.js

This guide walks you through setting up Sentry error tracking for your Expo React Native app integrated with an Express.js backend. It covers installation, configuration, source maps, release tracking, and alert rules.

**Prerequisites:**

*   **Node.js and npm (or yarn) installed:** Make sure you have Node.js and npm installed on your development machine.
*   **Expo CLI installed:** `npm install -g expo-cli`
*   **Sentry Account:**  Create a free Sentry account at [https://sentry.io/](https://sentry.io/)

**1. Installation**

**React Native (Expo):**

```bash
npm install @sentry/react-native
# or
yarn add @sentry/react-native
```

**Express.js (Backend):**

```bash
npm install sentry
# or
yarn add sentry
```

**2. Configuration**

**a) Sentry Project Setup:**

*   Log in to your Sentry dashboard.
*   Create a new project for your application.  Give it a descriptive name (e.g., "MyAwesomeApp").
*   Note the **Sentry SDK Key (API Key)**. You'll need this later.
*   Configure the project's settings (e.g., stack traces, integrations).

**b) React Native (Expo):**

*   **Install Expo Application:**  If you haven't already, initialize your Expo project:
    ```bash
    expo init MyAwesomeApp
    cd MyAwesomeApp
    ```

*   **Integrate Sentry:**  Within your Expo project, install and initialize the Sentry SDK:

    ```bash
    npx @sentry/react-native init --app <YOUR_SENTRY_SDK_KEY>
    ```
    Replace `<YOUR_SENTRY_SDK_KEY>` with the Sentry SDK key you obtained.

*   **Configure `app.json`:** Add the following section to your `app.json` file to customize Sentry's behavior:

    ```json
    {
      "expo": {
        "name": "MyAwesomeApp",
        "slug": "myawesomeapp",
        "version": "1.0.0",
        "orientation": "portrait",
        "icon": "./assets/icon.png",
        "splash": {
          "image": "./assets/splash.png",
          "resizeMode": "cover",
          "backgroundColor": "#ffffff"
        },
        "updates": {
          "fallbackToCacheTimeout": 0
        },
        "asset": {
          "uri": "https://s3.amazonaws.com/expo-images/foreground.png",
          "packagerBios": false
        },
        "android": {
          "package": "com.example.myawesomeapp",
          "versionCode": 1
        },
        "ios": {
          "bundleIdentifier": "com.example.myawesomeapp"
        },
        "sentry": {
          "dsn": "YOUR_SENTRY_DSN", // Replace with your DSN
          "environment": "development" // or "production"
        }
      }
    }
    ```

    *   **`dsn`:** Replace `YOUR_SENTRY_DSN` with your Sentry DSN (Data Source Name).  You can generate this DSN from the Sentry dashboard. It will look something like: `https://<YOUR_PROJECT_ID>@sentry.io/<YOUR_
