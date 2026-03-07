# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-04T04:40:56.952352

```yaml
name: CI/CD Pipeline - Automated Testing & Deployment

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
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'  # Specify Node.js version

      - name: Install Dependencies
        run: npm install

      - name: Run Tests
        run: npm test  # Assuming you have a 'test' script in your package.json

      - name: Build (Example - if applicable)
        run: npm run build #  Replace with your build command (e.g., `npm run build`)


  deploy-staging:
    runs-on: ubuntu-latest
    needs: build-and-test  # This job depends on the build-and-test job completing successfully
    if: github.ref == 'refs/heads/main'  # Only deploy when pushing to main

    steps:
      - name: Deploy to Staging Server (Example - using SSH)
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.STAGING_SERVER_HOST }}
          username: ${{ secrets.STAGING_SERVER_USERNAME }}
          key: ${{ secrets.STAGING_SERVER_PRIVATE_KEY }}
          script: |
            # Add your deployment script here.
            # This might include:
            # - SSH into the staging server
            # - Pull the latest code
            # - Run database migrations
            # - Restart the application server
            echo "Deploying to staging server..."
            # Example: npm install && npm run build && pm2 restart app  (Replace with your commands)


  deploy-production:
    runs-on: ubuntu-latest
    needs: build-and-test
    if: github.ref == 'refs/heads/main'  # Only deploy when pushing to main

    steps:
      - name: Deploy to Production Server (Example - using SSH)
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.PRODUCTION_SERVER_HOST }}
          username: ${{ secrets.PRODUCTION_SERVER_USERNAME }}
          key: ${{ secrets.PRODUCTION_SERVER_PRIVATE_KEY }}
          script: |
            # Add your deployment script here.
            # This might include:
            # - SSH into the production server
            # - Pull the latest code
            # - Run database migrations
            # - Restart the application server
            echo "Deploying to production server..."
            # Example: npm install && npm run build && pm2 restart app  (Replace with your commands)
```

**Explanation and Key Components:**

1. **`name`**:  A descriptive name for your CI/CD pipeline.

2. **`on`**:  This section defines when the workflow is triggered.
   - `push`:  Runs when code is pushed to the `main` branch (or any branch you specify).
   - `pull_request`: Runs when a pull request is created or updated targeting the `main` branch.

3. **`jobs`**:  This defines the individual jobs that make up the pipeline.
   - **`build-and-test`**:
     - `runs-on: ubuntu-latest
