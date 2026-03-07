# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-07T12:11:48.246936

Okay, here's a comprehensive Sentry setup guide specifically tailored for an Expo React Native project using an Express.js backend. This guide covers installation, configuration, and best practices.

**Understanding the Setup**

The core idea is to instrument both your React Native app *and* your Express backend with Sentry to capture errors, traces, and performance data.  This allows you to understand where problems occur throughout your entire application stack.

**Prerequisites**

*   **Expo CLI:** You should have Expo CLI installed and configured.
*   **Node.js and npm/yarn:**  Ensure you have Node.js and a package manager (npm or yarn) installed.
*   **Sentry Account:** You'll need a Sentry account. Sign up at [https://sentry.io/](https://sentry.io/).

**Step 1: Install Sentry Packages**

In your Expo React Native project, run these commands in your terminal:

```bash
npm install sentry-expo @sentry/node
# or
yarn add sentry-expo @sentry/node
```

*   `sentry-expo`: This is the Expo SDK integration for Sentry.
*   `@sentry/node`: This is the Sentry Node.js SDK –  needed for your Express backend.  (You can use other Sentry SDKs if your backend uses a different language.)

**Step 2: Configure Sentry in Your Expo React Native App**

1.  **Get Your Sentry Project ID:**  Log into your Sentry account. You'll find your project ID in the project dashboard. It's a string of characters.

2.  **Configure `sentry-expo`:**
    *   In your `App.js` (or your main entry point), import and initialize Sentry:

    ```javascript
    import * as React from 'react';
    import { Expo } from 'expo';
    import Sentry from 'sentry-expo';

    export default class App extends React.Component {
      constructor(props) {
        super(props);
        this.sentry = null; // Initialize Sentry later
      }

      componentDidMount() {
        // Replace with your Sentry Project ID
        Sentry.init({
          dsn: 'YOUR_SENTRY_PROJECT_ID',
          // Set environment (helpful for filtering)
          environment: 'production',
          // Optionally track transactions
          trackTransactions: true,
          // Optionally track user actions
          trackUserActions: true,
          // Optionally capture device info
          // sample: 0.1, // Optional: Sample 10% of events
        });
      }

      render() {
        return <Expo.App />;
      }
    }
    ```

    *   **Replace `YOUR_SENTRY_PROJECT_ID`** with your actual Sentry project ID.
    *   The `trackTransactions` and `trackUserActions` options are highly recommended for detailed tracking of user interactions.  Consider the `sample` option for controlling the volume of data sent.

**Step 3: Configure Sentry in Your Express Backend**

1.  **Install the Node.js Sentry SDK:** (You already did this in Step 1)

2.  **Initialize Sentry in Your Express App:**

    *   In your Express application's main file (e.g., `server.js` or `app.js`), import and initialize the SDK:

    ```javascript
    const express = require('express');
    const app = express();
    const Sentry = require('@sentry/node');

    // Set the Project ID
