# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T16:13:49.116403

Okay, here's a comprehensive CI/CD pipeline specification using GitHub Actions, designed to be adaptable to various projects.  I'll break down the steps, provide the YAML configuration, and explain the rationale behind each choice.

**Pipeline Overview:**

This pipeline focuses on:

*   **Build:**  Ensures the code compiles and is built correctly.
*   **Test:**  Runs unit tests and (optionally) integration tests.
*   **Static Analysis:** Performs static code analysis to identify potential issues.
*   **Deployment (to a Staging Environment):**  Deploys the built artifact to a staging environment.
*   **Automatic Promotion (To Production - Conditional):**  If tests and approvals pass, promotes to production.

**YAML Configuration (`.github/workflows/ci-cd.yml`):**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main  # Trigger on pushes to the main branch
  pull_request:
    branches:
      - main  # Trigger on pull requests to the main branch

jobs:
  build_and_test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18' # Or your preferred Node.js version

      - name: Install Dependencies
        run: npm install

      - name: Run Tests
        run: npm test

      - name: Run Linting
        run: npm run lint  # Assuming you have a linting script in your package.json

      - name: Build (if applicable)
        run: npm run build  # Replace with your build command

  deploy_staging:
    runs-on: ubuntu-latest
    needs: build_and_test
    steps:
      - name: Deploy to Staging
        # This step requires configuration specific to your staging environment.
        # Example (using SSH - adjust for your deployment method):
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.STAGING_HOST }}
          username: ${{ secrets.STAGING_USERNAME }}
          key: ${{ secrets.STAGING_KEY }}
          script: |
            # Replace with your deployment commands.  Example:
            npm install
            npm run build
            # Add commands to deploy to your staging server
            scp -r ./dist/* ${{ secrets.STAGING_USER }}@${{ secrets.STAGING_HOST }}:/var/www/staging

  promote_to_production:
    runs-on: ubuntu-latest
    needs: deploy_staging
    environment: production #This triggers a manual approval step
    steps:
      - name: Manual Approval
        run: |
          echo "Please approve this deployment before proceeding to production."
          # You'd likely integrate this with a checklist or a tool to manage approvals.
          # Example:  Add a condition to the workflow that fails if the environment variable "PRODUCTION_APPROVED" is not set.

      - name: Deploy to Production
        # Replace with your production deployment commands
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.PRODUCTION_HOST }}
          username: ${{ secrets.PRODUCTION_USERNAME }}
          key: ${{ secrets.PRODUCTION_KEY }}
          script: |
            # Replace with your production deployment commands
            npm install
            npm run build
            # Add commands to deploy to your production server
            scp -
