# Write a database backup and disaster recovery plan.
Agent: jordan
Generated: 2026-03-03T13:34:52.868978

## Database Backup & Disaster Recovery Plan

**Document Version:** 1.0
**Date:** October 26, 2023
**Prepared By:** [Your Name/Team Name]
**Approved By:** [Management Approval]

**1. Introduction**

This plan outlines the procedures for backing up and restoring our database systems (specifically [List Database Systems: e.g., MySQL, PostgreSQL, SQL Server]) to ensure business continuity in the event of data loss or system failure.  It prioritizes data integrity, minimizes downtime, and provides a clear path for recovery.

**2. Scope**

This plan covers all critical database systems supporting [Mention Key Business Processes - e.g., order management, customer data, reporting]. It includes:

* **Backup Procedures:** Frequency, methods, and storage locations.
* **Restoration Procedures:** Steps to restore databases from backups.
* **Disaster Recovery Procedures:**  Actions to take during a disaster event.
* **Testing & Maintenance:**  Regular testing and updates to ensure the plan remains effective.


**3. System Overview**

* **Database Systems:** [List all databases & versions]
* **Server Locations:** [Primary, Secondary (DR Site)]
* **Network Configuration:**  [Briefly describe network connectivity]
* **Applications Dependent on Databases:** [List key applications]


**4. Backup Procedures**

| Database System | Backup Method     | Frequency          | Retention Policy | Storage Location      | Verification Method |
|-----------------|--------------------|--------------------|--------------------|-----------------------|-----------------------|
| [Database 1]     | [e.g., Logical Backup] | [e.g., Full - Daily, Incremental - Hourly] | [e.g., 30 Days]     | [e.g., Cloud Storage - AWS S3] | [e.g., Database Console Check] |
| [Database 2]     | [e.g., Physical Backup] | [e.g., Full - Weekly, Differential - Daily] | [e.g., 90 Days]     | [e.g., On-Premise Server] | [e.g., RMAN Script Run]   |
| ...             | ...                | ...                | ...                | ...                   | ...                   |

**Details on Backup Methods:**

* **Logical Backup:** Captures the data as SQL statements.  Faster restoration, but potential for schema changes to break restores.
* **Physical Backup:**  Copies the raw data files. Slower restoration, but generally more reliable for full database copies.
* **Snapshot Backups:**  Instant copies of the database at a specific point in time.  Ideal for quick recovery from minor issues. (Consider for development/testing environments)

**5. Restoration Procedures**

* **Prioritization:** Restore based on business impact (Critical > Medium > Low).
* **Environment:** Restoration will be conducted in a staging environment mirroring the production setup.
* **Step-by-Step Restoration Process:**
    1. **Assessment:** Determine the scope of the data loss and the required restoration point.
    2. **Prepare Staging Environment:** Verify infrastructure, network connectivity, and required software.
    3. **Restore Backup:** Utilize the appropriate backup method (logical or physical) based on the database system.
    4. **Data Verification:**  Run data integrity checks, compare record counts, and perform sample data validation.
    5. **Application Testing:**  Test applications connected to the restored database to ensure functionality.
    6. **Cutover:**  Switch over to the restored database after successful testing.

**6. Disaster Recovery Procedures**

**Trigger Event:** Any event that renders the primary database system unavailable or results in significant data loss. (e.g., Hardware failure
