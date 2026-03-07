# Write a database backup and disaster recovery plan.
Agent: jordan
Generated: 2026-03-03T09:03:03.603884

## Database Backup & Disaster Recovery Plan

**Document Version:** 1.0
**Date:** October 26, 2023
**Prepared By:** [Your Name/Team Name]
**For:** [Database Name(s)]

**1. Introduction**

This plan outlines the procedures for regularly backing up our database(s) and the recovery steps to be taken in the event of a disaster. This plan aims to minimize data loss and downtime, ensuring business continuity.

**2. Scope**

This plan covers the following:

*   **Database(s):** [List all databases covered – e.g., "CustomerDB,” “ProductCatalog,” “ReportingDB”]
*   **Backup Frequency:** [Specify frequency – e.g., Full backup daily, Incremental backups hourly, Transaction Log backups every 15 minutes]
*   **Recovery Time Objective (RTO):** [Define the maximum acceptable downtime – e.g., 4 hours, 24 hours]
*   **Recovery Point Objective (RPO):** [Define the maximum acceptable data loss – e.g., 1 hour, 24 hours]


**3. Roles & Responsibilities**

| Role                  | Responsibilities                                                                                                       | Contact Information |
| --------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------- |
| **Database Administrator (DBA)** | Overall responsibility for backup and recovery procedures, monitoring, and troubleshooting.                      | [Phone Number]      |
| **System Administrator (SysAdmin)** | Infrastructure support for backups, storage, and network connectivity.                                         | [Phone Number]      |
| **IT Operations Team** | Support during disaster recovery, assisting with testing and execution of the plan.                                 | [Phone Number]      |
| **Business Owner/Stakeholder** | Approve the plan, understand RTO/RPO, and be notified of significant incidents.                                   | [Email Address]     |



**4. Backup Strategy**

* **Backup Types:**
    * **Full Backups:** [Specify schedule – e.g., Daily at 2:00 AM] – Complete copy of the entire database.
    * **Incremental Backups:** [Specify schedule – e.g., Hourly] –  Backs up only the changes made since the last backup (full or incremental).
    * **Transaction Log Backups:** [Specify schedule – e.g., Every 15 minutes] – Captures all database transactions since the last transaction log backup.
* **Backup Media:**
    * **Onsite Backup:** [e.g., Network Attached Storage (NAS) – Location: Server Room] – Faster restore times, primary backup.
    * **Offsite Backup:** [e.g., Cloud Storage (AWS S3, Azure Blob Storage) – Location: Geographically separate data center] – Protects against localized disasters.
* **Backup Software:** [Specify software – e.g.,  SQL Server Management Studio, Veeam Backup & Replication, Azure Backup]
* **Retention Policy:** [Define retention periods for each backup type - e.g., Full backups – 30 days, Incremental backups – 7 days, Transaction logs – 24 hours]


**5. Disaster Recovery Procedures**

* **Triggering a Disaster Recovery:**  A disaster is declared when [Define criteria – e.g., primary database server failure, natural disaster, ransomware attack].
* **Phase 1: Assessment & Notification**
    1.  **Identify the Impact:** Determine the extent of the damage and its impact on business operations.
    2.  **Activate Disaster Recovery Team:**  Notify designated roles and responsibilities.
    3.  **Initial Communication:**  Inform key stakeholders (Business Owner, IT Operations)
