# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T23:12:59.355018

## Sentry Setup Guide for Expo React Native + Express

This guide outlines how to integrate Sentry into your Expo React Native application and your accompanying Express backend.  It covers installation, configuration, and basic usage.

**Prerequisites:**

*   **Expo CLI:**  Make sure you have Expo CLI installed globally.
*   **Node.js and npm/yarn:**  You'll need Node.js and a package manager like npm or yarn.
*   **Sentry Account:** Create a free account on [https://sentry.io/](https://sentry.io/).

**1. Create a Sentry Project:**

*   Log into your Sentry account.
*   Click "Create project" and give your project a name.  Choose the "New project" option.
*   You'll be prompted to set an initialize snippet.  Choose the "Manual initialization" option.  This will give you the Sentry SDK key and configure the initial setup.
*   **Important:** Take note of the **Sentry SDK Key (SAMPLE)** and the **Release Stage** that Sentry will use for your application.  You'll need these in the next steps.


**2. Install Sentry Packages:**

*   **React Native:**
    ```bash
    npm install @sentry/react-native
    # or
    yarn add @sentry/react-native
    ```

*   **Express:**
    ```bash
    npm install @sentry/node
    # or
    yarn add @sentry/node
    ```

**3. Configure React Native:**

*   **`sentry.init()`:**  Import and initialize Sentry in your main application entry point (usually `App.js` or `index.js`).
    ```javascript
    import * as React from 'react';
    import { AppRegistry } from 'react-native';
    import App from './App'; // or your main component
    import { Sentry } from 'react-native';

    // Replace with your Sentry SDK Key
    const SENTRY_DSID = 'YOUR_SENTRY_DSID'; 

    // Initialize Sentry
    Sentry.init({
      dsid: SENTRY_DSID,
      // Optional:  Sets a custom app name
      app: 'My Expo App',
      // Optional: Set release stage
      releaseStage: 'production', // or 'staging' or 'development'
      // Optional: Include client information (for better debugging)
      // Example:
      // clientTrackUser: true,
    });

    AppRegistry.registerComponent('App', () => App);
    ```

    *   **`YOUR_SENTRY_DSID`:** Replace this with the **Sentry SDK Key (SAMPLE)** you obtained from Sentry.  This is crucial for sending data to your Sentry project.
    *   **`app`:**  (Optional) Sets the name of your application. This is helpful for organization in Sentry.
    *   **`releaseStage`:** (Optional, but highly recommended) This helps Sentry categorize errors based on the environment.  Set it to 'production', 'staging', or 'development' to accurately track issues.
    *   **`clientTrackUser`:** (Optional)  Enable tracking user information (like email, device ID, etc.) which can be helpful for debugging and user segmentation.

**4. Configure Express Backend:**

*   **Install the Node.js Sentry SDK:**  (You've already done this in step 2).
*   **Initialize Sentry:**  In your Express application, initialize Sentry in your main file (e.g., `app.js
