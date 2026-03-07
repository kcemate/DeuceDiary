# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-03T13:35:17.913273

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
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16' # Or your preferred Node.js version

      - name: Install Dependencies
        run: npm install

      - name: Run Tests
        run: npm test

      - name: Build (Example - Adjust for your project)
        run: npm run build  #  This is just an example, replace with your build command

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build-and-test  # Ensure build-and-test has completed successfully
    if: github.ref == 'refs/heads/main'  # Only deploy from main

    steps:
      - name: Deploy to Staging (Example - Adjust for your deployment method)
        run: |
          #  Replace this with your staging deployment commands
          echo "Deploying to staging..."
          # Example:  npm run deploy:staging  or equivalent
          #  You may need to configure credentials securely using secrets.
          #  For example, if deploying to AWS, you'd use the AWS CLI configured
          #  with credentials stored as GitHub Secrets.
          #  See GitHub Docs on secrets: https://docs.github.com/en/security/authenticating-with-github/configuring-access-tokens-for-your-app
```

**Explanation and Key Components:**

* **`name: CI/CD Pipeline`**:  Defines the name of the workflow.
* **`on:`**:  Specifies when the workflow should be triggered.
    * **`push:`**:  Triggers the workflow when code is pushed to the `main` branch.
    * **`pull_request:`**: Triggers the workflow when a pull request is created or updated against the `main` branch.
* **`jobs:`**:  Defines the individual jobs that make up the workflow.
    * **`build-and-test:`**:  This job is responsible for building and running tests.
        * **`runs-on: ubuntu-latest`**:  Specifies the virtual machine environment to run the job in.
        * **`steps:`**:  A sequence of actions to perform within the job.
            * **`actions/checkout@v3`**:  Checks out the code from the repository.
            * **`actions/setup-node@v3`**: Sets up the Node.js environment.  Adjust the `node-version` to your project's needs.
            * **`npm install`**: Installs the project's dependencies.
            * **`npm test`**:  Runs the project's tests.  (Replace with your test command if different).
            * **`npm run build`**:  Runs the project's build command.  (Adjust this to your project's build steps.)
    * **`deploy-staging:`**:  This job is responsible for deploying the code to a staging environment.
        * **`runs-on: ubuntu-latest`**: Specifies the environment.
        * **`needs: build-and-test`**:  Ensures that the `build-and-test` job must complete successfully
