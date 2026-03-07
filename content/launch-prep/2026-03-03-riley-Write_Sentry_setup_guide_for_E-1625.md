# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T16:25:24.556335

## Sentry Setup Guide for Expo React Native + Express

This guide outlines the steps to integrate Sentry into your Expo React Native application and your accompanying Express backend. This will help you track errors and monitor the performance of your application effectively.

**Prerequisites:**

*   **Sentry Account:** You need a Sentry account. Sign up at [https://sentry.io/](https://sentry.io/).
*   **Node.js & npm/yarn:**  Ensure you have Node.js and a package manager (npm or yarn) installed.
*   **Expo CLI:**  You need the Expo CLI installed globally: `npm install -g expo-cli` or `yarn global add expo-cli`

**Steps:**

**1. Install Sentry SDKs:**

*   **React Native (Expo):**
    ```bash
    npm install @sentry/react-native
    # or
    yarn add @sentry/react-native
    ```

*   **Express (Backend):**
    ```bash
    npm install @sentry/node
    # or
    yarn add @sentry/node
    ```

**2. Configure Sentry in your React Native App:**

*   **Create a Sentry Configuration:**
    *   Create a Sentry configuration file (e.g., `sentry.config.js`) in the root of your Expo project:
        ```javascript
        import * as Sentry from '@sentry/react-native';

        Sentry.init({
          dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
          // Optional:  Performance Monitoring
          tracesSampleRate: 0.5,
          // Optional: Set initial state to verbose
          enableNativeErrorTracking: true,
          // Optional:  Release Name (for tracking versions)
          releaseStage: 'production',
          // Optional:  User metadata
          // autoTrackUser: true,
        });
        ```
    *   **Replace `YOUR_SENTRY_DSN` with your actual Sentry DSN.** You can find your DSN in your Sentry dashboard.  It will look something like: `https://your-project-id.sentry.io/`

*   **Import and Use the SDK:**
    *   Import the Sentry SDK in your app's entry point file (usually `App.js` or `index.js`):
        ```javascript
        import * as Sentry from '@sentry/react-native';

        // ... other imports ...

        Sentry.init({
          // ... your configuration ...
        });

        // Optionally, you can use Sentry's error handling:
        Sentry.set({
          // Set user information (optional)
          user: {
            id: '12345', // Replace with your user ID
            name: 'John Doe',
          },
        });

        // ... your app logic ...
        ```

*   **Integrate with Expo Modules (Important for Expo):**

    *   Because Expo manages native modules, you need to ensure that Sentry's native SDK is properly initialized. You can achieve this through Expo's `App.js` or by creating a custom native module.

    *   **Option 1:  Using `App.js` (Simplest):** This approach utilizes Expo's provided hooks to initialize Sentry during the app's initial render.  Add this to the top of your `App.js`:

        ```javascript
        import * as Sentry from '@sentry/react-native';

        // ... other imports ...

        Sentry.init({
