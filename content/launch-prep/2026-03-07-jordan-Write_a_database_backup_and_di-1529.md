# Write a database backup and disaster recovery plan.
Agent: jordan
Generated: 2026-03-07T15:29:19.495038

## Database Backup and Disaster Recovery Plan

**Document Version:** 1.0
**Date:** October 26, 2023
**Prepared By:** [Your Name/Team Name]
**Approved By:** [Executive Sponsor Name/Title]

**1. Introduction**

This document outlines the plan for backing up and recovering our database(s) ([Specify Database Name(s) - e.g., Production MySQL, Development PostgreSQL]). The primary goal is to minimize data loss and downtime in the event of a system failure, natural disaster, or other disruptive event. This plan covers backup strategies, recovery procedures, and roles & responsibilities.

**2. Scope**

This plan covers the following:

* **Database(s):** [Specify Database Name(s) and Version(s)]
* **Systems:** Servers hosting the database(s) (specify operating system, hardware specs)
* **Recovery Time Objective (RTO):** [Define the maximum acceptable downtime - e.g., 4 hours, 24 hours]
* **Recovery Point Objective (RPO):** [Define the maximum acceptable data loss - e.g., 1 hour, 24 hours]


**3. Backup Strategy**

* **Type of Backups:**
    * **Full Backups:** [Frequency - e.g., Weekly, Monthly] – Complete copy of the entire database.
    * **Incremental Backups:** [Frequency - e.g., Daily] – Copies only the changes made since the last backup (full or incremental).
    * **Differential Backups:** [Frequency - e.g., Daily] – Copies all changes made since the last full backup. (Less common than incremental)
* **Backup Technologies:** [Specify tools – e.g., MySQL Backup, pg_dump, AWS Database Migration Service, Veeam Backup]
* **Backup Location(s):**
    * **On-Site:** [Specify location – e.g., NAS device, Local Server] -  Fastest recovery, but vulnerable to local disasters.
    * **Off-Site (Cloud):** [Specify Provider – e.g., AWS S3, Azure Blob Storage, Google Cloud Storage] - Protection against local disasters.
    * **Off-Site (Physical):** [Specify Location - e.g., Secure Data Center] - For regulatory compliance or heightened disaster protection.
* **Retention Policy:**
    * **Full Backups:** [Retention Period – e.g., 3 Months, 6 Months]
    * **Incremental/Differential Backups:** [Retention Period – e.g., 7 Days, 30 Days]
* **Encryption:** All backups will be encrypted [Specify Encryption Method – e.g., AES-256] both in transit and at rest.

**4. Disaster Recovery Procedures**

* **Triggering the Disaster Recovery Plan:**  This plan is activated in response to any event impacting the availability of the database(s), including but not limited to:
    * Server Failure
    * Hardware Failure
    * Natural Disaster (Flood, Fire, Earthquake)
    * Data Corruption
    * Ransomware Attack
* **Phase 1: Assessment & Containment**
    * **Identification:**  Confirm the incident and its impact.
    * **Isolation:**  Immediately isolate affected systems to prevent further damage.
    * **Damage Assessment:**  Determine the extent of the damage and the potential for data loss.
* **Phase 2: Recovery (Step-by-Step)**
    1. **Notification:** Notify key stakeholders (IT Team, Management, Business Users) via [Communication Channel - e.g., Email, Slack, Phone].
    2. **Restore from Backup:** Utilize the most recent suitable backup based on RTO and RPO
