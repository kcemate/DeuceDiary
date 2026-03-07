# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T06:37:50.954747

## Sentry Setup Guide for Expo React Native + Express

This guide outlines how to integrate Sentry into your Expo React Native app and your accompanying Express.js API server. It covers the key steps for tracking errors effectively, providing valuable insights for debugging and improving your application's stability.

**Prerequisites:**

*   **Expo Development Environment:**  Make sure you have Expo CLI installed and properly configured.
*   **Node.js and npm/yarn:**  Ensure you have Node.js and a package manager (npm or yarn) installed.
*   **Sentry Account:**  Create a free Sentry account at [https://sentry.io/](https://sentry.io/).

**1. Install Sentry Packages:**

First, install the necessary Sentry packages in both your React Native and Express projects:

**React Native (Expo App):**

```bash
npm install @sentry/react-native
# or
yarn add @sentry/react-native
```

**Express.js Server:**

```bash
npm install sentry
# or
yarn add sentry
```

**2. Configure Sentry in your React Native Expo App:**

**Step 2.1:  Set up Sentry Client:**

Import the `Sentry` client in your main app file (e.g., `App.js`) and initialize it.

```javascript
import { Sentry } from '@sentry/react-native';

// Enable Sentry in development.  Disable in production for performance.
Sentry.init({
  dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
  // Optional:  Set the reportLevels - 'debug', 'info', 'verbose', 'warn', 'error', 'critical'
  // reportLevels: {
  //   info: 'debug', // Set to 'debug' to send all info logs
  //   warn: 'warn',
  //   error: 'error',
  //   critical: 'critical',
  // }
});
```

*   **`YOUR_SENTRY_DSN`:** This is your Sentry DSN (Data Source Name). You can find this in your Sentry dashboard after creating an account. It looks something like: `sentry.io/<your_project_id>/<your_org_id>`.

*   **`reportLevels` (Optional):**  Configure the level at which Sentry will capture logs. 'debug' is often used in development, while 'warn' or 'error' is recommended for production.


**Step 2.2:  Handle Errors within your Components:**

Wrap your components with `Sentry.indicate()` to catch and report specific errors within them.

```javascript
import React from 'react';
import { View, Text, Button } from 'react-native';
import { Sentry } from '@sentry/react-native';

const MyComponent = () => {
  let count = 0;

  const increment = () => {
    Sentry.indicate({
      message: 'Increment button was clicked',
      extra: {
        count: count,
      },
    });
    count++;
    return count;
  };

  return (
    <View>
      <Text>Count: {count}</Text>
      <Button title="Increment" onPress={increment} />
    </View>
  );
};

export default MyComponent;
```

*   **`Sentry.indicate()`:**  This is the most common way to report errors within your components.  It allows you to provide context about the error (e.g., the component name, the state of the component,
