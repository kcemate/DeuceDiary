# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-07T12:22:17.700907

Okay, let's craft a CI/CD pipeline specification using GitHub Actions. This will be a detailed specification that you can adapt to your specific project needs.

**Pipeline Name:** `my-project-ci-cd` (Replace with your project's name)

**Description:** This pipeline automates the building, testing, and deployment of my-project, leveraging GitHub Actions for continuous integration and continuous delivery.

**Triggers:**

*   **Push to all branches:** Trigger the pipeline on every push to any branch.
*   **Pull Request Creation:**  Trigger the pipeline on creation of any Pull Request.
*   **Pull Request Updates:** Trigger the pipeline on updates to any Pull Request.

**Environments:** (Using GitHub's Environments feature - highly recommended for organization)

*   **Development:**  Runs on the `develop` branch and similar dev branches.
*   **Staging:** Runs on the `staging` branch.
*   **Production:** Runs on the `main` or `production` branch.

**Jobs:**

**1. Build & Test (Unit Tests, Linting, Static Analysis) –  `build-test`**

*   **Name:** Build & Test
*   **Runs on:** `ubuntu-latest` (or your preferred Ubuntu version)
*   **Steps:**
    *   `Checkout`:  Checkout the repository.
    *   `Setup Python`: (If Python is used) Install Python dependencies using `pip`.
    *   `Install Dependencies`:  Install project dependencies (e.g., using `npm install`, `yarn install`, `bundle install`).
    *   `Linting/Static Analysis`: Run linters and static analysis tools (e.g., ESLint, PyLint, SonarQube).
    *   `Unit Tests`:  Execute unit tests (e.g., `pytest`, `jest`, `npm test`).
    *   `Code Coverage Report`: Generate and upload code coverage reports (e.g., to Coveralls, Codecov).
    *   `Artifact Upload`:  Upload build artifacts (e.g., compiled binaries, package files) to a GitHub Release.
*   **Secrets:**
    *   `PYTHON_PIP_CACHE_DIR`: Path to Python pip cache (if applicable)
    *   `NPM_CACHE_DIR`: Path to NPM cache (if applicable)

**2.  Deployment to Staging (Staging Environment) – `deploy-staging`**

*   **Name:** Deploy to Staging
*   **Runs on:** `ubuntu-latest` (or your preferred Ubuntu version)
*   **Requires:**  `build-test` job must complete successfully.
*   **Steps:**
    *   `Checkout`: Checkout the repository.
    *   `Setup Environment`:  Install necessary tools for deployment (e.g., SSH keys, Docker).
    *   `Deploy`:  Deploy the application to a staging environment (e.g., using Ansible, Terraform, Docker Compose, a deployment script).  This step should include setting environment variables.
    *   `Verification`:  Perform basic verification steps (e.g., check application health, verify database connection).
    *   `Slack Notification`: (Optional)  Send a Slack notification indicating successful deployment.
*   **Secrets:**
    *   `STAGING_SERVER_IP`: IP address of the staging server.
    *   `STAGING_SERVER_USER`: Username for SSH access to the staging server.
    *   `STAGING_SERVER_KEY`: Private key for SSH access.
    *   `SLACK_WEBHOOK_URL`:  URL to your Slack webhook.

**3. Deployment to Production (Production Environment) – `deploy-production
