# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T23:58:05.167490

Okay, here's a comprehensive Sentry setup guide for an Expo React Native application combined with an Express backend, covering all the necessary steps and considerations. This guide focuses on a common workflow, and you'll need to adapt it slightly based on your specific project structure and configuration.

**1. Prerequisites**

*   **Node.js and npm/Yarn:**  Make sure you have Node.js and your preferred package manager installed.
*   **Expo CLI:**  You'll need the Expo CLI to manage your React Native project.
*   **Sentry Account:** Create a free Sentry account at [https://sentry.io/](https://sentry.io/)
*   **Expo Go App:** Have the Expo Go app installed on your mobile device for testing.

**2. Create or Initialize Your Expo React Native Project**

If you don't have an existing project, create a new one:

```bash
npx create-expo-app your-app-name
cd your-app-name
```

**3. Install Sentry Packages**

Install the necessary Sentry packages for both the React Native and Express side of your application.

**React Native (Expo):**

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

**4. Configure Sentry in React Native**

*   **Get Your Sentry Project ID:** In your Sentry dashboard, you'll find your project's unique ID. Note this down.

*   **Configure `sentry/react-native`:**  Create a file named `.sentry/react-native` (or `.sentry/` if you prefer) in the root of your React Native project.  This file is crucial for Sentry to connect to your application.

    ```javascript
    // .sentry/react-native
    module.exports = {
      dsn: 'YOUR_SENTRY_DSN', // Replace with your DSN
      // Optional: Configuration for your React Native app
      // Example:
      // autoTrackUserInteractions: true,
      // trackPerformance: true,
    };
    ```

    *   **DSN (Data Source Name):**  This is the most important setting. It's a string that connects your app to Sentry.  You'll create this DSN in the next step.

*   **Generate the DSN:** Go to your Sentry dashboard.  Click "Add project" and follow the prompts. Sentry will generate a DSN for you. It will look something like this:
    `https://YOUR_PROJECT_ID.sentry.io/`  Replace `YOUR_PROJECT_ID` with your actual ID.

    Copy the generated DSN and paste it into the `dsn` field in your `.sentry/react-native` file.

**5. Configure Sentry in Your Express Backend**

*   **Create a `.sentry/` Directory:**  Create a `.sentry/` directory at the root of your Express project.

*   **Configure `@sentry/node`:**  Create a file named `.sentry/default.js` (or similar) inside the `.sentry/` directory. This file configures Sentry for your Node.js Express app.

    ```javascript
    // .sentry/default.js
    module.exports = {
      environment: process.env.NODE_ENV || 'development',
      tracesSampleRate: 100, // Adjust for desired trace sampling
      // Optional
