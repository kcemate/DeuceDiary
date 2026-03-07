# Write a CI/CD pipeline specification for Deuce Diary: GitHub
Agent: riley
Generated: 2026-03-03T00:03:32.817525

Okay, let's craft a comprehensive CI/CD pipeline specification for Deuce Diary using GitHub Actions. This will cover testing, linting, building, and deploying to both staging and production environments on Railway.

**Core Assumptions:**

*   **Deuce Diary Project:** A Node.js project with a standard setup (package.json, npm scripts, etc.).
*   **Railway:** You have a Railway account and have deployed a basic Deuce Diary instance.
*   **GitHub Repository:** The Deuce Diary code is hosted in a GitHub repository.
*   **Environment Variables:** You've configured environment variables within Railway for your staging and production instances (database connection string, API keys, etc.). This is crucial for security.
*   **Version Control:**  Branching strategy (e.g., Gitflow) will influence some workflow details.

**Workflow Specification**

We'll primarily use two GitHub Actions workflows: `test`, `lint`, `build`, `deploy-staging`, and `deploy-production`.

**1. `test` Workflow (Continuous Testing)**

*   **Trigger:**  On push to the `main` branch and pull requests.
*   **Purpose:**  Automated testing of the code.
*   **Steps:**
    *   `Setup Node.js`:  Install Node.js and npm.
    *   `Install Dependencies`: `npm install`
    *   `Run Tests`: `npm test`  (Configure `test` script in `package.json` to use Jest, Mocha, or your preferred testing framework).
    *   `Run Linting`:  Execute your linting tools (e.g., ESLint)
    *   `Upload Test Reports`:  Publish test reports to Codecov or a similar service for visual tracking.
*   **Secrets:** None required.
*   **Example YAML:**

```yaml
name: Test
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18' # or your preferred Node.js version
      - name: Install Dependencies
        run: npm install
      - name: Run Tests
        run: npm test
      - name: Run Linting
        run: npm run lint # Assuming you have a lint script in package.json
      - name: Upload Test Reports
        uses: codecov/codecov-action@v3
```

**2. `lint` Workflow (Continuous Linting)**

*   **Trigger:** On push to the `main` branch and pull requests.
*   **Purpose:**  Ensures code style and quality through linting.
*   **Steps:**
    *   `Setup Node.js`: Install Node.js.
    *   `Install Dependencies`: Install linting tools.
    *   `Run Linting`: Execute the linting command.
    *   `Fail Build on Lint Errors`:  Fail the workflow if linting reports errors.
*   **Secrets:** None.
*   **Example YAML:** (Similar structure to the `test` workflow)

```yaml
name: Lint
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
