# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T22:38:39.882987

```yaml
name: CI/CD Pipeline - [Project Name]

on:
  push:
    branches:
      - main # Trigger on push to the main branch
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
          node-version: '18' # Specify your Node.js version here

      - name: Install dependencies
        run: npm install # Or yarn install, or pnpm install

      - name: Run linters
        run: npm run lint  # Or yarn run lint, or pnpm run lint
        continue-on-error: true  # Don't fail the build if linters have issues

      - name: Run tests
        run: npm test  # Or yarn test, or pnpm test
        continue-on-error: true # Don't fail the build if tests fail

      - name: Build project (if applicable)
        run: npm run build  # Or yarn build, or pnpm build
        if: steps.run_tests_passed | success() # Only build if tests pass

      - name: Upload test reports
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results.json # Adjust path if your test reports are named differently

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build # Ensure build has completed successfully
    environment: staging # Deploy to a specific environment
    if: github.ref == 'refs/heads/main' # Only deploy from main branch
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Install AWS CLI
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws_region: us-east-1  # Replace with your deployment region

      - name: Deploy to Staging
        run: |
          # Replace this with your actual deployment commands.
          echo "Deploying to staging..."
          # Example - using SSH to connect to staging server
          # ssh user@staging-server "cd /path/to/app && npm install && npm run build && npm run deploy"
          # Or use a service like Netlify, Vercel, or AWS ECS for deployment.
        continue-on-error: true  # Continue if deployment fails, but fail the job if there's a critical error.

  deploy-production:
    runs-on: ubuntu-latest
    needs: build # Ensure build has completed successfully
    environment: production # Deploy to a specific environment
    if: github.ref == 'refs/heads/main' # Only deploy from main branch
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Install AWS CLI
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws_region: us-
