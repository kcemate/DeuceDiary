# Write a database backup and disaster recovery plan.
Agent: jordan
Generated: 2026-03-04T14:25:46.922271

## Database Backup & Disaster Recovery Plan

**Document Version:** 1.0
**Date:** October 26, 2023
**Prepared by:** [Your Name/Team Name]
**For:** [Database Name]
**Purpose:** This plan outlines the procedures for backing up and restoring the [Database Name] database to ensure data integrity, minimize downtime, and facilitate business continuity in the event of a disaster.

**1. Scope & Objectives:**

* **Scope:** This plan covers all aspects of database backup and recovery for the [Database Name] database, including backups, restoration procedures, and testing.
* **Objectives:**
    * **Data Integrity:** Maintain the integrity and accuracy of the database data.
    * **RTO (Recovery Time Objective):**  Restore the database to operation within [Specify Timeframe - e.g., 4 hours, 8 hours] of a disaster event.
    * **RPO (Recovery Point Objective):** Recover data no more than [Specify Timeframe - e.g., 1 hour, 4 hours] old.
    * **Compliance:**  Meet any relevant regulatory requirements for data backup and recovery.


**2. Backup Strategy:**

* **Backup Types:**
    * **Full Backups:**  Complete copy of the entire database. (Frequency: [e.g., Weekly, Monthly]) –  Stored: [Storage Location - e.g., Offsite Cloud Storage, Tape Archive]
    * **Differential Backups:**  Changes made since the last *full* backup. (Frequency: [e.g., Daily]) – Stored: [Storage Location]
    * **Transaction Log Backups:**  Records of all database transactions. (Frequency: [e.g., Every 15 minutes, Hourly]) – Stored: [Storage Location]
* **Backup Tools:** [Specify Tools - e.g.,  SQL Server Management Studio, MySQL Workbench, AWS Backup, Veeam]
* **Backup Schedule:** (Detailed table outlining backup frequencies)

| Backup Type       | Frequency    | Time of Day  | Responsible Party | Storage Location  |
|--------------------|--------------|--------------|--------------------|--------------------|
| Full Backup        | Weekly       | [Day] [Time] | [Team/Individual] | [Cloud/Tape]       |
| Differential Backup| Daily        | [Day] [Time] | [Team/Individual] | [Cloud/Tape]       |
| Transaction Log   | Hourly       | [Day] [Time] | [Team/Individual] | [Cloud/Tape]       |


**3. Disaster Recovery Procedures:**

* **Disaster Declaration:** A disaster is declared when the primary database system is unavailable and unable to function reliably.  Criteria for declaration will include:
    * Prolonged downtime exceeding [Specify Timeframe].
    * Hardware failure impacting database availability.
    * Significant data corruption.
* **Recovery Steps:**

    1. **Assessment:** Determine the scope and cause of the disaster.
    2. **Activation:**  Notify designated personnel (IT Team, Stakeholders).
    3. **Recovery Point Selection:** Based on RPO, determine the appropriate backup to restore from.
    4. **Restoration:**  
        * **Step-by-Step Instructions (using [Backup Tool]):** [Provide detailed instructions for restoring from each backup type. Include screenshots if helpful.]
        * **Prioritize:**  Restore critical data first (e.g., user accounts, transactional data).
    5. **Verification:** Verify data integrity after restoration.  Perform thorough testing to ensure functionality.
    6. **Switchover:**  Point applications to the restored database.
    7. **Post-Disaster Analysis:**  Document the incident, root cause analysis, and
