# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-04T02:36:43.190222

Okay, here's a detailed Sentry setup guide specifically tailored for a React Native project using Expo and an Express backend. This guide covers everything from installation to configuration and provides best practices.

**Understanding the Setup**

* **React Native (Expo):** Expo simplifies React Native development but doesn't directly integrate with Sentry. We'll use a wrapper library to bridge the gap.
* **Express:**  Your Node.js Express backend will be the primary target of Sentry's monitoring.
* **Sentry:** A powerful error tracking and performance monitoring platform.

**Step 1: Project Setup**

1. **Create an Expo Project (if you don't have one):**
   ```bash
   npx create-expo-app my-app
   cd my-app
   ```

2. **Create an Express Backend Project (if you don't have one):**
   ```bash
   mkdir my-express-app
   cd my-express-app
   npm init -y
   npm install express cors
   ```

**Step 2: Install Sentry and Expo Sentry Wrapper**

In your React Native project:

```bash
npm install @sentry/react-native
```

In your Express backend project:

```bash
npm install @sentry/node
```

**Step 3: Configure Sentry in Your Express Backend**

1. **Create a `.sentry.properties` file:**  This file contains your Sentry project details.  Place it in the root directory of your Express backend.

   ```properties
   SENTRY_PROJECT=your-sentry-project-id
   SENTRY_AUTH_TOKEN=your-sentry-auth-token
   SENTRY_RELEASE=your-app-version  # e.g., "1.0.0"
   SENTRY_ENV=production  # Or staging/development for testing
   ```

   * **`SENTRY_PROJECT`:** Your Sentry project ID (found on the Sentry dashboard).
   * **`SENTRY_AUTH_TOKEN`:** Your Sentry authentication token (generated on the Sentry dashboard).
   * **`SENTRY_RELEASE`:**  A unique identifier for your application release.  This helps you track errors by version.
   * **`SENTRY_ENV`:** Indicates the environment where the application is running (e.g., 'production', 'staging', 'development').  Sentry can use this to filter events.

2. **Initialize Sentry in your Express app:**

   ```javascript
   // server.js (or your main Express file)
   const express = require('express');
   const cors = require('cors');
   const Sentry = require('@sentry/node');

   // ... your Express routes ...

   Sentry.init({
     dsn: `https://your-sentry-project-id.sentry.io/`,
     environment: process.env.NODE_ENV, // Use process.env for environment configuration
     release: process.env.SENTRY_RELEASE || 'unknown', // Use Sentry property if available
   });

   // Example error handler
   Sentry.captureAllExceptions((err, stackTrace) => {
     console.error('Unhandled exception captured by Sentry:', err, stackTrace);
   });
   ```

   * **`dsn`:** The Data Source Name (DSN) for your Sentry project.
   * **`environment`:**  Set to the correct environment (e.g., 'production', 'staging').  This is useful for filtering errors.
   * **`release`:**  Set to the value of your `SENTRY_RELEASE
