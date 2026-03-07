# Write a database backup and disaster recovery plan.
Agent: jordan
Generated: 2026-03-04T01:39:21.736679

## Database Backup & Disaster Recovery Plan

**Document Version:** 1.0
**Date:** October 26, 2023
**Prepared By:** [Your Name/Team Name]

**1. Introduction**

This plan outlines the procedures for backing up and recovering our database systems (specifically [List Database Systems - e.g., MySQL, PostgreSQL, SQL Server]) in the event of data loss or system failure.  The goal is to minimize downtime, ensure data integrity, and maintain business continuity.

**2. Scope**

This plan covers all primary database systems used by [Your Organization Name] including:

*   [Database System 1: e.g., Production Database - Customer Data]
*   [Database System 2: e.g., Staging Database - Development/Testing]
*   [Database System 3: e.g., Reporting Database]

**3. Roles & Responsibilities**

| Role                  | Responsibilities                                                                                             | Contact Information        |
|-----------------------|-------------------------------------------------------------------------------------------------------------|-----------------------------|
| **Database Administrator (DBA)** | Overall responsibility for backup and recovery strategy, execution, and testing.  Primary contact for emergencies. | [DBA Email/Phone Number]     |
| **IT Operations Team** | Hardware maintenance, network connectivity, server support.                                                     | [IT Ops Email/Phone Number]   |
| **Business Stakeholders** | To be notified of downtime, confirm data integrity upon restoration, and validate recovery processes.   | [Stakeholder Email List]      |


**4. Backup Strategy**

* **Backup Types:** We will utilize a layered approach:
    * **Full Backups:**  Performed weekly, storing backups offsite. (Frequency: Weekly)
    * **Incremental Backups:**  Performed daily, capturing changes since the last incremental backup. (Frequency: Daily)
    * **Transaction Log Backups:** Performed every 15-30 minutes (depending on transaction volume), ensuring point-in-time recovery. (Frequency: Continuous - automated)
* **Backup Schedule:** (See table below for specific timing)
| Database System         | Full Backup   | Incremental Backup | Transaction Logs |
|-------------------------|---------------|--------------------|------------------|
| Production Database       | Sunday 00:00 | Daily 00:00        | Every 15-30 min |
| Staging Database          | Bi-Weekly    | Daily 00:00        | Every 15-30 min |
| Reporting Database        | Monthly       | Daily 00:00        | Every 15-30 min |
* **Backup Storage:**
    * **Onsite Storage:** Short-term storage for immediate access (e.g., NAS device).
    * **Offsite Storage (Cloud):** Backups are replicated to [Cloud Provider - e.g., AWS S3, Azure Blob Storage, Google Cloud Storage] for disaster recovery.
* **Backup Verification:**  Automated scripts will verify the integrity of backups weekly. Manual testing will be conducted quarterly.
* **Retention Policy:**
    * Full Backups: Retained for 6 months.
    * Incremental Backups: Retained for 2 weeks.
    * Transaction Logs: Retained for 7 days.

**5. Disaster Recovery Plan**

* **Trigger Events:** This plan will be activated in response to the following events:
    * System failure (hardware, software)
    * Natural disasters (flood, fire, earthquake)
    * Cyberattacks (ransomware, data breach)
    * Human error (accidental deletion, configuration changes)
* **Recovery Time Objective (RTO):** [Define R
