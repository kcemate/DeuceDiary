# Write Sentry setup guide for Expo React Native + Express.
Agent: riley
Generated: 2026-03-03T22:27:44.530298

```bash
# Prerequisites:
# - Node.js and npm (or yarn) installed
# - Expo CLI installed: npm install -g expo-cli
# - Expo Go app installed on your mobile device (for testing)

# 1. Install Sentry

npm install sentry@5.10.0 --save

# OR using yarn:
# yarn add sentry@5.10.0

# 2. Initialize Sentry in your Expo project

# Navigate to your project's root directory:
cd your-expo-project

# Initialize Sentry
sentry-expo init

# This command will prompt you with several questions:

# - Project name:  Enter a descriptive name for your Sentry project (e.g., "My Awesome App")
# - Project URL:  Enter the URL of your application (e.g., "https://www.example.com")
# - Version:  Enter your application's version number (e.g., "1.0.0") - This is crucial for filtering issues!
# - Attribution:  Select "Expo" - This helps Sentry correctly identify the source of the error.
# -  Enable Debug Logging:  Choose "Yes" - This is highly recommended for getting detailed error information.
# -  Ignore these errors (optional): You can optionally specify errors to ignore (e.g., "console.warn").  Generally, you want to capture *everything*.

# 3. Configure Sentry in your Express.js Server

# Assuming you're using Express.js to serve your Expo app.  You need to integrate Sentry into your server-side code.
# This example shows how to use the `sentry-expo` library.

// Install the necessary dependency if you haven't already:
npm install --save @sentry/node @sentry/expo
// OR
// yarn add @sentry/node @sentry/expo


// Example server.js (or your main Express server file):

const express = require('express');
const app = express();
const Sentry = require('@sentry/node');
const Expo = require('@sentry/expo');

// Initialize Sentry
Sentry.init({
  // Set the SDK project and release
  project: 'your-sentry-project-key', // Replace with your Sentry project key
  release: 'your-app-version', // Replace with your app's version number
  // Add any custom Sentry options here if needed
});

// Example error handling middleware:
app.use((err, req, res, next) => {
  console.error(err.stack); // Log to the console for debugging
  Sentry.captureException(err, {
    extra: {
      req: req.body, // Include request body for debugging
      url: req.url, // Include request URL for debugging
      method: req.method, // Include request method
    },
  });
  res.status(500).send('Something went wrong!');
});

// Your application routes and logic here...
app.get('/', (req, res) => {
  res.send('Hello, Expo!');
});

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
// 4. Integrate Sentry with your Expo app (Important for mobile tracking)

#  This is the MOST important step!  You *must* integrate Sentry with your Expo app for it to track client-side errors.

# 1. Install the Sentry Expo SDK:
#    npm install @s
