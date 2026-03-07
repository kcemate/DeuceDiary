# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T20:34:16.833026

```markdown
# Sentry Setup Guide for Expo React Native + Express

This guide outlines the steps to integrate Sentry into your Expo React Native application and your Express backend (if you have one). It covers both the React Native side and the backend side, with detailed explanations and best practices.

**Prerequisites:**

*   **Expo CLI:** Ensure you have Expo CLI installed globally.  `npm install -g expo-cli`
*   **Node.js & npm/yarn:**  You need Node.js and a package manager (npm or yarn).
*   **Sentry Account:** Create a free Sentry account at [https://sentry.io/](https://sentry.io/)

---

## 1.  Sentry Backend Setup (If Applicable)

If you're using an Express backend, follow these steps:

1.  **Install Sentry:**
    ```bash
    npm install sentry --save
    # or
    yarn add sentry
    ```

2.  **Import Sentry:**
    ```javascript
    const Sentry = require('sentry-node');

    module.exports = (config) => {
      Sentry.init({
        // Replace with your Sentry DSN
        dsn: config.sentryDSN,
        // Set the sample rate (optional)
        // sampleRate: 0.1,
        // Enable before/after tracing (optional)
        // beforeExceptionSpan: (scope) => { ... },
        // afterExceptionSpan: (scope) => { ... },
      });

      return (req, res, next) => {
        // Wrap your Express route handlers
        next((err, req, res, next) => {
          if (err) {
            Sentry.captureException(err, req, res, next);
          }
        });
      };
    };
    ```

3.  **Configure Your `config.js` or similar:**
    ```javascript
    // config.js
    module.exports = {
      sentryDSN: 'YOUR_SENTRY_DSN', // Replace with your DSN
    };
    ```

4.  **Replace `YOUR_SENTRY_DSN`:**  Go to your Sentry dashboard and obtain your DSN (Data Source Name). This is a unique identifier for your Sentry project. You can find it on the 'Overview' page.  It typically looks like `https://YOUR_PROJECT_ID.sentry.io/`.

---

## 2.  Expo React Native Setup

1.  **Install Sentry for React Native:**
    ```bash
    npm install @sentry/react-native --save
    # or
    yarn add @sentry/react-native
    ```

2. **Import Sentry:**
   ```javascript
   import Sentry from '@sentry/react-native';

   //Optional: configure Sentry
   Sentry.init({
     dsn: 'YOUR_SENTRY_DSN',
     // sampleRate: 0.1,
     // beforeExceptionTrack: (exception, worker, ...args) => { ... },
     // beforeLog: (message, ...args) => { ... },
     // beforeMeasure: (name, ...args) => { ... },
   });
   ```

   *   **Replace `YOUR_SENTRY_DSN`:**  Use the same DSN from your backend setup.

3.  **Integrate with React Native's Error Reporting:**  Sentry automatically integrates with React Native's built-in error reporting.  It will automatically capture errors that occur during your app's
