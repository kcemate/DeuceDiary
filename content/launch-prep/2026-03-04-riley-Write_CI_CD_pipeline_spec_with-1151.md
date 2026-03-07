# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-04T11:51:45.539737

Okay, here's a comprehensive CI/CD pipeline specification using GitHub Actions, along with explanations and considerations. This is a starting point; you'll need to adapt it to your specific project's needs.

**Pipeline Name:** `ci-cd`

**Trigger:**  "Every push to all branches"  (You can refine this - e.g., only trigger on `main` or `develop`)

**Workflow File:** `workflows/ci-cd.yml`

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - '*'  # Trigger on all branches (adjust as needed)
  pull_request:
    branches:
      - '*'  # Trigger on all branches for PRs

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js (or your language)
        uses: actions/setup-node@v3
        with:
          node-version: '16'  # Or your desired Node.js version
          cache: 'npm'

      - name: Install dependencies
        run: npm install  # Or yarn install or your package manager

      - name: Lint code
        run: npm run lint # Assuming you have a lint script in your package.json

      - name: Test code
        run: npm run test  # Assuming you have a test script in your package.json

      - name: Build (if applicable)
        run: npm run build # Example for React, Vue, etc.  Adjust as needed.


  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    environment: staging  #Define your environment
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Staging Server
        uses: appleypress/deploy@v4  # Or your preferred deployment tool
        with:
          appDir: ./public  # Adjust to your project's build output directory
          project: my-project # Your project name
          serverUser: ${{ secrets.STAGING_SERVER_USER }}
          serverPass: ${{ secrets.STAGING_SERVER_PASSWORD }}
          serverHost: ${{ secrets.STAGING_SERVER_HOST }}
          deployType: static  # static, drag_drop, etc.

  deploy-production:
    needs: build
    runs-on: ubuntu-latest
    environment: production #Define your environment
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Production Server
        uses: appleypress/deploy@v4
        with:
          appDir: ./public
          project: my-project
          serverUser: ${{ secrets.PRODUCTION_SERVER_USER }}
          serverPass: ${{ secrets.PRODUCTION_SERVER_PASSWORD }}
          serverHost: ${{ secrets.PRODUCTION_SERVER_HOST }}
          deployType: static

```

**Key Components & Explanation:**

1.  **`on`**:  This section defines when the workflow should be triggered.
    *   `push`:  Runs the `build` job whenever code is pushed to any branch.
    *   `pull_request`: Runs the `build` job whenever a pull request is created or updated.

2.  **`jobs`**: Defines the individual jobs that make up the pipeline.
    *   **`build`**:  This job performs the core development tasks:
        *   `Checkout code`:  Fetches the latest version of your repository.
