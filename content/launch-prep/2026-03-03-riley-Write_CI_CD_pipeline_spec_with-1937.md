# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T19:37:28.055448

Okay, let's craft a CI/CD pipeline spec using GitHub Actions. This will cover a basic setup, but you'll need to adapt it to your specific project's needs (language, build tools, deployment targets, etc.).

**Pipeline Name:** `ci-cd`

**Trigger:**  "Every push to all branches" (You can adjust this to specific branches or pull requests if desired)

**YAML File (`.github/workflows/ci-cd.yml`):**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - '*'  # Trigger on all branches
  pull_request:
    branches:
      - '*'

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16' # Or your preferred Node.js version

      - name: Install Dependencies
        run: npm install

      - name: Run Tests
        run: npm test  # Replace with your testing command (e.g., npm run test)

      - name: Build (Example - adjust for your project)
        run: npm run build

  deploy-staging:
    needs: build-and-test
    runs-on: ubuntu-latest
    environment: staging
    if: github.ref == 'refs/heads/main'  # Only deploy from main branch
    steps:
      - name: Deploy to Staging (Example - adjust for your deployment method)
        uses: jaywcjahn/deployer@v2.6.0 # Using a deployer action
        with:
          name: staging
          host: ${{ secrets.STAGING_HOST }}
          user: ${{ secrets.STAGING_USER }}
          password: ${{ secrets.STAGING_PASSWORD }}
          path: ${{ secrets.STAGING_PATH }}
          clean: true # Clean before deployment

  deploy-production:
    needs: build-and-test
    runs-on: ubuntu-latest
    environment: production
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Production (Example - adjust for your deployment method)
        uses: jaywcjahn/deployer@v2.6.0
        with:
          name: production
          host: ${{ secrets.PRODUCTION_HOST }}
          user: ${{ secrets.PRODUCTION_USER }}
          password: ${{ secrets.PRODUCTION_PASSWORD }}
          path: ${{ secrets.PRODUCTION_PATH }}
          clean: true
```

**Explanation & Key Components:**

1.  **`name`:**  A descriptive name for your workflow.

2.  **`on`:**  Specifies when the workflow should be triggered.
    *   `push`: Triggers on pushes to any branch.
    *   `pull_request`: Triggers on pull requests to any branch.

3.  **`jobs`:**  Defines the tasks to be executed.
    *   **`build-and-test`:**
        *   `runs-on`: Specifies the virtual machine to use (Ubuntu in this example).
        *   `steps`: A sequence of tasks:
            *   `Checkout Code`: Checks out your repository.
            *   `Set up Node.js`: Installs a specific Node.js version.
            *   `Install Dependencies`: Runs `npm install`.
            *   `Run Tests`:  Executes your
