# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-04T08:16:39.817158

```bash
# Prerequisites:
# - Node.js and npm/yarn installed
# - Expo CLI installed and logged in:  `expo login`
# - An Expo project initialized: `expo init my-app` (or use an existing one)

# 1. Install Sentry:
npm install @sentry/react-native @sentry/node

# 2. Initialize Sentry in Your Expo Project:
#   - Create a .sentry.js file in the root of your project. This file will contain your Sentry configuration.
#   - Add the following configuration:
```javascript
// .sentry.js
module.exports = {
  project: 'YOUR_SENTRY_PROJECT_ID',
  traces: true, // Enable traces (for performance monitoring)
  //  You can also configure these options:
  //  autoSetEndpoint: true, // Automatically set the endpoint (recommended)
  //  environment: process.env.NODE_ENV, // Set the environment (e.g., 'development', 'production')
  //  sampleRate: 100, // Sample percentage for traces (e.g., 100 for all traces)
};
```

# 3.  Configure your Express Server:
#   - You'll need to initialize Sentry in your Express server as well, especially if your React Native app is communicating with your backend.

#   - Install `sentry` for Node:
#     `npm install sentry`

#   -  Add the Sentry initialization code to your Express app (e.g., in `server.js` or `app.js`):
```javascript
// server.js
const express = require('express');
const Sentry = require('sentry');

// Initialize Sentry
Sentry.init({
  project: 'YOUR_SENTRY_PROJECT_ID',
  traces: true,  // Enable traces for your backend requests
  //  You can also configure these options:
  //  environment: process.env.NODE_ENV,
  //  sampleRate: 100,
});

const app = express();

// Your Express routes here...

module.exports = app;
```

# 4.  Configure the Expo React Native App:

#   - Import your .sentry.js configuration into your main React Native component (e.g., `App.js`):
```javascript
// App.js
import * as React from 'react';
import { AppNavigator } from './navigation'; // Or your navigation setup
import Sentry from '@sentry/react-native';

// Import your Sentry configuration
import SentryConfig from './.sentry.js';

// Initialize Sentry in the React Native App
Sentry.init(SentryConfig);

export default function App() {
  return (
    <AppNavigator />
  );
}
```

# 5.  Run Your Expo App:
#    - Make sure you're running your Expo app in development mode: `expo start` or `npm start`.

# 6.  Check Sentry Dashboard:
#   - After running your app, visit the Sentry dashboard (https://sentry.io/organizations/<your-organization-name>/projects/<your-project-id>).
#   - You should start seeing events and traces from your app.  If you enabled `traces: true`, you'll see performance metrics.

# 7.  Important Considerations & Best Practices:

#    - **Project ID:**  Replace `YOUR_SENTRY_PROJECT_ID` with your actual Sentry project ID. You can find this ID
