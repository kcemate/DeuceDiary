# Write a Sentry error tracking setup guide for Expo React Nat
Agent: riley
Generated: 2026-03-02T19:18:19.718632

## Sentry Error Tracking Setup Guide for Expo React Native + Express.js

This guide outlines how to integrate Sentry error tracking into your Expo React Native application and your Express.js backend, focusing on best practices for debugging and monitoring.

**I. Prerequisites:**

*   **Sentry Account:** You'll need a Sentry account. Sign up at [https://sentry.io/](https://sentry.io/).
*   **Node.js & npm (or yarn):** Ensure you have Node.js and npm (or yarn) installed on your development machine.
*   **Expo CLI:** Familiarize yourself with the Expo CLI.

**II. Installing Sentry Packages:**

**A. React Native (Expo):**

1.  **Install `@sentry/react-native`:**
    ```bash
    npm install @sentry/react-native --save
    # or
    yarn add @sentry/react-native
    ```

2.  **Install `@sentry/expo` (Recommended for Expo):**
    ```bash
    npm install @sentry/expo --save
    # or
    yarn add @sentry/expo
    ```

**B. Express.js Backend:**

1.  **Install `sentry-node`:**
    ```bash
    npm install sentry-node --save
    # or
    yarn add sentry-node
    ```

**III. Configuration:**

**A. React Native (Expo):**

1.  **Create a Sentry Project in Sentry:** Within your Sentry dashboard, create a new project for your Expo app.  Note the **Sentry SDK Key** (also known as the "Project ID").

2.  **Configure `app.json` (Expo):**  Add the Sentry SDK Key to your `app.json` file under the `android` section:

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
          "fallbackToLocalCopy": false,
          "notify": "DISABLE"
        },
        "android": {
          "package": "com.example.myawesomeapp",
          "versionCode": 1,
          "signingKey": {
            "file": "android/app/build/outputs/apk/debug/app-debug.apk",
            "keyAlias": "YOUR_KEY_ALIAS",
            "keyPassword": "YOUR_KEY_PASSWORD",
            "keyFingerprint": "SHA1 YOUR_KEY_FINGERPRINT"
          },
          "sentry": {
            "projectId": "YOUR_SENTRY_PROJECT_ID"
          }
        },
        "ios": {
          "bundleIdentifier": "com.example.myawesomeapp",
          "buildBackendURL": "https://your-backend-url.com/build",
          "sentry": {
            "projectId": "YOUR_SENTRY_PROJECT_ID"
          }
        }
      }
    }
    ```

    *   Replace `YOUR_SENTRY_PROJECT_ID` with the actual Project ID you obtained from Sentry.
    *   Adjust the `android` and `ios` sections as necessary for your project.

3.  **
