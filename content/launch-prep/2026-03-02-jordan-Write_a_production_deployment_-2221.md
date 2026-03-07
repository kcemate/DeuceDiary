# Write a production deployment runbook for Deuce Diary (Expre
Agent: jordan
Generated: 2026-03-02T22:21:22.006256

## Deuce Diary Production Deployment Runbook - Railway

**Objective:**  Successfully deploy a new version of Deuce Diary to the production Railway environment.

**Environment:** Railway (Deuce Diary currently deployed on Railway)

**Assumptions:**
* You have a Railway account with the Deuce Diary project set up.
* You have the necessary Railway CLI installed and configured with your account.
* You have a Railway organization (or have the appropriate permissions) to manage the Deuce Diary project.
* You have the ability to access the Deuce Diary database.
* You have appropriate access to any environment-specific configuration files.

**I. Pre-Deploy Checks (Mandatory)**

Before starting the deployment, perform the following checks to minimize potential issues:

1. **Code Changes Verification:**
   * **Review Pull Request:** Confirm the latest changes in the production branch (typically `main` or `production`) have been reviewed and approved.
   * **Test Coverage:** Ensure the changes have adequate test coverage.  Ideally, all critical and relevant tests should pass in the testing environment.
   * **Code Quality:** Run a linter/formatter (e.g., ESLint, Prettier) and ensure the code adheres to quality standards.

2. **Railway Infrastructure Checks:**
   * **Database Connection:** Verify the Railway PostgreSQL database connection is still active and working.  (Use the Railway CLI to check database status).
   * **Storage Service:** Confirm the Railway Storage service is configured correctly (e.g., for uploads).
   * **Environment Variables:** Double-check all environment variables defined in the Railway project are correct and haven't been inadvertently modified. (Use the Railway UI to verify).
   * **Rolling Deployments Configured:**  Ensure Railway’s rolling deployment feature is configured and enabled for the Deuce Diary service. This is critical for minimizing downtime.

3. **Documentation:**
   * **Deployment Instructions:** Review these deployment instructions.
   * **Database Migration Plan:** Understand the database migration script(s) to be applied.

**II. Deployment Command (Using Railway CLI)**

1. **Navigate to Project Directory:**  In your terminal, navigate to the root directory of the Deuce Diary project.

2. **Authenticate Railway CLI:** (If not already authenticated)
   ```bash
   railway up login
   ```

3. **Deploy the Service:**
   ```bash
   railway deploy --image <YOUR_IMAGE_NAME>
   ```
   * Replace `<YOUR_IMAGE_NAME>` with the name of the Docker image that represents the latest version of your Deuce Diary application.  This should be a tag like `deuce-diary:latest`.
   * The `railway deploy` command will build (if necessary), push (if necessary), and deploy the service to the production Railway environment.  This will typically involve updating the deployed containers and restarting the service.

4. **Observe Deployment:**
   * The Railway CLI will display the deployment progress and logs. Monitor for any errors.  Pay attention to the container logs within the Railway UI.



**III. Post-Deploy Verification (Critical)**

Immediately after deployment, perform these verification steps:

1. **Service Status:**
   * **Railway UI:** Verify that the Deuce Diary service is running and healthy within the Railway UI.  Check the resource utilization (CPU, Memory).

2. **Application Health Checks:**
   * **Automated Health Checks:** Deuce Diary should have automated health checks configured (e.g., using a process manager like PM2 or a custom health check endpoint).  The Railway UI will indicate if these checks are passing.

3. **Basic Functionality Tests:**
   * **Manual Checks:**  Perform basic functionality tests:
      * **Login:**  Try logging
