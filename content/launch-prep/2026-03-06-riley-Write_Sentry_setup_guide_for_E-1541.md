# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-06T15:41:50.034026

Okay, let's create a comprehensive Sentry setup guide for an Expo React Native project with an Express backend. This guide will cover everything from installation to integrating Sentry into your application.

**Prerequisites:**

*   **Expo CLI:**  Make sure you have Expo CLI installed globally: `npm install -g expo-cli`
*   **Node.js & npm/yarn:**  You need Node.js and a package manager (npm or yarn) installed.
*   **Sentry Account:**  You'll need a Sentry account.  Sign up at [https://sentry.io/](https://sentry.io/).
*   **Expo Project:**  You should have a working Expo React Native project.

**Step 1: Create a New Expo Project (If Needed)**

If you don't have an existing project, create one:

```bash
npx create-expo-app my-sentry-app
cd my-sentry-app
```

**Step 2: Install Sentry SDK**

In your Expo project, install the Sentry SDK:

```bash
npm install @sentry/react-native @sentry/node
# or using yarn
yarn add @sentry/react-native @sentry/node
```

**Step 3: Configure Sentry Node.js SDK (Backend)**

This is crucial for capturing errors originating from your Express backend.

1.  **Create a `.sentry.properties` file:**
    Create a file named `.sentry.properties` in the root directory of your Express backend.  This file will contain your Sentry SDK details.

    ```properties
    SENTRY_PROJECT=your-sentry-project-id
    SENTRY_AUTH_TOKEN=your-sentry-auth-token
    ```

    *   **`SENTRY_PROJECT`:**  Replace `your-sentry-project-id` with your actual Sentry project ID (found on your Sentry dashboard).
    *   **`SENTRY_AUTH_TOKEN`:**  Replace `your-sentry-auth-token` with your Sentry authentication token.  You can generate this token on your Sentry dashboard under your profile settings.

2.  **Install the `sentry-node` Package:**
    ```bash
    npm install @sentry/node
    # or using yarn
    yarn add @sentry/node
    ```

3.  **Initialize the Node.js SDK:**
    In your Express backend's main file (e.g., `server.js` or `index.js`), initialize the Sentry SDK:

    ```javascript
    // server.js (Example)
    const express = require('express');
    const app = express();
    const Sentry = require('@sentry/node');

    // ... your Express app setup ...

    Sentry.init({
      dsn: 'https://your-sentry-project-id.sentry.io', // Replace with your DSN
      tracesSampleRate: 100, // Adjust based on your needs (percentage)
      //  ignoreUrls: ['http://localhost:19000'], // Optional: Ignore URLs (useful for development)
    });

    app.get('/', (req, res) => {
      res.send('Hello Sentry!');
    });

    // Example error handling
    app.use((err, req, res, next) => {
      console.error(err.stack);
      Sentry.captureException(err, {
        extra: {
          req: req.body, // Log request body for context
          url: req.originalUrl,
