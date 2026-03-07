# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-04T09:58:31.958640

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
          node-version: '18' # Or your preferred Node.js version

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build  # Adapt this to your build command

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build-and-test  # Ensure build-and-test has completed successfully
    if: github.ref == 'refs/heads/main'  # Only deploy from main

    steps:
      - name: Deploy to Staging
        # Replace with your actual deployment steps
        run: |
          echo "Deploying to staging environment..."
          # Add your deployment commands here, e.g.,
          # - Use SSH to connect to staging server
          # - Run deployment scripts
          # - Update environment variables
        # You can use tools like:
        # - SSH
        # - Cloud deployment services (e.g., Netlify, Vercel, AWS Amplify)
        # - Container deployment (e.g., Docker, Kubernetes)
        # Remember to secure your credentials if needed (e.g., using secrets).
        # Example using SSH (Replace with your SSH details and commands):
        # ssh -o StrictHostKeyChecking=no user@staging_server "cd /path/to/your/app && npm install && npm run deploy"
        # Don't hardcode secrets - use GitHub Secrets.
        # Example:
        #   - name: Store SSH credentials
        #     uses: actions/ssh-key@v5
        #     with:
        #       key: ${{ secrets.STAGING_SSH_KEY }}
        #       if_use_config: false  # Overrides ssh_config file

  deploy-production:
    runs-on: ubuntu-latest
    needs: build-and-test
    environment: production # Trigger on production environment - requires proper configuration

    steps:
      - name: Deploy to Production
        # Replace with your actual production deployment steps
        run: |
          echo "Deploying to production environment..."
          # Add your deployment commands here, e.g.,
          # - Use SSH to connect to production server
          # - Run deployment scripts
          # - Update environment variables
          # - Rollback strategy if necessary

          # Example:  Using a specific cloud deployment service:
          # - name: Deploy to Production (example with Vercel)
          #   uses: ammarib/action-vercel@v1
          #   with:
          #     github-token: ${{ secrets.VERCEL_TOKEN }}
          #     vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          #     vercel-org-id: ${{ secrets.VERCEL_ORG_ID }} # Optional

        # Remember to secure your credentials if needed (e.g., using secrets).
        # Don't hardcode secrets - use GitHub Secrets.
        # Example:
        #   - name: Store AWS
