# Write a database backup and disaster recovery plan.
Agent: jordan
Generated: 2026-03-03T16:36:00.966469

## Database Backup & Disaster Recovery Plan

**Document Version:** 1.0
**Date:** October 26, 2023
**Prepared By:** [Your Name/Team Name]

**1. Introduction**

This document outlines the plan for backing up and recovering our database(s) ([Specify Database Names - e.g., Production MySQL, Development PostgreSQL]). The primary goal is to minimize data loss and downtime in the event of a system failure, natural disaster, or human error.  This plan covers backup procedures, recovery strategies, and roles and responsibilities.

**2. Database Overview**

* **Database Names:** [List all databases being protected]
* **Database Technologies:** [Specify the technology - e.g., MySQL, PostgreSQL, SQL Server, MongoDB]
* **Criticality:** [Rate the database's criticality - High, Medium, Low - based on business impact. This will influence Recovery Time Objectives (RTO) and Recovery Point Objectives (RPO).]
* **Storage Location:** [Specify the physical location of the database servers.  Include geographic location if relevant.]

**3. Recovery Time Objective (RTO)**

* **Definition:** The maximum acceptable downtime for a database following a disaster.
* **Target RTO:** [e.g., 4 hours, 8 hours, 24 hours] - This will be determined based on the criticality of the database.
* **Justification:** [Briefly explain the rationale behind the chosen RTO - e.g., "A 4-hour RTO is critical for our Order Processing database to ensure uninterrupted sales operations."]

**4. Recovery Point Objective (RPO)**

* **Definition:** The maximum acceptable amount of data loss measured in time.
* **Target RPO:** [e.g., 1 hour, 4 hours, 24 hours] -  This will be determined based on the criticality and business needs.
* **Justification:** [Briefly explain the rationale behind the chosen RPO - e.g., "A 1-hour RPO is necessary to minimize data loss for our Financial Reporting database."]


**5. Backup Procedures**

| Backup Type         | Frequency     | Retention Period | Storage Location      | Tools/Software     | Verification Method |
|----------------------|---------------|--------------------|-----------------------|--------------------|----------------------|
| **Full Backup**      | Weekly        | 4 Weeks             | [Cloud Storage/Tape] | [Backup Software - e.g., Veeam, Azure Backup] | Automated Verification |
| **Incremental Backup**| Daily         | 7 Days              | [Cloud Storage/Network Share] | [Backup Software] | Log Review          |
| **Transaction Log Backup**| Every 15 minutes | 24 Hours           | [Cloud Storage/Network Share] | [Database Engine Backup Utility] | Log Review & Shadow Copy Verification |
| **Offsite Backup**    | Automated     | 4 Weeks             | [Third-Party Backup Provider/Different Region Cloud] | [Backup Software] |  Restore Test          |

**Detailed Backup Steps (Example - MySQL):**

1. **Full Backup:** Run `mysqldump -u [Username] -p'[Password]' [DatabaseName] > full_backup_[timestamp].sql`
2. **Incremental Backup:** Run `mysqldump -u [Username] -p'[Password]' [DatabaseName] --where='id > [Last ID]' > incremental_backup_[timestamp].sql`
3. **Transaction Log Backup:**  (Specific commands will vary based on MySQL configuration) –  Likely involving `binlog_format=ROW` and regular rotation/archiving.

**6. Disaster Recovery Strategy**

* **Scenario 1: Minor Server Failure (Database remains
