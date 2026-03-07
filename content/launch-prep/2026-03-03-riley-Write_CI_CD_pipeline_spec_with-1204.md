# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T12:04:38.298925

Okay, here's a CI/CD pipeline specification using GitHub Actions, designed to be a fairly robust example.  I'll break it down into sections with explanations, and then provide a complete YAML file you can directly adapt.

**Overall Goals & Considerations**

*   **Continuous Integration (CI):** Automatically build and test the code on every push to the main branch and pull requests.
*   **Continuous Delivery (CD):**  Automatically deploy to a staging environment (e.g., AWS, Azure, Google Cloud) when a pull request is merged.
*   **Infrastructure as Code (IaC):**  We'll use Terraform or similar to manage infrastructure, which is automatically applied during deployment.
*   **Secrets Management:**  GitHub Secrets will be used to securely store sensitive information like API keys and passwords.
*   **Rollbacks:** The pipeline includes a rollback mechanism for staged deployments.
*   **Branching Strategy:** This pipeline assumes a Gitflow-style branching strategy (e.g., `main`, `develop`, feature branches, release branches).

**Pipeline Stages**

1.  **Trigger:** GitHub Actions will automatically trigger the pipeline on:
    *   Push to `main` branch
    *   Creation of a pull request to `main` or any branch.

2.  **Setup:**
    *   Install necessary tools (Node.js, Python, etc., based on your project).
    *   Set up the environment variables.
    *   Configure Git.

3.  **Build:**
    *   Compile the code (e.g., `npm install`, `npm build`).
    *   Run unit tests.

4.  **Test:**
    *   Run integration tests.
    *   Potentially run security scans.

5.  **Package (Staging):**
    *   Create a deployable package (e.g., Docker image, zip file).
    *   Tag the package version.

6.  **Deploy to Staging:**
    *   Apply Terraform scripts to provision resources in a staging environment.
    *   Deploy the packaged application to the staging environment.

7.  **Approval (Manual):**
    *   A manual approval step is added *before* deploying to production. This is critical for ensuring changes are thoroughly vetted.

8. **Deploy to Production**
   * If the approval step is passed, deploy to the production environment using Terraform and the packaged application.

9. **Rollback**
    * Triggered in case the deployment fails.  Rolls back the staging deployment.

**YAML GitHub Actions Workflow File (Example)**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main
  create:
    branches:
      - main
    issuers:
      - your-github-username  # Replace with your username

jobs:
  build_and_test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16' # or your preferred version

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

  deploy_staging:
    runs-on: ubuntu-latest
    needs: build_and_test
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Terraform
        uses: hashicorp/setup-terraform@v2
        with:
          terraform_version: '
