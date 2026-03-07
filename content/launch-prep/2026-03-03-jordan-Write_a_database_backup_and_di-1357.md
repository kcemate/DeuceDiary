# Write a database backup and disaster recovery plan.
Agent: jordan
Generated: 2026-03-03T13:57:24.336890

## Database Backup & Disaster Recovery Plan

**Document Version:** 1.0
**Date:** October 26, 2023
**Prepared By:** [Your Name/Team Name]

**1. Introduction**

This document outlines the plan for backing up and recovering our database systems (Specify Database Name(s) - e.g., "CustomerDB", "ProductDB") in the event of data loss, system failures, or disaster. This plan prioritizes data integrity and minimizes downtime to ensure business continuity.

**2. Scope**

This plan covers the following aspects:

*   **Backup Strategy:** Defining backup frequency, types, and retention policies.
*   **Disaster Recovery Plan:**  Steps to restore the database to a functional state after a disaster.
*   **Roles and Responsibilities:** Assigning personnel to specific tasks within the plan.
*   **Testing & Maintenance:** Procedures for regular testing and updating the plan.


**3. Database Systems Involved**

*   **Database Name:** [e.g., CustomerDB]
*   **Database Type:** [e.g., MySQL, PostgreSQL, SQL Server, Oracle]
*   **Server Location:** [e.g., AWS EC2, On-Premise Server Name]
*   **Key Data:** [Brief description of the most critical data – e.g., Customer records, Transaction history]


**4. Backup Strategy**

| Backup Type          | Frequency         | Retention Period | Storage Location            | Method                  | Verification |
|-----------------------|------------------|------------------|------------------------------|-------------------------|--------------|
| **Full Backup**       | Weekly            | 4 Weeks          | [e.g., AWS S3 Bucket, Network Share] | Automated (e.g., Backup Software) | Daily        |
| **Differential Backup** | Daily            | 7 Days           | [e.g., AWS S3 Bucket, Network Share] | Automated (e.g., Backup Software) | Daily        |
| **Transaction Log Backup**| Every 15 minutes| 24 Hours         | [e.g., AWS S3 Bucket, Network Share] | Automated (e.g., Backup Software) | Hourly       |
| **Snapshot (if applicable)**| Upon Major Changes| 1 Week           | [e.g., Cloud Provider Storage]  | Cloud Provider Tooling| As Needed    |


**5. Disaster Recovery Plan - Step-by-Step**

**Phase 1: Assessment & Notification (0-30 minutes)**

1.  **Identify the Disaster:** Determine the nature and extent of the event (e.g., server failure, natural disaster, ransomware attack).
2.  **Activate the Plan:** Notify the Disaster Recovery Team (DRT) – [List Team Members and Contact Info].
3.  **Initial Impact Assessment:** Determine the impact on database availability, data integrity, and business operations.
4.  **Communication:**  Establish communication channels – [e.g., Slack channel, Conference Call Bridge].

**Phase 2: Recovery (30 minutes - 4 Hours)**

1.  **Verify Backup Integrity:** Check the last successful backup and verify its integrity.
2.  **Restore (Prioritized):**
    *   **Transaction Log Restore:**  Restore the most recent transaction log backup to bring the database to a point in time prior to the disaster. (This is the highest priority)
    *   **Differential Backup Restore:** Restore the latest differential backup.
    *   **Full Backup Restore:**  Only restore the full backup if necessary (e.g., in cases where transaction logs are not available or complete restoration is required).
3.  **Database Configuration:**  Reconfigure the database server with the appropriate settings.
4
