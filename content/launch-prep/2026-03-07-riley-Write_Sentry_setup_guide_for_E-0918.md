# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-07T09:18:05.631673

## Sentry Setup Guide for Expo React Native + Express

This guide will walk you through integrating Sentry into your Expo React Native application and your associated Express backend.  This is a multi-step process that requires configuring both the React Native and Express sides.

**Prerequisites:**

*   **Node.js and npm/yarn:** Make sure you have Node.js installed on your system.
*   **Expo CLI:** Install the Expo CLI globally: `npm install -g expo-cli`
*   **Sentry Account:** You need a Sentry account. Sign up at [https://sentry.io/](https://sentry.io/).
*   **Expo Go App (Optional but Recommended):** Have the Expo Go app installed on your mobile device for immediate testing.

**Step 1: Create a Sentry Project in Sentry**

1.  Log in to your Sentry account.
2.  Click "Create Project" and choose a project name.  You can choose a "New Project" or "Import Existing Project" depending on your needs.
3.  Select the application type: "Web" (even though it's React Native, we'll use it for the web SDK).
4.  Configure any project settings (e.g., auto-track, integrations).  For a basic setup, you can usually leave these at their defaults.
5.  Take note of your **Sentry Project ID** (a long string of characters). You'll need this later.

**Step 2: Install Sentry SDK in Expo React Native**

1.  **Navigate to your Expo project directory:** `cd my-expo-project`
2.  **Install the Sentry SDK:**
    ```bash
    npm install @sentry/react-native
    # or
    yarn add @sentry/react-native
    ```

**Step 3: Configure Sentry in Your React Native App**

1.  **Import Sentry and Initialize:**  In your main App.js (or the root of your application), import and initialize Sentry:

    ```javascript
    import * as Sentry from '@sentry/react-native';

    // Replace with your Sentry Project ID
    const SENTRY_PROJECT_ID = 'YOUR_SENTRY_PROJECT_ID';

    Sentry.init({
      dsn: `https://${SENTRY_PROJECT_ID}.sentry.io/`,
      // Set additional options as needed
      // sampleRate: 0.8, // Track 80% of events
    });

    export default App;
    ```

2.  **Enable Automatic Trackers:** Ensure you have automatic trackers enabled. This will automatically track errors, warnings, and info events.

    ```javascript
    import * as Sentry from '@sentry/react-native';

    // ... other code ...
    Sentry.init({
        dsn: 'YOUR_SENTRY_PROJECT_ID',
        // ... other options ...
        // beforeEach: () => {},
        // afterEach: () => {},
        // beforeError: () => {},
        // afterError: () => {},
    });

    export default App;
    ```

    *   You can also use `Sentry.setContext` to set context information for each tracked event. This can be useful for correlating events with user information or session data.

3.  **Testing:** Run your Expo app and simulate an error (e.g., try to divide by zero in a component). You should see the error report appear in Sentry.

**Step 4: Install and Configure Sentry SDK in Your Express Backend**

1.  **Install the Sentry SDK
