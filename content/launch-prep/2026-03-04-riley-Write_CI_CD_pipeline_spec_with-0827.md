# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-04T08:27:38.401413

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
          node-version: '18'  # Specify desired Node.js version

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Build project
        run: npm run build  # Adjust this command based on your build process

      - name: Upload test artifacts (optional)
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results.json  # Path to your test result file

  deploy-staging:
    needs: build-and-test
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Install Production Dependencies
        run: npm install  #Ensure production dependencies are installed

      - name: Build Production
        run: npm run build -- --env=production

      - name: Deploy to Staging (Example - uses SSH)
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.STAGING_HOST }}
          username: ${{ secrets.STAGING_USERNAME }}
          key: ${{ secrets.STAGING_SSH_KEY }}
          script: |
            echo "Deploying to staging..."
            # Add your deployment commands here, e.g.,
            # rsync -avz --delete ./dist/ ${{ secrets.STAGING_REMOTE_PATH }}
            echo "Deployment complete!"

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Install Production Dependencies
        run: npm install

      - name: Build Production
        run: npm run build -- --env=production

      - name: Deploy to Production (Example - uses SSH)
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.PRODUCTION_HOST }}
          username: ${{ secrets.PRODUCTION_USERNAME }}
          key: ${{ secrets.PRODUCTION_SSH_KEY }}
          script: |
            echo "Deploying to production..."
            # Add your deployment commands here, e.g.,
            # rsync -avz --delete ./dist/ ${{ secrets.PRODUCTION_REMOTE_PATH }}
            echo "Deployment complete!"
```

**Explanation and Important Considerations:**

1. **`name: CI/CD Pipeline`**:  Defines the name of the workflow.

2. **`on:`**: Specifies when the workflow should be triggered.
   - `push`:  Triggers on pushes to the `main` branch.
   - `pull_request`: Triggers on pull requests to the `main` branch.  This is crucial for testing changes before they're merged.

3. **`jobs:`**: Contains the actual tasks to be executed.

4. **`build-and-test` Job**:
   - `runs-on:
