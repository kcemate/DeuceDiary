# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-07T15:47:47.448256

Okay, here's a comprehensive guide to setting up Sentry for your Expo React Native app and your accompanying Express.js backend, with best practices and explanations.

**Understanding the Setup**

* **Sentry:** A real-time error monitoring service. It captures crashes, exceptions, and performance issues in your app.
* **Expo:** A framework for building native React Native apps that simplifies the development process.
* **Express.js:** A popular Node.js framework for building web applications and APIs.
* **Dual Setup:** You'll need to configure Sentry separately for both your React Native app and your Express.js backend.  They typically communicate through shared key/domain.

**I. Setting Up Sentry for Your Expo React Native App**

1. **Create a Sentry Account and Project:**
   - Go to [https://sentry.io/](https://sentry.io/) and sign up for a free account.
   - Create a new project (give it a descriptive name, like "ExpoApp").

2. **Install the Sentry SDK:**
   -  In your Expo project, navigate to the root directory.
   -  Run the following command to install the Sentry SDK:
     ```bash
     npx expo install @sentry/react-native
     ```

3. **Configure the Sentry SDK:**
   -  Open your `App.js` (or your main entry point).
   -  Add the following code to initialize Sentry:
     ```javascript
     import * as Sentry from '@sentry/react-native';

     Sentry.init({
       dsn: 'YOUR_SENTRY_DSN', // Replace with your DSN
       enableSourceMaps: true, // Helpful for debugging
       //  Optional:  Consider these if you're tracking specific events
       //  capturePerformance: true,
       //  trackOperatingSystem: true,
     });

     export default App;
     ```
   - **DSN (Device Session Name):**  This is your Sentry project's DSN.  You'll find this in your Sentry project dashboard. It's a unique string that links your app to your Sentry project.

4. **Handling Errors:**
   -  You'll want to capture errors in your React Native app.  Here's a basic example in your component:
     ```javascript
     import React from 'react';
     import { Button } from 'react-native';

     const MyComponent = () => {
       // ... your component logic ...

       return (
         <Button
           title="Do something"
           onPress={() => {
             try {
               // Code that might throw an error
               throw new Error('Something went wrong!');
             } catch (error) {
               console.warn('Error in MyComponent:', error);
               Sentry.captureException(error, {
                 extra: {
                   componentName: 'MyComponent',
                   // Add any relevant context here
                 },
               });
             }
           }}
         />
       );
     };

     export default MyComponent;
     ```
   - **`Sentry.captureException(error, options)`:**  This is the key function. It sends the error and any extra context to Sentry.
     - `error`: The error object you caught.
     - `options`:  An object with optional properties:
       - `extra`:  A dictionary to add context to the error (e.g., component name, device info, user ID).  This is *highly* recommended.

5. **Start Your App:**  Run `expo start` or `yarn start`
