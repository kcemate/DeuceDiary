# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T15:40:13.807665

Okay, here's a comprehensive Sentry setup guide tailored for Expo React Native and Express.js, combining best practices and addressing common pitfalls.

**Overview**

Sentry is a powerful error tracking and performance monitoring tool.  This guide will walk you through integrating it into your Expo React Native app and your Express.js backend, ensuring you're alerted to crashes, exceptions, and performance bottlenecks.

**Prerequisites**

*   **Sentry Account:**  Create a free Sentry account at [https://sentry.io/](https://sentry.io/)
*   **Expo Project:** You should have a fully functional Expo React Native project.
*   **Node.js and npm (or Yarn):** Installed on your development machine.
*   **Express.js Project:** You need an Express.js backend project.  If you don't have one, you can create a simple one:  `npm init -y` and `npm install express`

**Step 1: Install Sentry Packages**

In your Expo React Native project, install the necessary Sentry packages:

```bash
npm install @sentry/react-native
npm install @sentry/node
```

In your Express.js project:

```bash
npm install @sentry/node
```

**Step 2: Configure Sentry in Your Expo React Native App**

1.  **Create a Sentry Client:**

    ```javascript
    import * as Sentry from '@sentry/react-native';

    // Replace with your Sentry SDK Public Key
    const SENTRY_PUBLIC_KEY = 'YOUR_SENTRY_PUBLIC_KEY';

    Sentry.init({
      dsn: SENTRY_PUBLIC_KEY,
      // Optional:  Customize error reporting
      // active: process.env.NODE_ENV === 'production', // Only report in production
      // Before (optional - helpful for debugging)
      // before(e) {
      //   console.log('Sentry Before:', e);
      // },
      // After (optional - helpful for debugging)
      // after(e) {
      //   console.log('Sentry After:', e);
      // },
    });
    ```

2.  **Wrap Your App (if needed):**  If you're using a custom root component, wrap your app with Sentry:

    ```javascript
    import { AppProvider } from '@sentry/react-native';
    import App from './App'; // Your main App component

    const AppWithSentry = () => {
      return (
        <AppProvider>
          <App />
        </AppProvider>
      );
    };

    export default AppWithSentry;
    ```

3.  **Integrate with Expo's Native Modules (Important for React Native Crashes):**  Sentry's React Native SDK often needs to register with Expo's native modules to reliably catch crashes.  The easiest way to do this is with Expo's `expo-updates` library, which handles the native registration.  This is the most common cause of Sentry not reporting native crashes.

    ```bash
    npx expo install expo-updates
    ```

    Then, add this to your `App.js`:

    ```javascript
    import { AppProvider } from '@sentry/react-native';
    import App from './App'; // Your main App component

    const AppWithSentry = () => {
      return (
        <AppProvider>
          <App />
        </AppProvider>
      );
    };

    export default AppWithSentry;
    ```

**Step 3: Configure S
