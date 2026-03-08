# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-07T15:33:10.469141

Okay, let's craft a comprehensive CI/CD pipeline specification using GitHub Actions. This specification will cover the core stages of a typical workflow, including testing, building, and deployment.  We'll break it down into sections for clarity and provide YAML-formatted examples you can adapt to your specific project.

**1. Overview & Goals**

* **Purpose:**  Automate the build, test, and deployment process for a software project hosted on GitHub.
* **Triggers:**
    * **Code Push:**  Automatic execution on pushes to the `main` (or designated primary) branch.
    * **Pull Requests:** Execution of tests and build artifacts for PRs.
* **Environments:**
    * **Development:**  Local development/testing. (Not explicitly included in this GitHub Actions workflow, but the pipeline should be testable.)
    * **Staging:** Pre-production environment for final testing.
    * **Production:**  Live environment.
* **Tools:**  GitHub Actions, Git, a build tool (e.g., npm, Maven, Gradle), a testing framework (e.g., Jest, JUnit, Pytest), and deployment tools (e.g., AWS CLI, Azure CLI, Google Cloud SDK).


**2. YAML Pipeline Specification (GitHub Actions)**

Here's a detailed YAML file (`.github/workflows/ci-cd.yml`) to define the pipeline.  I'll provide a comprehensive example, but you should customize it for your project's specifics.

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main  # Trigger on pushes to the main branch
  pull_request:
    branches:
      - main  # Trigger on pull requests targeting the main branch
    types: [opened, synchronize, reopened] # Trigger on any PR events

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
        run: npm install  # Or your package manager command

      - name: Run tests
        run: npm test  # Or your testing command

      - name: Build project (if applicable)
        run: npm run build # Or your build command

  deploy_staging:
    needs: build_and_test
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Staging (Example - AWS CLI)
        if: ${{ github.ref == 'refs/heads/main' }}  # Only deploy on main branch push
        run: |
          # Replace with your actual deployment commands
          aws s3 sync ./dist s3://your-staging-bucket --delete

  deploy_production:
    needs: build_and_test
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Production (Example - AWS CLI)
        if: ${{ github.ref == 'refs/heads/main' }}  # Only deploy on main branch push
        run: |
          # Replace with your actual deployment commands
          aws s3 sync ./dist s3://your-production-bucket --delete
```

**3. Explanation & Key Considerations**

* **`name`:**
