# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T20:22:41.972435

Okay, here's a CI/CD pipeline specification for GitHub Actions, designed for a relatively standard scenario.  This is a starting point and will need customization based on your specific project, repository structure, testing framework, and deployment environment.

**Pipeline Name:** `ci-cd`

**Trigger:**  "Every push to all branches" (or a specific branch like `main` for production deployments)

**Workflow File:** `workflows/ci-cd.yml` (This file defines the entire pipeline)

```yaml
name: CI/CD

on:
  push:
    branches:
      - main # Or your production branch
  pull_request:
    branches:
      - main

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18' # Or your preferred Node.js version

      - name: Install dependencies
        run: npm install

      - name: Run Tests
        run: npm test

      - name: Build (if applicable)
        run: npm run build # Or your build command

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build-and-test
    environment:
      name: staging
      url: ${{ secrets.STAGING_URL }}  # Link to your staging environment
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy to Staging
        run: |
          # Replace with your staging deployment commands
          echo "Deploying to staging..."
          # Example: npm run deploy:staging
          # Or use deployment tools like rsync, SSH, or a CI/CD platform
          #  Example (using rsync - replace with your actual credentials):
          #   rsync -avz ./dist/ user@staging-server.com:/var/www/your-app/

  deploy-production:
    runs-on: ubuntu-latest
    needs: build-and-test
    environment:
      name: production
      url: ${{ secrets.PRODUCTION_URL }}
    if: github.ref == 'refs/heads/main' # Only deploy from main branch
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy to Production
        run: |
          # Replace with your production deployment commands
          echo "Deploying to production..."
          # Example: npm run deploy:production
          # Or use deployment tools like rsync, SSH, or a CI/CD platform
          # Example (using rsync - replace with your actual credentials):
          # rsync -avz ./dist/ user@production-server.com:/var/www/your-app/
```

**Explanation and Key Considerations:**

* **`on:`:** This section defines the triggers for the workflow.
    * `push`:  Runs the workflow whenever code is pushed to any branch. This is essential for initial builds and tests.
    * `pull_request`: Runs the workflow whenever a pull request is created or updated. This allows for PR testing *before* merging to the main branch.
* **`jobs:`:** Defines the individual jobs within the workflow.
    * **`build-and-test`:**
        * `runs-on: ubuntu-latest`:  Specifies the runner environment.  Choose the environment that best suits your application (e.g., `macos-latest`, `windows
