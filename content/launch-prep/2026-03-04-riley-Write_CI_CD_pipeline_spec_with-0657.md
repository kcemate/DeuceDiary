# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-04T06:57:00.668571

Okay, here's a comprehensive CI/CD pipeline specification using GitHub Actions, designed to be adaptable to various projects.  I'll break it down with explanations, best practices, and considerations for customization.

**Pipeline Name:** `ci-cd-pipeline`

**Trigger:**  `push` to all branches (but configurable - see notes below)

**Workflow Name:** `run-tests-build-deploy`

**YAML Configuration (Example):**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main  # Or your primary development branch
  pull_request:
    branches:
      - main

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set Up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'  # Or your desired Node.js version

      - name: Install Dependencies
        run: npm install

      - name: Run Tests
        run: npm test

      - name: Build (Example - adjust for your project)
        if: github.ref == 'refs/heads/main' # Only build on main branch
        run: npm run build # Or your build command

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build-and-test # Ensures build succeeds first
    if: github.ref == 'refs/heads/main' # Only deploy from main

    steps:
      - name: Deploy to Staging
        uses: actions/deploy-pages@v2
        with:
          # You'd typically replace this with your actual deployment steps.
          # Example: SSH into server, run rsync, etc.
          #  This is just a placeholder to demonstrate the concept.
          #   Use a secure deployment strategy (e.g., environment variables).
          empty_directory: staging-build # Replace with your deployment directory
          github_token: ${{ secrets.STAGING_DEPLOYMENT_TOKEN }} #  Replace with your token!


  deploy-production:
    runs-on: ubuntu-latest
    needs: build-and-test # Ensures build succeeds first
    if: github.ref == 'refs/heads/main' # Only deploy from main

    steps:
      - name: Deploy to Production
        uses: actions/deploy-pages@v2
        with:
          #  Again, replace with your actual production deployment steps.
          #  This is a placeholder.  Crucially, use secrets for sensitive data!
          empty_directory: production-build
          github_token: ${{ secrets.PRODUCTION_DEPLOYMENT_TOKEN }}
```

**Explanation and Breakdown:**

1. **`on:` (Trigger)**
   - `push`:  This workflow will run whenever code is pushed to the specified branches.
   - `pull_request`: Runs on pull requests. This is useful for testing changes before merging.

2. **`jobs:`**
   - This section defines the independent tasks (jobs) that make up the pipeline.

3. **`build-and-test:`**
   - `runs-on: ubuntu-latest`:  Specifies the runner (virtual machine) to execute the job on.  Ubuntu is a common choice.
   - `steps:`  A sequence of tasks within the job:
     - `Checkout Code`:  Retrieves the code from your repository.
     - `Set Up Node.js`:  Installs a specific version of Node.js (adjust the version
