# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-04T02:47:45.171068

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
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18  # Specify the Node.js version

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Build project
        run: npm run build  # Assuming you have a build script defined in package.json

      - name: Upload coverage report
        uses: actions/upload-artifact@v3
        with:
          name: coverage-report
          path: coverage/ # Adjust this if your coverage report is in a different directory

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build-and-test  # This job depends on the build-and-test job
    environment: staging  # Specify the deployment environment
    if: github.ref == 'refs/heads/main'  # Deploy only from the main branch
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Staging (using SSH)
        uses: appleboy/ssh-action@v1.1.3 # Use a pre-built action for SSH
        with:
          host: ${{ secrets.STAGING_HOST }}
          username: ${{ secrets.STAGING_USERNAME }}
          key: ${{ secrets.STAGING_SSH_KEY }}
          script: |
            echo "Deploying to staging..."
            # Replace with your actual deployment commands
            npm install
            npm run build
            # Example: Copy the built files to the staging server
            scp -r ./dist/* ${{ secrets.STAGING_USER }}@${{ secrets.STAGING_HOST }}:${{ secrets.STAGING_DEPLOY_PATH }}

  deploy-production:
    runs-on: ubuntu-latest
    needs: build-and-test
    environment: production # Specify the deployment environment
    if: github.ref == 'refs/heads/main'  # Deploy only from the main branch
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Production (using SSH)
        uses: appleboy/ssh-action@v1.1.3
        with:
          host: ${{ secrets.PRODUCTION_HOST }}
          username: ${{ secrets.PRODUCTION_USERNAME }}
          key: ${{ secrets.PRODUCTION_SSH_KEY }}
          script: |
            echo "Deploying to production..."
            # Replace with your actual deployment commands
            npm install
            npm run build
            # Example: Copy the built files to the production server
            scp -r ./dist/* ${{ secrets.PRODUCTION_USER }}@${{ secrets.PRODUCTION_HOST }}:${{ secrets.PRODUCTION_DEPLOY_PATH }}
```

**Explanation and Key Improvements:**

1. **`on:` Section:**
   - `push` and `pull_request`:  This pipeline triggers on both pushes to the `main` branch *and* pull requests targeting the `main` branch. This allows for continuous integration during development and testing.

2. **`jobs:` Section:**
   -
