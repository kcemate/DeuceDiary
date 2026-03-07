# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-04T09:47:23.552740

## Sentry Setup Guide for Expo React Native + Express

This guide outlines how to integrate Sentry into your Expo React Native app and your Express backend. It covers the key steps for instrumentation, configuration, and monitoring.

**1. Prerequisites:**

* **Node.js and npm/yarn:**  Make sure you have Node.js and a package manager (npm or yarn) installed.
* **Expo CLI:**  You need the Expo CLI to manage your project. If you don't have it, install it globally: `npm install -g expo-cli`
* **Sentry Account:** You'll need an account on [Sentry](https://sentry.io/). Sign up for a free account.

**2. Install Sentry Packages:**

Install the necessary Sentry packages in both your React Native app and your Express backend:

**React Native App:**

```bash
npm install @sentry/react-native
# or
yarn add @sentry/react-native
```

**Express Backend:**

```bash
npm install @sentry/node
# or
yarn add @sentry/node
```

**3. Configure Sentry in your React Native App:**

**a)  Get Your Sentry Project ID:**

* Log in to your Sentry dashboard.
* You'll see your project ID, which looks something like `YOUR_PROJECT_ID`.  Make note of this ID.

**b)  Initialize Sentry:**

In your main entry point file (e.g., `App.js`), initialize Sentry:

```javascript
import * as React from 'react';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import AppNavigator from './AppNavigator'; // Or your navigation component
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'YOUR_PROJECT_ID', // Replace with your Sentry project ID
  tracesetIgnorance: [
    // (Optional)  List of global React components to ignore traces for.
    // Useful for components that you know won't have critical errors.
    // Example: ['Spinner']
  ],
  // (Optional)  Custom actions you can dispatch to Sentry
  // Example:
  // beforeExceptionFilter(exception, attributes) {
  //   attributes.additional = 'Custom Action';
  //   return new Sentry.Transaction({
  //     op: 'Exception',
  //     name: exception.name,
  //     message: exception.message,
  //     stackTrace: exception.stackTrace,
  //     extra: attributes,
  //   });
  // }
});

AppRegistry.registerComponent(appName, () => AppNavigator);
```

**c)  Track Errors (Simple Example):**

You can manually track errors using Sentry's `captureException` function:

```javascript
import * as React from 'react';
import { View, Button, Text } from 'react-native';

const App = () => {
  const handleButtonPress = () => {
    try {
      // Simulate an error
      throw new Error('Something went wrong!');
    } catch (error) {
      Sentry.captureException(error, {
        extra: {
          message: 'This is an extra message',
          level: 'error'
        }
      });
      console.error("Caught error: ", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>
