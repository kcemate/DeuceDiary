# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T11:30:45.569754

Okay, here's a comprehensive Sentry setup guide for an Expo React Native app integrated with an Express backend, combining best practices and clear steps.

**Prerequisites:**

*   **Expo CLI:** Installed and configured. (`npm install -g expo-cli`)
*   **React Native Project:**  An existing Expo React Native project.
*   **Node.js & npm/Yarn:**  Installed and available in your system.
*   **Express Backend:** A running Express.js server (for this example, assume it's running locally at `http://localhost:3000`).  This guide will focus on the React Native side.

**Steps:**

**1. Install Sentry SDK for React Native:**

```bash
npm install @sentry/react-native
```

or with Yarn:

```bash
yarn add @sentry/react-native
```

**2. Initialize Sentry in Your Expo App:**

*   **Create a Sentry Configuration File:** Create a file named `sentry.config.js` (or similar) in the root of your Expo project.  This file will hold your Sentry project details.

    ```javascript
    // sentry.config.js
    import * as Sentry from '@sentry/react-native';

    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN', // Replace with your actual Sentry DSN
      // Optional configuration options:
      // autoSetups: [
      //   { levels: ['info', 'warning', 'error'], 
      //     transactionOrigin: 'Expo React Native'
      //   }
      // ],
      // releaseStage: 'production', // For identifying releases
      // enableSourceMaps: true,   //  Good for debugging
    });
    ```

    *   **`dsn` (Data Source Name):** This is your Sentry project's DSN. You get this from your Sentry dashboard ([https://sentry.io/](https://sentry.io/)).  It looks something like:  `https://YOUR_ORG_ID.sentry.io/`  or `https://YOUR_PROJECT_ID.sentry.io/`.
    *   **`autoSetups` (Optional):** Automatically track events for specific levels (info, warning, error). The `transactionOrigin` helps categorize the events.
    *   **`releaseStage` (Optional):** Useful for tracking development, staging, and production releases.
    *   **`enableSourceMaps` (Optional):**  Enables source maps, making it easier to debug issues by mapping error stack traces to your source code.  Highly recommended.

**3. Import and Use Sentry in Your React Native Components:**

*   **Import Sentry:** In your React Native components, import `Sentry`.
*   **Use `Sentry.set` and `Sentry.captureException`:**  Use these functions to track events and errors.

    ```javascript
    import React, { useState } from 'react';
    import { View, Text, Button } from 'react-native';
    import * as Sentry from '@sentry/react-native';

    const MyComponent = () => {
      const [count, setCount] = useState(0);

      const increment = () => {
        try {
          setCount(count + 1);
          Sentry.captureMessage('Count incremented', { level: 'info' });
        } catch (error) {
          Sentry.captureException(error, {
            level: 'error',
            extra: {
              count: count,
              componentName
