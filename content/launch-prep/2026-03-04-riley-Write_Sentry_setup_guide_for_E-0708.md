# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-04T07:08:40.096454

```markdown
# Sentry Setup Guide for Expo React Native + Express

This guide walks you through setting up Sentry for your Expo React Native app and your accompanying Express.js backend.  It covers integration with Expo's native modules and best practices.

**Prerequisites:**

*   **Expo CLI:**  Make sure you have Expo CLI installed globally: `npm install -g expo-cli`
*   **Node.js and npm/yarn:**  You’ll need Node.js and either npm or yarn.
*   **Sentry Account:** You'll need a Sentry account. Create one at [https://sentry.io/](https://sentry.io/).

## 1. Install Sentry SDKs

Install the necessary Sentry SDKs for both your React Native app and your Express.js backend.

**React Native (Expo App):**

```bash
npm install --save @sentry/react-native
# or
yarn add @sentry/react-native
```

**Express.js Backend:**

```bash
npm install --save @sentry/node
# or
yarn add @sentry/node
```

## 2. Configure Sentry in Expo React Native

**a) Install the `sentry-expo` package:**

This package is a wrapper around `@sentry/react-native` specifically designed for Expo.

```bash
npm install --save @sentry/expo
# or
yarn add @sentry/expo
```

**b) Initialize Sentry in your Root App:**

Inside your main `App.js` (or equivalent) file, initialize Sentry.  Replace `YOUR_SENTRY_DSN` with your actual Sentry DSN (Data Source Name). You can find this on your Sentry dashboard after creating an account.

```javascript
import * as React from 'react';
import { ExpoRoot } from 'expo-root';
import Sentry from '@sentry/react-native';

export default function App() {
  return (
    <ExpoRoot>
      <Sentry.SSR
        원본 URL="/">
        <ExpoRoot />
      </Sentry.SSR>
    </ExpoRoot>
  );
}
```

**Explanation:**

*   `Sentry.SSR`: This component manages the Sentry setup, including instrumentation and reporting.
*   `원본 URL="/":`  This specifies the base URL to capture for error reporting. It's important for correctly attributing errors.

**c) Configure Sentry Severity Levels (Important for Expo):**

Expo's native modules often have asynchronous callbacks that can be tricky to debug with Sentry.  You'll likely need to adjust the severity levels to capture more detailed information.

In your `App.js` or a dedicated configuration file, configure the `defaultSeverity` to `critical` to ensure that all errors are caught.

```javascript
import * as React from 'react';
import { ExpoRoot } from 'expo-root';
import Sentry from '@sentry/react-native';

export default function App() {
  return (
    <ExpoRoot>
      <Sentry.SSR
        원본 URL="/">
        <ExpoRoot />
      </Sentry.SSR>
    </ExpoRoot>
  );
}
```

**d) Start your Expo Development Server:**

```bash
expo start
# or
npm start
# or
yarn start
```

**e) Verify Sentry is Working:**

After starting your Expo development server, Sentry should automatically start sending error reports.  Check your Sentry dashboard to confirm you're receiving events.

## 3. Configure Sentry in Express.js Backend
