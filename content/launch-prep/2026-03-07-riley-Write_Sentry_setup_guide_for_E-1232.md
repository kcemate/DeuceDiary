# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-07T12:32:54.152772

Okay, let's create a comprehensive Sentry setup guide specifically for an Expo React Native project integrated with an Express backend. This guide will cover installation, configuration, and best practices.

**Prerequisites:**

*   You have a working Expo React Native project.
*   You have Node.js and npm/yarn installed.
*   You have a Sentry account.  Sign up at [https://sentry.io/](https://sentry.io/)

**Steps:**

**1. Install Sentry Packages:**

First, install the necessary Sentry packages for both your React Native and Express applications.

*   **React Native:**
    ```bash
    npm install @sentry/react-native
    # or
    yarn add @sentry/react-native
    ```
*   **Express:**
    ```bash
    npm install @sentry/node
    # or
    yarn add @sentry/node
    ```

**2. Configure Sentry in Your React Native App:**

*   **Initialize Sentry:** In your main App.js or App.tsx file, initialize Sentry.

    ```javascript
    import * as Sentry from '@sentry/react-native';

    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN', // Replace with your actual DSN
      // Optionally customize...
      // BeforeErrorTheme: {
      //   attach: true,
      // },
      // trackUserInterfaceUpdate: true,
    });

    export default App;
    ```

    *   **`dsn`:** This is your Sentry Data Source Name (DSN). You'll find this on your Sentry dashboard after creating an app.  It's a string in the format: `sentry.io/YOUR_PROJECT_ID/`
    *   **Customization (Optional):**
        *   `BeforeErrorTheme`:  Customize the appearance of error details when they are first attached.
        *   `trackUserInterfaceUpdate`:  Automatically track updates to the UI (often helpful for performance issues).

**3. Configure Sentry in Your Express Backend:**

*   **Initialize Sentry:** In your Express application's main file (e.g., `app.js` or `server.js`), initialize Sentry.

    ```javascript
    const Sentry = require('@sentry/node');

    // Set the global Sentry instance
    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN', // Replace with your actual DSN
      // Optionally customize...
    });

    // Example:  Wrap your routes with Sentry
    const express = require('express');
    const app = express();

    app.get('/api/users', (req, res) => {
      Sentry.captureMessage('User request received', {
        level: Sentry.Severity.INFO,
        extra: {
          requestUrl: req.url,
          userIp: req.ip,
        },
      });
      // ... your route logic ...
    });

    app.listen(3000, () => {
      console.log('Server listening on port 3000');
    });
    ```

    *   **`dsn`:**  Again, use your Sentry DSN.
    *   **`captureMessage`:** This is the most basic way to send events to Sentry.  It captures a message with an optional level (INFO, WARNING, ERROR, etc.) and extra context.
    *   **`extra`:** This object lets you include contextual data with your events, like request URLs, IP
