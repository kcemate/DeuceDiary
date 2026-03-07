# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-03T18:18:01.590213

Okay, here's a production deployment runbook for Deuce Diary on Railway, designed to be clear, detailed, and facilitate a smooth transition. It's broken down into phases with specific steps, considerations, and rollback procedures.

**Document Version:** 1.0
**Date:** October 26, 2023
**System:** Deuce Diary - Railway Deployment
**Goal:** Deploy the latest production version of Deuce Diary to the Railway production environment.


---

**Phase 1: Pre-Deployment Checks & Verification (30-60 mins)**

* **Team:** DevOps, Lead Developer
* **Tools:** Railway UI, SSH Client, Git, Postman/Insomnia (for API testing)

1. **Verify Current Deployment:**
   * Confirm the current running Deuce Diary instance is healthy and accessible via the Railway UI.  Check logs for errors.
2. **Code Review:** Ensure the latest code in the `main` branch is approved and meets production standards.
3. **Test Environment Verification:** Double-check that the staging environment mirrors the production setup as closely as possible.
4. **Railway Environment Configuration:**
   * Verify Railway environment variables are correctly configured in the production Railway environment. This includes:
      * `DATABASE_URL`
      * `REDIS_URL`
      * `JWT_SECRET`
      * `STRIPE_SECRET_KEY` (if applicable)
      * `RAILWAY_API_KEY` (ensure this is secure and not exposed)
      * `ALLOWED_ORIGINS` (Critical for security - restrict to your domain)
5. **Storage Bucket Verification:** Confirm the production Railway storage bucket is properly configured and accessible.


**Phase 2: Deployment (60-120 mins)**

* **Team:** DevOps
* **Tools:** Railway UI, SSH Client, Git

1. **Pull Latest Code:**
   * SSH into the Railway deployment environment.
   * Run: `git pull origin main` (or the appropriate branch)
2. **Build & Test:**
   * Run: `npm install` (or equivalent for your build system)
   * Run: `npm run build` (or equivalent) – This creates the production build.
   * Run automated tests: `npm run test` (or equivalent) – Ensure tests pass.  Ideally, this should be integrated into your CI/CD pipeline.
3. **Restart Services:**
   *  SSH into the Railway deployment environment.
   *  Restart the Deuce Diary services: `sudo systemctl restart deuce-diary-backend` and `sudo systemctl restart deuce-diary-frontend` (Adjust command based on your service names).
4. **Monitor Initial Health:**  Continuously monitor the Deuce Diary instance in the Railway UI for any errors.

**Phase 3: Post-Deployment Verification (30-60 mins)**

* **Team:** DevOps, Lead Developer
* **Tools:** Railway UI, Postman/Insomnia, Web Browser

1. **Smoke Tests:**
    * **API Tests:** Use Postman/Insomnia to test key API endpoints:
        * User registration
        * Login
        * Diary entry creation/retrieval
        * (Other critical API functions)
    * **UI Tests:**  Access the Deuce Diary application in a web browser to verify the UI is functioning correctly.
2. **Database Connection Test:** Verify the application can connect to the database.
3. **Redis Connection Test:**  Ensure the application can connect to Redis.
4. **Log Review:**  Review application logs for any errors or warnings.
5. **Performance Monitoring:** Use Railway’s built-in monitoring tools to check CPU usage, memory usage, and response
