# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-04T14:31:35.121440

Okay, let's create a comprehensive CI/CD pipeline spec using GitHub Actions.  This will include best practices and considerations for a robust pipeline. I'll break it down into sections, covering the key stages and providing YAML files for each action.  This is a starting point – you'll need to tailor it to your specific project's needs.

**Core Concepts:**

* **GitHub Actions Workflows:**  These YAML files define the sequence of actions to be performed.
* **Jobs:**  A job represents a set of steps that run in a specific environment (e.g., a runner with Node.js, Python, or Docker).
* **Steps:** Individual tasks within a job (e.g., running a shell command, executing a test suite, deploying code).
* **Runners:**  Machines that execute your actions (GitHub-hosted or self-hosted).

**Pipeline Spec:  Node.js Project Example (Adapt to your Language/Framework)**

This example focuses on a Node.js project using Jest for testing.  It includes stages for:

1.  **Build:**  Install dependencies and potentially build the project.
2.  **Test:**  Run unit tests.
3.  **Lint:**  Run linters to enforce code style.
4.  **Deploy (Staging):** Deploy to a staging environment.
5.  **Deploy (Production):**  Deploy to a production environment.

**1. Workflow File:  `.github/workflows/main.yml`**

```yaml
name: Node.js CI/CD

on:
  push:
    branches:
      - main  # Trigger on pushes to the main branch
  pull_request:
    branches:
      - main  # Trigger on pull requests to the main branch

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 16  # Or your preferred Node.js version

      - name: Install dependencies
        run: npm install

      - name: Run linter
        run: npm run lint  # Assumes you have a lint script in your package.json

      - name: Run tests
        run: npm test

      - name: Build (if applicable)
        run: npm run build # Example - adjust to your build command

      - name: Deploy to Staging
        if: github.ref == 'refs/heads/main'
        run: |
          # Replace with your staging deployment script
          echo "Deploying to Staging..."
          # Example:  npm run deploy:staging
          # Or use a deployment tool like AWS CLI, Terraform, etc.

  deploy-to-production:
    runs-on: ubuntu-latest
    needs: build-and-test  # Ensure build-and-test has completed successfully
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Production
        run: |
          # Replace with your production deployment script
          echo "Deploying to Production..."
          # Example: npm run deploy:production
```

**2. Explanation & Important Considerations:**

*   **`on:`**: Defines when the workflow is triggered (push events to `main` and pull requests to `main`).
*   **`jobs:`**:  Defines the jobs to be executed.
*   **`runs-on:`**: Specifies
