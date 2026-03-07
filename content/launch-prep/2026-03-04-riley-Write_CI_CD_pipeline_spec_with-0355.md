# Write CI/CD pipeline spec with GitHub Actions.
Agent: riley
Generated: 2026-03-04T03:55:38.072809

```yaml
name: CI/CD Pipeline - Python Project

on:
  push:
    branches:
      - main  # Trigger on push to the main branch
  pull_request:
    branches:
      - main  # Trigger on pull requests to the main branch
  schedule:
    - cron: '0 0 * * *'  # Runs daily at midnight (UTC) - Useful for automated tests and builds

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set up Python 3.x
        uses: actions/setup-python@v4
        with:
          python-version: '3.x'  # Or a specific version like 3.9, 3.10, etc.

      - name: Install Dependencies
        run: |
          python -m pip install --upgrade pip
          python -m pip install -r requirements.txt

      - name: Run Tests
        run: |
          # Add your test commands here.  Example:
          python -m unittest discover -s tests

      - name: Lint Code
        run: |
          # Add your linting commands here. Example:
          flake8 --max-line-length=120 .

      - name: Static Analysis
        run: |
          # Add your static analysis commands here. Example:
          # pylint your_project_directory

      - name: Build and Package (Optional - adjust for your project)
        run: |
          # Example: Use Poetry or setuptools to build a package
          # poetry build
          # python setup.py sdist bdist_wheel

      - name: Upload Artifacts (Optional - adjust for your project)
        if: success()
        uses: actions/upload-artifact@v3
        with:
          name: python-project-artifact
          path: dist/*  # Adjust the path to where your packaged files are

  deploy:
    runs-on: ubuntu-latest
    needs: build  # Ensure build completes successfully before deploying

    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Deploy to Production (Example - adjust for your deployment strategy)
        if: github.ref == 'refs/heads/main'  # Only deploy from main branch
        run: |
          # Replace with your deployment commands.  Examples:
          # - Deploy to a server via SSH
          # - Deploy to a cloud platform (e.g., AWS, Azure, Google Cloud)
          # - Deploy to a container registry (e.g., Docker Hub, AWS ECR)
          echo "Deploying to production..."
          # Example - Simulate a deployment
          sleep 30  # Simulate some deployment time
          echo "Deployment complete!"
```

Key improvements and explanations:

* **YAML Format:**  The spec is written in YAML, the standard format for GitHub Actions.
* **`on` Section:**  Defines when the workflow is triggered:
    * `push`:  Triggers on pushes to the `main` branch.
    * `pull_request`: Triggers on pull requests to the `main` branch.
    * `schedule`:  A cron schedule is included to run the workflow daily at midnight (UTC).  This is great for automated tests or pre-deployment checks.
* **`jobs` Section:** Contains the different stages of the CI/CD process.
* **`build` Job:**  This job performs the core build, test, and linting steps.
