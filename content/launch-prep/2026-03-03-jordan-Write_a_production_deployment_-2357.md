# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-03T23:57:40.086392

Okay, here's a production deployment runbook for Deuce Diary on Railway, aiming for a streamlined and documented process. This focuses on best practices for Railway deployments and includes checks, rollback procedures, and post-deployment verification.

**Document Version:** 1.0
**Date:** October 26, 2023
**Application:** Deuce Diary
**Railway Account:** [Your Railway Account Name]
**Team:** [Your Team Name]

**1. Introduction**

This runbook outlines the steps required to deploy a production version of Deuce Diary to Railway.  It assumes you’ve completed the development and testing phases and are ready to move to production.  It emphasizes a staged approach to minimize risk.

**2. Prerequisites**

* **Railway Account Access:** You have the necessary permissions in your Railway account.
* **Railway CLI:** Railway CLI is installed and configured on your machine.  (`railway up`)
* **Deuce Diary Source Code:** The latest production code is committed to your designated repository (e.g., GitHub).
* **Railway Organization & Project:** The Railway organization and project for Deuce Diary are already created and initialized.  (Ideally, this has been pre-configured with the necessary services – Database, Web App, Redis, etc.)
* **Service Credentials:**  You have the necessary service credentials (API keys, database passwords) for any external services used by Deuce Diary. These should be securely stored in Railway's Secrets Manager.

**3. Deployment Steps**

**Phase 1: Pull & Build (Staging - Dry Run)**

1. **Pull Latest Code:**
   ```bash
   railway pull [Your Repository URL] --branch [Production Branch Name]
   ```
   * **Explanation:**  This command pulls the latest changes from your production branch into your Railway project.
   * **Verification:**  Check the Railway UI to confirm the code pull was successful and that the project's files match your expectations.

2. **Build (If Required):**
   ```bash
   railway build
   ```
   * **Explanation:** If your application requires a build step (e.g., compiling TypeScript, bundling JavaScript), this command performs it.
   * **Verification:** Confirm the build process completed without errors.

**Phase 2: Deployment - Staged Rollout**

This phase uses a staged rollout to minimize the impact of potential issues.

3. **Deploy to Canary (10%):**
   ```bash
   railway deploy --stage canary
   ```
   * **Explanation:** This deploys the new version to the canary environment, representing 10% of your traffic.
   * **Monitoring:** *Immediately* monitor the canary environment using Railway's monitoring tools (Grafana, logs) for errors, performance degradation, or unexpected behavior.

4. **Monitor Canary:** (Continuous monitoring for at least 30-60 minutes.  Watch for errors, latency, and user reports.)
   * **Key Metrics:**  Error rates, response times, database query performance, and any relevant application-specific metrics.

5. **If Canary is Stable - Deploy to Production (80%):**
   ```bash
   railway deploy --stage production
   ```
   * **Explanation:** This deploys the new version to the 80% production environment.
   * **Gradual Rollout:** Railway’s default rollout is a gradual rollout.  It will slowly increase the traffic to the new version over a predetermined period (e.g., 15-30 minutes) to allow for user feedback and easier rollback.

6. **Monitor Production:**  (Continuous monitoring for the next 2-4 hours.  Pay close attention to user reports and critical metrics.)
