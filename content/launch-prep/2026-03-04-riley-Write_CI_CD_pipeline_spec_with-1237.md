# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-04T12:37:16.255219

Okay, let's craft a comprehensive CI/CD pipeline spec using GitHub Actions, focusing on best practices and flexibility. This spec will cover several stages, with options for customization based on your project's needs.

**Pipeline Name:** `ci-cd-pipeline`

**Trigger:**  Every push to the `main` branch (or specify your primary branch). You can also trigger on pull requests for testing.

**Workflow File:** `workflows/ci-cd.yml` (This is a recommended naming convention)

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
  build-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18' # Or your preferred Node.js version

      - name: Install Dependencies
        run: npm install

      - name: Run Tests
        run: npm test

      - name: Build (Example - Adjust for your project)
        run: npm run build  # Or your build command

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build-test  # This job depends on the build-test job passing
    environment: staging
    steps:
      - name: Deploy to Staging (Example - Use your deployment method)
        if: github.ref == 'refs/heads/main'
        run: |
          # Replace with your deployment script or command
          echo "Deploying to Staging..."
          # Example using SSH to deploy:
          # ssh user@staging-server "cd /path/to/app && git pull origin main && npm install && npm run build && pm2 restart app"
          # Or use a CI/CD tool like Netlify, Vercel, or AWS.

  deploy-production:
    runs-on: ubuntu-latest
    needs: build-test
    environment: production
    if: github.ref == 'refs/heads/main' # Only deploy from the main branch
    steps:
      - name: Deploy to Production (Example - Adjust)
        run: |
          # Replace with your production deployment script
          echo "Deploying to Production..."
          # Example using SSH:
          # ssh user@production-server "cd /path/to/app && git pull origin main && npm install && npm run build && pm2 restart app"
          # Or use a CI/CD tool like Netlify, Vercel, or AWS.
```

**Explanation and Key Components:**

1. **`name`:**  A descriptive name for your pipeline.

2. **`on`:** This section defines when the workflow should be triggered.
   - `push`:  Triggers on every push to the specified branches.
   - `pull_request`: Triggers on pull requests to the specified branches.

3. **`jobs`:** Contains the individual jobs that make up the pipeline.

   - **`build-test`:**
     - `runs-on`: Specifies the virtual machine environment (Ubuntu in this case).
     - `steps`:  A sequence of actions to perform:
       - `Checkout Code`:  Checks out the code from your repository.
       - `Set up Node.js`: Installs a specific Node.js version.
       - `Install Dependencies`:  Installs project dependencies using `npm install`.
       - `Run Tests`: Executes your test
