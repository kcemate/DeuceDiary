# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-06T20:14:28.021100

Okay, let's craft a CI/CD pipeline specification using GitHub Actions. This will be a comprehensive example, covering key stages and considerations.  I'll provide a YAML file (`.github/workflows/main.yml`) with explanations and best practices.

**Understanding the Pipeline Stages**

A typical CI/CD pipeline for a modern web application (or similar) usually involves these stages:

1. **Code Checkout:**  Retrieving the source code from your repository.
2. **Linting & Formatting:**  Ensuring code style and quality.
3. **Unit Testing:**  Running automated tests to verify individual components.
4. **Build:**  Compiling code, creating artifacts (e.g., Docker images).
5. **Static Analysis (Optional):**  Analyzing code for potential security vulnerabilities or issues.
6. **Integration Testing:** Testing the interaction between different components.
7. **Deployment (Staging):** Deploying the application to a staging environment for user testing and further validation.
8. **Deployment (Production):** Deploying the application to the production environment.

**`.github/workflows/main.yml` (GitHub Actions Workflow File)**

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
          node-version: '16' # or your preferred Node.js version

      - name: Install Dependencies
        run: npm install  # or yarn install

      - name: Lint Code
        run: npm run lint # Assumes you have a lint script in your package.json

      - name: Run Unit Tests
        run: npm run test  # Assumes you have a test script in your package.json

      - name: Build Application
        run: npm run build # Assumes you have a build script in your package.json

      # (Optional) Static Analysis -  example with SonarQube
      #- name: SonarQube Analysis
      #  uses: sonarsource/sonarcloud-action@v1
      #  with:
      #    token: ${{ secrets.SONARQUBE_TOKEN }}
      #    projectKey: your-project-key # Replace with your SonarQube project key


  deploy_staging:
    runs-on: ubuntu-latest
    needs: build_and_test  # Ensures build_and_test completes successfully
    if: github.ref == 'refs/heads/main' # Only deploy from main branch
    strategy:
      matrix:
        environment: ['staging1', 'staging2']  # Define staging environments

    steps:
      - name: Deploy to Staging
        if: matrix.environment == 'staging1'
        uses: actions/deploy-pages@v2
        with:
          # This deploys files to the Github Pages website
          # This is a simple example.  You'll likely need to adapt this
          # to your specific deployment strategy.
          # You might use cloud infrastructure like AWS, Azure, or Google Cloud.
          github-token: ${{ secrets.GITHUB_TOKEN }}

  # Production Deployment (Example - Requires a more sophisticated setup)
  deploy_production:
    runs-on: ubuntu-latest
    needs:
