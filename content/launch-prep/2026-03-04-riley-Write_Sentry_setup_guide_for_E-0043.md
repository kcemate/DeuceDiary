# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-04T00:43:17.840382

```bash
# Prerequisites:
# - Node.js and npm (or yarn) installed
# - Expo CLI installed:  npm install -g expo-cli

# 1.  Install Sentry
```bash
npm install sentry-expo --save
```

or with yarn:
```bash
yarn add sentry-expo
```

## 2. Initialize Sentry in your Expo Project

First, you need to create a Sentry project on the Sentry website: [https://sentry.io/](https://sentry.io/)

*   **Sign up or Log in:** Create an account on Sentry if you don't have one.
*   **Create a New Project:**  Follow the instructions on the Sentry website to create a new project. Give it a meaningful name (e.g., "Expo React Native App").
*   **Copy the Sentry SDK Key:** After creating the project, you'll be provided with an SDK key (also called a "public key").  **Copy this key.**

Now, in your Expo project's root directory, run the following command:

```bash
npx @sentry/expo --app <YOUR_APP_NAME> --project <YOUR_PROJECT_KEY>
```

Replace:

*   `<YOUR_APP_NAME>`:  A descriptive name for your Expo app (e.g., "MyApp").  This is used for your Sentry client.
*   `<YOUR_PROJECT_KEY>`:  The SDK key you copied from the Sentry website.

**Example:**

```bash
npx @sentry/expo --app MyApp --project 64f21ac5082a47688725839301c67ff1
```

This command will:

*   Create a `Sentry.Expo.js` file in your project's root directory.
*   Install any necessary Sentry dependencies.
*   Configure Sentry to automatically capture errors from your Expo app.

## 3. Integrate Sentry into your React Native App

Import `Sentry.Expo.js` into your main app file (usually `App.js` or `index.js`).

```javascript
import { Expo } from 'sentry-expo';
import React from 'react';
import AppNavigator from './navigation/AppNavigator'; // Replace with your navigation component

export default () => {
  return (
    <Expo.Root>
      <AppNavigator />
    </Expo.Root>
  );
};
```

**Important:** Make sure the `Expo.Root` component is at the top level of your application.

## 4.  (Optional) Configure Sentry (Sentry.Expo.js Configuration)

The `Sentry.Expo.js` file contains configuration options.  Here are some common settings you might want to adjust:

*   **`Release Channel`**:  Specify the channel of your app (e.g., "production", "staging"). This helps Sentry categorize your reports.
*   **`Release Version`**:  Set the version number of your app.  Sentry uses this for grouping releases.
*   **`Environment`**:  Set the environment (e.g., "development", "production").

```javascript
// Sentry.Expo.js (Example)
import { Sentry } from 'sentry-expo';

export default (options = {}) => {
  Sentry.init({
    dsn: 'YOUR_PROJECT_KEY', // Replace with your SDK key
    ...options, // Allow passing other Sentry options
  });
};
```

**To customize the configuration:**  Create a
