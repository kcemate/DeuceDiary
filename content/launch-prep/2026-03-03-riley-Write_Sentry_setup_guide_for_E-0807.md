# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T08:07:36.320741

```bash
# Prerequisites:
# - Node.js and npm/yarn installed
# - Expo CLI installed: npm install -g expo-cli or yarn global add expo-cli
# - Expo Go app installed on your mobile device (or emulator/simulator)

# 1. Install Sentry:
# npm install --save @sentry/react-native @sentry/node
# or
# yarn add @sentry/react-native @sentry/node


# 2.  Create a Sentry Project:
#   - Go to [https://sentry.io/](https://sentry.io/) and create a free account.
#   - Log in to your Sentry dashboard.
#   - Create a new project for your Expo React Native app.  Give it a descriptive name.

# 3.  Configure Sentry in your Expo React Native app:

#   a.  Install Sentry SDK for React Native:
#      - You can use the Expo Sentry SDK which is recommended.  It's simpler to set up.

#   b.  Import Sentry and initialize it:

#      In your main app file (e.g., App.js or index.js):

#      ```javascript
#      import * as React from 'react';
#      import { Expo } from 'expo';
#      import { Sentry } from '@sentry/react-native';

#      export default () => {
#        Sentry.init({
#          dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
#          // Optional settings:
#          // autoSetTTL: 120, // Set default transaction TTL to 120s
#          // enableSourceMaps: true, // Enable source maps for better debugging
#          // trackPerformance: true, // Enable performance monitoring (requires Sentry Premium/Enterprise)
#          // releaseStage: 'production', // Specify the release stage
#        });

#        return (
#          <Expo.App />
#        );
#      }
#      ```

#   c.  Get Your Sentry DSN:
#      - In your Sentry dashboard, go to your project.
#      - Under "Logs," you'll find the "DSN" (Data Source Name).  This is a long string that looks something like:
#        `https://xxxxxxxx.send.sentry.io/`
#      -  Replace `YOUR_SENTRY_DSN` in the code above with your actual DSN.

# 4. Configure Sentry in your Express.js API:

#   a. Install Sentry Node SDK:
#      - npm install --save @sentry/node
#      - or
#      - yarn add @sentry/node

#   b. Import Sentry and initialize it:

#      In your Express app file (e.g., server.js or app.js):

#      ```javascript
#      const express = require('express');
#      const app = express();
#      const Sentry = require('@sentry/node');

#      // ... your Express app setup ...

#      Sentry.init({
#        dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
#        // Optional settings:
#        // beforeExceptionHandlers: [ ... ],
#        // beforeLogHandlers: [ ... ],
#        // afterTransactionHandlers: [ ... ],
#      });

#      // Example route that triggers a Sentry report
#      app.get('/api/hello', (req, res)
