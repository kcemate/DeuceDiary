# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-07T02:00:15.570458

Okay, let's craft a comprehensive CI/CD pipeline specification using GitHub Actions. This will cover a sample workflow, best practices, and considerations.

**Pipeline Goal:** Automate testing and deployment of a Node.js application to a staging environment upon code commits to the `main` branch.

**1. Repository Setup**

*   **GitHub Repository:**  You need a GitHub repository containing your Node.js application code.
*   **GitHub Actions Workflow File:** Create a file named `.github/workflows/main.yml` in your repository. This file defines your CI/CD workflow.

**2. YAML Workflow Specification (`.github/workflows/main.yml`)**

```yaml
name: Node.js CI/CD Pipeline

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'  # Or your preferred Node.js version

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build  # Assuming you have a build script defined in package.json

      - name: Upload test reports
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results.json  # Adjust if your test reports are in a different format

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build  # Ensures build job completes successfully before deployment

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Staging (Example - Using SSH)
        uses: appleboy/ssh-action@v1.1.3
        with:
          host: ${{ secrets.STAGING_HOST }}
          username: ${{ secrets.STAGING_USERNAME }}
          key: ${{ secrets.STAGING_KEY }}
          script: |
            # Your deployment commands here.
            # Example:  npm install && npm run deploy
            echo "Deploying to staging..."
          # Optional: Add a pass status if the deployment succeeds
          pass: true
```

**3. Explanation of the YAML**

*   **`name`**: A descriptive name for your workflow.
*   **`on`**:  Specifies when the workflow is triggered:
    *   `push`: Triggered when code is pushed to the `main` branch.
    *   `pull_request`: Triggered when a pull request is created or updated against the `main` branch.
*   **`jobs`**: Defines the individual jobs within the workflow.
    *   **`build`**:
        *   `runs-on`:  Specifies the runner environment (Ubuntu in this case).
        *   `steps`: A sequence of tasks to perform:
            *   `Checkout code`:  Clones the repository.
            *   `Set up Node.js`: Installs the required Node.js version.
            *   `Install dependencies`:  Runs `npm install`.
            *   `Run tests`: Runs your test suite (e.g., using `npm test`).
            *   `Build`:  Runs your build command (e.g., `npm run build`).
            *   `Upload test reports`:  Uploads test results for reporting
