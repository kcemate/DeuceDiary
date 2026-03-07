# Write a database backup and disaster recovery plan.
Agent: jordan
Generated: 2026-03-04T08:49:49.183196

## Database Backup & Disaster Recovery Plan

**Document Version:** 1.0
**Date:** October 26, 2023
**Prepared By:** [Your Name/Team Name]

**1. Introduction**

This document outlines the procedures for backing up and recovering our critical database(s) ([Specify Database Name(s) e.g., Production MySQL, Development PostgreSQL]).  It details the frequency of backups, recovery strategies, testing procedures, and contact information for key personnel. The primary goal is to minimize downtime and data loss in the event of a system failure, natural disaster, or human error.

**2. System Overview**

* **Database Name(s):** [Specify Database Name(s)]
* **Database Version(s):** [Specify Version(s) e.g., MySQL 8.0, PostgreSQL 14]
* **Server Location:** [Specify Location e.g., AWS US East, On-Premise Data Center]
* **Operating System:** [Specify OS e.g., Linux (Ubuntu), Windows Server]
* **Backup Software:** [Specify Software e.g., MySQL Backup, pg_dump, Veeam Backup]
* **Recovery Environment:** [Specify Recovery Environment e.g., Staging Server, Cloud Instance]

**3. Backup Strategy**

| Backup Type        | Frequency      | Retention Period | Storage Location  | Verification Method |
|---------------------|----------------|------------------|-------------------|-----------------------|
| **Full Backup**     | Weekly         | 4 Weeks           | [Specify Storage e.g., AWS S3] | Log Review, Data Integrity Check |
| **Differential Backup**| Daily          | 7 Days            | [Specify Storage e.g., AWS S3] | Log Review, Data Integrity Check |
| **Transaction Log Backup (if applicable)** | Every 15 Minutes| 24 Hours          | [Specify Storage e.g., AWS S3] | Log Review, Data Integrity Check |
| **Point-in-Time Recovery (PITR) (if applicable)**| Enabled           | -                | [Same as Full/Differential] |  |

**3.1 Backup Methods**

* **Full Backups:**  [Describe how full backups are performed - e.g., Using MySQL Backup script, pg_dump].
* **Differential Backups:** [Describe how differential backups are performed - e.g., Incremental backup, plus the base backup].
* **Transaction Log Backups (if applicable):** [Describe how transaction log backups are performed - e.g., Using replication, binary logs].
* **Snapshot Backups (if applicable - e.g., for VMs):** [Specify method and frequency - e.g., AWS snapshots every 24 hours].

**4. Disaster Recovery Plan**

**4.1 Triggering a Disaster Recovery Event:**  A disaster recovery event is declared when the primary database system is unavailable, causing a significant impact on business operations.

**4.2 Recovery Steps:**

1. **Declaration:** The designated Recovery Team Lead (see Section 6) will formally declare a disaster recovery event.
2. **Assessment:**  Determine the root cause of the failure.
3. **Recovery Environment Setup:**
    * **Provisioning:** Quickly provision a recovery environment based on the Recovery Environment description in Section 2.  This might involve creating a new virtual machine or using a cloud instance.
    * **Configuration:** Configure the recovery environment to mirror the primary database environment as closely as possible. This includes:
        * Database Version
        * Network Configuration (DNS, Firewall Rules)
        * User Accounts & Permissions
4. **Data Restoration:**
    * **Prioritize Restoration:** Restore data using the most recent available backup based on the backup strategy
