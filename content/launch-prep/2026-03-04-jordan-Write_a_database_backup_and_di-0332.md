# Write a database backup and disaster recovery plan.
Agent: jordan
Generated: 2026-03-04T03:32:32.949373

## Database Backup & Disaster Recovery Plan

**Document Version:** 1.0
**Date:** October 26, 2023
**Prepared By:** [Your Name/Team Name]
**For:** [Database Name(s)]

**1. Introduction**

This document outlines the procedures for backing up and restoring our critical database(s) (referred to as "[Database Name]”) to ensure business continuity and data integrity in the event of a disaster. It defines backup strategies, recovery procedures, testing schedules, and roles and responsibilities.

**2. Scope**

This plan covers the following:

*   Backing up the [Database Name] database.
*   Recovery procedures to restore the database to a consistent state.
*   Testing the backup and recovery processes.
*   Maintaining an up-to-date recovery strategy.


**3. Business Impact Analysis (BIA)**

*   **Criticality:** High - [Database Name] is essential for [Describe Business Impact - e.g., order processing, customer data, financial transactions].
*   **Recovery Time Objective (RTO):** [e.g., 4 hours - maximum downtime allowed].
*   **Recovery Point Objective (RPO):** [e.g., 1 hour - maximum data loss allowed].
*   **Dependencies:** [List any systems or applications dependent on this database].


**4. Backup Strategy**

| Backup Type       | Frequency   | Retention Period | Location(s)                  | Tool(s) Used             |
|-------------------|-------------|--------------------|-------------------------------|---------------------------|
| **Full Backup**    | Weekly      | 6 Months           | Offsite Cloud Storage (e.g., AWS S3, Azure Blob Storage, Google Cloud Storage) | [Backup Software - e.g., pg_dump, mysqldump, native backup tools] |
| **Incremental Backup**| Daily       | 7 Days              | Offsite Cloud Storage (same as full) | [Backup Software - same as full] |
| **Transaction Log Backup**| Continuous  | 24 Hours            | Offsite Cloud Storage (same as full) | [Database Engine Native Log Backup Feature, Backup Software] |

**5. Recovery Procedures**

**5.1.  Recovery Scenarios:**

*   **Minor Data Loss (RPO ≤ RPO):** Restore from the most recent transaction log backup.
*   **Significant Data Loss (RPO > RPO):** Restore from the most recent full backup. Restore transaction logs up to the point of failure.
*   **Complete System Failure:** Restore from the most recent full backup. Restore transaction logs to a point prior to the failure.

**5.2.  Step-by-Step Recovery Process:**

1.  **Assessment:** Determine the nature and extent of the disaster and data loss.
2.  **Notification:** Notify the database administrator, IT support team, and relevant stakeholders.
3.  **Verification:** Verify the integrity of the backup files.
4.  **Recovery Environment Setup:** Configure a temporary or designated recovery environment. This may involve provisioning a new server or utilizing a hot standby database.
5.  **Restoration:** Restore the database using the appropriate backup type.
6.  **Verification & Testing:** Perform thorough testing to ensure data integrity and application functionality.
7.  **Failback:**  Once the primary system is restored, carefully plan and execute the failback process.

**6. Roles & Responsibilities**

| Role                | Responsibilities                                                                      | Contact Information |
|---------------------|---------------------------------------------------------------------------------------|-----------------------|
| Database Administrator | Responsible for implementing the backup & recovery plan, monitoring backups, and performing restores. | [Email, Phone Number]
