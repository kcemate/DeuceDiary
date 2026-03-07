# Write a database backup and disaster recovery plan.
Agent: jordan
Generated: 2026-03-06T13:11:41.028929

## Database Backup and Disaster Recovery Plan

**Document Version:** 1.0
**Date:** October 26, 2023
**Prepared By:** [Your Name/Team Name]
**For:** [Database System Name - e.g., MySQL, PostgreSQL, SQL Server]
**Database Name:** [Specific Database Name - e.g., CustomerDB, SalesAppDB]

**1. Introduction**

This plan outlines the procedures for regularly backing up our critical database, [Database Name], and restoring it in the event of a disaster.  The primary goals are to minimize data loss, reduce downtime, and ensure business continuity. This plan is a living document and will be reviewed and updated at least annually, or more frequently based on changes to the database, infrastructure, or business requirements.

**2. System Overview**

* **Database System:** [Specify Database System – e.g., MySQL 8.0, PostgreSQL 14, SQL Server 2019]
* **Hardware Platform:** [Describe server specifications – e.g., AWS EC2 instance – t3.medium, Physical Server – Intel Xeon 2.5 GHz]
* **Operating System:** [Specify OS – e.g., Ubuntu 20.04, Windows Server 2019]
* **Backup Location(s):** [Specify locations – e.g., AWS S3, Azure Blob Storage, Offsite Backup Server]
* **Recovery Location:** [Describe recovery environment – e.g., Staging AWS EC2 instance,  Physical Server with latest OS]
* **Critical Data:** [List key tables and data points that are essential for business operations]

**3. Backup Strategy**

* **Backup Types:**
    * **Full Backup:**  A complete copy of the database.
    * **Incremental Backup:**  Only backs up data that has changed since the last backup (full or incremental).
    * **Differential Backup:**  Backs up all data that has changed since the last *full* backup.
* **Backup Frequency:**
    * **Full Backup:** Weekly (Sunday at 2:00 AM UTC)
    * **Incremental Backup:** Daily (Every evening at 8:00 PM UTC)
* **Backup Tool:** [Specify tool – e.g., `mysqldump`, `pg_dump`, SQL Server Management Studio, AWS Backup Service, Azure Backup Agent]
* **Retention Policy:**
    * **Full Backups:**  Retain for 4 weeks.
    * **Incremental Backups:** Retain for 7 days.
* **Data Verification:**  Each backup will be verified using [Specify Verification Method – e.g., checksums, partial restoration]

**4. Disaster Recovery Plan**

**4.1. Disaster Declaration Criteria:**

* **System Failure:** Server hardware failure, Operating system corruption, Database engine crash.
* **Data Corruption:** Detection of data inconsistencies or damage.
* **Network Outage:**  Prolonged loss of connectivity impacting database access.
* **Security Breach:**  Confirmed compromise of database security.

**4.2. Recovery Procedures (Step-by-Step)**

1. **Disaster Declaration:** Designated personnel (e.g., System Administrator, Database Administrator) assess the situation and formally declare a disaster.
2. **Communication:** Notify key stakeholders – IT Team, Business Users, Management – via [Specify Communication Method – e.g., Slack Channel, Email].
3. **Recovery Site Activation:**
    * **Cloud Recovery (Recommended):**  Provision a new, identical database instance on [Specify Recovery Platform – e.g., AWS EC2, Azure Virtual Machine].
    * **Physical Recovery:** Set up a temporary physical server with the appropriate OS and database software.
