# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-04T00:31:39.307859

```yaml
name: CI/CD Pipeline - GitHub Actions

on:
  push:
    branches:
      - main  # Trigger on pushes to the main branch
  pull_request:
    branches:
      - main  # Trigger on pull requests targeting the main branch
  schedule:
    - cron: '0 0 * * *' # Runs daily at midnight (example - adjust as needed)


jobs:
  build_and_test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'  # Or your preferred Node.js version

      - name: Install dependencies
        run: npm install  # Or yarn install

      - name: Run tests
        run: npm test  # Or yarn test

      - name: Build (example - adjust based on your project)
        run: npm run build  # Or yarn build


  deploy_to_staging:
    runs-on: ubuntu-latest
    needs: build_and_test  # Ensures build_and_test has completed successfully
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Staging Server (example - adjust based on your infrastructure)
        # This is a placeholder - replace with your actual deployment steps
        run: |
          echo "Deploying to Staging..."
          # Example: SSH into a staging server and run commands
          # ssh user@staging_server "npm install && npm run build"

      - name: Notify Slack (optional)
        # Replace with your Slack Webhook URL
        uses: rtCamp/action-slack-notify@v2.2.0
        with:
          slack-token: ${{ secrets.SLACK_TOKEN }} # Store your Slack token as a secret
          slack-channel: '#your-channel'
          slack-message: "Deployment to Staging Successful!"
          slack-title: "Staging Deployment"


  deploy_to_production:
    runs-on: ubuntu-latest
    needs: build_and_test, deploy_to_staging # Ensure both stages are successful
    environment: production # Sets the environment to "production" - this is important for some actions
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Production Server (example - adjust based on your infrastructure)
        # Replace with your actual deployment steps -  This is a placeholder!
        run: |
          echo "Deploying to Production..."
          # Example: Use a deployment service (e.g., AWS CodeDeploy, Netlify)
          # Or use SSH with proper security measures
          # Ensure you have the correct credentials set up for your production environment


      - name: Notify Slack (optional)
        # Replace with your Slack Webhook URL
        uses: rtCamp/action-slack-notify@v2.2.0
        with:
          slack-token: ${{ secrets.SLACK_TOKEN }} # Store your Slack token as a secret
          slack-channel: '#your-channel'
          slack-message: "Deployment to Production Successful!"
          slack-title: "Production Deployment"
```

Key improvements and explanations:

* **Clear Structure:** Uses `jobs` and `steps` for a well-organized pipeline.
* **`on` Trigger:**  Defines triggers for:
    * `push`:  Triggers on any push
