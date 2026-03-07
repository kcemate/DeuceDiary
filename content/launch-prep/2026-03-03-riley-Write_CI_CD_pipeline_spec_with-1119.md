# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T11:19:09.303419

Okay, let's outline a comprehensive CI/CD pipeline using GitHub Actions. This specification will cover a typical workflow, but you'll need to adapt it to your specific project's needs and dependencies.

**Pipeline Name:** `my-project-ci-cd` (Replace with your project's name)

**Trigger:**  "Every push to all branches" (This is a common starting point - you can refine it later to trigger specific branches like `main` or `develop`)

**Overall Strategy:** This pipeline will perform the following stages:

1.  **Build:**  Compile the code (if necessary), potentially run linters, and produce an executable artifact.
2.  **Test:** Run unit tests, integration tests, and possibly end-to-end tests.
3.  **Static Analysis:**  Perform code quality checks using tools like SonarQube (or your preferred tool).
4.  **Deploy:**  Deploy the artifact to a specified environment (e.g., staging, production).

**GitHub Actions Workflow File (`.github/workflows/my-project-ci-cd.yml`):**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main  # Or your primary development branch
  pull_request:
    branches:
      - main  # Or your primary development branch

jobs:
  build_and_test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js 18
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm install  # Or yarn install

      - name: Run linters
        run: npm run lint  # Adjust command based on your project's linting setup

      - name: Run tests
        run: npm test  # Or yarn test

      - name: Run static analysis
        uses: w9jds/sonar-scanner-action@v1
        with:
          sonarProjectKey: 'your-sonar-project-key' # Replace
          sonarProjectRole: 'PROVIDER'
          globPatterns: 'src/**/*' # Adjust based on where your code is
          token: ${{ secrets.SONARQUBE_TOKEN }} # Store your SonarQube token as a GitHub Secret

  deploy_staging:
    runs-on: ubuntu-latest
    needs: build_and_test # Ensure build_and_test completes successfully
    if: github.ref == 'refs/heads/main' # Only deploy from main branch
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Staging
        # This section would contain your deployment commands
        # Example (using SSH):
        run: |
          ssh -o StrictHostKeyChecking=no user@staging-server "cd /path/to/app && git pull && npm install && npm run build"
        # Alternatively, use cloud deployment tools (e.g., AWS CodeDeploy, Azure DevOps)
        # using their respective actions.

  deploy_production:
    runs-on: ubuntu-latest
    needs: build_and_test
    if: github.ref == 'refs/heads/main'
    #  This is the most complex part - automate your production deployment
    #  This requires credentials for your production environment (e.g., AWS IAM role, Azure Service Principal)
    steps:
      - name: Deploy to Production
        #  Replace with your
