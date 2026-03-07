# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T19:14:46.475345

Okay, let's craft a detailed CI/CD pipeline specification using GitHub Actions. This will cover the key stages, actions, and configurations you'd need to automate your software delivery process.

**Pipeline Name:** `my-project-ci-cd` (Replace with your project's name)

**Trigger:** GitHub Actions will automatically run this pipeline on every push to the `main` branch, pull requests targeting `main`, and scheduled runs (if configured).

**Stages:**

1. **Build:**
   * **Purpose:** Compile the code, run linters, and potentially build any necessary artifacts.
   * **Actions:**
     * `actions/checkout@v3`: Checks out your repository.
     * `node/setup-node@v3` (If using Node.js): Sets up the Node.js environment.
     * `node/install-packages@v3` (If using Node.js): Installs dependencies from `package.json`.
     * `npm/run-script@v0.3.3`:  Runs specified npm scripts (e.g., `npm test`, `npm build`). Replace `npm` with `yarn` or `pnpm` if you use them.
     * `hadolint/hadolint@3`:  Runs Hadolint to check Dockerfile best practices (if using Docker).
   * **Environment Variables:**
     * `NODE_VERSION`:  Specify your Node.js version (e.g., `18`, `20`).  Default to `node` if not set.
   * **Artifacts:**  None directly, but the build output (e.g., `dist` folder, compiled binaries) should be placed in the repository.  (You'll need to configure this in the `build` step).

2. **Test:**
   * **Purpose:**  Execute automated tests to ensure code quality and functionality.
   * **Actions:**
     * `actions/checkout@v3`:  (Re-check out the repository).
     * `node/setup-node@v3` (If using Node.js): (Re-setup Node.js).
     * `node/install-packages@v3` (If using Node.js): (Re-install packages).
     * `npm/run-script@v0.3.3`: Runs tests using `npm test`.
     * `jest/jest@v28.1.0` (If using Jest): Runs Jest tests.
     * `cypress/cypress@v10.11.0` (If using Cypress):  Runs Cypress tests.  (Configure Cypress for headless mode).
   * **Environment Variables:**
     * `NODE_VERSION`: Same as in the Build stage.
   * **Failure Handling:**  Fail the pipeline if any tests fail.

3. **Package/Publish (Production):**
   * **Purpose:**  Create a package (e.g., a `.zip` file, a `.tar.gz` archive) and upload it to a package registry.
   * **Actions:**
     * `actions/checkout@v3`: (Re-check out the repository).
     * `node/setup-node@v3` (If using Node.js): (Re-setup Node.js).
     * `node/install-packages@v3` (If using Node.js): (Re-install packages).
     * `npm/run-script@v0.3.3`: Runs a script to build the package (e.g., `npm run package`).  This might create the archive file.
     * `actions/upload-artifact@v3`:  Uploads the created package as an
