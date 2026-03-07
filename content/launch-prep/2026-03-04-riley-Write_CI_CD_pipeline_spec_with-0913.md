# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-04T09:13:01.253593

Okay, let's craft a CI/CD pipeline specification using GitHub Actions. This will be a detailed outline, providing the YAML configuration for the workflow.  I'll break it down into sections with explanations to make it understandable and adaptable to your needs.

**Assumptions:**

*   **Repository:** We'll assume you have a GitHub repository containing your project code.
*   **Language:** Let's illustrate with a Python project (you can easily adapt this to Node.js, Java, etc.).
*   **Deployment Target:**  We'll use a simple simulated deployment to a "staging" environment (a directory on your server).  You'll need to adapt this to your actual deployment process.
*   **Testing Framework:**  You're using `pytest` for testing in your Python project.

**YAML Workflow File (`.github/workflows/ci-cd.yml`)**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main  # Trigger on pushes to the 'main' branch
  pull_request:
    branches:
      - main  # Trigger on pull requests targeting 'main'

jobs:
  build-and-test:
    runs-on: ubuntu-latest  # Use the latest Ubuntu runner

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'  # Specify Python version

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt

      - name: Run tests
        run: |
          pytest  # Run your tests (adjust command if needed)

      - name: Lint Code (Optional)
        uses: pycodes/gha-lint-action@v2.0.1 # example linting action
        with:
          python-version: '3.11'
          # configure options as needed
    
  deploy-staging:
    runs-on: ubuntu-latest
    needs: build-and-test # Ensures build-and-test has completed successfully
    if: github.ref == 'refs/heads/main' # Deploy only from main branch
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Staging
        run: |
          # Replace this with your actual deployment commands
          echo "Deploying to staging..."
          # Example:  rsync -avz ./dist/ staging_user@staging.example.com:/path/to/staging/
          #  This is a placeholder.  Adjust based on your deployment method.
          echo "Deployment complete."
```

**Explanation:**

1.  **`name`:**  A descriptive name for your workflow.
2.  **`on`:**  This section defines when the workflow should be triggered.
    *   `push`:  Triggers the workflow on pushes to the `main` branch.
    *   `pull_request`: Triggers on pull requests targeting the `main` branch.  (This is good for code review and testing of changes before merging).
3.  **`jobs`:** Defines the individual jobs that make up the workflow.
    *   `build-and-test`: This job builds and tests your project.
        *   `runs-on`:  Specifies the virtual machine (runner) to use. `ubuntu-latest` is a common choice.
        *   `steps`: The sequence of actions to perform within
