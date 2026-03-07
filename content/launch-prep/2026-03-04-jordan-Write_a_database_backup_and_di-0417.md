# Write a database backup and disaster recovery plan.
Agent: jordan
Generated: 2026-03-04T04:17:56.070132

## Database Backup & Disaster Recovery Plan

**Document Version:** 1.0
**Date:** October 26, 2023
**Prepared by:** [Your Name/Team Name]
**For:** [Database Name & System Name]

**1. Introduction**

This plan outlines the procedures for regularly backing up our critical database, [Database Name], and defines the steps to restore operations in the event of a disaster. The primary goals are to minimize data loss, reduce downtime, and ensure business continuity. This plan is a living document and will be reviewed and updated at least annually, or more frequently if significant changes occur.

**2. Scope & Objectives**

* **Scope:** This plan covers the backup and restoration of the [Database Name] database running on [Server/Cloud Environment - e.g., AWS RDS, Azure SQL Database, SQL Server].
* **Objectives:**
    * **RTO (Recovery Time Objective):**  [Specify Target RTO - e.g., 4 hours] –  The maximum acceptable time to restore the database after a disaster.
    * **RPO (Recovery Point Objective):** [Specify Target RPO - e.g., 15 minutes] – The maximum acceptable amount of data loss in the event of a disaster.
    * **Data Integrity:** Maintain the integrity and accuracy of the backed-up data.
    * **Compliance:** Meet all relevant regulatory requirements (e.g., GDPR, HIPAA) regarding data backup and recovery.


**3. System Overview**

* **Database:** [Database Name] – [Version] - [Platform - e.g., MySQL, PostgreSQL, SQL Server]
* **Server/Environment:** [Server IP Address/Cloud Environment URL] – [Operating System] - [Virtualization Technology (if applicable)]
* **Applications Dependent on Database:** [List Applications]
* **Network Diagram:** (A basic network diagram illustrating the database server and key network connections should be included here).

**4. Backup Strategy**

* **Backup Types:**
    * **Full Backups:** [Frequency - e.g., Weekly] – Complete copy of the entire database.
    * **Incremental Backups:** [Frequency - e.g., Daily] –  Backs up only the data that has changed since the last backup (full or incremental).
    * **Differential Backups:** [Frequency - e.g., Daily] - Backs up all changes since the last full backup.
* **Backup Tools:** [Specify Tools - e.g., MySQLdump, pg_dump, SQL Server Management Studio Backup, AWS Backup Service, Azure Backup]
* **Backup Locations:**
    * **On-site Backup:** [Specify Location - e.g., NAS device] - For rapid recovery and testing.
    * **Off-site Backup:** [Specify Location - e.g., Cloud Storage (AWS S3, Azure Blob Storage), Offsite Data Center] - Protecting against site-wide disasters.
* **Backup Schedule:** (Detailed schedule of all backup types)
    * **Monday:** Full Backup - 12:00 AM
    * **Tuesday - Sunday:** Incremental Backup - 6:00 AM
* **Retention Policy:** [Specify Retention Periods - e.g., Full Backups - 4 weeks, Incremental Backups - 7 days]


**5. Disaster Recovery Procedures**

* **Phase 1: Disaster Declaration**
    *  A disaster is declared when the primary database server is unavailable due to:
        *  Hardware failure
        *  Software corruption
        *  Natural disaster (fire, flood, earthquake)
        *  Cyberattack
    *  Declaration responsibility rests with: [Designated Person/Team]
* **Phase 2: Recovery Steps**
