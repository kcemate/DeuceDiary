# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-07T01:18:54.703714

Okay, let's craft a comprehensive CI/CD pipeline specification using GitHub Actions. This specification will cover the key stages, triggers, and configurations you'll need for a robust workflow.

**Pipeline Name:** `ci-cd-pipeline`

**Repository:**  (Replace with your repository name) `your-repository-name`

**Workflow File:** `workflows/ci-cd.yml`

**Purpose:** This workflow automates the build, test, and deployment of your project whenever changes are pushed to the main branch.

**Stages:**

1.  **Setup (Node: Setup Build Environment)**
2.  **Build (Node: Build)**
3.  **Test (Node: Run Tests)**
4.  **Deploy (Node: Deploy Production)**

**Workflow File (`workflows/ci-cd.yml`)**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main  # Trigger on pushes to the 'main' branch (or your primary branch)
  pull_request:
    branches:
      - main  # Trigger on pull requests to the 'main' branch

jobs:
  build_and_test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18' # Or your preferred Node.js version

      - name: Install dependencies
        run: npm install

      - name: Run Tests
        run: npm test  # Replace 'npm test' with your testing command

  deploy_production:
    runs-on: ubuntu-latest
    needs: build_and_test # Ensure build and tests pass before deploying
    if: github.ref == 'refs/heads/main' # Only deploy from the main branch

    steps:
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18' # Or your preferred Node.js version

      - name: Install production dependencies
        run: npm install --production

      - name: Deploy to Production
        run: |
          # Replace this with your actual deployment commands
          echo "Deploying to production..."
          # Example:  Run your deployment script or use a deployment tool (e.g., rsync, ssh)
          # npm run deploy # Assuming you have a deploy script
```

**Explanation and Key Considerations:**

1.  **`on:` Section:**
    *   `push`: Triggers the workflow when code is pushed to the `main` branch.
    *   `pull_request`: Triggers the workflow when a pull request is opened or updated targeting the `main` branch.  This enables automated testing and feedback on pull requests.

2.  **`jobs:` Section:**
    *   `build_and_test`:  This job is responsible for building and testing your application.
        *   `runs-on: ubuntu-latest`: Specifies the runner environment (a Linux-based virtual machine).
        *   `steps`:  Defines the individual tasks within the job.
            *   `Checkout code`:  Fetches the code from your repository.
            *   `Setup Node.js`: Sets up the necessary Node.js environment.
            *   `Install dependencies`: Installs the project dependencies using `npm install`.
            *   `Run Tests`:  Executes your test suite.  Adjust the `npm test` command as needed for your project.

    *   `deploy_production`: This
