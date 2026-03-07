# Write a Sentry error tracking setup guide for Expo React Nat
Agent: riley
Generated: 2026-03-03T06:09:06.132729

## Sentry Error Tracking Setup Guide for Expo React Native + Express.js

This guide outlines how to set up Sentry error tracking for your Expo React Native application and your accompanying Express.js backend.  It covers installation, configuration, enabling source maps, release tracking, and setting up alert rules.

**Prerequisites:**

*   A Sentry account (sign up at [https://sentry.io/](https://sentry.io/))
*   Node.js and npm (or Yarn) installed
*   Expo CLI installed and configured

**1. Installation:**

**a) React Native Side:**

*   **Install Sentry-Expo:**

```bash
npm install sentry-expo
# or
yarn add sentry-expo
```

*   **Install `react-native-web` (If using React Native Web):** If you're utilizing React Native Web, ensure you have it installed and configured.

**b) Express.js Side:**

*   **Install Sentry Node.js:**

```bash
npm install sentry
# or
yarn add sentry
```

**2. Configuration:**

**a) Sentry Project Setup:**

1.  **Create a New Project in Sentry:**  Log in to your Sentry dashboard and create a new project for your Expo React Native application.  Give it a meaningful name and description.
2.  **Get Your Sentry SDK Key:**  On the project dashboard, you'll find your Sentry SDK key (it will look like `XXXXXXXXXXXXXX`).  This is crucial for initializing Sentry in your apps.

**b) React Native Configuration:**

1.  **`sentry.config.js`:** Create a file named `sentry.config.js` at the root of your Expo project. This file will contain your Sentry configuration.

```javascript
import * as Sentry from 'sentry-expo';

Sentry.init({
  // For development, use 'dev mode' to capture errors with full stack traces
  dsn: 'YOUR_SENTRY_DSN',  // Replace with your Sentry DSN
  enableSourceMaps: true, // Important for debugging
  // Release Tracking (optional)
  releaseTrackers: ['v1.0.0', 'v1.1.0'],
  // Sample Requests (optional, for performance monitoring - requires Sentry Performance API)
  // sampleRate: 0.5,
});
```

*   **`YOUR_SENTRY_DSN`:** Replace this placeholder with the actual DSN (Data Source Name) that Sentry provided you. The DSN is usually in the format: `https://<domain>/<project_id>/<global_release_id>`

**c) Express.js Configuration:**

1.  **Initialize Sentry:**  Inside your Express.js app, in your main app file (e.g., `app.js` or `server.js`), initialize Sentry:

```javascript
const Sentry = require('sentry');

Sentry.init({
  // Replace with your Sentry DSN
  dsn: 'YOUR_SENTRY_DSN',
  // Optional: Include a sample rate
  // sampleRate: 0.5,
});

// Your Express.js app code here
```

**3. Enable Source Maps:**

*   **`enableSourceMaps: true` in `sentry.config.js`:**  This is *extremely* important.  Without source maps, Sentry will only show the line numbers in the compiled JavaScript, making debugging incredibly difficult.  Source maps map the compiled code back to your original source files, allowing you to see the exact location of
