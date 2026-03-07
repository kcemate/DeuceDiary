# Write a database backup and disaster recovery plan.
Agent: jordan
Generated: 2026-03-03T07:33:17.877005

## Database Backup and Disaster Recovery Plan

**Document Version:** 1.0
**Date:** October 26, 2023
**Prepared By:** [Your Name/Team Name]
**For:** [Database Name(s)]

**1. Introduction**

This document outlines the plan for backing up and recovering [Database Name(s)] to ensure business continuity in the event of data loss or system failure. This plan prioritizes data integrity, minimal downtime, and a defined recovery process.  It's a living document and should be reviewed and updated at least annually, or more frequently based on changes to the environment or business requirements.

**2. Scope**

This plan covers the following:

* **Databases:** [List specific databases included - e.g., Production Customer Database, Development Database]
* **Systems:** Servers hosting the database(s) – [Specify Server Details: Operating System, Database Software Version, Location]
* **Recovery Objectives:** RTO (Recovery Time Objective) - [Define acceptable downtime - e.g., 4 hours] & RPO (Recovery Point Objective) - [Define acceptable data loss - e.g., 15 minutes]


**3. Backup Strategy**

* **Backup Types:**
    * **Full Backups:** [Frequency - e.g., Weekly] - Complete copy of the database.
    * **Differential Backups:** [Frequency - e.g., Daily] - Changes since the last full backup.
    * **Transaction Log Backups:** [Frequency - e.g., Every 15 minutes] - Records of all database transactions.
* **Backup Location(s):**
    * **On-site:** [Storage Solution - e.g., NAS device, Dedicated Backup Server] – For rapid initial recovery.  [Capacity:  [Specify Size]]
    * **Off-site:** [Cloud Provider - e.g., AWS S3, Azure Blob Storage, Google Cloud Storage] -  For protection against physical disasters.  [Bucket Name/Storage Account Name]
* **Backup Software:** [Specify Software - e.g., Veeam Backup & Replication, AWS RDS Snapshots, Azure Backup]
* **Retention Policy:**
    * Full Backups: [Retention Period - e.g., 4 weeks]
    * Differential Backups: [Retention Period - e.g., 7 days]
    * Transaction Log Backups: [Retention Period - e.g., 24 hours]
* **Encryption:** All backups will be encrypted using [Specify Encryption Method - e.g., AES-256] both in transit and at rest.


**4. Disaster Recovery Plan**

* **Triggering Events:** The disaster recovery plan will be activated in the following scenarios:
    * Hardware failure (server, storage)
    * Software corruption
    * Natural disasters (fire, flood, earthquake)
    * Ransomware attack
    * Data corruption
* **Recovery Process:**
    1. **Detection & Assessment:** Monitor system health and alerts. Confirm the nature and extent of the disaster.
    2. **Activation:**  Designated Disaster Recovery Team member initiates the plan.
    3. **Communication:** Notify key stakeholders (IT, Management, Business Users) of the situation and recovery efforts.
    4. **Recovery Point Selection:**  Determine the appropriate backup set based on RPO and available data.
    5. **Restore:**  Restore the database to a new or recovered server.  This may involve:
        * **Pilot Restore:** (Recommended) Perform a dry run of the restore process in a test environment.
        * **Full Restore:** Using the latest full backup.
        * **Incremental Restore:** Using a combination of full and differential backups.
    6. **Verification
