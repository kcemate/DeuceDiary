# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T07:45:12.831507

## Sentry Setup Guide for Expo React Native + Express

This guide outlines the steps to integrate Sentry into your Expo React Native project alongside your Express.js backend.  It covers installation, configuration, and important considerations.

**Prerequisites:**

*   A working Expo React Native project.
*   An Sentry account (sign up at [https://sentry.io/](https://sentry.io/)).
*   Node.js and npm/Yarn installed.

**1. Install Sentry Packages:**

You’ll need to install Sentry packages for both your React Native app and your Express.js backend.

*   **React Native App:**

    ```bash
    npm install @sentry/react-native
    # or
    yarn add @sentry/react-native
    ```

*   **Express.js Backend:**

    ```bash
    npm install @sentry/node
    # or
    yarn add @sentry/node
    ```

**2. Configure Sentry in the React Native App:**

*   **Create a Sentry Client:**  Inside your main app component (usually `App.js` or `index.js`), create a Sentry client instance.

    ```javascript
    import * as Sentry from '@sentry/react-native';

    // Replace with your Sentry project ID
    const SENTRY_PROJECT_ID = 'YOUR_SENTRY_PROJECT_ID';

    // Initialize Sentry
    Sentry.init({
      dsn: `https://${SENTRY_PROJECT_ID}.sentry.io/`,
      // Optional:  Customization options
      // performanceMonitoring: true, // Enable performance monitoring
      // trackUserInterfaceUpdates: true, // Track UI updates
      // enableSourceMaps: true, // Enable source maps for easier debugging
      // releaseStage: 'production', // Set the release stage (e.g., 'development', 'production')
    });

    export default App;
    ```

    **Important:** Replace `YOUR_SENTRY_PROJECT_ID` with your actual Sentry project ID.

*   **Handle Errors:**  Wrap your application's entry point with a global error handler to catch and send unhandled exceptions to Sentry.

    ```javascript
    import React, { useEffect } from 'react';
    import App from './App'; // Your main App component
    import * as Sentry from '@sentry/react-native';

    const errorHandler = (error, info) => {
      Sentry.captureException(error, info);
    };

    useEffect(() => {
      // Initialize Sentry - already done in App.js, but this ensures it's done after the component mounts
      Sentry.init({
        dsn: `https://${SENTRY_PROJECT_ID}.sentry.io/`,
        // ... (your other Sentry config options)
      });

      // Global Error Handler
      Sentry.setGlobalHandler(errorHandler);

    }, []); // Empty dependency array to run this effect only once on mount

    render() {
      return (
        <Sentry.Root {...Sentry.configure()} >
          <App />
        </Sentry.Root>
      );
    }
    ```

**3. Configure Sentry in the Express.js Backend:**

*   **Create a Sentry Client:** In your Express.js app (e.g., `server.js` or `app.js`), create a Sentry client instance.

    ```javascript
    const express = require('express');
    const Sentry = require('@sentry/node');

    // Replace with your Sentry project
