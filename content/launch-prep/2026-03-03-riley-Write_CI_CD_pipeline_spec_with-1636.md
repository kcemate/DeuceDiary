# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T16:36:25.980015

Okay, here's a CI/CD pipeline specification using GitHub Actions, designed to be a good starting point.  I'll break it down into sections, explain the purpose of each step, and provide a YAML configuration file you can adapt.

**Goal:** This pipeline automates building, testing, and deploying a simple Node.js application to a GitHub Pages site.  This is a practical example that you can easily modify to fit your own project.

**Assumptions:**

*   You have a GitHub repository with a Node.js application.
*   You have a GitHub Pages site configured (either through a branch or a custom domain).
*   You have a basic understanding of Node.js and GitHub Actions.

**Pipeline Stages:**

1.  **`setup-node`:**  Installs Node.js and npm.
2.  **`npm install`:** Installs project dependencies.
3.  **`build`:**  Builds the application (e.g., transpile TypeScript, bundle JavaScript).
4.  **`test`:**  Runs unit tests.
5.  **`deploy-pages`:**  Deploys the built application to GitHub Pages.

**YAML Configuration (`.github/workflows/ci-cd.yml`)**

```yaml
name: Node.js CI/CD

on:
  push:
    branches:
      - main # Trigger on pushes to the main branch
  pull_request:
    branches:
      - main

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18' # Or your desired Node.js version

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build # Adjust this to your build command

      - name: Run tests
        run: npm test # Adjust this to your test command

  deploy-to-pages:
    needs: build-and-test # Make sure build-and-test completes successfully
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        uses: actions/deploy-github-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          branch: main # Or your deployment branch
          directory: ./dist # Or the directory where your built files are
          enable_pages: true
          setup_git_url: git@github.com:${{ github.repository }}.git # Use SSH for authentication
```

**Explanation:**

*   **`name`**:  A descriptive name for the workflow.
*   **`on`**: Defines when the workflow runs.
    *   `push`:  Triggers the workflow on pushes to the `main` branch.
    *   `pull_request`: Triggers the workflow on pull requests to the `main` branch.
*   **`jobs`**:  Defines the individual jobs that make up the workflow.
    *   **`build-and-test`**:
        *   `runs-on`: Specifies the runner environment (Ubuntu in this case).
        *   `steps`: A sequence of tasks to perform.
            *   `actions/checkout@v3`: Checks out your repository code.
            *   `actions/setup-node@v3`:  Sets up a Node.js environment.
            *   `npm install`: Installs project dependencies.
            *   `npm run build
