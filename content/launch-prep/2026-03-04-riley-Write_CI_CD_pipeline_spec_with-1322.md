# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-04T13:22:37.278871

Okay, here's a detailed CI/CD pipeline spec using GitHub Actions, designed to be a solid starting point. This example focuses on a Node.js project, but you can easily adapt it to other languages and frameworks.

**Pipeline Name:** `nodejs-ci-cd`

**Repository:**  (Replace with your GitHub repository URL)  `https://github.com/your-username/your-repo`

**Triggers:**

*   **Push to all branches:**  This pipeline will automatically run whenever you push code to any branch.
*   **Pull Request Creation:** This pipeline will run when a Pull Request is opened.
*   **Pull Request Updates:** This pipeline will run when a Pull Request is updated.

**Stages & Jobs:**

This pipeline will have three main stages:  `build`, `test`, and `deploy`.

**1. `build` Stage:**

*   **Job Name:** `build`
*   **Image:** `node:16-alpine` (or your preferred Node.js version)
*   **Steps:**
    *   `Checkout` - Checks out the code from the repository.
    *   `Setup Cache` -  (Optional, but recommended for faster builds):
        *   `cache key`: `package-lock.json` (or `yarn.lock` if you use Yarn)
        *   `restore keys`: `package-lock.json`
    *   `Install Dependencies` - `npm install` or `yarn install`
    *   `Build` -  (Example for a JavaScript project):  `npm run build` (This would run your build script. Adapt as needed).
    *   `Store Artifacts` - Stores the build output (e.g., `dist` folder, bundled files) as an artifact.
        *   `name`: `build-artifacts`
        *   `path`: `dist` (or the directory where your build output is).  You can use a glob pattern if needed (e.g., `dist/**`).

**2. `test` Stage:**

*   **Job Name:** `test`
*   **Image:** `node:16-alpine`
*   **Concurrency:** `cancel-on-fail` (To prevent cascading failures)
*   **Steps:**
    *   `Checkout` - Checks out the code from the repository.
    *   `Setup Cache` - (same as build stage)
    *   `Install Dependencies` - `npm install` or `yarn install`
    *   `Run Tests` - `npm test` or `yarn test`  (Run your test suite).  Make sure your `package.json` has a `test` script defined.
    *   `Upload Test Results` - (Optional, but recommended):
        *   `name`: `test-results`
        *   `path-patterns`: `coverage/lcov.json`, `coverage/junit.xml` (Adjust these paths based on your test framework's output)

**3. `deploy` Stage:**

*   **Job Name:** `deploy`
*   **Image:** `ubuntu:latest` (or your preferred deployment image)
*   **Strategy:**  "Service Endpoint" (for deploying to a service like AWS Elastic Beanstalk or Heroku) or "Deploy Status" (for manual deployment)
*   **Steps:**
    *   `Checkout` - Checks out the code from the repository.
    *   `Setup SSH Key` - (If deploying to a server): This is crucial! You need to configure a Deploy Key in your GitHub repository settings.
        *   `secrets`: `SSH_PRIVATE_KEY` (This secret holds the
