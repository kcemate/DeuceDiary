# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T06:26:17.128488

Okay, here's a CI/CD pipeline specification for GitHub Actions, designed to be reasonably comprehensive and adaptable.  I'll break it down into sections with explanations and then provide a complete YAML file.

**1. Core Concepts & Goals**

* **Continuous Integration (CI):**  Automated builds and tests triggered by code changes on GitHub.
* **Continuous Delivery (CD):** Automated deployment of tested code to various environments (e.g., staging, production).
* **YAML-Based Configuration:** We'll use GitHub Actions YAML files to define the pipeline.
* **Environment Variables:**  We'll leverage GitHub Secrets for sensitive data (API keys, passwords, etc.).
* **Workflow Stages:** The pipeline will be divided into stages for logical grouping (e.g., Build, Test, Deploy).
* **Branching Strategy:** This configuration assumes a `main` or `master` branch for deployment.  You should adjust the workflows for different branches (e.g., development, feature branches).

**2. Pipeline Stages & Actions**

1. **Build:**
   - **Purpose:**  Compile code, run linters, and potentially build artifacts.
   - **Actions:**
      - `actions/checkout@v3`: Checks out the code from the repository.
      - `node/setup-node@v3` or equivalent (for Node.js projects): Sets up a Node.js environment.
      - `node/install-packages@v3` or equivalent: Installs project dependencies (e.g., `npm install`).
      - `node/run-scripts@v1` or equivalent: Executes build scripts.
      - `actions/lint` (or a similar linter action): Checks code style and quality.
2. **Test:**
   - **Purpose:**  Run automated tests to ensure code quality.
   - **Actions:**
      - `node/run-tests@v1` or equivalent: Executes unit tests, integration tests, etc.
      - `jest` (or similar testing framework):  Specific testing execution.
3. **Artifact Upload (Build Stage):**
   - **Purpose:**  Uploads any build artifacts (e.g., compiled JavaScript, Docker images) to GitHub's Container Registry.
   - **Action:** `actions/upload-artifact@v3`
4. **Deploy (Staging):**
   - **Purpose:** Deploys the application to a staging environment.
   - **Actions:**
      - `actions/deploy-artifact@v2`: This action will be configured to deploy to your staging environment.
5. **Deploy (Production):**
   - **Purpose:** Deploys the application to the production environment.
   - **Actions:**
      - `actions/deploy-artifact@v2`: This action will be configured to deploy to your production environment.

**3. GitHub Secrets**

* You'll need to configure GitHub Secrets within your repository settings. Here are some commonly used secrets:
   - `NODE_VERSION`:  The Node.js version to use.
   - `API_KEY`: Any API keys required for external services.
   - `STAGING_DATABASE_URL`:  URL for your staging database.
   - `PRODUCTION_DATABASE_URL`: URL for your production database.
   - `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`: For AWS deployments.
   - `DEPLOY_TOKEN`: Used to authenticate with your deployment platform.

**4. YAML File (Example)**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main  # Trigger on pushes to the main branch
  pull_request:
