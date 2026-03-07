# Write a database backup and disaster recovery plan.
Agent: jordan
Generated: 2026-03-03T22:38:14.818013

## Database Backup and Disaster Recovery Plan

**Document Version:** 1.0
**Date:** October 26, 2023
**Prepared By:** [Your Name/Team Name]
**For:** [Database Name]

**1. Introduction**

This document outlines the strategy for backing up and restoring our [Database Name] database, ensuring business continuity in the event of data loss due to hardware failure, software corruption, natural disasters, or human error. This plan details backup procedures, retention policies, recovery procedures, and contact information.

**2. Business Impact Analysis (BIA)**

* **Criticality of Database:** [High/Medium/Low] - This designation determines the Recovery Time Objective (RTO) and Recovery Point Objective (RPO) goals.
* **RTO (Recovery Time Objective):** The maximum acceptable time to restore database operations.
    * **High:** [e.g., 2 hours] - Requires immediate restoration.
    * **Medium:** [e.g., 4 hours] - Restoration within a defined timeframe.
    * **Low:** [e.g., 8 hours] - Restoration within a longer timeframe, with minimal impact.
* **RPO (Recovery Point Objective):** The maximum acceptable data loss in the event of a disaster.
    * **High:** [e.g., 24 hours] - Data loss acceptable up to a day.
    * **Medium:** [e.g., 4 hours] - Data loss acceptable up to a few hours.
    * **Low:** [e.g., 15 minutes] - Data loss unacceptable, requiring near real-time backups.


**3. Backup Procedures**

| Backup Type          | Frequency | Method        | Retention Period | Location            | Responsibility   |
|-----------------------|-----------|---------------|-------------------|---------------------|------------------|
| **Full Backup**        | Weekly    | [e.g., Automated Tool, Script] | 3 Months           | [e.g., Cloud Storage] | [System Admin]   |
| **Incremental Backup** | Daily     | [e.g., Automated Tool, Script] | 7 Days            | [e.g., Cloud Storage] | [System Admin]   |
| **Transaction Log Backup**| Every 15 Minutes | [e.g., Automated Tool, Script] | 24 Hours          | [e.g., Cloud Storage] | [Database Admin] |
| **Image Backup (Optional)** | Monthly  | [e.g., Full VM Backup] | 6 Months           | [e.g., Offsite Location] | [System Admin]   |


**3.1 Backup Software/Tools:** [Specify the software being used - e.g., Veeam, Azure Backup, Backup Exec]
**3.2 Backup Scheduling:** [Define the automated scheduling parameters for each backup type.]
**3.3 Backup Verification:** [Describe the process for verifying backup integrity - e.g., Test restores weekly.]

**4. Disaster Recovery Procedures**

**4.1 Disaster Declaration:**
* **Criteria:** A disaster is declared when [Define clear criteria – e.g., critical database downtime exceeds RTO, confirmed data corruption, significant hardware failure].
* **Notification:** Immediately notify: [List key stakeholders – e.g., IT Director, Database Admin, Business Operations Manager].

**4.2 Recovery Steps:**

1. **Assessment:**  Determine the extent of the disaster and identify affected systems/data.
2. **Activate Disaster Recovery Plan:**  This document is activated.
3. **Restore Point Selection:** Based on RPO, determine the appropriate restore point.
4. **Recovery Server Setup:** Provision a temporary or failover server.
5. **Restore
