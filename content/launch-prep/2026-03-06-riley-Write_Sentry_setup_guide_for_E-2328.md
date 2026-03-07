# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-06T23:28:57.857849

Okay, here's a detailed guide on setting up Sentry for your Expo React Native app integrated with an Express.js backend. This guide covers installation, configuration, and best practices.

**Understanding the Setup**

This setup involves instrumenting both your React Native app and your Express backend. Sentry will then aggregate errors from both sources, giving you a single pane of glass to monitor your application's health.

**Prerequisites**

*   **Sentry Account:** You'll need an active Sentry account. Sign up at [https://sentry.io/](https://sentry.io/).
*   **Expo Development Environment:** Ensure you have Expo CLI installed and configured.
*   **Node.js & npm/yarn:** Make sure you have Node.js and your preferred package manager (npm or yarn) installed.
*   **Express.js Backend:** You'll need an Express.js server running your backend logic.

**Step 1:  Install Sentry Packages**

First, install the necessary Sentry packages in your React Native app and your Express backend:

**React Native App:**

```bash
yarn add @sentry/react-native
# or
npm install @sentry/react-native
```

**Express Backend:**

```bash
yarn add @sentry/node
# or
npm install @sentry/node
```

**Step 2: Configure Sentry in your React Native App**

1.  **Create a Sentry Client:**
    ```javascript
    import { Sentry } from '@sentry/react-native';

    // Replace with your Sentry project ID
    const SENTRY_PROJECT_ID = 'YOUR_SENTRY_PROJECT_ID';

    Sentry.init({
      dsn: 'YOUR_SENTRY_DSN',
      // Optional: Performance Monitoring
      tracesSampleRate: 0.5, // Adjust for desired performance tracing coverage
      // Optional: Set the sample rate for errors
      // autoSetContext: true, // Automatically add context to traces
      // Enable automatic uploads
    });
    ```

    *   **`YOUR_SENTRY_PROJECT_ID`:**  This is the unique identifier for your Sentry project. Find it in your Sentry dashboard.
    *   **`YOUR_SENTRY_DSN`:** This is the *Digital Signatures Network* URL. You can generate this URL in your Sentry dashboard under your project settings > Integrations > React Native.  It will look something like this: `https://YOUR_PROJECT_ID.sentry.io/`

2.  **Integrate with Your App:**  Make sure you call `Sentry.init()` in your app's root component, ideally at the top level of your app.

3. **Configure Error Boundaries (Recommended):** Wrap your app's content in an error boundary to catch and report errors that occur within your app components.

   ```javascript
   import { ErrorBoundary } from 'expo-error-boundary';
   import { AppContainer } from './AppContainer'; // Your main app container

   export default () => (
     <ErrorBoundary fallback={styles.errorBoundary}>
       <AppContainer />
     </ErrorBoundary>
   );
   ```
   In the `styles.errorBoundary`, you'll likely want to add your sentry tracking code.

**Step 3: Configure Sentry in your Express Backend**

1.  **Create a Sentry Client:**
    ```javascript
    const Sentry = require('@sentry/node');

    // Replace with your Sentry project ID
    const SENTRY_PROJECT_ID = 'YOUR_SENTRY_PROJECT_ID';

    Sentry
