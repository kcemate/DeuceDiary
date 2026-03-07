# Write a Sentry error tracking setup guide for Expo React Nat
Agent: riley
Generated: 2026-03-02T20:49:03.706057

## Sentry Error Tracking Setup Guide for Expo React Native + Express.js

This guide outlines how to integrate Sentry for error tracking in your Expo React Native application and your accompanying Express.js backend.  We’ll cover installation, configuration, source maps, release tracking, and alert rules.

**Key Considerations:**

* **Expo’s Limitations:** Expo doesn't directly support Sentry's SDK in the same way as native apps. We'll use a workaround leveraging `react-native-error-reporting` for immediate crash reporting and then relay events to Sentry through a wrapper app on your Express backend.
* **Express Backend:** The Express backend will receive all error events from React Native and send them to Sentry.
* **Simplicity:** This guide focuses on a simplified setup for clarity. Production deployments might require more granular control.

**1. Project Setup & Dependencies**

* **React Native Project (Expo):** Ensure you have a standard Expo project set up.
* **Express.js Backend:** Create an Express.js backend project.
* **Install Dependencies:**
    * **React Native:**
        * `npm install react-native-error-reporting`
    * **Express.js:**
        * `npm install express sentry`
        * `npm install cors` (For allowing cross-origin requests from your React Native app)


**2. React Native Configuration (Expo)**

* **Install `react-native-error-reporting`:**
   ```bash
   npx expo install react-native-error-reporting
   ```
* **Configure `react-native-error-reporting`:**
   ```javascript
   // App.js or your root App component
   import { ErrorReporting } from 'react-native-error-reporting';

   export default function App() {
     return (
       <ErrorReporting
         sentryDsn="YOUR_SENTRY_DSN" // Replace with your Sentry DSN
         enableSourceMaps={true} // Enable source maps for debugging
         />
     );
   }
   ```
   **Important:**  Replace `YOUR_SENTRY_DSN` with your actual Sentry DSN. You can find this on the Sentry dashboard.

**3. Express.js Backend Configuration**

* **Create a Sentry Client:**
   ```javascript
   // server.js or your main server file
   const express = require('express');
   const Sentry = require('sentry');
   const cors = require('cors');

   const app = express();
   const port = 3001; // Or your preferred port

   app.use(cors());
   app.use(express.json());

   Sentry.init({
     dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
     // Other Sentry options (e.g., traces, integrations)
   });

   app.use((err, req, res, next) => {
       console.error(err); // Log to console for quick debugging

       // Send error to Sentry
       Sentry.captureException(err, {
         context: {
           req: req // Optionally pass request context
         }
       });

       res.status(500).json({ error: 'Something went wrong' });
   });

   app.listen(port, () => {
     console.log(`Server listening at http://localhost:${port}`);
   });
   ```
   **Replace `YOUR_SENTRY_DSN` with your actual Sentry DSN.**

* **Error Handling Middleware:** The provided middleware is essential.  It catches *all* errors and sends them to
