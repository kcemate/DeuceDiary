# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-03T23:35:03.115292

## Deuce Diary Production Deployment Runbook - Railway

**Date:** October 26, 2023
**Version:** 1.0
**Goal:** Deploy the latest production version of Deuce Diary to the Railway Production environment.

**Assumptions:**

* You have a Railway account and the Deuce Diary project created.
* You have a Railway CLI installed and configured.
* You have the necessary permissions to deploy to the Railway Production environment.
* You understand the Deuce Diary deployment process (e.g., database migrations, environment variable updates).


**Phase 1: Preparation & Verification**

1. **Verify Latest Code:**
   * **Command:** `git checkout main` (or the appropriate production branch)
   * **Action:** Ensure you're on the correct production branch.  Inspect the most recent commits to confirm the changes.
2. **Update Environment Variables:**
   * **Review:**  Carefully review the `Railway.toml` file and any other environment variables used by Deuce Diary.  Make sure they are correctly set for the Production environment.  Key variables include:
      * `DATABASE_URL` (PostgreSQL connection string)
      * `STRIPE_SECRET_KEY` (Stripe API key - **NEVER COMMIT THIS TO GIT!**)
      * `RAILWAY_API_KEY` (Railway API key)
      * Any other application-specific configuration.
   * **Update:** Update the values in `Railway.toml` based on the production configuration.
3. **Test Local Deployment (Highly Recommended):**
   * **Command:** `railway up` (locally) -  This will deploy the latest code to a local Railway instance for testing.
   * **Action:** Thoroughly test the application in the local Railway environment to ensure everything works as expected.  Focus on:
      * Core functionality (diary entries, user authentication).
      * Stripe integration (payments).
      * Database connectivity.
      * Logging and monitoring.



**Phase 2: Deployment on Railway**

1. **Stop Existing Deployment:**
   * **Command:** `railway stop -f <your_project_name>` (Replace `<your_project_name>` with the actual name of your Deuce Diary Railway project.)
   * **Action:**  This will gracefully stop the current running instance.
2. **Deploy the New Code:**
   * **Command:** `railway up` (in the project directory).
   * **Action:** Railway will automatically pull the latest code from the repository and deploy it to the Production environment.
3. **Database Migrations:**
   * **Railway handles this automatically.** Railway will run the database migrations defined in your application code. Ensure you have your migrations set up correctly in your codebase.
4. **Environment Variable Updates:**
   * **Railway handles this automatically.** Railway will update the environment variables based on the values specified in your `Railway.toml` file.
5. **Post-Deployment Verification:**
   * **Access the Application:** Navigate to the Deuce Diary URL provided by Railway.
   * **Check Logs:** Examine the Railway logs for any errors or warnings. (`railway logs`)
   * **Run Tests:**  If applicable, run any automated tests to verify functionality.


**Phase 3: Post-Deployment Tasks & Monitoring**

1. **Monitor Application Health:**
    * **Railway Dashboard:** Regularly monitor the Railway dashboard for overall application health, CPU usage, memory usage, and other key metrics.
    * **Database Monitoring:**  Monitor the PostgreSQL database performance.
    * **Stripe Monitoring:** Check the Stripe dashboard for any failed payments or transactions.
2. **Check Application Logs:**  Continuously monitor application logs for errors or unusual activity. (`rail
