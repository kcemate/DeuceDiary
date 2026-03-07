# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T21:30:36.200780

Okay, here's a comprehensive CI/CD pipeline spec using GitHub Actions, along with explanations and considerations. This is a starting point and should be tailored to your specific project's needs.

**Pipeline Name:** `main` (or whatever your main branch is called)

**Workflow Name:** `ci-cd`

**Triggers:**

*   **Push to all Branches:** This workflow will run automatically whenever code is pushed to any branch of your repository.
*   **Pull Request Created:**  This will trigger a pre-flight check (e.g., code style, linting) before a PR is merged.
*   **Pull Request Updated:** This will rerun the workflow to ensure no changes have broken the checks.

**Jobs:**

The pipeline is broken down into several jobs, each responsible for a specific stage:

1.  **`build` Job (Node.js Example - Adapt for your Language!)**
    *   **Runs on:** `ubuntu-latest` (or your preferred OS)
    *   **Steps:**
        *   `Checkout` – Checks out the code from the repository.
        *   `Setup Node.js` – Installs a specific Node.js version (recommended for consistency).
        *   `Install Dependencies` – `npm install` or `yarn install` to install project dependencies.
        *   `Linting` – Runs a linter (e.g., ESLint) to enforce code style.  Set up a step to fail the build if linting fails.
        *   `Unit Tests` – Runs your unit tests (e.g., using Jest, Mocha).  Set up a step to fail the build if tests fail.
        *   `Build Artifact` - (Optional)  Build a deployable artifact (e.g., a Docker image, a compiled executable).  You might store this in a `build` folder.

    ```yaml
    jobs:
      build:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v3
          - name: Setup Node.js
            uses: actions/setup-node@v3
            with:
              node-version: '18' # Or your required Node.js version
          - name: Install Dependencies
            run: npm install
          - name: Linting
            run: npm run lint # Assuming you have a "lint" script in your package.json
          - name: Run Unit Tests
            run: npm test # Assuming you have a "test" script in your package.json
          - name: Build Artifact (Example)
            run: mkdir build && cp package.json build
    ```

2.  **`deploy-staging` Job**
    *   **Runs on:** `ubuntu-latest`
    *   **Trigger:**  This job runs only when a Pull Request is merged to the `main` branch.
    *   **Steps:**
        *   `Checkout`
        *   `Setup Node.js`
        *   `Deploy to Staging Environment` – This is where you'd use tools like SSH, Terraform, or a cloud deployment service to deploy the code to your staging environment.  This step needs to be customized heavily based on your deployment process.
        *   `Run Integration Tests` – (Highly recommended) Run integration tests against the staging environment.

    ```yaml
    jobs:
      deploy-staging:
        runs-on: ubuntu-latest
        needs: build # This job depends on the 'build' job completing successfully
        if: github.ref == 'refs/heads/main' # Only run on merge to main
        steps:
          - uses: actions/checkout@v
