# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T10:45:26.204830

```bash
# 1. Install Sentry

```bash
npm install sentry --save
```

## 2. Initialize Sentry in Your Expo App

```bash
# a. Create a Sentry project at https://sentry.io/
#    and obtain your Sentry SDK (AUTH_TOKEN)

# b.  In your Expo project's root directory, run the following command:

npx @sentry/cli init
```

This command will guide you through the setup. Here's a breakdown of the key questions and what to answer:

*   **Sentry Project:** Select the Sentry project you created.
*   **Enable Source Maps:** (Recommended)  Enable this for better error reporting by mapping your client-side source code directly to the stack trace in Sentry.  This is extremely helpful for debugging React Native errors.
*   **Install `sentry-expo`:** Install the `sentry-expo` library.  This library provides integration with Expo's native modules.
    ```bash
    npm install @sentry/expo --save
    ```
*   **Add Sentry SDK to Your App:** This will install the Sentry SDK and configure it.

## 3. Configure Your Express Server

Now you need to integrate Sentry with your Express server.  There are several ways to do this, depending on your setup. Here are the most common approaches:

**Option 1:  Using `sentry-node` (Recommended for Larger Apps)**

This is the standard way to integrate Sentry with Node.js applications.  It provides fine-grained control and robust error handling.

*   **Install `sentry-node`:**
    ```bash
    npm install sentry-node --save
    ```
*   **Configure Sentry in your Express app's `server.js` (or similar file):**

    ```javascript
    const Sentry = require('sentry-node');
    const express = require('express');
    const app = express();

    // Set the Sentry SDK Auth Token
    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
      // Example DSN: 'https://YOUR_PROJECT_ID@sentry.io'
    });

    // Middleware to catch errors and report them to Sentry
    app.use((err, req, res, next) => {
      console.error(err);  // Log to console for initial debugging
      Sentry.captureException(err, {
        extra: {
          req: req.body, // Include request body for context
          url: req.originalUrl, // Include URL
          method: req.method
        }
      });
      res.status(500).send('Something went wrong!');
    });

    // Your Express app routes here...
    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
    ```

    **Important:** Replace `YOUR_SENTRY_DSN` with your actual Sentry DSN. You can find this in your Sentry project dashboard.

**Option 2:  Using `sentry-node` with `express-sentry` (Simplified for Express)**

The `express-sentry` middleware simplifies the integration process by handling error handling directly within Express.  It's a good choice for smaller apps or if you prefer a more streamlined approach.
