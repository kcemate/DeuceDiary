# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T07:11:14.039717

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main # Trigger on pushes to the main branch
  pull_request:
    branches:
      - main # Trigger on pull requests targeting the main branch

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18 # Or your preferred Node.js version

      - name: Install dependencies
        run: npm install

      - name: Run linters and tests
        run: |
          npm run lint  # Or your linting command
          npm test       # Or your testing command

      - name: Build application
        run: npm run build # Or your build command

      - name: Upload artifacts (optional)
        if: success()
        uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: build/ #  Adjust this path to your build output

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build # Ensure build job completes successfully
    environment: staging # Deploy to staging environment
    if: github.ref == 'refs/heads/main' # Only deploy from main branch

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Install dependencies
        run: npm install

      - name: Deploy to Staging
        run: |
          # Replace these with your actual deployment commands
          echo "Deploying to Staging..."
          # Example - using SSH to deploy
          # ssh user@staging_server "cd /path/to/app && git pull origin main && npm install && npm run build"
          # Or a more sophisticated deployment solution (e.g., Netlify, Vercel, AWS)
          echo "Deployment complete!"
          #  Consider adding success/failure checks here to ensure deployment succeeded

  deploy-production:
    runs-on: ubuntu-latest
    needs: build # Ensure build job completes successfully
    environment: production # Deploy to production environment
    if: github.ref == 'refs/heads/main' # Only deploy from main branch

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Install dependencies
        run: npm install

      - name: Deploy to Production
        run: |
          # Replace these with your actual deployment commands
          echo "Deploying to Production..."
          # Example - using SSH to deploy
          # ssh user@production_server "cd /path/to/app && git pull origin main && npm install && npm run build"
          # Or a more sophisticated deployment solution (e.g., Netlify, Vercel, AWS)
          echo "Deployment complete!"
          # Consider adding success/failure checks here to ensure deployment succeeded
```

**Explanation and Key Components:**

* **`name: CI/CD Pipeline`**:  The name of your workflow.
* **`on:`**:  Defines when the workflow should run:
    * **`push:`**: Triggers on push events to the `main` branch.
    * **`pull_request:`**: Triggers on pull requests targeting the `main` branch.
* **`jobs:`**:  Defines the individual jobs that make up the workflow.
    * **`build:`**: This is the main build job.
        * **`runs-
