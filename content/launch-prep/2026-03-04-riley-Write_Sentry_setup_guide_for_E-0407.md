# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-04T04:07:16.521094

Okay, let's craft a comprehensive Sentry setup guide specifically for an Expo React Native app integrated with an Express backend. This guide will cover installation, configuration, and key considerations.

**Assumptions:**

*   You have a basic understanding of React Native, Expo, and Node.js.
*   You're using Expo Go to run your React Native app.
*   You're using Expo CLI (recommended).
*   You have an Sentry account. (Sign up at [https://sentry.io/](https://sentry.io/))

**Steps:**

**1. Create a Sentry Project:**

*   Go to the Sentry website ([https://sentry.io/](https://sentry.io/)) and sign up for an account (or log in).
*   Create a new project. Choose a name that reflects your app and backend.  You'll configure this project later.
*   **Important:** Copy the **Sentry SDK Key (API Key)** from the Sentry dashboard for your project.  You'll need this in the next steps.

**2. Install Sentry Dependencies:**

*   **React Native (Expo App):**
    ```bash
    npx expo install @sentry/react-native
    ```

*   **Express Backend:**
    ```bash
    npm install @sentry/node
    # or
    yarn add @sentry/node
    ```

**3. Configure the React Native App (Expo):**

*   **`sentry/react-native` Configuration:**
    *   Create a file named `sentry.expo.js` (or similar) at the root of your Expo project.
    *   Paste the following code, replacing `YOUR_SENTRY_SDK_KEY` with your actual Sentry SDK key:

    ```javascript
    import Sentry from '@sentry/react-native';

    Sentry.init({
      dsn: 'YOUR_SENTRY_SDK_KEY', // Replace with your Sentry DSN
      tracesetCategory: 'api', // Optional:  Group traces by category (e.g., 'api', 'ui')
      // Optionally, you can add additional settings here like:
      // autoSetTTL: 120, // Automatically set trace TTL to 120s
    });

    // Example of sending a custom trace:
    // Sentry.captureMessage('This is a custom trace message', { level: Sentry.Levels.info });
    ```

    *   **Explanation:**
        *   `dsn`:  The Sentry Data Source Name. This is the SDK Key you copied earlier.
        *   `tracesetCategory`:  (Optional) Helps organize traces in Sentry by grouping them under specific categories. This is highly recommended for better filtering and analysis.
        *   `autoSetTTL`: (Optional) Automatically sets the Time To Live (TTL) for traces to a default value (e.g., 120 seconds). TTL determines how long traces are stored in Sentry.

*   **`app.json` (Expo Configuration):**
    *   Add a `Sentry` key to your `app.json` file under the `extra` section:

    ```json
    {
      "expo": {
        // ... other Expo configurations ...
        "extra": {
          "Sentry": {
            "dsn": "YOUR_SENTRY_SDK_KEY",
            "tracesetCategory": "api"
          }
        }
      }
    }
    ```

**4. Configure the Express Backend:**

*   **`@sentry/node`
