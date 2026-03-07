# Write a database backup and disaster recovery plan.
Agent: jordan
Generated: 2026-03-03T18:06:25.977938

## Database Backup & Disaster Recovery Plan

**Document Version:** 1.0
**Date:** October 26, 2023
**Prepared by:** [Your Name/Team Name]

**1. Introduction**

This plan outlines the procedures for backing up and restoring our database(s) ([Specify Database Name(s), e.g., Production, Staging, Development]) to ensure business continuity in the event of data loss, system failure, or disaster. This plan aims to minimize downtime, data loss, and disruption to operations.

**2. Scope**

This plan covers:

* **Data Backup:** Scheduling, methods, and storage of backups.
* **Disaster Recovery:** Procedures for restoring databases in case of a disaster.
* **Testing & Validation:** Regularly testing the backup and recovery procedures.
* **Roles & Responsibilities:** Clearly defined roles for executing the plan.


**3. Database Details**

* **Database Name(s):** [List all databases covered]
* **Database Server(s):** [Specify Server IPs or Hostnames]
* **Operating System:** [e.g., Windows Server, Linux]
* **Database Engine:** [e.g., MySQL, PostgreSQL, SQL Server]
* **Current Size:** [Approximate size of each database]
* **Recovery Point Objective (RPO):** [e.g., 1 hour – the maximum acceptable data loss]
* **Recovery Time Objective (RTO):** [e.g., 4 hours – the maximum acceptable downtime]



**4. Backup Procedures**

| Backup Type        | Frequency       | Method                 | Storage Location         | Retention Policy |
|---------------------|-----------------|------------------------|--------------------------|--------------------|
| **Full Backup**       | Weekly          | [e.g., Native Database Tool, Third-Party Software] | [e.g., Cloud Storage (AWS S3, Azure Blob), Offsite Tape Drive] | 1 Month            |
| **Incremental Backup**| Daily           | [e.g., Native Database Tool, Third-Party Software] | [Same as Full Backup]    | 7 Days             |
| **Transaction Log Backup**| Every 15 mins | [e.g., Native Database Tool] | [Same as Full Backup]    | 24 Hours           |
| **Synthetic Full Backup** (If applicable - recommended for complex databases) | [e.g.,  Automated process combining incremental and full] | [Specify method] | [Same as Full Backup] | 1 Month           |


**Detailed Backup Instructions:**
* [Provide detailed step-by-step instructions for each backup type. Include commands, screenshots, or links to relevant documentation.]
* **Automation:**  All backups should be automated using [e.g.,  Database Scheduler, Task Scheduler, Cloud Automation Tools].

**5. Disaster Recovery Procedures**

**5.1. Disaster Declaration & Notification**

* **Trigger:** A disaster is declared when the primary database server is unavailable, experiencing significant performance issues, or impacted by a major event (fire, flood, ransomware attack).
* **Notification:**  The following parties will be notified immediately:
    * IT Manager
    * Database Administrator
    * Relevant Business Stakeholders
    * [Other Key Personnel]
* **Communication Channel:** [Specify preferred communication method – e.g., Phone, Email, Slack Channel]


**5.2. Recovery Steps (RTO-Specific)**

* **Recovery Time Objective (4 Hours - Example)**

    * **Phase 1 (0-1 Hour):  Assessment & Verification**
        * Confirm the nature of the disaster.
        * Verify the integrity of backup copies.
        * Communicate with stakeholders.
    * **Phase
