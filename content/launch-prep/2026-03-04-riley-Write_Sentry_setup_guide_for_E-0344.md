# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-04T03:44:36.413848

```bash
# 1. Install Sentry

#   This step is done once, globally for your development environment.
npm install --save-dev @sentry/react-native @sentry/node

# 2.  Set up Sentry Node.js SDK (for your Express backend)

#   - Create a `.sentry.client.js` file in your Express backend directory.
#   - This file initializes the Sentry Node.js SDK and configures it.

#   Example `.sentry.client.js`:
```javascript
import Sentry from '@sentry/node';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
  // Before each request, send the request data to Sentry
  tracesSampleRate: 100, //  Percentage of traces to sample (defaults to 100)
  // Automatic instrumentation (for common Node.js types)
  integrations: [
    {
      name: 'express',
      version: '1.0.0',  // Replace with your Express version
    },
  ],
});

// Optional:  Useful for debugging.  Disables automatic instrumentation.
// Sentry.disableOnError = false;
```

#   **Important:**
#   * Replace `YOUR_SENTRY_DSN` with your actual Sentry DSN (Data Source Name). You can obtain this from the Sentry dashboard.
#   * The `tracesSampleRate` controls how many traces are sampled for performance. 100 means all traces are sent.
#   * The `integrations` array allows Sentry to automatically detect and instrument common Node.js types. Adding `express` integration is recommended.


# 3.  Set up Sentry React Native SDK (for your Expo app)

#   - In your Expo project, install the necessary packages:
npm install --save @sentry/react-native

#   - Import and initialize Sentry in your root app file (e.g., `App.js`).

#   Example `App.js`:
```javascript
import React from 'react';
import { AppNavigator } from './navigation'; // Assuming you have a navigation component
import { Sentry } from '@sentry/react-native';

// Optionally configure the Sentry React Native SDK with a custom configuration
// This can be done through a separate configuration file or inline.
// Example:
Sentry.init({
  dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
  // You can also customize the SDK here. Example:
  // beforeNavigate: (routeName, routeParams) => {
  //   console.log('Navigating to:', routeName, routeParams);
  // },
});

export default () => {
  return (
    <Sentry.Native
      provider={Sentry.NativeProvider}
      // Add any additional configuration options here
    >
      <AppNavigator />
    </Sentry.Native>
  );
};
```

#   **Important:**
#   * Replace `YOUR_SENTRY_DSN` with your actual Sentry DSN.
#   * The `Sentry.NativeProvider` component is essential for Sentry to collect traces from your Expo app.
#   * The `beforeNavigate` function (optional) allows you to track screen navigation events within your app.  This can be very helpful for debugging UI issues and understanding user flow.


# 4.  Configure Your Express Backend to Use Sentry

#   - **Middleware:** You need to add Sentry middleware to your Express app to
