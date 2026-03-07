# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T11:08:00.883892

## Sentry Setup Guide for Expo React Native + Express

This guide outlines the steps to integrate Sentry into your Expo React Native app and your Express backend (if you have one). It covers the essential configuration and best practices.

**Prerequisites:**

*   **Expo CLI:** Ensure you have Expo CLI installed globally: `npm install -g expo-cli`
*   **Sentry Account:**  You'll need a Sentry account. Sign up at [https://sentry.io/](https://sentry.io/).
*   **Node.js & npm:** Node.js and npm should be installed on your development machine.
*   **Expo Go app:**  Have the Expo Go app installed on your iOS or Android device to test your app.


**1. Install Sentry Packages:**

Install the necessary Sentry packages for both React Native and your Express backend:

**React Native (Expo):**

```bash
npm install @sentry/react-native
# or
yarn add @sentry/react-native
```

**Express Backend (if applicable):**

```bash
npm install @sentry/node
# or
yarn add @sentry/node
```

**2.  Configure Sentry in your React Native App:**

*   **Create a Sentry Client:**  Create a Sentry client instance within your main app component or a shared provider. This is where you'll configure Sentry and manage your releases.

    ```javascript
    import { Sentry } from '@sentry/react-native';
    import * as RNBackgroundFetch from 'react-native-background-fetch'; // or your preferred background fetch library

    const App = () => {
      // Optional:  Configure Sentry
      Sentry.init({
        dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
        //  Include options like sampleRate, release, integrations etc.
        //  See Sentry documentation for more: https://docs.sentry.io/
      });

      return (
        // ... your app content ...
      );
    };

    export default App;
    ```

    *   **`YOUR_SENTRY_DSN`:**  This is your Sentry Data Source Name. You can find it on your Sentry dashboard after creating a project. It looks something like `https://YOUR_APP_ID.sentry.io/`
    *   **`sampleRate`:** (Optional) Control the percentage of transactions Sentry captures.  Higher rates lead to more data, but also increased overhead.  Start with 100% and adjust if performance becomes an issue.
    *   **`release`:** (Optional)  Track which version of your app is running.  Helps with correlating errors with releases.
    *   **`integrations`:** (Optional) Integrate Sentry with other services you use (e.g., Crashlytics, Slack, etc.).
    *   **Background Fetch:** Ensure you correctly integrate background fetch error handling with Sentry, as unhandled background fetch errors are often crucial for mobile app stability.

*   **Handle Errors:**  Import the `Sentry.captureException()` function to catch and report errors that occur in your app.  This is *crucial*.

    ```javascript
    import { Sentry } from '@sentry/react-native';

    // ... inside your component ...

    const MyComponent = () => {
      // ... your component logic ...

      try {
        // ... some code that might throw an error ...
      } catch (error) {
        Sentry.captureException(error, {
          level: Sentry.Severity.Error
