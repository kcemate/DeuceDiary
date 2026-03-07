# Write a database backup and disaster recovery plan.
Agent: jordan
Generated: 2026-03-04T11:06:08.202545

## Database Backup & Disaster Recovery Plan

**Document Version:** 1.0
**Date:** October 26, 2023
**Prepared By:** [Your Name/Team Name]
**For:** [Database Name(s)]
**Purpose:** This plan outlines the procedures for regular database backups and recovery strategies in the event of data loss or system failure.

**1. Introduction**

This plan aims to minimize downtime and data loss resulting from unforeseen events, including hardware failures, software errors, natural disasters, and human error.  It’s a living document and should be reviewed and updated at least annually or after any significant changes to the database environment.

**2. System Overview**

* **Database Server(s):** [Specify server names/IP addresses]
* **Database Engine:** [e.g., MySQL, PostgreSQL, SQL Server, Oracle]
* **Operating System:** [e.g., Windows Server, Linux]
* **Network Topology:** [Briefly describe network connectivity]
* **Key Applications Dependent on Database:** [List applications using the database]

**3. Backup Strategy**

| Backup Type          | Frequency   | Retention Period | Storage Location(s)          | Method          | Verification |
|-----------------------|-------------|-------------------|------------------------------|-----------------|---------------|
| **Full Backup**        | Weekly      | 4 Weeks            | [e.g., Cloud Storage - AWS S3, Azure Blob Storage] | [e.g., Database Backup Utility, Third-Party Tool] | Daily Log Review |
| **Incremental Backup** | Daily       | 7 Days             | [Same as Full Backup]       | [Same as Full Backup] |  -            |
| **Transaction Log Backup (if applicable)** | Every 15 Minutes | 24 Hours          | [Same as Full Backup]       | [Database Engine Tool] |  -            |
| **Synthetic Full Backup (if applicable)** |  -         | N/A                |  [Same as Full Backup]        | [Reconstructing Full Backup from Incremental/Log Backups] | -           |



**4. Disaster Recovery Procedures**

**4.1. Trigger Events & Response Levels:**

| Trigger Event | Response Level | Actions                                                                          | Contact Person(s) |
|-----------------|----------------|----------------------------------------------------------------------------------|--------------------|
| **Minor Hardware Failure (e.g., disk error)** | Level 1       | Restart server, run diagnostics, monitor system health.                        | [IT Support]       |
| **Major Hardware Failure (e.g., server crash)** | Level 2       | Activate Disaster Recovery Plan, initiate failover to secondary server.           | [DBA, IT Manager]  |
| **Software Corruption** | Level 2       | Restore from last known good backup, investigate root cause.                        | [DBA]             |
| **Natural Disaster (e.g., flood, fire)** | Level 3       | Activate Offsite Backup, implement remote access, prioritize critical data recovery.| [DBA, IT Manager, Management] |

**4.2. Recovery Steps (General - Specific steps will vary based on database engine and environment)**

1. **Assessment:** Determine the scope of the damage/failure.
2. **Communication:** Notify key stakeholders (management, application teams, support).
3. **Failover (If applicable):**  Switch to a secondary server or cloud instance. This will likely involve:
   *  Database server shutdown and restart on the secondary.
   *  DNS updates to point to the new server.
   *  Application configuration updates.
4. **Backup Restoration:**  Restore the database from the appropriate backup (full, incremental, transaction logs) based on the Recovery
