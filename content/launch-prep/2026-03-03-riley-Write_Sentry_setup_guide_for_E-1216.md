# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T12:16:14.500302

Okay, here's a comprehensive Sentry setup guide specifically tailored for an Expo React Native app combined with an Express.js backend.  I'll break it down into steps, including installation, configuration, and best practices.

**Understanding the Setup**

* **Expo React Native:** We'll use the `expo-sentry` SDK to integrate Sentry into your Expo app.  This will capture errors and crashes happening within your React Native UI.
* **Express.js Backend:**  The backend will handle API calls, database interactions, and other server-side logic.  Sentry will also capture errors originating from your Express routes.
* **Shared Configuration:**  Crucially, you *must* have a consistent Sentry project for both the React Native app and the Express backend.  This is essential for correlating logs and tracking issues effectively.

**Step 1: Create a Sentry Account & Project**

1. **Go to Sentry:**  Navigate to [https://sentry.io/](https://sentry.io/).
2. **Sign Up:** Create a free account.
3. **Create a New Project:** Click "Create Project."
   * **Project Name:**  Choose a descriptive name (e.g., "MyAwesomeApp").
   * **Application Type:** Select "Web" (even though this is a React Native app – it’s the standard for Sentry).
   * **SDK Type:** Select "Node.js."
   * **Environment:** Choose the appropriate environment (e.g., "Development," "Staging," "Production").
4. **Important:** **Note down your Sentry Project API Key.** You'll need this in subsequent steps.  Also, save your Sentry project URL (e.g., `https://[your-project-name].sentry.io/`)

**Step 2: Install Sentry SDK in your React Native App**

1. **Install `expo-sentry`:** In your Expo project directory, run:

   ```bash
   npx expo install expo-sentry
   ```

2. **Configure Sentry in `App.js` (or your root component):**
   ```javascript
   import * as React from 'react';
   import { ExpoRoot } from '@expo/sdk';
   import Sentry from 'expo-sentry'; // Import the SDK

   // Your app code here...

   export default function App() {
     // ...

     return (
       <ExpoRoot>
         {/* Your App UI */}
       </ExpoRoot>
     );
   }
   ```

3. **Initialize Sentry:** Add the following code to your `App.js` (or another appropriate location, ideally near the top):

   ```javascript
   import * as React from 'react';
   import { ExpoRoot } from '@expo/sdk';
   import Sentry from 'expo-sentry';

   // Your Sentry configuration
   const SENTRY_DSN = 'YOUR_SENTRY_DSN'; // Replace with your DSN
   const SENTRY_RELEASE = 'MyAwesomeApp'; // App release version
   const SENTRY_ENVIRONMENT = 'Development'; // or 'Staging', 'Production'

   Sentry.init({
     dsn: SENTRY_DSN,
     release: SENTRY_RELEASE,
     environment: SENTRY_ENVIRONMENT,
     tracesetFunctional: true,  // Optional: Enable traceset for functional components
     //  You can add more options here, like:
     //  integrations: [Sentry.Integrations.CLS], // Color Live Stats
   });

   export default function App() {
     // ...
   }
