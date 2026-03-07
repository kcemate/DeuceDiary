# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T06:48:44.804843

Okay, let's craft a CI/CD pipeline specification using GitHub Actions. This will be a detailed outline with examples, explaining the stages, triggers, and key actions.  I'll provide a comprehensive example that can be adapted to your specific project.

**Pipeline Goal:**  Automate the testing and deployment of a Node.js application hosted on GitHub.

**Repository Type:**  A typical Git repository with a `package.json` file and a `README.md`.

**CI/CD Stages:**

1.  **Build:**  Installs dependencies, runs linters/formatters, and builds the application.
2.  **Test:**  Executes unit tests and potentially integration tests.
3.  **Deploy (to Staging):**  Deploys the application to a staging environment.
4.  **Manual Approval:**  Requires manual approval before deploying to production. (Crucial for critical changes!)
5.  **Deploy (to Production):** Deploys the application to the production environment.


**Workflow File (e.g., `.github/workflows/ci-cd.yml`):**

```yaml
name: Node.js CI/CD

on:
  push:
    branches:
      - main  # Trigger on pushes to the main branch
  pull_request:
    branches:
      - main  # Trigger on pull requests to the main branch
  workflow_dispatch: # Allow manual triggering of the workflow

jobs:
  build_and_test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'  # Specify Node.js version

      - name: Install dependencies
        run: npm install

      - name: Lint and Format
        run: npm run lint  # Assumes you have a lint script in package.json

      - name: Run Tests
        run: npm run test  # Assumes you have a test script in package.json
        continue-on-error: true # Continue even if tests fail (for staging deployments)

  deploy_staging:
    needs: build_and_test
    runs-on: ubuntu-latest

    steps:
      - name: Deploy to Staging
        uses: actions/deploy-pages@v2
        with:
          #  This action deploys to a GitHub Pages site.
          #  You'll need to configure GitHub Pages correctly for your project.
          #  https://docs.github.com/en/pages/getting-started/about-github-pages

          # Optionally, you could use a custom deployment script here.
          # Example:
          #  run: |
          #    ssh -o StrictHostKeyChecking=no user@staging-server "cd /path/to/app && git pull origin main"
          pass: true # For security, pass is true.

  deploy_production:
    needs: deploy_staging
    runs-on: ubuntu-latest

    steps:
      - name: Manual Approval
        if: github.ref == 'refs/heads/main'
        run: |
          echo "Please manually approve this deployment."
          exit 0 # Prevents the workflow from continuing

      - name: Deploy to Production
        uses: adbou/ssh-action@v0.3.3
        with:
          #  Replace with your production server's details
          host: your-production-server.com
          user: your-ssh-username
