# Write a production deployment runbook for Deuce Diary on Rai
Agent: jordan
Generated: 2026-03-04T08:38:51.606387

Okay, here's a production deployment runbook for Deuce Diary on Railway, designed to be as detailed and robust as possible. This focuses on a blue/green deployment strategy for minimal downtime.

**Document Version:** 1.0
**Date:** October 26, 2023
**Application:** Deuce Diary
**Railway Environment:** Production
**Deployment Strategy:** Blue/Green

**I. Goals:**

*   Deploy a new version of Deuce Diary to a green environment.
*   Switch traffic from the blue environment to the green environment with minimal downtime.
*   Verify the new version is functioning correctly.
*   Rollback plan in case of issues.

**II. Prerequisites:**

*   Railway Account Access: Ensure you have the necessary permissions to deploy and manage Railway apps.
*   Railway CLI: Install and configure the Railway CLI.
*   Deuce Diary Service:  The Deuce Diary service already deployed on Railway in the blue environment.
*   Access to your Deuce Diary Database: Credentials for the database.
*   Deployment Branch: A separate branch (e.g., `release/1.2`) containing the new Deuce Diary version.
*   Release Notes: Documented changes and any known issues in the new version.

**III. Steps:**

**Phase 1: Preparation (Approximately 30-60 minutes)**

1.  **Verify New Version:**
    *   Review the Deuce Diary service logs in Railway for the new version.  Ensure no critical errors.
    *   Review the changes in the release notes.
2.  **Build and Push:**
    *   Build the Deuce Diary service for the new version.  (Assume this is automated within your CI/CD pipeline - adapt accordingly).
    *   Push the new build to your Railway repository.
3.  **Create Green Environment:**
    *   Using the Railway CLI:
        ```bash
        railway up --team <your_team_name> --name deuce-diary-green --service-count 1
        ```
        *   Replace `<your_team_name>` with your Railway team name.
        *   This will create a new Railway app with the same service definition as the blue environment.
4.  **Configure Green Environment:**
    *   Connect the new `deuce-diary-green` app to the same database as the blue environment.  (This is *crucial* - use the same database URL and credentials).  Make sure the database is running in the green environment.
    *   Verify the application settings (e.g., API keys, environment variables) are correctly configured in the green environment.  This might involve updating the Railway configuration file or using environment variables.
    *   Update the service definition of the green environment to point to the new build.  This might require editing the `services.yml` file.

**Phase 2: Testing & Switchover (Approximately 15-30 minutes)**

1.  **Initial Traffic Routing (Optional - Recommended):**
     * Before switching over, it's highly recommended to test the green environment with a small percentage of traffic.  This can be done by using a reverse proxy service like Cloudflare or using a Railway feature.
2.  **Scale Green Service:**
     * Increase the number of instances of the Deuce Diary service in the green environment to match the blue environment.
        ```bash
        railway scale deuce-diary-green --service-count <number_of_instances>
        ```
        * Replace `<number_of_instances>` with the appropriate number.
3.  **Monitor Green Environment:**
    *   Continuously monitor the logs and health checks of the green De
