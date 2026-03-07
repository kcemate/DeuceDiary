# Write a CI/CD pipeline specification for Deuce Diary: GitHub
Agent: riley
Generated: 2026-03-02T20:21:47.191387

Okay, here's a comprehensive CI/CD pipeline specification for Deuce Diary, leveraging GitHub Actions, with considerations for testing, linting, building, deploying to Railway (staging & production), and incorporating best practices.

**Overall Philosophy:**

* **Idempotency:** Each step in the pipeline should be designed to be run multiple times without causing unintended side effects.
* **Clear Stages:**  Well-defined stages for testing, linting, building, and deployment.
* **Environment Variables:**  Reliance on environment variables for configuration (Railway credentials, deployment specifics).  Never hardcode sensitive information.
* **Rollback Strategy:**  (This requires more complex setup, but should be considered long-term.)  Ideally, a rollback mechanism would be built into deployment to revert to a previous version quickly.  Railway's deployment features offer some built-in rollback capabilities.
* **Monitoring & Logging:** While this specification focuses on the pipeline itself, ensure your Railway deployment is set up for robust monitoring and logging to diagnose issues.

**GitHub Actions Workflow Specification**

**1. `main` Branch Workflow (`.github/workflows/main.yml`)**

This workflow will be triggered on pushes to the `main` branch.

```yaml
name: Deuce Diary CI/CD - Main Branch

on:
  push:
    branches:
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'  # Or your preferred Node.js version

      - name: Install Dependencies
        run: npm install

      - name: Lint Code
        run: npm run lint

      - name: Test Code
        run: npm test

      - name: Build Production Assets
        run: npm run build:prod  # Adapt this command to your build process

      - name: Deploy to Railway - Staging
        if: github.ref == 'refs/heads/main'  # Deploy only on main branch pushes
        uses: railway/deploy@v3
        with:
          app_name: deuce-diary-staging  # Replace with your staging app name
          deploy_key: ${{ secrets.RAILWAY_DEPLOY_KEY }}
          strategy: overwrite # Strategy to use
          run_migrations: true  # Ensure database migrations are run
```

**2. `develop` Branch Workflow (`.github/workflows/develop.yml`)**

This workflow is triggered on pushes to the `develop` branch.  It's typically used for integration testing and potentially early releases.

```yaml
name: Deuce Diary CI/CD - Develop Branch

on:
  push:
    branches:
      - develop

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install Dependencies
        run: npm install

      - name: Lint Code
        run: npm run lint

      - name: Test Code
        run: npm test

      - name: Build Production Assets
        run: npm run build:prod

      - name: Deploy to Railway - Staging
        if: github.ref == 'refs/heads/develop'
        uses: railway/deploy@v3
        with:
