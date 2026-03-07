# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T23:35:28.169106

Okay, let's craft a comprehensive Sentry setup guide specifically tailored for an Expo React Native app integrated with an Express backend. This guide will cover installation, configuration, and key considerations for a robust monitoring setup.

**Understanding the Architecture**

Before diving into the steps, let's clarify the setup. You have two parts:

1.  **Expo React Native App:**  Your mobile app built with Expo.
2.  **Express Backend:** Your server-side application built with Node.js and Express.

Sentry will be used to monitor both the client-side errors (from the React Native app) and the server-side errors (from the Express backend).

**Prerequisites**

*   **Sentry Account:**  You'll need a Sentry account.  Sign up at [https://sentry.io/](https://sentry.io/). You'll get a project key – save this, you’ll need it.
*   **Node.js and npm/yarn:** Ensure you have Node.js and a package manager (npm or yarn) installed.
*   **Expo CLI:** Install the Expo CLI globally: `npm install -g expo-cli` or `yarn global add expo-cli`
*   **Express Application:** You should have a functioning Express application set up.

**Step 1: Install Sentry Packages**

1.  **React Native (Expo):**

    ```bash
    npm install @sentry/react-native  # or yarn add @sentry/react-native
    ```

2.  **Express Backend:**

    ```bash
    npm install @sentry/node  # or yarn add @sentry/node
    ```

**Step 2: Configure Sentry in the React Native App**

1.  **Initialize Sentry:** In your React Native app's root directory, run the following command:

    ```bash
    npx @sentry/react-native init
    ```

    This command will ask you a series of questions to configure your Sentry integration.

2.  **Project Key:**  You'll be prompted for your Sentry project key. Paste the key you obtained from your Sentry account.

3.  **Enable Automatic Context:**  It's highly recommended to enable automatic context. This automatically captures useful information like user IDs and session IDs for each error.

4. **Customization (Optional):**
   *  **Screenshots:**  You can configure Sentry to automatically capture screenshots when errors occur in your app. This can be incredibly useful for debugging UI issues.
   *  **Local Logs:**  You can log local logs to Sentry using `console.log` statements or with the `logger` package.

**Example React Native Code (Basic Sentry Integration):**

```javascript
import * as Sentry from '@sentry/react-native';

// Initialize Sentry (usually done once)
Sentry.init({
  dsn: 'YOUR_SENTRY_DSN', // Replace with your DSN
  // Enable automatic context (recommended)
  integrations: [
    {
      level: 'debug', // Adjust logging level
      // ... other integrations
    },
  ],
});

// Example Error Handling
function handleClick() {
  try {
    // Some code that might throw an error
    throw new Error('Something went wrong!');
  } catch (error) {
    Sentry.captureException(error, {
      extra: {
        // Add any extra context to the error report
        // useful for debugging, like the current screen name
        screen: 'MyScreen',
      },
    });
  }
}
```

**Step 3
