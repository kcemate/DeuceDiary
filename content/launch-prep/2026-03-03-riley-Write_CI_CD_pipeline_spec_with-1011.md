# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T10:11:14.702119

Okay, here's a CI/CD pipeline specification using GitHub Actions, designed for a relatively simple application. This spec covers the key stages and considerations.  I'll break it down into sections, including YAML configuration files and explanations.

**Scenario:**

Let's assume we have a simple Node.js application hosted in a GitHub repository.  We want to:

*   **CI (Continuous Integration):**  Run tests on every push to the main branch.
*   **CD (Continuous Delivery):**  Deploy to a staging environment (e.g., Heroku) on a schedule (e.g., daily).

**1. Workflow File (`.github/workflows/ci-cd.yml`)**

This is the main YAML file that defines the entire CI/CD pipeline.

```yaml
name: Node.js CI/CD

on:
  push:
    branches:
      - main  # Trigger only on pushes to the 'main' branch
  pull_request:
    branches:
      - main  # Trigger on PRs to 'main'

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'  # Specify Node.js version
      - name: Install Dependencies
        run: npm install
      - name: Run Tests
        run: npm test  # Assuming you have a 'test' script in package.json
      - name: Build (Optional - if needed)
        run: npm run build # Example build command

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build-and-test  # This job depends on the build-and-test job
    environment: staging # Deploy to a specific environment
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Staging (Example - Heroku)
        uses: heroku/heroku-deploy@v2
        with:
          HEROKU_API_KEY: ${{ secrets.HEROKU_API_KEY }}  # Use a GitHub Secret
          APP_NAME: my-app-staging
```

**2. Explanation of the YAML:**

*   **`name`:**  A descriptive name for the workflow.
*   **`on`:** Defines when the workflow should trigger.
    *   `push`: Triggers the workflow on pushes to the `main` branch.
    *   `pull_request`: Triggers the workflow on pull requests to the `main` branch.
*   **`jobs`:**  Defines the individual jobs that make up the pipeline.
    *   **`build-and-test`:**
        *   `runs-on: ubuntu-latest`:  Specifies the runner (virtual machine) to use.
        *   `steps`:  A sequence of actions to perform.
            *   `actions/checkout@v3`: Checks out the code from the repository.
            *   `actions/setup-node@v3`:  Sets up the Node.js environment.  You can specify a particular version.
            *   `npm install`: Installs the project's dependencies.
            *   `npm test`: Runs your project's tests (assuming you have a `test` script in `package.json`).
            *   `npm run build`:  (Optional)  Executes a build script (e.g., for bundling JavaScript).
    *   **`deploy-staging`
