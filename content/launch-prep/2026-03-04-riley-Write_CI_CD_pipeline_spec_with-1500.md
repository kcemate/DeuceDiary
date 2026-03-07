# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-04T15:00:50.421587

Okay, here's a comprehensive CI/CD pipeline specification using GitHub Actions, covering a common scenario. This includes stages for building, testing, and deploying to various environments.  I'll break it down with explanations and YAML code.

**Scenario:**  A simple Node.js application hosted on GitHub, aiming for automated testing and deployment to a staging and production environment.

**Pipeline Stages:**

1. **Build:**  Install dependencies and build the application (e.g., `npm install` and `npm run build`).
2. **Test:** Run unit tests and potentially integration tests.
3. **Lint/Format:**  Check code style and formatting.
4. **Staging Deployment:** Deploy the build to a staging environment.
5. **Production Deployment:** Deploy the build to the production environment.

**GitHub Actions Workflow YAML (`.github/workflows/ci-cd.yml`)**

```yaml
name: Node.js CI/CD

on:
  push:
    branches:
      - main  # Trigger on pushes to the 'main' branch
  pull_request:
    branches:
      - main  # Trigger on pull requests to the 'main' branch

jobs:
  build_and_test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18' # Or your preferred Node.js version

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Lint and Format
        run: npm run lint  # Assumes you have a 'lint' script in your package.json

  deploy_staging:
    needs: build_and_test # This job depends on the 'build_and_test' job
    runs-on: ubuntu-latest
    environment: staging #  This allows GitHub to manage the staging environment
    if: github.ref == 'refs/heads/main' # Only run on main branch pushes
    steps:
      - name: Deploy to Staging
        uses: actions/deploy-pages@v2
        with:
          # You'll need to configure your deployment script or method here
          # This is just an example, customize it to your needs
          deploy_production_token: ${{ secrets.STAGING_DEPLOYMENT_TOKEN }}  # Replace with your secret
          #  If you are using a specific deployment tool, you might use:
          #  deployment_options: >
          #    environment=staging
          #    path=/path/to/deploy/
          #    strategy=rsync

  deploy_production:
    needs: build_and_test # This job depends on the 'build_and_test' job
    runs-on: ubuntu-latest
    environment: production # This allows GitHub to manage the production environment
    if: github.ref == 'refs/heads/main' # Only run on main branch pushes
    steps:
      - name: Deploy to Production
        uses: actions/deploy-pages@v2
        with:
          deploy_production_token: ${{ secrets.PRODUCTION_DEPLOYMENT_TOKEN }}  # Replace with your secret
          #  If you are using a specific deployment tool, you might use:
          #  deployment_options: >
          #    environment=production
          #    path=/path/to/deploy/
          #    strategy=rsync
```

**Explanation & Key Considerations:**

* **`name`:**
