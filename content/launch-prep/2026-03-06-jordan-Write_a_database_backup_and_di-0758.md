# Write a database backup and disaster recovery plan.
Agent: jordan
Generated: 2026-03-06T07:58:56.409548

## Database Backup & Disaster Recovery Plan

**Document Version:** 1.0
**Date:** October 26, 2023
**Prepared By:** [Your Name/Team Name]
**For:** [Database Name]

**1. Introduction**

This document outlines the plan for regularly backing up and restoring our database, [Database Name], ensuring business continuity and minimizing data loss in the event of a disaster. This plan addresses both routine backups and disaster recovery procedures.

**2. System Overview**

* **Database System:** [Specify Database System - e.g., MySQL, PostgreSQL, SQL Server, Oracle]
* **Server Location:** [Physical Location of Server - e.g., Data Center, Cloud Provider]
* **Database Size:** [Approximate Size of Database - e.g., 100GB, 1TB]
* **Key Applications Dependent on Database:** [List applications and their criticality - e.g., Customer Portal, Reporting System, Order Processing System]


**3. Backup Strategy**

**3.1 Backup Types:**

* **Full Backup:** Complete copy of the database.  Frequency: [e.g., Weekly, Monthly]
* **Incremental Backup:**  Copies only the changes made since the last backup (full or incremental). Frequency: [e.g., Daily]
* **Differential Backup:** Copies all changes made since the last *full* backup. Frequency: [e.g., Daily]
* **Transaction Log Backup (For Databases Supporting it):** Captures database transactions in real-time. Frequency: [e.g., Every 15 minutes - 1 hour]

**3.2 Backup Schedule:**

| Backup Type       | Frequency       | Retention Period | Storage Location     |
|--------------------|-----------------|------------------|-----------------------|
| Full Backup        | Weekly          | 4 Weeks           | [e.g., Offsite Cloud Storage, Separate NAS] |
| Incremental Backup | Daily           | 7 Days            | [Same as Full Backup] |
| Differential Backup| Daily           | 7 Days            | [Same as Full Backup] |
| Transaction Logs   | Every 15 Min    | 24 Hours          | [Same as Full Backup] |


**3.3 Backup Tools:**

* **[Specify Backup Tool - e.g., MySQL Workbench, pg_dump, SQL Server Management Studio, Oracle RMAN]**
* **Automation:** [Describe automated backup scheduling – e.g., Cron jobs, Scheduled Tasks, Cloud Provider Backup Services]


**4. Disaster Recovery Plan**

**4.1 Disaster Scenarios:**

* **Hardware Failure:** Server crash, disk failure.
* **Natural Disaster:** Fire, flood, earthquake.
* **Cyberattack:** Ransomware, data breach.
* **Human Error:** Accidental data deletion or corruption.

**4.2 Recovery Objectives (RTO & RPO):**

* **Recovery Time Objective (RTO):**  The maximum acceptable time to restore the database to operation. [e.g., 4 hours, 8 hours]
* **Recovery Point Objective (RPO):** The maximum acceptable amount of data loss. [e.g., 15 minutes, 1 hour]

**4.3 Recovery Procedures:**

* **Step 1: Assessment:**  Determine the extent of the disaster and impact on the database.
* **Step 2: Activation:**  Notify key personnel and initiate the recovery process.
* **Step 3: Backup Restoration:**
    * **Locate the latest available backup.** (Prioritize Full Backup)
    * **Restore the Full Backup to a Recovery Server:** [Specify Recovery Server - e.g., Staging Server, Cloud Instance]
    * **Apply
