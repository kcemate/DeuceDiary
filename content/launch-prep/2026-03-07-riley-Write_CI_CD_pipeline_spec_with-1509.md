# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-07T15:09:56.537002

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main # Trigger on pushes to the main branch
  pull_request:
    branches:
      - main # Trigger on pull requests to the main branch

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18' # Or your desired Node.js version

      - name: Install Dependencies
        run: npm install

      - name: Run Tests
        run: npm test

      - name: Build (Example - Adjust for your project)
        run: npm run build

      - name: Upload Coverage Report (Optional)
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }} # Securely store your Codecov token
          directory: ./coverage # Adjust if your coverage reports are in a different location
          fail_ci_if_coverage_fails: true

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build-and-test  # Ensure build-and-test completes successfully before deploying
    environment: staging # This name is for the deployment environment
    if: github.ref == 'refs/heads/main' #  Only deploy from the main branch
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Deploy to Staging
        run: |
          # Replace with your actual deployment commands
          echo "Deploying to Staging..."
          # Example using SSH:
          # ssh user@staging-server "cd /path/to/app && git pull && npm install && npm run build"
          # Alternatively, use cloud deployment tools like Netlify, Vercel, etc.
          # You would typically use their CLI or APIs here.
          echo "Deployment complete"

  deploy-production:
    runs-on: ubuntu-latest
    needs: build-and-test
    environment: production # This name is for the production environment
    if: github.ref == 'refs/heads/main' # Only deploy from the main branch
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Deploy to Production
        run: |
          # Replace with your actual deployment commands
          echo "Deploying to Production..."
          # Example using SSH:
          # ssh user@production-server "cd /path/to/app && git pull && npm install && npm run build"
          # Alternatively, use cloud deployment tools like Netlify, Vercel, AWS, Azure, etc.
          # You would typically use their CLI or APIs here.
          echo "Deployment complete"
```

**Explanation and Key Components:**

1. **`name: CI/CD Pipeline`**:  The name of your GitHub Actions workflow.

2. **`on:`**:  Defines when the workflow will be triggered:
   - **`push`**: Triggers on pushes to branches (specified by `branches:`).  `
