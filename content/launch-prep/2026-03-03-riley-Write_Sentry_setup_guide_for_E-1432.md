# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T14:32:04.847653

## Sentry Setup Guide for Expo React Native + Express

This guide outlines the steps to integrate Sentry into your Expo React Native project with your Express backend. It covers installation, configuration, and basic usage.

**Prerequisites:**

*   **Node.js and npm (or yarn):** Make sure you have Node.js and npm installed.
*   **Expo CLI:** You'll need the Expo CLI installed to build and run your React Native app.
*   **Sentry Account:** Create a free Sentry account at [https://sentry.io/](https://sentry.io/).

**Steps:**

**1. Install Sentry Packages:**

Install the necessary Sentry packages for both React Native and Express:

```bash
# React Native (Expo)
npx expo install @sentry/react-native

# Express Backend
npm install @sentry/node
# or
yarn add @sentry/node
```

**2. Configure Sentry in your React Native Expo App:**

*   **Create a Sentry Initial Screen:** Import the `SentryInitialScreen` component from `@sentry/react-native`.

```javascript
import { SentryInitialScreen } from '@sentry/react-native';
```

*   **Wrap your app with the `SentryInitialScreen`:**  In your main app file (usually `App.js` or `index.js`), wrap your app with the `SentryInitialScreen` and configure it.

```javascript
import React from 'react';
import { ExpoRoot } from './app/app'; // Your ExpoRoot component
import { SentryInitialScreen } from '@sentry/react-native';

const App = () => {
  return (
    <SentryInitialScreen
      org="your-org-name"          // Your Sentry organization name
      project="your-project-name"  // Your Sentry project name
      dsn="YOUR_SENTRY_DSN"          // Your Sentry DSN (see below)
      // Optional:  Customize the appearance and behavior
      //  e.g., enable/disable session replays, include links, etc.
    >
      <ExpoRoot />
    </SentryInitialScreen>
  );
};

export default App;
```

*   **Get your DSN (Data Source Name):**  This is the most important part.  Your DSN is a unique identifier that links your app to your Sentry project.  You'll find it in your Sentry dashboard after creating your project.  It will look something like: `https://YOUR_PROJECT_ID.sentry.io/` or `https://your-domain.com/sentry/YOUR_PROJECT_ID`

**3. Configure Sentry in your Express Backend:**

*   **Import `@sentry/node`:** Import the `@sentry/node` package.

```javascript
const Sentry = require('@sentry/node');
```

*   **Initialize Sentry:**  Initialize Sentry in your application's main entry point (e.g., `app.js` or `server.js`).  This should be done *before* your routes or any other application logic.

```javascript
// app.js
const express = require('express');
const app = express();
const Sentry = require('@sentry/node');

// Configure Sentry
Sentry.init({
  dsn: 'YOUR_SENTRY_DSN', // Replace with your DSN
  // Optional:  Integrate with other Sentry features
  //  e.g., integrate with custom breadcrumbs, performance monitoring
});

// Your Express routes here...
