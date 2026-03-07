# Write a database backup and disaster recovery plan.
Agent: jordan
Generated: 2026-03-03T07:55:38.801396

## Database Backup & Disaster Recovery Plan

**Document Version:** 1.0
**Date:** October 26, 2023
**Prepared By:** [Your Name/Team Name]
**For:** [Database Name - e.g., Customer Database, Inventory System]

**1. Introduction**

This document outlines the plan for backing up and recovering our critical database, [Database Name]. The goal is to minimize data loss and downtime in the event of a disaster, ensuring business continuity.  This plan will be reviewed and tested regularly to maintain its effectiveness.

**2. Scope**

This plan covers the following:

*   **Database:** [Database Name] - [Version Number]
*   **Systems Affected:** Applications accessing the database, reporting systems, and any dependent processes.
*   **Recovery Time Objective (RTO):** [Define your RTO - e.g., 4 hours –  Maximum time acceptable for system downtime]
*   **Recovery Point Objective (RPO):** [Define your RPO - e.g., 15 minutes – Maximum acceptable data loss]
*   **Disaster Scenarios:** Hardware failure, natural disasters (flood, fire), ransomware attack, data corruption.


**3. Backup Strategy**

| Backup Type         | Frequency   | Retention Period | Location                     | Verification Method |
|----------------------|-------------|------------------|------------------------------|-----------------------|
| **Full Backup**      | Weekly      | 3 Months          | [Offsite Storage - e.g., AWS S3] | Log Review, Database Size |
| **Differential Backup** | Daily       | 7 Days            | [Local Storage - e.g., Network Share] | Log Review, Database Size |
| **Transaction Log Backup**| Continuous | 24 Hours         | [Offsite Storage - e.g., AWS S3] | Log Review, Database Size |



**3.1 Backup Tools & Technologies:**

*   **Backup Software:** [Specify Backup Software – e.g.,  SQL Server Management Studio,  AWS Backup, Veeam]
*   **Storage:** [Specify Storage Locations - e.g., AWS S3, Azure Blob Storage, Network Share]
*   **Automation:** [Describe automation tools - e.g., SQL Server Agent, Scheduled Tasks, CloudWatch Events]

**4. Disaster Recovery Procedures**

**4.1 Immediate Actions (Detection & Assessment)**

*   **Detection:** Monitoring systems (e.g., database performance, backup logs) will trigger alerts.
*   **Assessment:** Immediately assess the nature and extent of the disaster. Determine if the primary database is accessible.  Engage IT support and relevant stakeholders.

**4.2 Recovery Steps - Based on Scenario**

**Scenario 1: Minor Hardware Failure (Server Crash)**

1.  **Isolate:**  Immediately isolate the failed server.
2.  **Failover:** Initiate a failover to a secondary server (if configured - e.g., Always On Availability Group in SQL Server).
3.  **Restore:** Restore the latest full backup to the new server.
4.  **Apply Transaction Logs:** Apply the transaction logs from the most recent backup to minimize data loss.
5.  **Verify:** Thoroughly test the restored database for functionality and data integrity.

**Scenario 2: Major Disaster (Natural Disaster, Ransomware)**

1.  **Activate Disaster Recovery Team:** Assemble the designated recovery team.
2.  **Secure Infrastructure:**  Establish a secure recovery environment – ideally offsite.
3.  **Restore from Offsite Backup:** Restore the latest full backup from [Offsite Storage Location].
4.  **Apply Transaction Logs:** Apply transaction logs to the restoration point, prioritizing log application based on the impact of
