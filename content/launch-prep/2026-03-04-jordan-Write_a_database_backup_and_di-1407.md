# Write a database backup and disaster recovery plan.
Agent: jordan
Generated: 2026-03-04T14:07:24.513959

## Database Backup and Disaster Recovery Plan

**Document Version:** 1.0
**Date:** October 26, 2023
**Prepared By:** [Your Name/Team Name]

**1. Introduction**

This document outlines the procedures for backing up and restoring our critical databases. It details our strategy for mitigating data loss and ensuring business continuity in the event of a disaster, including natural disasters, hardware failures, cyberattacks, or human error.  This plan is a living document and will be reviewed and updated at least annually or whenever significant changes occur to our environment or database systems.

**2. Scope**

This plan covers the following databases: [List all databases covered - e.g., Production CRM, Development Database, Reporting Database]

**3. Roles and Responsibilities**

| Role                | Responsibilities                                                                                                                                                                                          | Contact Information |
|---------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------|
| **Database Administrator (DBA)** | Overall responsibility for backup & recovery procedures, monitoring, testing, and maintaining backups.  Primary point of contact for disaster recovery.                                      | [DBA Email/Phone]      |
| **System Administrator (SysAdmin)** | Infrastructure support, server maintenance, network connectivity, and assisting with disaster recovery implementations.                                                                       | [SysAdmin Email/Phone] |
| **Application Owner(s)** | Understanding business impact of data loss, validating restoration procedures, and participating in recovery testing.                                                                              | [Application Owner Email] |
| **IT Security Team**  | Implementing security measures related to backups and disaster recovery, ensuring compliance with security policies.                                                                                | [Security Team Email/Phone]|


**4. Backup Strategy**

* **4.1 Backup Types:** We will utilize a layered backup strategy:
    * **Full Backups:** Performed weekly, during off-peak hours. These contain the entire database.
    * **Differential Backups:** Performed daily, capturing all changes since the last full backup.
    * **Transaction Log Backups:** Performed every 15-30 minutes (depending on transaction volume) to capture all changes since the last transaction log backup.
* **4.2 Backup Schedule:**
    * **Full Backup:** Sunday at 02:00 AM (UTC)
    * **Differential Backup:** Daily at 06:00 AM (UTC)
    * **Transaction Log Backup:** Every 15 minutes (automatic)
* **4.3 Backup Location:**
    * **Primary Backup Location (On-Site):** [Specify location – e.g., NAS device, Dedicated Backup Server] - For rapid recovery.
    * **Secondary Backup Location (Off-Site):** [Specify location – e.g., Cloud Storage (AWS S3, Azure Blob Storage), Dedicated Off-Site Backup Provider] - For protection against site-wide disasters.
* **4.4 Backup Software & Tools:** [Specify Software – e.g., Veeam, Backup Exec, native database tools]
* **4.5 Retention Policy:**
    * **Full Backups:** Retained for 3 months.
    * **Differential Backups:** Retained for 7 days.
    * **Transaction Log Backups:** Retained for 30 days.

**5. Disaster Recovery Strategy**

* **5.1 Recovery Time Objective (RTO):** [Define RTO - e.g., 4 hours - maximum acceptable downtime]
* **5.2 Recovery Point Objective (RPO):** [Define RPO - e.g., 30 minutes - maximum acceptable data loss]
* **5.3 Recovery Procedures:**
    * **Step 1: Disaster Declaration:** The DBA,
