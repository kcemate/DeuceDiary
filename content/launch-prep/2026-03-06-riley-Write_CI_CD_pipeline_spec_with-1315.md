# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-06T13:15:46.242051

Okay, here's a detailed CI/CD pipeline spec using GitHub Actions, designed to be a solid starting point. This specification covers a typical workflow including code linting, testing, and deployment to a simple GitHub Pages site.  I'll break it down into sections with explanations and best practices.

**Pipeline Name:** `ci-cd-pipeline`

**Repository:** (Specify your GitHub repository here)

**Triggers:**

*   **Push to all branches:** This will initiate the pipeline whenever code is pushed to any branch.
*   **Pull Request Created:** This will initiate the pipeline when a new pull request is created.
*   **Pull Request Updated:** This will trigger the pipeline when an existing pull request is updated.

**Stages:**

1.  **Linting & Formatting (Build):**
    *   **Name:** `Linting`
    *   **Runs on:** `ubuntu-latest` (or another suitable Linux-based runner)
    *   **Jobs:**
        *   **Job Name:** `lint`
            *   **Steps:**
                *   `uses: actions/checkout@v3` - Checks out the code from the repository.
                *   `uses: actions/setup-node@v3` - Sets up a Node.js environment.  Choose the appropriate version (e.g., `node-18`, `node-20`).
                *   `run: npm install` - Installs the project's dependencies.
                *   `run: npm run lint` -  Executes the project's linting script (e.g., `eslint .`).
                *   `run: npm run format` - Executes the project's formatting script (e.g., `prettier --write .`).
                *   `if: ${{ failure() == true }}` - If linting fails, mark the job as failed.  This prevents further steps.

2.  **Testing (Build):**
    *   **Name:** `Testing`
    *   **Runs on:** `ubuntu-latest`
    *   **Jobs:**
        *   **Job Name:** `test`
            *   **Steps:**
                *   `uses: actions/checkout@v3`
                *   `uses: actions/setup-node@v3`
                *   `run: npm install`
                *   `run: npm run test` - Executes the project's test suite (e.g., `jest`).
                *   `if: ${{ failure() == true }}` - Mark the job as failed if tests fail.

3.  **Deployment to GitHub Pages (Deploy):**
    *   **Name:** `Deploy to GitHub Pages`
    *   **Runs on:** `ubuntu-latest`
    *   **Jobs:**
        *   **Job Name:** `deploy`
            *   **Steps:**
                *   `uses: actions/checkout@v3`
                *   `uses: actions/setup-node@v3`
                *   `run: npm install`
                *   `run: npm run build` - Builds the project for production (e.g., `npm run build`).  This step is crucial for serving static content.
                *   `run: npm run deploy` - Executes a deployment script (e.g., `npm run deploy-gh-pages`). This script would typically push the built assets to the `gh-pages` branch or a configured deployment target. *Important: This assumes you've configured a `deploy` script that correctly handles your deployment process.*

**Workflow File (Example: `.github/workflows/ci-cd-pipeline.yml`)**

```yaml
name:
