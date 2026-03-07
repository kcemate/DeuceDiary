# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-04T03:21:55.197750

## Sentry Setup Guide for Expo React Native + Express

This guide outlines the process of integrating Sentry into your Expo React Native application and your associated Express server. It focuses on a practical approach, ensuring proper logging and error tracking for a smooth development and deployment experience.

**Prerequisites:**

*   **Expo CLI:** Ensure you have Expo CLI installed: `npm install -g expo-cli`
*   **Node.js & npm/yarn:**  Ensure you have Node.js and your preferred package manager installed.
*   **Sentry Account:**  Create a Sentry account at [https://sentry.io/](https://sentry.io/) and obtain your Sentry project SDK.

**Steps:**

**1. Install Sentry Packages:**

Navigate to your project directory and install the necessary Sentry packages:

```bash
npm install sentry-expo --save
npm install @sentry/node --save # For your Express server
```

**2. Configure Sentry in Your Expo React Native App:**

*   **Create a Sentry Client:**  Inside your Expo app (e.g., `App.js` or a dedicated `SentryConfig.js` file), create a Sentry client instance:

```javascript
import * as Sentry from 'sentry-expo';

const SENTRY_DSN = 'YOUR_SENTRY_DSN'; // Replace with your Sentry DSN

Sentry.init({
  dsn: SENTRY_DSN,
  // Optional:  Sets custom instrumentations
  // performanceTracking: true,
});

// Example usage - Log a custom event
Sentry.addCallback('error', (error) => {
  console.error('Sentry error:', error);
  // You can add additional logic here, like sending detailed reports
});

//  Optional:  Log something informative. Useful for tracking
//  user actions or app states that you want to monitor.
Sentry.addCallback('capture', (message) => {
    console.log('Sentry message:', message);
});
```

*   **Replace `YOUR_SENTRY_DSN`:**  Replace the placeholder with your actual Sentry DSN (Data Source Name). You can find this on your Sentry dashboard. The DSN typically looks like: `sentry.io/<your_project_id>/<your_environment>`
*   **Environment Configuration:**  Consider setting different DSNs for different environments (development, staging, production) to enable tailored error reporting.  You can use environment variables for this.

**3. Configure Sentry in Your Express Server:**

*   **Install `@sentry/node`:**  As mentioned earlier, install the Sentry Node.js package.
*   **Import and Initialize Sentry:**  In your Express server's main file (e.g., `server.js` or `app.js`):

```javascript
const Sentry = require('@sentry/node');

// Set the global Sentry scope
Sentry.init({
  dsn: 'YOUR_SENTRY_DSN', // Replace with your DSN
  // Optional: Add your server's environment
  environment: process.env.NODE_ENV || 'development',
});

// Example - Log errors within your Express route handlers
app.get('/api/users', (req, res, next) => {
  try {
    // Your API logic here...
    const users = [];
    res.json(users);
  } catch (err) {
    next(err); // Pass the error to Sentry
  }
});
```

*   **Replace `YOUR_SENTRY_DSN`:**
