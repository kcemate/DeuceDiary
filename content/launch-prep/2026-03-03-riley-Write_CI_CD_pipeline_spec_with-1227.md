# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T12:27:14.084635

```yaml
# .github/workflows/ci-cd-pipeline.yml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main  # Trigger on pushes to the main branch
  pull_request:
    branches:
      - main  # Trigger on pull requests to the main branch
  schedule:
    - cron: '0 0 * * *'  # Run every day at midnight (optional)

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'  # Or your desired Node.js version

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test  # Assuming you have a test script in your package.json

      - name: Build (if applicable)
        run: npm run build  # Assuming you have a build script in your package.json
        if: success() # Only run build if tests pass

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build-and-test  # Ensure build-and-test completes successfully
    if: github.ref == 'refs/heads/main' # Only deploy from main branch
    steps:
      - name: Deploy to Staging
        # Replace with your actual deployment steps
        # This is a placeholder - adapt to your deployment environment
        run: |
          echo "Deploying to staging environment..."
          # Example:  Run a deployment command
          # npm run deploy-staging  # if you have a deploy-staging script
          # Or use SSH, cloud provider CLI, etc.
          sleep 30  # Simulate deployment time
          echo "Deployment completed!"

  deploy-production:
    runs-on: ubuntu-latest
    needs: build-and-test
    if: github.ref == 'refs/heads/main'  # Only deploy from main branch
    environment: production
    permissions:
      contents: write
      packages: write # Required for some deployment methods (e.g., npm publish)
    steps:
      - name: Deploy to Production
        # Replace with your actual deployment steps
        # This is a placeholder - adapt to your deployment environment
        run: |
          echo "Deploying to production environment..."
          # Example:  Run a deployment command
          # npm run deploy-production  # if you have a deploy-production script
          # Or use SSH, cloud provider CLI, etc.
          sleep 30  # Simulate deployment time
          echo "Deployment completed!"

# Example Workflow for Production Deployment using a specific tool like Netlify or Vercel (adapt as needed)
#  production-deploy:
#    runs-on: ubuntu-latest
#    needs: build-and-test
#    if: github.ref == 'refs/heads/main'
#    steps:
#      - name: Deploy to Production (Netlify)
#        uses: netlify/actions/cli@v1
#        with:
#          args: 'deploy --prod --dir .  --message "Automated Deploy"'
#          production_environment: ${{ secrets.NETLIFY_SITE_ID }}  # Set this secret in your repository settings
#          auth: ${{ secrets.NETLIFY_API_TOKEN }}  # Set this secret in your repository settings
```

**Explanation and Key Concepts
