# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-06T14:44:31.305897

Okay, let's create a CI/CD pipeline specification for GitHub Actions. This example focuses on a relatively straightforward workflow for a Node.js project, but the principles can be adapted to other languages and environments.

**Pipeline Specification: CI/CD for Node.js Project**

**Project:** (Assumed Node.js project with a `package.json` file)

**Repository:** `your-github-repo-name`

**Workflow Name:** `ci-cd`

**Triggers:**

*   **Push to all branches:** This will trigger the pipeline whenever code is pushed to any branch.
*   **Pull Request Creation:**  (Optional) - Can be added to trigger builds on PRs.  This example focuses on push triggers for simplicity.

**Jobs:**

The workflow is composed of two main jobs: `build` and `deploy`.

**1. `build` Job:**

*   **Name:** `build`
*   **Runs on:** `ubuntu-latest` (or your preferred Linux distribution)
*   **Steps:**

    1.  **Check out code:** `actions/checkout@v3`  -  This step clones your repository.

    2.  **Set up Node.js:** `actions/setup-node@v3` - Installs a specific Node.js version (e.g., `18`) based on your project's requirements.

    3.  **Install dependencies:** `npm ci` - Installs dependencies, using `package-lock.json` to ensure consistent installs.  `npm ci` is recommended for CI environments.

    4.  **Linting (Optional):** `npm run lint` -  Runs your project's linter to catch style issues.  You'll need to have a `lint` script defined in your `package.json`.

    5.  **Testing:** `npm test` - Runs your project's tests.  Make sure you have a `test` script in your `package.json`.  This step could also be configured to run specific test suites using environment variables.

    6.  **Build (if applicable):** `npm run build` - If your project requires a build step (e.g., using Webpack, Babel), execute it here.

    7.  **Upload Artifacts:** `actions/upload-artifact@v3` -  Uploads any generated artifacts (e.g., built JavaScript files, static assets) to be used in the deployment job.  This is crucial if the deployment needs these files.

*   **Concurrency:**  (Optional)  If you have multiple build steps, you can configure concurrency to limit the build time.



**2. `deploy` Job:**

*   **Name:** `deploy`
*   **Runs on:** `ubuntu-latest` (or your preferred Linux distribution)
*   **Requires:** `build` - This job depends on the successful completion of the `build` job.
*   **Steps:**

    1.  **Download Artifacts:** `actions/download-artifact@v3` - Downloads the artifacts created by the `build` job.

    2.  **Deploy (Example - Netlify):**  This section uses the `netlify/cli` action to deploy to Netlify.  Adapt this to your deployment target (e.g., AWS S3, Google Cloud Storage, Heroku, etc.).

        ```yaml
        - name: Deploy to Netlify
          uses: netlify/actions/cli@v2
          with:
            netlify-site-id: ${{ secrets.NETLIFY_SITE_ID }}
            netlify-auth-token: ${{ secrets.NETLIFY_AUTH_TOKEN }}
            production-branch:
