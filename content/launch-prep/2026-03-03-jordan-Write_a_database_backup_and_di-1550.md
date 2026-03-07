# Write a database backup and disaster recovery plan.
Agent: jordan
Generated: 2026-03-03T15:50:52.163834

## Database Backup and Disaster Recovery Plan

**Document Version:** 1.0
**Date:** October 26, 2023
**Prepared By:** [Your Name/Team Name]

**1. Introduction**

This document outlines the plan for backing up and restoring our database systems, ensuring business continuity and minimizing data loss in the event of a disaster. It defines procedures, responsibilities, and recovery time objectives (RTO) and recovery point objectives (RPO) for our critical databases.

**2. Scope**

This plan covers the following databases: [List all databases covered - e.g., CustomerDB, OrderDB, AnalyticsDB]

**3. System Overview**

* **Database Systems:** [Specify the database management system - e.g., MySQL, PostgreSQL, SQL Server, Oracle]
* **Servers:** [List server locations – e.g., Production Server - AWS EC2, Backup Server - On-Premise]
* **Network Topology:** [Briefly describe the network infrastructure relevant to database access]


**4. Roles and Responsibilities**

| Role             | Responsibility                                                    | Contact Information |
|------------------|------------------------------------------------------------------|----------------------|
| **Database Admin** | Overall responsibility for backups, recovery, and testing.       | [Email/Phone Number]   |
| **System Admin**  | Server maintenance, network connectivity, and infrastructure support.| [Email/Phone Number]   |
| **Security Admin**| Access control, security policies, and compliance.              | [Email/Phone Number]   |
| **Business Owner**| Defining RTO/RPO, validating recovery procedures.               | [Email/Phone Number]   |

**5. Backup Procedures**

* **Backup Types:**
    * **Full Backups:** [Frequency - e.g., Weekly, Monthly] – Complete copy of the database.
    * **Differential Backups:** [Frequency - e.g., Daily] – Changes since the last full backup.
    * **Transaction Log Backups:** [Frequency - e.g., Every 15 minutes] – Records of all database transactions. (For point-in-time recovery)
* **Backup Tools:** [Specify the tools used - e.g., `mysqldump`, pg_dump, SQL Server Management Studio, Oracle RMAN]
* **Backup Locations:**
    * **On-site Backup:** [Specify location – e.g., Network Attached Storage (NAS)] – Primary backup for quick restoration.
    * **Off-site Backup:** [Specify location – e.g., Cloud Storage (AWS S3, Azure Blob Storage), Third-Party Backup Service] – Disaster recovery backup for protection against site-wide failures.
* **Backup Schedule:** [Detailed schedule outlining the time and frequency of each backup type]
* **Backup Verification:**  Regularly verify backup integrity (e.g., spot-check recovery from a test backup).

**6. Disaster Recovery Plan**

* **Triggers for Activation:**
    * Server failure (hardware or software)
    * Network outage
    * Natural disaster (fire, flood, earthquake)
    * Ransomware attack
* **Recovery Time Objective (RTO):** [Define the maximum acceptable downtime - e.g., 4 hours, 24 hours] –  The target time to have the database operational after a disaster.
* **Recovery Point Objective (RPO):** [Define the maximum acceptable data loss - e.g., 1 hour, 24 hours] – The target period of transactions lost in a disaster.
* **Recovery Steps:**
    1. **Assessment:** Confirm the scope of the disaster and assess the impact on the database systems.
    2. **Activation:** Notify relevant stakeholders (Database
