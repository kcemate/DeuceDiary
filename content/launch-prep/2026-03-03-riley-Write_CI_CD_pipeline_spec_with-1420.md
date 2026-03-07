# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T14:20:28.378258

Okay, here's a comprehensive CI/CD pipeline specification using GitHub Actions, designed to be adaptable and well-documented. This example focuses on a basic workflow but can be easily expanded upon.

**Pipeline Name:** `CI-CD-Pipeline`

**Trigger:** GitHub Actions will trigger this pipeline automatically on:

*   **Push to all branches:**  This triggers the entire pipeline every time code is pushed.
*   **Pull Request Creation:** Triggers a faster, less resource-intensive pipeline on pull request creation.

**Workflow YAML (Example: `workflows/ci-cd.yml`)**

```yaml
name: CI-CD-Pipeline

on:
  push:
    branches:
      - '*'  # Trigger on all branches
  pull_request:
    branches:
      - '*'

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18' # Or your preferred Node.js version

      - name: Install dependencies
        run: npm install  # Or yarn install or your preferred package manager

      - name: Run linters
        run: npm run lint #  Assuming you have a linting script in your package.json

      - name: Run unit tests
        run: npm test  # Assuming you have a test script in your package.json

      - name: Build (Example - Web App)
        run: npm run build # Or your build command (e.g., `yarn build`)


  deploy-staging:
    needs: build-and-test
    runs-on: ubuntu-latest
    environment: staging  # This name is important for GitHub Environments
    if: github.ref == 'refs/heads/main'  # Only deploy from the main branch
    steps:
      - name: Deploy to Staging (Example - AWS S3)
        uses: aws-actions/aws-cli@master
        with:
          aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          args: s3 sync --delete ./dist s3://your-staging-bucket  # Adjust to your deployment method


  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production  # This name is important for GitHub Environments
    if: github.ref == 'refs/heads/main' # Only deploy from the main branch
    steps:
      - name: Deploy to Production (Example - AWS S3)
        uses: aws-actions/aws-cli@master
        with:
          aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          args: s3 sync --delete ./dist s3://your-production-bucket # Adjust to your deployment method
```

**Explanation and Key Considerations:**

1.  **`on:` Section:**
    *   Specifies the events that trigger the workflow.  We're using both `push` (on all branches) and `pull_request` events.
2.  **`jobs:` Section:**
    *   Defines the individual jobs within the workflow.
    *   **`build-and-test:`**  This job performs the core build and testing steps.
    *
