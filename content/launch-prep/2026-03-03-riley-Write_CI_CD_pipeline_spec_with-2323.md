# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T23:23:56.322123

```yaml
name: CI/CD Pipeline - MyProject

on:
  push:
    branches:
      - main  # Trigger on pushes to the main branch
  pull_request:
    branches:
      - main  # Trigger on pull requests to the main branch

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18' # Or your preferred Node.js version

      - name: Install Dependencies
        run: npm install

      - name: Run Tests
        run: npm test

      - name: Build Project
        run: npm run build  # Or your build command (e.g., npm run build:prod)

      - name: Upload Artifacts (Optional - for deployment)
        if: success()  # Only upload if previous steps were successful
        uses: actions/upload-artifact@v4
        with:
          name: build-artifacts
          path: build/  #  Adjust to your build output directory
          if_no_files_found: fail

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build  # Ensure build has completed successfully
    environment: staging  #  Customize this to your staging environment name

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Deploy to Staging
        # Replace with your actual deployment commands.
        # Examples:
        # - Use a deployment service like AWS S3, Netlify, Vercel, etc.
        # - Run a deployment script
        run: |
          echo "Deploying to Staging..."
          # Example:  scp -r build/ user@staging-server:/var/www/myproject
          # You might need SSH keys configured in your GitHub secrets
          #  This is just a placeholder - replace with your actual deployment logic.
          echo "Deployment complete!"

  deploy-production:
    runs-on: ubuntu-latest
    needs: build
    environment: production  # Customize this to your production environment name

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Deploy to Production
        # Replace with your actual deployment commands.
        # Similar to deploy-staging, adapt to your deployment service
        run: |
          echo "Deploying to Production..."
          # Example:  scp -r build/ user@production-server:/var/www/myproject
          # You might need SSH keys configured in your GitHub secrets
          echo "Deployment complete!"

workflows:
  main:
    jobs:
      - build
      - deploy-staging
      - deploy-production
```

**Explanation and Key Improvements:**

1. **`name`:**  A clear name for your pipeline.
2. **`on`:** This section defines when the workflow triggers.
   - `push`:  Triggers on every push to the `main` branch.
   - `pull_request`: Triggers on pull requests to the `main` branch. This is critical for code review and testing.
3. **`jobs`:**  This section defines the individual jobs that make up your pipeline.
   - **`build`:**
     - `runs-on`: Specifies the runner environment (Ubuntu in this case).
     - `steps`:  A sequence of actions to perform.
       - `Checkout Code`:  Fetches the
