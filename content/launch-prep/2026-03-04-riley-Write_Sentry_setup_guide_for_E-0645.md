# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-04T06:45:58.819906

```bash
# Prerequisites:
# - Node.js and npm (or yarn) installed
# - Expo CLI installed: npm install -g expo-cli or yarn global add expo-cli
# - Express.js project setup (if you haven't already)

# 1. Install Sentry
```bash
npm install sentry@5.10.0 --save  # Use the latest version as of this writing
# or
yarn add sentry@5.10.0
```

**Important:**  Use the version number specified (5.10.0) as Sentry versions change.  Always check the official Sentry documentation for the latest recommended version.

**2.  Initialize Sentry in Your React Native Expo App**

Within your Expo project, initialize Sentry.  Navigate to the root of your project in your terminal.

```bash
npx @sentry/cli init  # Recommended for best practices and project setup
# or
# yarn sentry init
```

The `init` command will guide you through the setup process:

* **Project Name:**  Enter a descriptive name for your project.
* **Project URL:**  Enter the URL of your application (e.g., `https://your-app.com`). This is used to link errors to your app.
* **Release Channel:** Choose a release channel (e.g., "Production"). This helps organize errors.  This is useful if you have multiple environments.
* **Next Version:** Select the version of Sentry you want to use (e.g., "Latest").
* **Enable Error Reporting:**  Confirm that you want to enable error reporting.
* **SDK Key:** Sentry will generate a unique SDK key.  **Copy this key**. You'll need it in the next step.

**3. Configure Your Expo App to Use Sentry**

Within your React Native Expo app, you'll need to integrate the Sentry SDK.  Here's how:

* **Install Sentry SDK:**

   ```bash
   npm install @sentry/react-native --save
   # or
   yarn add @sentry/react-native
   ```

* **Import and Initialize Sentry in Your App:**

   In your main app file (typically `App.js` or `index.js`), import the Sentry SDK and initialize it.

   ```javascript
   import * as React from 'react';
   import { ExpoRoot } from './expo-root';  // Or your actual Expo Root component
   import * as Sentry from '@sentry/react-native';

   Sentry.init({
     dsn: 'YOUR_SENTRY_DSN', // Replace with your SDK key from the init command
     enableSourceMaps: true,  // Helpful for debugging
     // Optional: Add custom configurations here
     // performanceMonitoring: true,
   });

   export default () => {
     return (
       <ExpoRoot>
         {/* Your app content here */}
       </ExpoRoot>
     );
   };
   ```

   **Replace `YOUR_SENTRY_DSN` with the actual SDK key you copied in Step 2.**

   * **`dsn`:** The Data Source Name (DSN) is the identifier for your Sentry project.
   * **`enableSourceMaps: true`:**  Enables source maps, which are crucial for easily debugging errors reported by Sentry.  They map the compiled JavaScript back to your original source code.
   * **`performanceMonitoring: true`** (Optional):  If you want to monitor performance metrics, set this to `true`.  This will provide more detailed data on performance issues.

*
