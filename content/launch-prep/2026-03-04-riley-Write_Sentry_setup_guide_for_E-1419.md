# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-04T14:19:02.237936

## Sentry Setup Guide for Expo React Native + Express

This guide outlines the steps to integrate Sentry for monitoring your Expo React Native app and your Express backend. It covers installation, configuration, and key considerations.

**Prerequisites:**

*   **Sentry Account:** You'll need an active Sentry account. Sign up at [https://sentry.io/](https://sentry.io/)
*   **Expo Project:** An existing Expo React Native project.
*   **Node.js and npm/yarn:** Ensure you have Node.js and a package manager (npm or yarn) installed.
*   **Express Backend:** You should have an Express server running your backend logic.


**Steps:**

**1. Install Sentry Packages:**

   *   **For React Native:**
      ```bash
      npm install @sentry/react-native
      # or
      yarn add @sentry/react-native
      ```

   *   **For Express:**
      ```bash
      npm install @sentry/node
      # or
      yarn add @sentry/node
      ```

**2. Configure Sentry in your React Native App:**

   *   **Get Sentry DSN:**  In your Sentry dashboard, create an app and copy the *DSN (Data Source Name)*.  This is your authentication key.

   *   **Integrate Sentry SDK:** In your React Native app's root file (e.g., `App.js` or `index.js`), import and initialize the Sentry SDK:

      ```javascript
      import Sentry from '@sentry/react-native';

      // Replace with your actual DSN
      Sentry.init({
        dsn: 'YOUR_SENTRY_DSN',
        // Optional:  You can configure additional options here
        // Example:
        // autoSetContext: true, // Automatically set context from user info
        // trackPerformance: true // Track JS performance
      });
      ```

   *   **Handle Errors:**  Wrap your app's logic in a `try...catch` block or use Sentry's error reporting:

      ```javascript
      import React, { Component } from 'react';
      import { View, Text, Button } from 'react-native';

      class MyComponent extends Component {
        componentDidCatch(error, info) {
          Sentry.add Report({
            exception: error,
            stackTrace: info.stackTrace,
            extra: {
              componentName: this.props.componentName || 'Unnamed Component',
              // Add any relevant context here
            },
          });
        }

        render() {
          try {
            return (
              <View>
                <Text>This is my component</Text>
              </View>
            );
          } catch (error) {
            // This block will be hit if there's an error in the render
            console.error("Error in render:", error);
            Sentry.add Report({
              exception: error,
              stackTrace: error.stackTrace,
            });
          }
        }
      }

      export default MyComponent;
      ```
      **Explanation:**
      * `componentDidCatch(error, info)`: This lifecycle method is called when an unhandled error occurs within a component.
      * `Sentry.add Report()`:  This function sends the error report to Sentry, including the error details and stack trace.  The `extra` object allows you to include contextual information.

**3. Configure Sentry in your Express Backend:**

   *   **Get Sentry DSN:**  As
