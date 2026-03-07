# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-04T10:32:52.049210

Okay, here's a comprehensive Sentry setup guide specifically tailored for Expo React Native projects using Express as your backend. This guide covers installation, configuration, and important considerations for a smooth integration.

**1. Prerequisites**

*   **Expo Go App:**  Have the Expo Go app installed on your mobile device.
*   **Expo CLI:**  You'll need the Expo CLI installed globally. (If you don't have it: `npm install -g expo-cli`)
*   **Node.js and npm/yarn:** Ensure you have Node.js and npm or yarn installed on your development machine.
*   **Sentry Account:** Create a free Sentry account at [https://sentry.io/](https://sentry.io/)

**2. Installation**

First, install the necessary packages within your Expo React Native project:

```bash
npm install @sentry/react-native @sentry/sdk sentry-expo
```

or with yarn

```bash
yarn add @sentry/react-native @sentry/sdk sentry-expo
```

**3. Configure Sentry in Your Express Backend**

This is crucial. Sentry primarily focuses on *client-side* (Expo React Native) errors.  You'll need to configure it for your Express backend as well.

*   **Create a Sentry Project:**  In your Sentry dashboard, create a new project.  Give it a descriptive name.
*   **Get Your Sentry SDK Key:** After creating the project, Sentry will provide you with a unique SDK key (also often referred to as the project public key). *Keep this key safe.*
*   **Add Sentry SDK to Express:**

```javascript
// server/index.js (or your Express app file)
const express = require('express');
const app = express();
// ... your routes ...

app.get('/sentry-init', (req, res) => {
  const SENTRY_DSN = 'YOUR_SENTRY_DSN';  // Replace with your Sentry DSN
  //  Example DSN:  "https://YOUR_PROJECT_PUBLIC_KEY@YOUR_ENVIRONMENT.sentry.io/stages/YOUR_ENVIRONMENT"
  //  Replace 'YOUR_PROJECT_PUBLIC_KEY', 'YOUR_ENVIRONMENT' with your values.
  Sentry.init({
    dsn: SENTRY_DSN,
    // Optional: Include a 'traces' option to capture traces (breadcrumbs)
    traces: true,
    // Optional:  Set a 'track' function if you need to manually track events
    track: (eventData) => {
      console.log("Tracking event:", eventData);
      Sentry.captureEvent(eventData);
    },
  });
  res.status(200).send('Sentry initialized!');
});

module.exports
```

*   **Important:** Replace `YOUR_SENTRY_DSN` with your actual Sentry DSN.  The DSN (Data Source Name) is the key to connecting your application to Sentry.  The format is typically:

    `https://<your-project-public-key>@<environment>.sentry.io/stages/<environment>`

    *   `<your-project-public-key>`: Your Sentry project's public key.
    *   `<environment>`:  This is how you categorize your errors (e.g., `development`, `staging`, `production`).

*   **`track` function (Optional but Recommended):** The `track` function allows you to manually send events (breadcrumbs) from your backend to Sentry, providing additional context to errors.  This is
