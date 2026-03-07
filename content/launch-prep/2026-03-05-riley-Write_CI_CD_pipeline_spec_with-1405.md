# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-05T14:05:36.869652

Okay, let's craft a CI/CD pipeline specification for GitHub Actions. This will be a detailed spec outlining the stages, actions, and configurations needed to automate your build, test, and deployment process.  I'll focus on a fairly common scenario, but you can adapt this to your specific needs.

**Pipeline Name:** `main` (or whatever you want to call your primary pipeline)

**Trigger:** GitHub Events - "Every push to every branch" (This will trigger the pipeline on every code commit)

**General Considerations:**

*   **Environment Variables:**  Use GitHub Secrets (configured in your repository settings) for sensitive information like API keys, database passwords, and deployment credentials.  Never hardcode these in your workflow files.
*   **Caching:**  Leverage caching to speed up builds by storing dependencies and build artifacts.
*   **Parallelism:** Consider using parallel jobs to reduce overall pipeline execution time.
*   **Branching Strategy:** This pipeline is designed for the `main` branch, which is assumed to be the production branch.  You'll need separate pipelines for development and feature branches.
*   **Rollbacks:** For production deployments, consider strategies for rolling back to previous versions if necessary (e.g., using a deployment tool like Argo Rollouts with GitHub Actions).
*   **Logging and Monitoring:** Integrate logging and monitoring into your workflow to track progress and identify issues.

**Workflow File:** `workflows/main.yml` (This file will define the entire pipeline)

```yaml
name: CI/CD Pipeline - Main Branch

on:
  push:
    branches:
      - main  # Trigger on pushes to the main branch

  pull_request:
    branches:
      - main  # Trigger on pull requests to the main branch


jobs:
  build-and-test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node_version: [16.x, 18.x, 20.x]  # Test with multiple Node.js versions
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set Node.js version
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node_version }}

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build-and-test  # Ensure build-and-test has completed successfully
    if: github.ref == 'refs/heads/main'  # Only deploy from main branch
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Staging (Example using SSH)
        uses: appleypress/deploy-staging@v2 # Example Deployment Action. Adapt for your needs.
        with:
          appId: ${{ secrets.APP_ID }}
          apiToken: ${{ secrets.API_TOKEN }}
          projectDir: ./
          stagingServer: staging.example.com
          branch: main
          # Add any other necessary configuration for your deployment tool.
          # See appleypress/deploy-staging documentation for all available options.



  deploy-production:
    runs-on: ubuntu-latest
    needs: build-and-test, deploy-staging # Requires staging to be successful
    if: github.ref == 'refs/heads/main' # Only deploy from main
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Production (
