# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T22:04:59.792622

## Sentry Setup Guide for Expo React Native + Express

This guide outlines how to integrate Sentry into your Expo React Native application and your associated Express.js backend (if you have one).  It covers the necessary steps, best practices, and considerations.

**Prerequisites:**

*   **Expo CLI:** Ensure you have Expo CLI installed globally (`npm install -g expo-cli`).
*   **Sentry Account:** You'll need a Sentry account. Sign up at [https://sentry.io/](https://sentry.io/).
*   **Node.js & npm/yarn:**  Node.js and your package manager of choice must be installed.
*   **Expo Go App:**  Have the Expo Go app installed on your phone to test your setup.

**Steps:**

**1. Create a Sentry Project:**

*   Log in to your Sentry account.
*   Click "Create project."
*   Choose "Quick start" for a simple setup.
*   Give your project a name and description.
*   Select your application type: **"Web / Native"**
*   Select the **"React Native"** technology.
*   Click "Create SDK." You'll receive an **Sentry SDK Key (API Key)**.  Keep this key secure!

**2. Install Sentry Packages:**

*   **React Native:**
    ```bash
    npm install @sentry/react-native
    # or
    yarn add @sentry/react-native
    ```
*   **Express (if applicable):**
    ```bash
    npm install @sentry/node
    # or
    yarn add @sentry/node
    ```

**3. Configure the React Native App:**

*   **Install the Sentry SDK:** Import and initialize the Sentry SDK in your main App.js or your root component file.

    ```javascript
    import * as Sentry from '@sentry/react-native';

    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
      // Set tracekit to automatically capture stack traces for uncaught exceptions
      tracesetEnabled: true,
      // You can customize the default sample rate if needed.  Higher values mean more data.
      sampleRate: 0.95,
      // Optionally configure auto-batching
      autoSetUpshots: true,
      // Optionally configure integrations with other services (e.g., Slack, PagerDuty)
    });
    ```

*   **Replace `YOUR_SENTRY_DSN`:**  This is the crucial part. Replace this placeholder with your actual Sentry DSN. The DSN (Data Source Name) has the following format:

    `https://<public_key>@sentry.io/<project_id>`

    You can find the DSN in your Sentry project dashboard after creating the SDK.

*   **Example `App.js`:**

    ```javascript
    import React from 'react';
    import { SafeAreaView, Text, StyleSheet } from 'react-native';
    import * as Sentry from '@sentry/react-native';

    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN',
      tracesetEnabled: true,
      sampleRate: 0.95,
      autoSetUpshots: true
    });

    const App = () => {
      Sentry.set && Sentry.set({
          // Set any custom Sentry properties here
          project: 'my-expo-app'
      });
      return (
        <SafeAreaView style={
