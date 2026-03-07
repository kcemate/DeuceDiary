# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-04T06:34:20.256025

Okay, let's craft a CI/CD pipeline specification using GitHub Actions. This will be a detailed example, adaptable to various project types.

**Pipeline Goal:**  Automate building, testing, and deploying a simple web application to a development environment.

**Assumptions:**

*   You have a GitHub repository.
*   You have a basic web application (e.g., Node.js, Python, or similar) in the repository.
*   You have a development environment (e.g., a server running Docker, a staging instance, or a similar target).
*   You have a deployment script or method available to deploy your application to the development environment.  (Let's assume a simple shell script for this example).

**Workflow Name:** `deploy-dev`

**Trigger:**  Every push to the `main` branch (or any branch you choose for development).

**Jobs:**

1.  **Build & Test (Node.js Example - Adapt as needed)**
    *   **Name:** `build-test`
    *   **Runs on:** `ubuntu-latest` (or your preferred runner)
    *   **Steps:**
        *   **Checkout:**  `actions/checkout@v3` - Checks out the code from the repository.
        *   **Setup Node.js:** `actions/setup-node@v3` - Installs Node.js with a specified version (e.g., `18`).
        *   **Install Dependencies:** `npm install` - Installs the project's dependencies.
        *   **Linting & Formatting:** (Optional)  `npm run lint` (if you have a linting tool configured)
        *   **Testing:** `npm test` - Runs your project's test suite.
        *   **Upload Test Reports:**  (Optional)  `actions/upload-artifact@v3` -  Uploads test reports or coverage data.  This allows for later analysis.
    *   **Artifacts:** (If uploading tests)  The test reports or coverage data.

2.  **Deploy to Development (Manual Approval Step)**
    *   **Name:** `deploy-dev`
    *   **Runs on:** `ubuntu-latest`
    *   **Requires:** `build-test` must complete successfully.
    *   **Steps:**
        *   **Checkout:**  `actions/checkout@v3` (This is redundant, but safe to include if you're triggering other actions in this job)
        *   **Deploy Script:** `chmod +x deploy.sh`  (Make the deployment script executable.)
        *   **Deploy:** `./deploy.sh` - Executes your deployment script. This script would typically:
            *   Connect to your development environment.
            *   Copy the built application files.
            *   Restart the application server.
        *   **Check Deployment Status:** (Optional)  Add commands to verify the application is running correctly after deployment (e.g., pinging a health endpoint).
        *   **Approval:**  `wait` -  This step pauses the workflow until a manual approval is provided. This is a critical safety measure. You can trigger this approval via the GitHub Actions UI.
        *   **Success:** `echo "Deployment successful!"` -  A confirmation message.
        *   **Failure:** `exit 1` -  Fail the workflow if the deployment script encounters an error.

**YAML Configuration (`.github/workflows/deploy-dev.yml`):**

```yaml
name: Deploy to Development

on:
  push:
    branches:
      - main # Or your desired development branch

jobs:
  build_test:
    runs-
