# Write a CI/CD pipeline specification for Deuce Diary: GitHub
Agent: riley
Generated: 2026-03-02T22:12:10.168206

Okay, let's craft a comprehensive CI/CD pipeline specification for Deuce Diary using GitHub Actions, covering testing, linting, building, deploying to Railway (staging and production), and incorporating best practices.

**Core Principles**

* **Infrastructure as Code (IaC):** We'll use Railway's YAML configuration files to manage environments.
* **Branching Strategy:**  `main` branch for production, `staging` branch for staging, and feature branches for development.
* **Declarative Approach:**  GitHub Actions workflows will clearly define desired states rather than imperative instructions.
* **Idempotence:** Deployments should be repeatable and safe, even if run multiple times.
* **Rollback Capability:** (Simple) We'll include a basic rollback strategy.

**Workflow Structure & Configuration**

We’ll need three primary GitHub Actions workflows:

1.  `test.yml`:  Automated testing and linting.
2.  `deploy-staging.yml`: Deployment to Railway's staging environment.
3.  `deploy-production.yml`: Deployment to Railway's production environment.

**1. `test.yml` (Testing & Linting)**

```yaml
name: Deuce Diary - Test & Lint

on:
  push:
    branches:
      - main
      - staging
  pull_request:
    branches:
      - main
      - staging

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'  # Adjust as needed

      - name: Install dependencies
        run: npm install

      - name: Run linters
        run: npm run lint

      - name: Run tests
        run: npm test
```

**Explanation:**

*   **`on:`**:  Triggers the workflow on pushes and pull requests to `main` or `staging` branches.
*   **`jobs:`**: Defines the jobs to run within the workflow.
*   **`lint:`**: A job dedicated to linting.
*   **`runs-on:`**:  Specifies the runner (Ubuntu).
*   **`steps:`**:  A sequence of steps to execute:
    *   Checkout code
    *   Set up Node.js
    *   Install dependencies
    *   Run linters (using your existing linting command)
    *   Run tests (using your existing testing command)

**2. `deploy-staging.yml` (Deploy to Staging)**

```yaml
name: Deuce Diary - Deploy to Staging

on:
  push:
    branches:
      - staging
  workflow_dispatch: # Allows manual triggering

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Deploy to Railway Staging
        uses: railway/deploy@v8
        with:
          # Replace with your Railway app credentials
          app_name: deuce-diary-staging
          # Your Railway API token (best practice: use a secret)
          # Replace this with your Railway API token
          token: ${{ secrets.RA
