# Write a database backup and disaster recovery plan.
Agent: jordan
Generated: 2026-03-03T11:18:44.278031

## Database Backup and Disaster Recovery Plan

**Document Version:** 1.0
**Date:** October 26, 2023
**Prepared By:** [Your Name/Team Name]

**1. Introduction**

This document outlines the strategy for backing up and recovering our database(s) – [Specify Database Name(s), e.g., Production MySQL Database, Development PostgreSQL Instance] – to ensure business continuity in the event of data loss, system failure, or disaster. This plan aims to minimize downtime and data loss, allowing us to quickly restore operations.

**2. Scope**

This plan covers all aspects of backup and recovery for the following database(s): [List Database Names Again]

**3. Roles & Responsibilities**

| Role                  | Responsibility                                                                 | Contact Information       |
|-----------------------|------------------------------------------------------------------------------|---------------------------|
| **Database Administrator (DBA)** | Overall responsibility for backup/recovery strategy, monitoring, testing. | [DBA Email/Phone]         |
| **System Administrator (SysAdmin)** | Server maintenance, infrastructure support, executing backups.            | [SysAdmin Email/Phone]     |
| **Operations Team**    |  Initiating recovery procedures in case of a disaster.                        | [Operations Team Contact] |
| **Management**         |  Approving budget, resources, and overall plan implementation.               | [Management Contact]       |



**4. Backup Strategy**

* **4.1 Backup Types:** We will utilize a layered approach:
    * **Full Backups:** Weekly, executed [Day of Week] at [Time].
    * **Differential Backups:** Daily, executed [Day of Week] at [Time].
    * **Transaction Log Backups (if supported by the database):** Every 15 minutes - captured during normal operations.
* **4.2 Backup Location & Storage:**
    * **Primary Backup Location:** [Specify Network Share/Cloud Storage - e.g., /backup/db_prod, AWS S3 Bucket] - Redundant storage.
    * **Secondary Backup Location (Offsite):** [Specify Network Share/Cloud Storage - e.g., Google Cloud Storage, Azure Blob Storage] – For disaster recovery.  This ensures data is safe even if the primary site is compromised.
* **4.3 Backup Tools:** [Specify Tools – e.g., `mysqldump`, `pg_dump`,  Database Management System (DBMS) native backup utilities, Cloud provider backup services (AWS RDS, Azure Database Backup)]
* **4.4 Backup Retention Policy:**
    * **Full Backups:** Retained for 3 months.
    * **Differential Backups:** Retained for 1 week.
    * **Transaction Log Backups:** Retained for 7 days.


**5. Disaster Recovery Plan**

* **5.1 Disaster Declaration Criteria:**
    *  Prolonged downtime (defined as [e.g., 4 hours]) due to a server failure.
    *  Corruption or unrecoverable data loss.
    *  Natural disaster affecting the primary site.
* **5.2 Recovery Time Objective (RTO):** [Define the maximum acceptable downtime - e.g., 4 hours, 8 hours].
* **5.3 Recovery Point Objective (RPO):** [Define the maximum acceptable data loss - e.g., 15 minutes, 1 hour].
* **5.4 Recovery Procedures:**
    1. **Assessment:** SysAdmin confirms disaster and assesses damage.
    2. **Notification:** Operations Team & Management are notified.
    3. **Isolation:**  Impacted systems are isolated to prevent further damage.
    4. **Recovery Point Selection:**  Based on R
