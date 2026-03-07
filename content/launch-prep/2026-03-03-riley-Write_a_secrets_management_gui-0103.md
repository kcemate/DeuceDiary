# Write a secrets management guide for Deuce Diary: environmen
Agent: riley
Generated: 2026-03-03T01:03:51.647408

## Deuce Diary: Secrets Management Guide - Dev, Staging, Prod & Railway

This guide outlines a robust secrets management strategy for Deuce Diary, covering environment variables across different environments, leveraging Railway for deployment, integrating Expo secrets, and establishing a rotation policy to ensure security and maintainability.

**I. Core Principles:**

* **Principle of Least Privilege:**  Grant each environment and service only the necessary credentials.
* **Avoid Hardcoding:** Never hardcode secrets directly into code or configuration files.
* **Centralized Management:**  Use a dedicated system for managing secrets, rather than distributing them individually.
* **Regular Rotation:** Implement a schedule for rotating secrets to minimize the impact of compromised credentials.
* **Auditing:** Track who accessed and modified secrets for accountability.

**II. Environment Variable Management:**

| Environment | Variables Managed | Location | Purpose | Considerations |
|---|---|---|---|---|
| **Dev** | API Keys, Database URLs, API Endpoints, Development Client IDs |  Local Development Environment (e.g., `.env` file, `process.env`) |  For initial development and testing. |  Least sensitive, easy to change.  Consider using a simplified `.env` file with common keys. |
| **Staging** | API Keys, Database URLs, API Endpoints, Staging Client IDs, Email Sending Service Credentials |  Railway Environment Variables |  Mimics production closely for acceptance testing. |  Should have a subset of production keys.  Regularly updated before staging deployments. |
| **Prod** | All API Keys, Database URLs, API Endpoints, Production Client IDs, Email Sending Service Credentials, Monitoring Service Keys | Railway Environment Variables |  Production environment - highest security standards. |  Most critical, requires rigorous access controls and audit trails. |

**III. Leveraging Railway for Secrets Management**

Railway offers a convenient and secure way to manage environment variables across your services.

1. **Railway Secrets:** Railway provides a dedicated “Secrets” section within each project. This is the preferred method for storing sensitive information.
2. **Accessing Secrets in Code:**
   * **Expo Secrets:**  Use the `expo-secrets` library to securely access secrets within your Expo apps.
   * **Node.js/React Native:** Use the `dotenv` library or the built-in `process.env` to access variables directly from Railway.

**Example (Node.js with `dotenv`):**

```javascript
require('dotenv').config();

const apiKey = process.env.API_KEY;
const databaseUrl = process.env.DATABASE_URL;

console.log(apiKey);
console.log(databaseUrl);
```

**Railway Setup:**

*  Within your Railway project, navigate to “Secrets”.
*  Add each variable, specifying its name and value.
*  Set appropriate permissions (e.g., read-only) for the services accessing these secrets.

**IV. Integrating Expo Secrets**

Expo secrets are designed specifically for managing secrets within Expo applications.

1. **Installation:**  Install the `expo-secrets` library: `npm install expo-secrets`
2. **Initialization:**  Initialize Expo secrets using `expo secrets init`. This will create a `.secrets` file.
3. **Storing Secrets:**  Place your sensitive data (API keys, authentication tokens) into the `.secrets` file.
4. **Accessing Secrets:** Use `expo-secrets.get("secretName")` to retrieve secrets within your Expo app.

**Example:**

```javascript
import * as secrets from 'expo-secrets';

async function fetchUserData() {
  try {
    await secrets.processManifest(); // Ensure the secrets manifest is processed
    const apiKey = secrets.get("API_KEY");
    //
