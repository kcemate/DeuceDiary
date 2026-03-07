# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-04T12:26:13.840388

## Sentry Setup Guide for Expo React Native + Express

This guide outlines the steps to integrate Sentry into your Expo React Native and Express application, providing valuable insights into your application's performance and errors.

**Prerequisites:**

*   **Expo CLI:** Make sure you have the latest version of Expo CLI installed: `npm install -g expo-cli`
*   **Sentry Account:** You'll need a Sentry account. Create one at [https://sentry.io/](https://sentry.io/).
*   **Node.js & npm:** Ensure you have Node.js and npm installed on your machine.
*   **Expo Project:** You should have an existing Expo React Native project.

**Steps:**

**1. Install Sentry SDK:**

First, install the Sentry SDK for React Native and the Express SDK. You'll need them both to capture errors from both your frontend (React Native) and backend (Express) applications.

```bash
# In your Expo project directory
npm install @sentry/react-native @sentry/express
```

**2. Configure Sentry React Native SDK:**

*   **Get Sentry Project ID:** In your Sentry dashboard, you'll find your project ID.  Make a note of this – you'll need it in the next step.
*   **Configure `sentry.expo.json`:**  Create a `sentry.expo.json` file in the root of your project. This file configures the Sentry SDK for your React Native application.  Here's a basic example:

```json
{
  "environments": {
    "development": {
      "url": "http://localhost:19001"  // Replace with your development Expo server URL
    },
    "staging": {
      "url": "http://staging.example.com"
    },
    "production": {
      "url": "https://your-production-app.com"
    }
  },
  "global": {
    "environment": "development",  // Set to 'production' for live deployments
    "release": "v1.0",            // Set your release version
    "sample": false               // Set to true for debugging (only during development)
  }
}
```

*   **Adjust `url`:** Make sure the `url` values in the `environments` section match the URLs of your Expo development server, staging server, and production server.  This is crucial for Sentry to correctly identify the application context.
*   **Set `environment`:** Set the `environment` to 'development' during development to ensure accurate error tracking.  Change it to 'staging' or 'production' when appropriate.
*   **Set `release`:**  Use the `release` field to track your application versions.
*   **Enable `sample`:**  During development, set `sample` to `true` to allow Sentry to capture all errors, even those that might be sensitive. This is highly recommended during debugging.  Remember to set it to `false` in production for privacy reasons.

**3. Configure Sentry Express SDK:**

*   **Get Sentry Project ID:** Again, you'll need your Sentry project ID.
*   **Update your Express app:**  You'll need to integrate the Express SDK into your server-side code. A simple way to do this is to import the SDK and configure it in your main Express application file (e.g., `app.js` or `server.js`).

```javascript
const express = require('express');
const Sentry = require('@sentry/express');

const app = express();

// Initialize S
