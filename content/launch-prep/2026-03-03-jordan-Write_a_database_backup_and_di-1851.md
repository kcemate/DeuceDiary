# Write a database backup and disaster recovery plan.
Agent: jordan
Generated: 2026-03-03T18:51:42.580698

## Database Backup and Disaster Recovery Plan

**Document Version:** 1.0
**Date:** October 26, 2023
**Prepared By:** [Your Name/Team Name]
**For:** [Database Name]

**1. Introduction**

This plan outlines the procedures for regularly backing up our database ([Database Name]) and restoring it in the event of a disaster. The goal is to minimize data loss and downtime, ensuring business continuity. This plan covers both routine backups and disaster recovery scenarios.

**2. System Overview**

* **Database System:** [Specify Database System - e.g., MySQL, PostgreSQL, SQL Server, Oracle]
* **Server Location:** [Physical Location of the Database Server]
* **Operating System:** [Specify OS - e.g., Windows Server, Linux]
* **Database Size:** [Approximate Size - e.g., 10GB, 100GB]
* **Criticality:** [High, Medium, Low - Based on business impact]
* **Recovery Time Objective (RTO):** [Target Downtime - e.g., 4 hours, 24 hours]
* **Recovery Point Objective (RPO):** [Maximum Data Loss - e.g., 1 hour, 12 hours]

**3. Backup Procedures**

* **Backup Type:** Full, Incremental, Differential (Specify the strategy – e.g., Full Daily, Incremental Weekly)
* **Backup Schedule:**
    * **Full Backup:** [Day & Time - e.g., Sunday 2:00 AM]
    * **Incremental Backup:** [Day & Time - e.g., Monday - Friday 6:00 AM]
    * **Differential Backup:** [Day & Time - e.g., Tuesday 6:00 PM] (If applicable - some systems don't use Differential)
* **Backup Tools:** [Specify Tools – e.g., `mysqldump`, `pg_dump`, SQL Server Management Studio, Oracle RMAN]
* **Backup Storage Location:**
    * **Primary:** [Specify Location - e.g., Offsite Cloud Storage (AWS S3, Google Cloud Storage, Azure Blob Storage), Tape Library]
    * **Secondary (Redundant):** [Specify Location - e.g.,  Another Offsite Cloud Storage location]
* **Backup Verification:**
    * **Automated Verification:** [Describe automated checks - e.g., Regular script to verify file integrity]
    * **Manual Verification:** [Describe manual checks - e.g., Periodic restoration of a small sample dataset to confirm backups are usable]
* **Backup Retention Policy:**
    * **Full Backups:** [Retention Period - e.g., 4 weeks]
    * **Incremental/Differential Backups:** [Retention Period - e.g., 7 days]

**4. Disaster Recovery Procedures**

**4.1. Disaster Declaration:**

* **Criteria for Declaration:** Loss of primary server, prolonged outage affecting database access, critical data corruption.
* **Declaration Authority:** [Specify who has authority - e.g., IT Manager, Head of Operations]
* **Notification Protocol:** [Describe how the declaration will be communicated - e.g., Email, Phone Call, Slack Channel]

**4.2. Recovery Steps:**

1. **Activate Disaster Recovery Team:** Notify designated team members.
2. **Assess Damage:** Determine the scope of the disaster and its impact on the database.
3. **Restore from Backup:**
    * **Selection:** Choose the most recent appropriate backup (based on RPO).
    * **Restoration Method:** [Specify method - e.g., Database system’s native restore tools, Third-party recovery software]
    * **
