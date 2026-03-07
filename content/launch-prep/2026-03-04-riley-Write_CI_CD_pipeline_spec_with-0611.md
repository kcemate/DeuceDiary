# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-04T06:11:40.383275

Okay, let's craft a CI/CD pipeline specification using GitHub Actions. This spec will cover a fairly standard setup for a web application, but you'll need to adapt it to your specific project's needs.

**Pipeline Name:** `ci-cd-pipeline`

**Repository:**  `[Your Repository Name]`

**Triggers:**

*   **Push to `main` branch:**  This will trigger the pipeline on every push to the main branch, initiating both CI and CD stages.
*   **Pull Request to `main` branch:**  This will trigger a separate pipeline for each pull request targeting the `main` branch.

**Stages:**

The pipeline will consist of three key stages:

1.  **Build (CI)**
2.  **Test (CI)**
3.  **Deploy (CD)**

**1. Build Stage (CI - Continuous Integration)**

*   **Name:** `Build`
*   **Runs on:** `ubuntu-latest` (or your preferred base image)
*   **Jobs:**
    *   `build`:
        *   **Steps:**
            1.  **Checkout:** `actions/checkout@v3` (fetches the repository code)
            2.  **Set up Node.js:** `actions/setup-node@v3` (or equivalent for your language/framework)
            3.  **Install Dependencies:** `npm install` (or `yarn install`, `pip install`, etc.)
            4.  **Build Application:**  This will depend on your application (e.g., `npm run build`, `mvn package`, `gradle build`).
            5.  **Store Artifact:** `actions/upload-artifact@v3`  (stores the build output - usually a `dist` or `build` folder, or compiled binaries).  Set `name` to `build-artifacts`.
*   **Outputs:**  The `build-artifacts` artifact will be used in the next stage.
*   **Failure Actions:**  If any step in this stage fails, the pipeline fails.

**2. Test Stage (CI - Continuous Integration)**

*   **Name:** `Test`
*   **Runs on:** `ubuntu-latest`
*   **Jobs:**
    *   `test`:
        *   **Steps:**
            1.  **Checkout:** `actions/checkout@v3` (Redundant but ensures code is checked out again for testing)
            2.  **Set up Node.js:** `actions/setup-node@v3`
            3.  **Install Dependencies:** `npm install`
            4.  **Run Tests:** `npm test` (or equivalent for your testing framework - e.g., `jest`, `mocha`, `pytest`).
*   **Inputs:**  Takes the `build-artifacts` artifact from the Build stage.
*   **Outputs:**  If all tests pass, the pipeline continues. If tests fail, the pipeline fails.

**3. Deploy Stage (CD - Continuous Delivery)**

*   **Name:** `Deploy`
*   **Runs on:**  `ubuntu-latest` (or a server image that allows you to deploy)
*   **Jobs:**
    *   `deploy`:
        *   **Steps:**
            1.  **Checkout:** `actions/checkout@v3` (Again, ensures code is checked out)
            2.  **Set up Node.js:** `actions/setup-node@v3`
            3.  **Install Dependencies:** `npm install`
            4.  **Deploy to Staging (Example):** This is the most customized step. This example shows deploying to a staging server.
                *   Use SSH or
