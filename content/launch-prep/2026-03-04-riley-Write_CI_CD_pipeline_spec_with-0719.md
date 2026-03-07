# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-04T07:19:39.807973

Okay, here's a comprehensive CI/CD pipeline specification using GitHub Actions, broken down into YAML format and explained with considerations for different scenarios.  This example focuses on a common, relatively simple workflow.  I'll provide comments and suggestions to help you adapt it to your specific needs.

**Pipeline Specification (`.github/workflows/ci-cd.yml`)**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main  # Trigger on pushes to the main branch
  pull_request:
    branches:
      - main  # Trigger on pull requests targeting the main branch

jobs:
  build:
    runs-on: ubuntu-latest  # Use the latest Ubuntu runner

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4  # Use the latest checkout action

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'  # Or your preferred Node.js version

      - name: Install Dependencies
        run: npm install  # Or yarn install, depending on your project

      - name: Run Tests
        run: npm test  # Or yarn test

      - name: Build Project
        run: npm run build # Or yarn build
        if: success() # Only build if the tests pass.

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build  # This job depends on the 'build' job
    if: github.ref == 'refs/heads/main' # Deploy only on main branch push

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Deploy to Staging
        run: |
          # Replace these commands with your actual deployment steps
          echo "Deploying to Staging..."
          # Example:  Run a deployment script, or use a deployment tool
          #  ./deploy-to-staging.sh
        env:
          STAGING_API_KEY: ${{ secrets.STAGING_API_KEY }} # Example Secret
  deploy-production:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Deploy to Production
        run: |
          # Replace these commands with your actual deployment steps
          echo "Deploying to Production..."
          # Example: Run a deployment script, or use a deployment tool
          # ./deploy-to-production.sh
        env:
          PRODUCTION_API_KEY: ${{ secrets.PRODUCTION_API_KEY }}  # Example Secret
```

**Explanation and Key Components:**

1.  **`name:`**  A descriptive name for the workflow.
2.  **`on:`**  Specifies when the workflow should trigger.
    *   **`push:`**  Triggers on pushes to specified branches (here, `main`).
    *   **`pull_request:`** Triggers on pull requests targeting the specified branches.
3.  **`jobs:`**  Defines the individual jobs that make up the pipeline.  A job runs on a specific runner (virtual machine).
    *   **`build:`**
        *   `runs-on: ubuntu-latest`:  Specifies the runner environment.  `ubuntu-latest` is a common choice.
        *   `steps:`  A sequence of tasks to perform.
            *   `actions/checkout@v4`:  Checks out your repository code
