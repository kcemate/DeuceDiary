# Write a database backup and disaster recovery plan.
Agent: jordan
Generated: 2026-03-03T10:33:27.271086

## Database Backup & Disaster Recovery Plan

**Document Version:** 1.0
**Date:** October 26, 2023
**Prepared By:** [Your Name/Team Name]
**For:** [Database Name/System Name]

**1. Introduction**

This plan outlines the procedures for backing up and recovering the [Database Name] database to ensure business continuity in the event of data loss due to hardware failure, software corruption, natural disasters, or human error.  This plan aims to minimize downtime and data loss, allowing for a rapid restoration of services.

**2. Goals & Objectives**

* **Recovery Time Objective (RTO):** [Specify the maximum acceptable time to restore the database.  Example: 4 hours - This is the target for restoring operations after a failure.]
* **Recovery Point Objective (RPO):** [Specify the maximum acceptable data loss. Example: 1 hour - This is the target data age we aim to restore.]
* **Data Integrity:**  Ensure data accuracy and consistency during backup and recovery processes.
* **Operational Awareness:** Maintain clear communication and documented procedures for all stakeholders.


**3. Database Information**

* **Database Name:** [Database Name]
* **Database Version:** [Database Version - e.g., MySQL 8.0, PostgreSQL 14, SQL Server 2019]
* **Server Location:** [Physical Location of the Database Server - e.g., AWS US-East-1, On-Premise Data Center]
* **Backup Media:** [Types of Media Used - e.g., Cloud Storage (AWS S3, Azure Blob Storage), External Hard Drives, Network Attached Storage (NAS)]
* **Database Size:** [Current Database Size - e.g., 100GB]


**4. Backup Procedures**

| Backup Type        | Frequency   | Method                      | Retention Period | Storage Location | Verification Method |
|--------------------|-------------|-----------------------------|------------------|--------------------|---------------------|
| **Full Backup**     | Weekly      | [Specific Tool - e.g., mysqldump, pg_dump, SQL Server Management Studio] | 4 Weeks           | [Cloud Storage URL/Path] | Automated checks & PITR |
| **Incremental/Differential Backup**| Daily       | [Specific Tool - e.g.,  Incremental MySQL Backup] | 7 Days            | [Cloud Storage URL/Path] | Automated checks    |
| **Transaction Log Backups** | Continuous | [Specific Tool - e.g., MySQL Binary Logs, SQL Server Transaction Logs] | 24 Hours          | [Cloud Storage URL/Path] | Automated checks    |


**4.1. Backup Tools & Scripts:**

* **[Tool Name]:** [Brief Description & Version] - Used for [Specific Backup Task]
* **[Script Name]:** [Description of Script] – Responsible for [Detailed Task]
* **Automation:**  All backups will be automated using [Scheduling Tool – e.g., Cron, Windows Task Scheduler, Cloud Automation Service].


**5. Disaster Recovery Procedures**

**5.1. Scenario Identification & Trigger:**

* **Trigger Events:**  System failure, server hardware failure, data corruption, natural disaster (fire, flood, earthquake), ransomware attack.
* **Alerting:** [Specify alerting mechanisms - e.g., Monitoring system alerts, Email notifications, SMS alerts].

**5.2. Recovery Steps (Following a Failure):**

1. **Confirmation & Assessment:** Verify the nature and extent of the failure.
2. **Isolation:** Immediately isolate the affected server to prevent further damage.
3. **Backup Selection:** Based on RPO and available backup, determine the appropriate backup to restore from.
4. **Restoration:**
