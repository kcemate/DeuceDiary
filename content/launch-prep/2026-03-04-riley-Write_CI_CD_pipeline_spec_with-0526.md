# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-04T05:26:24.493315

Okay, let's craft a CI/CD pipeline specification using GitHub Actions, covering various stages and best practices.  I'll provide a YAML file (`.github/workflows/main.yml`) and explain each section.

**Core Concept:**  This pipeline will:

1.  **Trigger:** Automatically run on pushes to the main branch, pull requests.
2.  **Build:**  Install dependencies, compile code (if applicable).
3.  **Test:**  Run unit tests, integration tests.
4.  **Lint:** Perform code style checks.
5.  **Static Analysis:**  Potentially run tools like SonarQube.
6.  **Deploy:**  Deploy to a staging environment (with appropriate configurations).
7.  **Notification:**  Send notifications on success or failure.

**`main.yml` (GitHub Actions Workflow File)**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main  # Trigger on pushes to the main branch
  pull_request:
    branches:
      - main  # Trigger on pull requests to the main branch

jobs:
  build_and_test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18' # Or your preferred Node.js version

      - name: Install Dependencies
        run: npm install  # Or yarn install, or your package manager

      - name: Run Tests
        run: npm test  # Or yarn test, or your testing command

      - name: Run Lint
        run: npm run lint # Assumes you have a linting script in package.json
      # - name: Run Static Analysis
      #   uses: actions/static-analysis@v1  # Example for SonarQube or similar

  deploy_staging:
    runs-on: ubuntu-latest
    needs: build_and_test
    if: github.ref == 'refs/heads/main' # Only deploy from main branch
    steps:
      - name: Deploy to Staging (Example - Simplified)
        uses: actions/deploy-pages@v2
        with:
          # Replace with your actual deployment steps
          # This example just pushes the generated HTML to a branch
          # in your repo. This is a simplified demonstration
          # For production deployments, use tools like AWS, Google Cloud, etc.
          draft: true
```

**Explanation:**

*   **`name`:**  A descriptive name for your workflow.
*   **`on`:** Defines when the workflow should be triggered:
    *   `push`:  Triggers on pushes to the specified branches.
    *   `pull_request`: Triggers on pull requests to the specified branches.
*   **`jobs`:**  A collection of jobs that run sequentially.  In this case, we have two jobs: `build_and_test` and `deploy_staging`.
*   **`build_and_test`:**
    *   `runs-on: ubuntu-latest`:  Specifies the runner environment (Ubuntu in this case).
    *   `steps`:  A sequence of tasks to be performed within the job.
        *   `actions/checkout@v3`: Checks out your repository code.
        *   `actions/setup-node@v3`: Sets up the Node.js environment.  You can configure the `node-version` here.
        *   `npm install`: Installs
