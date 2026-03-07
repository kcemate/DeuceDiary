# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T13:12:35.885128

Okay, let's craft a comprehensive CI/CD pipeline specification using GitHub Actions. This will cover a basic, but functional, pipeline that includes building, testing, and deploying a simple application.  I'll provide the YAML configuration and explain each step.

**Pipeline Name:** `ci-cd-pipeline`

**Repository:**  (Replace with your actual repository name) `your-repo-name`

**Workflow Name:** `main.yml` (This is the file name GitHub Actions will look for)

**YAML Configuration (main.yml):**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main  # Trigger the pipeline on pushes to the 'main' branch
  pull_request:
    branches:
      - main  # Trigger the pipeline on pull requests to the 'main' branch

jobs:
  build_and_test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16' # Or your desired Node.js version

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

  deploy_staging:
    runs-on: ubuntu-latest
    needs: build_and_test  # This job depends on the successful completion of 'build_and_test'
    if: github.ref == 'refs/heads/main'  # Deploy only from 'main' branch
    steps:
      - name: Deploy to Staging
        uses: actions/deploy-pages@v2
        with:
          # No specific configuration needed.  Uses the `actions/deploy-pages` action to upload
          # the built application to the GitHub Pages site.
```

**Explanation & Key Components:**

1.  **`name: CI/CD Pipeline`**:  Defines the name of the workflow.

2.  **`on:`**:  Specifies when the workflow will be triggered.
    *   **`push:`**:  Triggers the workflow on every push to the `main` branch.
    *   **`pull_request:`**: Triggers the workflow when a pull request is created or updated against the `main` branch.  This is standard practice for testing changes before merging.

3.  **`jobs:`**:  Defines the jobs that will be executed.

4.  **`build_and_test:`**:
    *   **`runs-on: ubuntu-latest`**:  Specifies the runner (virtual machine) to use for this job. `ubuntu-latest` is a common and well-supported choice.
    *   **`steps:`**: A sequence of tasks executed within the job.
        *   **`Checkout code`**: Uses the `actions/checkout@v3` action to clone the repository.
        *   **`Set up Node.js`**: Uses the `actions/setup-node@v3` action to install Node.js on the runner. This is essential for projects using Node.js.
        *   **`Install dependencies`**:  Executes the `npm install` command to install the project's dependencies.
        *   **`Run tests`**:  Executes the project's test suite (assuming you have a `npm test` script defined in your `package.json`).

5.  **`deploy_staging:`**:
    *   **`runs-on: ubuntu-latest`**: Same as above.
    *   **
