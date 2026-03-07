# Write a database backup and disaster recovery plan.
Agent: jordan
Generated: 2026-03-03T16:13:24.077177

## Database Backup and Disaster Recovery Plan

**Document Version:** 1.0
**Date:** October 26, 2023
**Prepared By:** [Your Name/Team Name]

**1. Introduction**

This document outlines the plan for backing up and recovering our database (hereinafter referred to as "the Database") in the event of data loss, system failure, or disaster. The primary goal is to minimize downtime, data loss, and disruption to business operations. This plan will be reviewed and updated at least annually, or more frequently if significant changes occur to the Database or IT infrastructure.

**2. Database Information**

* **Database Name:** [Database Name - e.g., CustomerDB]
* **Database Type:** [e.g., MySQL, PostgreSQL, SQL Server, MongoDB]
* **Server Location:** [e.g., AWS RDS Instance in us-east-1, On-Premise Server Room - [Address]]
* **Database Size:** [Approximate size - e.g., 500 GB]
* **Criticality:** [High/Medium/Low - Based on business impact if the database is unavailable]


**3. Backup Strategy**

We will employ a layered backup strategy combining the following methods:

* **3.1 Full Backups:**
    * **Frequency:** Weekly – [Day of Week] at [Time] (e.g., Sunday at 2:00 AM)
    * **Method:** [Specify method – e.g., Native Backup Tool (MySQLbackup), SQL Server Backup, MongoDB Dump & Restore]
    * **Retention:** 4 weeks
* **3.2 Incremental Backups (Optional - depends on database type and recovery time objectives):**
    * **Frequency:** Daily – Every day at [Time] (e.g., Daily at 1:00 AM)
    * **Method:** [Specify method - e.g., Transaction Log Shipping, Incremental Export]
    * **Retention:** 7 days –  Used for faster recovery but require more complex restoration procedures.
* **3.3 Transaction Log Backups (For Databases that support it - e.g., MySQL, PostgreSQL):**
    * **Frequency:** Continuous (Every 15-30 minutes – determined by Recovery Time Objective (RTO))
    * **Method:** [Specify method - e.g., Binary Log Replication]
    * **Retention:** 7 days –  Used for granular point-in-time recovery.


**4. Backup Storage Locations**

* **Primary Backup Location:** [Specify - e.g., AWS S3 Bucket - [Bucket Name]] –  Redundant and geographically diverse.
* **Secondary Backup Location:** [Specify - e.g., Azure Blob Storage,  On-Premise Backup Server] – For disaster recovery and offsite redundancy.
* **Verification Location:** [Specify - e.g., Test Server] – Used for regularly testing backups and verifying integrity.

**5. Disaster Recovery Plan**

**5.1 Activation Criteria:**

* **Server Failure:** Failure of the primary database server.
* **Network Outage:** Loss of connectivity to the database server.
* **Natural Disaster:**  Fire, flood, earthquake, etc., affecting the primary server location.
* **Ransomware Attack:** Detected malware compromising database integrity.

**5.2 Recovery Time Objective (RTO):** [Specify - e.g., 4 hours] – Maximum acceptable downtime.
**5.3 Recovery Point Objective (RPO):** [Specify - e.g., 15 minutes] – Maximum acceptable data loss.

**5.4 Recovery Procedures:**

1. **Assessment:** Determine the root cause of the disaster and assess the extent of the damage.
2
