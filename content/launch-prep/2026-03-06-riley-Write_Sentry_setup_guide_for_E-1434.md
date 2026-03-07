# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-06T14:34:03.107154

Okay, let's create a comprehensive Sentry setup guide for Expo React Native and Express.js. This guide covers the key steps, configurations, and best practices to get you monitoring your application effectively.

**Prerequisites:**

*   **Node.js and npm (or yarn):**  Make sure you have Node.js and npm installed on your development machine.
*   **Expo CLI:** You need the Expo CLI installed globally.  `npm install -g expo-cli`
*   **Expo Go App:**  Have the Expo Go app running on your mobile device or emulator.
*   **Express.js Project:** You should already have a functional Express.js backend project.

**Step 1: Install Sentry Packages**

Navigate to your Expo React Native project directory in your terminal.  Install the necessary Sentry packages:

```bash
npm install @sentry/react-native @sentry/node --save-dev
# or with yarn:
# yarn add @sentry/react-native @sentry/node --dev
```

**Explanation of Packages:**

*   `@sentry/react-native`:  The Sentry SDK for React Native applications.
*   `@sentry/node`: The Sentry SDK for Node.js environments (your Express server).

**Step 2: Configure Sentry in Your Express Server**

1.  **Create a `.sentry.properties` file:**  In the root of your Express project, create a file named `.sentry.properties`. This file will hold your Sentry configuration.  Example content:

    ```properties
    AUTH_TOKEN=YOUR_SENTRY_AUTH_TOKEN
    ENVIRONMENT=development  # or production, staging, etc.
    SAMPLE_RATE=100        # Percentage of traces to sample (optional, defaults to 100)
    ```

    **Important:**  Replace `YOUR_SENTRY_AUTH_TOKEN` with your actual Sentry Auth Token.  You can find this token in your Sentry account dashboard after creating an organization and project.

2. **Install `sentry-node` as a dev dependency**:

    ```bash
    npm install sentry-node --save-dev
    # or yarn add sentry-node --dev
    ```

3. **Set up the Sentry SDK in your Express server (e.g., `server.js` or `app.js`):**

   ```javascript
   const Sentry = require('sentry-node');
   const dotenv = require('dotenv');
   dotenv.config();

   const express = require('express');
   const app = express();

   // Sentry Configuration
   const SentryOptions = {
     dsn: process.env.SENTRY_DSN, // Use environment variable for DSN
     // Other options can be added here (e.g., integrations)
   };

   Sentry.init(SentryOptions);

   // Example route
   app.get('/', (req, res) => {
     res.send('Hello, Express!');
   });

   // Error handling with Sentry
   app.use((err, req, res, next) => {
     console.error(err.stack);
     Sentry.captureException(err, {
       extra: {
         req: req.body, // Or any other relevant data
         url: req.originalUrl,
       },
     });
     res.status(500).send('Something went wrong!');
   });

   const port = process.env.PORT || 3000;
   app.listen(port, () => {
     console.log(`Server listening
