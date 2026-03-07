# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-04T17:59:38.064024

Okay, here's a comprehensive CI/CD pipeline specification for GitHub Actions, designed to be adaptable to a wide range of projects. I'll break it down into sections, explaining the purpose of each stage and providing a YAML configuration file example.

**1. Overall Goals & Assumptions:**

* **Project Type:** This pipeline is designed for general-purpose software projects (e.g., web apps, libraries, command-line tools) using Git.
* **Workflow:**
    * **CI (Continuous Integration):** Automated builds and tests on every push to the main branch and pull requests.
    * **CD (Continuous Delivery):** Automated deployment to a staging environment on merge to a designated branch.
* **Deployment Target:** (You'll need to customize this!)  This example assumes a deployment to a server/VM using SSH.  Adjust the SSH key and commands to fit your infrastructure.
* **Branching Strategy:**  We'll assume a typical Gitflow-like branching strategy:
    * `main`: Production-ready code.
    * `develop`: Integration branch for new features.
    * `feature/*`: Branches for individual features.
    * `release/*`: Branches for preparing releases.

**2. Pipeline Stages:**

1. **Trigger:** The pipeline is triggered by:
   * `push` events to the `main` branch.
   * `pull_request` events.

2. **Checkout:**  Retrieves the code from the repository.

3. **Setup:**
   * Installs dependencies (e.g., Node.js, Python, Maven, npm, pip, etc.).
   * Sets up environment variables (e.g., API keys, database credentials).

4. **Build:** Compiles the code if necessary (e.g., compiling Java, C++, or generating frontend assets).

5. **Test:**  Runs automated tests:
   * Unit tests
   * Integration tests
   * (Optionally) E2E (End-to-End) tests

6. **Linting & Static Analysis:**  Checks the code for style issues and potential problems.

7. **Package (Optional):** Creates a package for distribution (e.g., a Docker image, a npm package, a JAR file).

8. **Deploy to Staging:**  Deploys the application to a staging environment.

9. **Manual Approval (Optional):**  Requires a manual approval before deploying to production.

10. **Deploy to Production:**  Automated deployment to production (often triggered after successful staging deployment).



**3. GitHub Actions YAML Configuration (Example):**

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
  build-test-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'  # Adjust as needed

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Linting
        run: npm run lint  # Assuming you have a lint script in package.json

      - name: Build (if needed)
        run: npm run build  # Example for a frontend app

      - name: Deploy to Staging
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.STAGING_HOST }}
          username: ${{ secrets.STAGING_USER
