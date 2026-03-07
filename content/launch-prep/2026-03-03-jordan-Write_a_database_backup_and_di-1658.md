# Write a database backup and disaster recovery plan.
Agent: jordan
Generated: 2026-03-03T16:58:32.523043

## Database Backup and Disaster Recovery Plan

**Document Version:** 1.0
**Date:** October 26, 2023
**Prepared By:** [Your Name/Team Name]

**1. Introduction**

This document outlines the strategy for backing up and recovering our database (specify database name – e.g., “Production Customer Database”) in the event of data loss, corruption, or system failure. The primary goal is to minimize downtime, ensure data integrity, and allow for rapid restoration to a consistent state. This plan applies to [Specify Environment – e.g., Production Environment].

**2. Database Information**

* **Database Name:** [Specify Database Name]
* **Database Type:** [Specify Database Type – e.g., MySQL, PostgreSQL, SQL Server, Oracle]
* **Version:** [Specify Database Version]
* **Server Location:** [Physical or Cloud Location – e.g., AWS Region, Data Center Address]
* **Key Users/Contacts:** [List key personnel responsible for database administration, backups, and recovery]

**3. Backup Strategy**

**3.1. Backup Types:**

* **Full Backups:** Complete copy of the database.  Frequency: [e.g., Weekly, Monthly - Determined by Recovery Point Objective (RPO)]
* **Differential Backups:**  Copies all changes since the last *full* backup. Frequency: [e.g., Daily]
* **Transaction Log Backups (If Supported by Database Type):**  Copies of individual transactions. Frequency: [e.g., Every 15 minutes - Determined by Recovery Time Objective (RTO)]

**3.2. Backup Schedule:**

| Backup Type      | Frequency | Time of Execution | Storage Location        |
|------------------|-----------|--------------------|-------------------------|
| Full Backup       | [Weekly]   | [e.g., Sunday 2:00 AM] | [e.g., Offsite Cloud Storage] |
| Differential Backup | [Daily]    | [e.g., Monday 6:00 AM]  | [e.g., Offsite Cloud Storage] |
| Transaction Log Backup| [Every 15 mins]| [e.g., Continuous]    | [e.g., Offsite Cloud Storage] |


**3.3. Backup Media & Storage:**

* **Primary Storage:** [e.g., Network Attached Storage (NAS), Cloud Storage (AWS S3, Azure Blob Storage)] - [Location & Size]
* **Secondary (Offsite) Storage:** [e.g., AWS S3 Glacier, Azure Archive Storage] - [Location & Size] – Crucial for disaster recovery.
* **Backup Software:** [Specify Backup Software – e.g., MySQL Backup, Veeam, Azure SQL Backup]

**3.4. Backup Verification:**

* **Automated Verification:** [Specify automated checks – e.g., Automated test restores, log monitoring]
* **Manual Verification:** [Specify frequency – e.g., Monthly] - Involve key personnel to perform a full test restore to a staging environment.


**4. Disaster Recovery (DR) Strategy**

**4.1. Recovery Time Objective (RTO):** [Define the maximum acceptable downtime – e.g., 4 hours] – This is the target time to have the database operational.

**4.2. Recovery Point Objective (RPO):** [Define the maximum acceptable data loss – e.g., 15 minutes] – This is the age of data you can afford to lose.

**4.3. Recovery Procedures:**

* **Phase 1: Detection & Assessment:**
    * Monitor system health and database performance.
    * Verify backup integrity.
    * Assess the extent of the damage.
