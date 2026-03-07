# Write a database backup and disaster recovery plan.
Agent: jordan
Generated: 2026-03-03T14:42:49.308271

## Database Backup & Disaster Recovery Plan

**Document Version:** 1.0
**Date:** October 26, 2023
**Prepared by:** [Your Name/Team Name]

**1. Introduction**

This document outlines the strategy for backing up and recovering our database(s) – [Specify Database Names & Versions, e.g., MySQL 8.0, PostgreSQL 14] – to ensure business continuity in the event of a failure, disaster, or corruption. This plan aims to minimize downtime, data loss, and disruption to operations.

**2. Scope**

This plan covers all critical databases used for [Specify Business Processes, e.g., Order Management, Customer Relationship Management, Inventory Management].  It includes backup procedures, recovery strategies, and testing protocols.

**3. Roles and Responsibilities**

| Role                 | Responsibility                                                                | Contact Information |
|----------------------|--------------------------------------------------------------------------------|----------------------|
| **Database Administrator (DBA)** | Overall responsibility for backup and recovery, plan maintenance, monitoring. | [DBA Email/Phone]    |
| **System Administrator** | Infrastructure support (servers, network, storage), assisting with DR testing. | [SysAdmin Email/Phone] |
| **Application Team** | Ensuring application compatibility with backup/recovery procedures.            | [Application Team Email] |
| **IT Management**      | Approving the plan, allocating resources, overseeing progress.                | [IT Manager Email/Phone]|


**4. Backup Strategy**

* **Database:** [Specify Database Names]
* **Backup Type:** Full, Incremental, Differential (Decision based on Recovery Time Objective - RTO)
* **Frequency:**
    * **Full Backups:** [Frequency, e.g., Weekly] - Complete copy of the database.
    * **Incremental/Differential Backups:** [Frequency, e.g., Daily] -  Changes since the last full or incremental backup.
* **Backup Method:**
    * **Logical Backups:** [Specify Tool, e.g., mysqldump for MySQL, pg_dump for PostgreSQL] - Creates a logical copy of the database files.  Preferred for portability and restoration.
    * **Physical Backups (if applicable):** [Specify Tool, e.g., File System Snapshots] -  Direct copy of the database files. Faster restoration, but less portable.
* **Backup Storage Locations:**
    * **Primary (Onsite):** [Specify Location, e.g., NAS Device, Local Server] - Immediate recovery for minor incidents.
    * **Secondary (Offsite - Cloud):** [Specify Provider, e.g., AWS S3, Azure Blob Storage, Google Cloud Storage] - Protection against physical disasters.
    * **Tertiary (Offsite - Physical):** [Specify Location, e.g., Secure Data Center] - Redundant protection against regional disasters.

**5. Recovery Strategy**

* **Recovery Time Objective (RTO):** [Specify Time, e.g., 4 hours] – Maximum acceptable downtime.
* **Recovery Point Objective (RPO):** [Specify Time, e.g., 15 minutes] – Maximum acceptable data loss.
* **Recovery Procedures:**
    * **Minor Incidents (e.g., Single File Corruption):**  Restore from the most recent incremental/differential backup.
    * **Major Incidents (e.g., Server Failure, Database Corruption):**
        1. **Failover to Standby Server:** (If a standby server is configured) -  Switch application traffic to the backup server.
        2. **Restore from Offsite Backup:** Restore the database to a new server or a recovered server.
        3. **Application Verification & Testing:** Confirm data integrity
