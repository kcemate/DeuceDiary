# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-04T00:20:35.829398

Okay, here's a comprehensive Sentry setup guide specifically for an Expo React Native app integrated with an Express backend. This guide covers installation, configuration, and best practices.

**Understanding the Setup**

* **Expo React Native:**  We're building a React Native app using Expo's managed workflow.
* **Express.js:** We have a Node.js backend using Express for handling API requests.
* **Sentry:** We'll use Sentry to monitor errors and performance across both our React Native app and our Express backend.
* **Two Environments:** It’s very important to differentiate between your Expo development environment and your production environment.

**Step 1: Create a Sentry Account and Project**

1. **Sign Up:** Go to [https://sentry.io/](https://sentry.io/) and create a free account.
2. **Create a Project:**  Once logged in, create a new Sentry project. Give it a descriptive name (e.g., "MyExpoApp-Sentry").
3. **Get Your Sentry Project ID:**  This ID is crucial.  You'll find it on the project dashboard after creation. It will look something like `YOUR_PROJECT_ID`.

**Step 2: Install Sentry Packages**

You'll need to install Sentry packages in both your React Native app and your Express backend.

**React Native App:**

```bash
npm install @sentry/react-native
# or
yarn add @sentry/react-native
```

**Express Backend:**

```bash
npm install @sentry/node
# or
yarn add @sentry/node
```

**Step 3: Configure React Native App**

1. **Initialize Sentry:**  Run this command in your React Native project's root directory:

   ```bash
   npx @sentry/react-native init
   ```

   This will create a `.sentry/` directory in your project root.
2. **Set the Project ID:**  Modify the `Expo.Notifications.setSentryConfig`  in your `App.js` or `App.tsx` file:

   ```javascript
   import { Expo } from 'expo';
   // ... other imports

   export default function App() {
     // ... your app setup
     Expo.Notifications.setSentryConfig({
       dsn: 'YOUR_PROJECT_ID@YOUR_APP_NAME.sentry.io', // Replace with your Sentry DSN
       // sampleRate: 1,  // Optional:  If you want to sample a percentage of events
     });
     return (
       // ... your app content
     );
   }
   ```

   * **`dsn`:** This is the "Data Source Name" (DSN).  It's the most important part. It should look like this: `YOUR_PROJECT_ID@YOUR_APP_NAME.sentry.io`.  Replace `YOUR_PROJECT_ID` and `YOUR_APP_NAME` with the values you obtained from your Sentry project.  `YOUR_APP_NAME` can usually be the same as your project name.

**Step 4: Configure Express Backend**

1. **Initialize Sentry:** Run this command in your Express app's root directory:

   ```bash
   npx @sentry/node init
   ```

   This will create a `.sentry/` directory in your Express app root.
2. **Set the Project ID:**  Modify `app.js` (or your main Express file) to set the Sentry DSN:

   ```javascript
   const Sentry = require('@sentry/node');
