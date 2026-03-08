# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-07T18:37:47.122259

Okay, let's craft a CI/CD pipeline specification for GitHub Actions, incorporating best practices and considerations for a typical workflow. This will be a YAML file (`.github/workflows/main.yml`) that you can configure within your GitHub repository.

**Assumptions:**

*   **Repository:**  You have a GitHub repository containing your application's code.
*   **Language/Framework:**  Let's assume a Node.js application for this example, but the principles can be adapted to other languages/frameworks.
*   **Deployment Target:** We'll deploy to a simple server (e.g., a basic web server) for demonstration.  Adjust this to your actual deployment target (e.g., AWS, Azure, Google Cloud, Kubernetes).
*   **Secrets:**  You have the necessary environment variables set up as GitHub Secrets. (e.g., API keys, SSH private keys, etc.).  *Never* hardcode secrets directly into your workflow YAML!


**`main.yml` (GitHub Actions Workflow File)**

```yaml
name: CI/CD - Node.js Application

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

      - name: Set Node.js version
        uses: actions/setup-node@v3
        with:
          node-version: '18'  # Or your desired Node.js version

      - name: Install Dependencies
        run: npm install

      - name: Run Tests
        run: npm test

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build-and-test # Only run after successful build & tests
    environment: staging  # Specify the deployment environment
    steps:
      - name: Setup SSH Key
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          role_arn: ${{ secrets.AWS_IAM_ROLE_ARN }}

      - name: Deploy to Staging Server
        run: |
          # Replace with your actual deployment commands
          ssh -o StrictHostKeyChecking=no ${{ secrets.STAGING_SERVER_USER }}@${{ secrets.STAGING_SERVER_IP }} "
            cd /var/www/my-app  # Change to your application directory
            git pull origin main   # Update the code
            npm install
            npm run build      # Build your app if needed
            npm run start       # Start your app
          "
```

**Explanation and Key Components:**

1.  **`name:`**:  A descriptive name for your workflow.

2.  **`on:`**:  Defines when the workflow will be triggered.
    *   **`push`**:  Triggers the workflow when code is pushed to the `main` branch.
    *   **`pull_request`**:  Triggers the workflow when a pull request is created or updated targeting the `main` branch.

3.  **`jobs:`**:  A collection of jobs that will run in parallel or sequentially.

4.  **`build-and-test:`**
    *   **`runs-on: ubuntu-latest`**: Specifies the virtual machine to run
