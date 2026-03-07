# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-04T10:21:13.640039

Okay, let's craft a CI/CD pipeline spec for GitHub Actions. This will be a detailed, configurable spec you can adapt to your project's needs.

**Pipeline Name:** `ci-cd-pipeline` (Adapt to your project)

**Trigger:**  `push` to all branches (or specific branches like `main`, `develop`)

**Workflow Name:** `run-build-test-deploy`

**Description:**  Automates the build, testing, and deployment of the project.

**Jobs:**

*   **`build`**
    *   **Runs on:** `ubuntu-latest` (or your preferred runner)
    *   **Steps:**
        *   `Checkout`:  `actions/checkout@v3` - Checks out the code from the repository.
        *   `Setup Node.js`: `actions/setup-node@v3` - Sets up Node.js with the desired version (e.g., `16`, `18`, `20`). You can specify the version with `--default-version`.
        *   `Install Dependencies`: `npm install` (or `yarn install`) - Installs the project's dependencies.
        *   `Build`:  This step depends on your project.  Examples:
            *   `npm run build` (for React, Vue, Angular)
            *   `mvn clean install` (for Maven Java projects)
            *   `gradle build` (for Gradle Java projects)
            *   `dotnet build` (for .NET projects)
        *   `Lint`: (Optional) `npm run lint` or equivalent - Runs a linter to enforce code style.
        *   `Code Quality Check`: (Optional)  Integration with tools like SonarQube, ESLint, etc.
*   **`test`**
    *   **Runs on:** `ubuntu-latest`
    *   **Depends on:** `build`
    *   **Steps:**
        *   `Checkout`: `actions/checkout@v3` (redundant but safe)
        *   `Setup Node.js`: `actions/setup-node@v3` (redundant but safe)
        *   `Install Dependencies`: `npm install` (or `yarn install`)
        *   `Run Tests`: `npm test` (or `yarn test`) - Executes the project's test suite.
        *   `Codecov`: (Optional)  Integrates with Codecov to upload test coverage reports.  Requires a Codecov account.
*   **`deploy`**
    *   **Runs on:** `ubuntu-latest`
    *   **Depends on:** `build` and `test`
    *   **Requires Checks:** `build` succeeds, `test` succeeds
    *   **Steps:**
        *   `Checkout`: `actions/checkout@v3`
        *   `Deploy to Staging`:
            *   (Example for AWS S3) `aws s3 sync ./dist s3://your-staging-bucket --delete`
            *   (Example for Netlify)  Use the Netlify CLI to deploy.
            *   (Example for Heroku)  Use the Heroku CLI to deploy.
        *   `Deploy to Production`:
            *   (Similar deployment steps as staging, but to your production environment.)  Important: Implement safeguards, such as approvals and pre-flight checks, before deploying to production.

**Secrets & Variables:**

| Secret Name          | Description                                   |
| --------------------- | --------------------------------------------- |
| `AWS_ACCESS_KEY_ID`   | AWS Access Key ID                           |
| `AWS_SECRET_ACCESS_
