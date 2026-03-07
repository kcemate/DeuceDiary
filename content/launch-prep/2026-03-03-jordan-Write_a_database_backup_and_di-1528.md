# Write a database backup and disaster recovery plan.
Agent: jordan
Generated: 2026-03-03T15:28:10.422316

## Database Backup and Disaster Recovery Plan

**Document Version:** 1.0
**Date:** October 26, 2023
**Prepared By:** [Your Name/Team Name]

**1. Introduction**

This document outlines the strategy for backing up and recovering our databases (Specify Database Names - e.g., “Production Sales Database”, “Development Reporting Database”) in the event of data loss, system failure, or disaster.  The goal is to minimize downtime and ensure business continuity.

**2. Scope**

This plan covers the following:

* **Databases:** [List all databases covered by this plan, including versions]
* **Backup Strategies:** Full, Incremental, and Transaction Log backups.
* **Recovery Time Objective (RTO):** [Define your RTO - e.g., 4 hours - the maximum acceptable downtime after a disaster]
* **Recovery Point Objective (RPO):** [Define your RPO - e.g., 1 hour - the maximum acceptable data loss]
* **Disaster Scenarios:** Hardware failure, Natural disaster, Cyberattack, Human error.


**3. Backup Procedures**

| Database Name          | Backup Type       | Frequency      | Storage Location(s)             | Retention Policy | Responsible Party |
|------------------------|--------------------|----------------|---------------------------------|--------------------|--------------------|
| [Database 1 Name]       | Full               | Weekly         | [e.g., AWS S3 Bucket, NAS]      | 4 Weeks            | [Team/Person]       |
| [Database 1 Name]       | Incremental       | Daily          | [e.g., AWS S3 Bucket, NAS]      | 7 Days             | [Team/Person]       |
| [Database 1 Name]       | Transaction Logs   | Every 15 mins | [e.g., AWS S3 Bucket, NAS]      | 24 Hours           | [Team/Person]       |
| [Database 2 Name]       | Full               | Weekly         | [e.g., AWS S3 Bucket, NAS]      | 4 Weeks            | [Team/Person]       |
| [Database 2 Name]       | Incremental       | Daily          | [e.g., AWS S3 Bucket, NAS]      | 7 Days             | [Team/Person]       |
| [Database 2 Name]       | Transaction Logs   | Every 15 mins | [e.g., AWS S3 Bucket, NAS]      | 24 Hours           | [Team/Person]       |
| ...                   | ...                | ...            | ...                             | ...                | ...                |


**Detailed Backup Instructions:**

* **Full Backups:** Complete copies of the database.
* **Incremental Backups:** Copies of data changed since the last *full* backup.
* **Transaction Log Backups:**  Copies of database transactions recorded since the last *full* backup.  Crucial for point-in-time recovery.
* **Backup Software:** [Specify Backup Software - e.g., pg_dump, MySQL Backup, Veeam Backup]
* **Automation:** Implement automated backup schedules using [Specify Tool - e.g., Cron, Task Scheduler, Backup Software Scheduler].  Regularly test these schedules.
* **Encryption:** All backups MUST be encrypted at rest and in transit for security. [Specify Encryption Method - e.g., AES-256, TLS]



**4. Disaster Recovery Procedures**

**4.1. Disaster Declaration & Activation**

* **Criteria for Declaration:**  A disaster is declared when the primary database systems are unavailable and impact business operations.
* **Notification:** Designated team member(s) will immediately notify key stakeholders (e.
