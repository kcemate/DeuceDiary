# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-04T05:49:04.713652

Okay, here's a comprehensive CI/CD pipeline specification using GitHub Actions, along with explanations and best practices.  This example focuses on a common scenario – a Node.js project, but you can easily adapt it to other languages and frameworks.

**Pipeline Name:** `my-node-project-ci-cd`

**Description:**  Automates build, test, and deployment of my-node-project.

**Triggers:**

*   **Push to `main` branch:**  Triggers the entire pipeline on every push to the main branch (for code changes).
*   **Pull Request Creation:**  Triggers a *specific* test run when a pull request is created.
*   **Pull Request Updates:** Triggers a *specific* test run when a pull request is updated.

**Jobs:**

The pipeline will have several jobs, executed sequentially.

1.  **`build` Job:**
    *   **Name:** Build
    *   **Runs on:** `ubuntu-latest` (or your preferred OS)
    *   **Steps:**
        *   `Checkout` - Checks out the code from the repository.
        *   `Setup Node.js with Actions Cache` - Uses the GitHub Actions cache to speed up subsequent builds by reusing previously downloaded dependencies.
        *   `Install Dependencies` - Runs `npm install` or `yarn install` to install project dependencies.
        *   `Build` - (Optional) Runs any build commands specific to your project (e.g., `npm run build` for React or Angular).
        *   `Store Build Artifacts` - Stores the built output (e.g., `dist` directory, compiled files) in a GitHub Actions artifact. This artifact will be used in the deployment job.
    *   **Artifacts:**  `build-artifacts` (This name is important for the deployment job)

2.  **`test` Job:**
    *   **Name:** Test
    *   **Runs on:** `ubuntu-latest`
    *   **Dependencies:** Depends on the `build` job (using `needs: build`).
    *   **Steps:**
        *   `Checkout` - Checks out the code from the repository.
        *   `Setup Node.js with Actions Cache`
        *   `Install Dependencies`
        *   `Run Tests` - Runs your unit tests using `npm test` or `yarn test`.
        *   **Failure Handling:** If tests fail, the job fails, and the pipeline stops.

3.  **`deploy` Job (for Production):**
    *   **Name:** Deploy to Production
    *   **Runs on:** `ubuntu-latest` (or your deployment environment's OS)
    *   **Requires:** Depends on the `build` and `test` jobs (using `needs: build, test`).
    *   **Secrets:** This job needs secrets to access your deployment environment (e.g., API keys, server credentials). *Never* commit secrets directly to your repository.  Configure these secrets in GitHub under *Settings -> Secrets*.
    *   **Steps:**
        *   `Checkout` - Checks out the code from the repository.
        *   `Setup Node.js with Actions Cache`
        *   `Deploy` - This is where you'll add the commands to deploy your application.  Example for a simple Node.js app on Heroku:
            ```bash
            # Assuming you have your Heroku CLI installed and configured
            heroku --version
            heroku login # You'll be prompted to log in
            heroku git:remote -a <your-heroku-app-name>
            git push heroku main
            heroku open
            ```
        *
