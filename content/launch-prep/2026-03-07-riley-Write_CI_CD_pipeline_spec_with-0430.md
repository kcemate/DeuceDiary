# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-07T04:30:10.357164

Okay, let's craft a comprehensive CI/CD pipeline specification using GitHub Actions. This spec will cover a basic but robust pipeline for a typical Node.js application, but it's easily adaptable to other languages and workflows.

**Pipeline Name:** `ci-cd`

**Trigger:**  `push` to `main` and `pull_request` events.

**Workflow File:** `github-actions.yml`

**Workflow Description:**  This workflow will:

1.  Install dependencies.
2.  Run unit tests.
3.  Lint the code.
4.  Build the application.
5.  Deploy to a Staging environment on every push to `main` and pull request.
6.  (Optional) Trigger a deployment to Production after successful staging deployment.

**YAML Configuration (github-actions.yml):**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'  # Or your preferred Node.js version

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Lint code
        run: npm run lint  # Assumes you have a lint script in your package.json

      - name: Build application
        run: npm run build  # Assumes you have a build script

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build-and-test
    steps:
      - name: Deploy to Staging
        if: github.ref == 'refs/heads/main' # Only deploy from main
        uses: jaywcjahn/deploy-action@v2.1.0
        with:
          href: ${{ secrets.STAGING_DEPLOY_URL }}  # Your staging deployment URL (secret)
          target: staging  # Name of the staging environment
          strategy: rollback #  rollback strategy

  deploy-production:
    runs-on: ubuntu-latest
    needs: deploy-staging
    steps:
      - name: Deploy to Production
        if: github.ref == 'refs/heads/main'
        uses: jaywcjahn/deploy-action@v2.1.0
        with:
          href: ${{ secrets.PRODUCTION_DEPLOY_URL }}  # Your production deployment URL (secret)
          target: production
          strategy: rollback
```

**Explanation & Key Elements:**

*   **`on:`**:  This section defines when the workflow is triggered.
    *   `push`:  Runs when code is pushed to the `main` branch.
    *   `pull_request`: Runs when a pull request is opened or updated targeting the `main` branch.

*   **`jobs:`**:  Defines the individual jobs that make up the workflow.
    *   **`build-and-test`**:  This job contains the core CI tasks.
        *   `runs-on: ubuntu-latest`: Specifies the virtual machine to run the job on.
        *   `steps:`:  A sequence of actions to be performed.
            *   `Checkout code`:  Fetches the code from your repository.
            *   `Setup Node.js`: Installs the specified Node.js version.
