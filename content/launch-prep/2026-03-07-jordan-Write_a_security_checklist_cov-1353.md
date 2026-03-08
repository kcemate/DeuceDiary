# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-07T13:53:02.144934

## OWASP Top 10 Security Checklist - Comprehensive

This checklist is designed to guide you through assessing your application for vulnerabilities based on the OWASP Top 10. It's a starting point and should be adapted to your specific application and environment.  **Regular testing and updates are crucial.**

**Note:** This checklist uses a rating system for prioritization:
* **High:** Critical vulnerabilities that require immediate remediation.
* **Medium:** Significant vulnerabilities that should be addressed soon.
* **Low:**  Vulnerabilities that require monitoring and potential mitigation based on risk.


**1. Injection (SQL, NoSQL, OS Command, LDAP)**

* **Description:** Exploiting vulnerabilities where user-supplied data is used to construct database queries, shell commands, or LDAP searches without proper sanitization.
* **Checklist Items:**
    * [ ] **Input Validation:**  Are all user inputs validated against expected data types, formats, and lengths? (High)
    * [ ] **Parameterized Queries/Prepared Statements:**  Are database queries using parameterized queries/prepared statements to separate data from command structure? (High)
    * [ ] **Output Encoding:** Is data properly encoded before being displayed in web pages to prevent XSS and other injection attacks? (Medium)
    * [ ] **Stored Procedures:** Are stored procedures used for database interactions instead of dynamic SQL construction? (Medium)
    * [ ] **Access Control:**  Are database user accounts properly restricted with least privilege principles? (Medium)
    * [ ] **Logging & Monitoring:**  Are injection attempts logged and monitored for suspicious activity? (Low)


**2. Broken Authentication**

* **Description:** Flaws in authentication and session management that allow attackers to compromise accounts or impersonate users.
* **Checklist Items:**
    * [ ] **Strong Password Policies:** Are strong password policies enforced (length, complexity, expiration)? (High)
    * [ ] **Multi-Factor Authentication (MFA):** Is MFA implemented for sensitive accounts? (High)
    * [ ] **Secure Session Management:**  Are sessions secured with strong, randomly generated session IDs? (High)
    * [ ] **Session Timeout:** Are session timeouts configured appropriately? (Medium)
    * [ ] **Protection Against Brute-Force Attacks:** Are rate limiting and account lockout mechanisms in place? (Medium)
    * [ ] **Secure Storage of Credentials:** Are passwords and other credentials stored securely (hashed and salted)? (High)


**3. Sensitive Data Exposure**

* **Description:**  Failure to protect sensitive data (PII, credentials, etc.) in transit or at rest.
* **Checklist Items:**
    * [ ] **Data Classification:**  Is sensitive data classified appropriately? (Medium)
    * [ ] **Encryption in Transit:**  Is all sensitive data transmitted over HTTPS (TLS/SSL)? (High)
    * [ ] **Encryption at Rest:** Is sensitive data encrypted at rest (database, storage)? (High)
    * [ ] **Secure Storage of Secrets:**  Are API keys, passwords, and other secrets stored securely using a secrets management solution (e.g., HashiCorp Vault)? (High)
    * [ ] **Data Masking/Tokenization:** Is data masked or tokenized when not actively needed? (Low)


**4. XML External Entities (XXE)**

* **Description:**  Exploiting vulnerabilities in XML parsers that allow attackers to access local files or external resources.
* **Checklist Items:**
    * [ ] **Disable External Entity Processing:**  Is external entity processing disabled in XML parsers? (High)
    * [ ] **Input Validation:**  Is XML input validated to prevent malicious entities? (Medium)
    * [ ] **Proper Configuration:**  Are XML parsers
