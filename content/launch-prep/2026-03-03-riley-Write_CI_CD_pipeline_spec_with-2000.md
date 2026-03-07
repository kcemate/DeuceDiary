# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T20:00:08.705907

Okay, let's craft a comprehensive CI/CD pipeline specification using GitHub Actions, covering several stages with explanations and best practices.

**Pipeline Name:** `my-project-ci-cd` (Replace with your project's name)

**Trigger:**  GitHub Actions triggered on pushes to all branches and pull requests.

**Overall Workflow:**

The pipeline will be structured into these key stages:

1.  **Setup:** Install required tools (Node.js, Python, etc.)
2.  **Linting & Formatting:**  Check code style and quality.
3.  **Unit Tests:**  Run automated unit tests.
4.  **Build:**  Compile or package your application.
5.  **Static Analysis (Optional):**  Analyze code for vulnerabilities and potential issues.
6.  **Deployment (to Staging/Production):** Deploy the built artifact to a staging or production environment.

**Workflow YAML (Example - `workflow.yml`)**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - '*'  # Trigger on all branches
  pull_request:
    branches:
      - '*' # Trigger on all branches

jobs:
  build_and_test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node_version: [16.x, 18.x, 20.x] # Test with multiple Node versions

    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node_version }}

      - name: Install Dependencies
        run: npm install

      - name: Lint Code
        run: npm run lint  # Assumes you have a 'lint' script in your package.json

      - name: Run Unit Tests
        run: npm run test  # Assumes you have a 'test' script in your package.json

      - name: Build Application
        run: npm run build  # Your build command.  (e.g., webpack, Parcel, etc.)
  deploy_staging:
    needs: build_and_test
    if: github.ref == 'refs/heads/main'  # Only deploy from the main branch
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Staging
        uses: actions/deploy-pages@v2
        with:
          name: staging-deploy
          path: ./docs  # Adjust this to the directory containing your deployment files
          environment: staging
  deploy_production:
    needs: build_and_test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Production
        uses: adroll/deploy-action@v5.0.0 # Example deploy action.  Replace with your preferred method.
        with:
          app-name: my-production-app
          app-token: ${{ secrets.PRODUCTION_DEPLOY_TOKEN }} # Securely store your deployment token
          target-env: production
```

**Explanation and Key Considerations:**

*   **`on`:**  Defines the triggers for the workflow. `push` and `pull_request` triggers ensure it runs whenever code is pushed or a PR is created.
*   **`jobs`:** Groups steps into independent jobs.
*   **`strategy.matrix`:**  This is powerful for testing compatibility across different Node.js versions. You can add other matrices for
