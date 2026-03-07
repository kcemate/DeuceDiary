# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T12:23:58.104076

## OWASP Top 10 Security Checklist - A Comprehensive Guide

This checklist is designed to help you systematically assess your application’s security posture based on the OWASP Top 10 vulnerabilities. It's a starting point and needs to be tailored to your specific application and environment.

**This checklist is divided into categories, mirroring the OWASP Top 10, with suggested testing methods and key considerations.**

**I. Injection (A1, A2)**

* **Description:** Exploiting vulnerabilities where untrusted data is used to construct SQL queries, OS commands, or other code execution contexts.
* **Testing Methods:**
    * **SQL Injection:**  Manual fuzzing with SQLi tools (SQLmap), automated scanning, testing input validation thoroughly.
    * **Command Injection:**  Manual fuzzing with command injection payloads, using specialized tools.
    * **LDAP Injection:**  Testing for manipulation of LDAP queries.
    * **NoSQL Injection:** Testing for injection into NoSQL databases.
* **Key Considerations:**
    * **Input Validation:** Implement robust, whitelisting-based input validation.
    * **Parameterized Queries:** Utilize parameterized queries or prepared statements for all database interactions.
    * **Least Privilege:**  Grant database and OS accounts only the necessary permissions.
    * **Escaping:**  Don’t rely solely on escaping; it's often insufficient.

**II. Broken Authentication (A3, A4)**

* **Description:** Weaknesses in authentication and session management allowing unauthorized access.
* **Testing Methods:**
    * **Credential Stuffing:**  Attempt to log in with known compromised credentials.
    * **Brute Force Attacks:** Monitor login attempts and implement rate limiting.
    * **Session Management:**  Analyze session ID generation, storage, and expiration.
    * **Weak Password Policies:**  Verify password strength requirements and enforcement.
    * **Multi-Factor Authentication (MFA):** Assess the implementation and coverage of MFA.
* **Key Considerations:**
    * **Strong Password Policies:** Enforce complex passwords and regular changes.
    * **Secure Session Management:** Use strong session IDs, short expiry times, and secure storage.
    * **Rate Limiting:**  Prevent brute force attacks.
    * **MFA Implementation:**  Implement MFA for sensitive accounts.

**III. Sensitive Data Exposure (A5, A6)**

* **Description:**  Unprotected exposure of sensitive data like passwords, API keys, and personally identifiable information (PII).
* **Testing Methods:**
    * **Data Leakage:**  Inspect application logs, database queries, and source code for exposed sensitive data.
    * **Configuration Management:**  Review configuration files for exposed credentials.
    * **API Security:** Analyze API endpoints for sensitive data transmission or storage.
    * **PII Handling:**  Ensure proper anonymization, masking, or encryption of PII.
* **Key Considerations:**
    * **Data Minimization:**  Collect only necessary data.
    * **Encryption:**  Encrypt sensitive data at rest and in transit.
    * **Secure Storage:**  Store sensitive data securely using appropriate storage mechanisms.
    * **Regular Audits:** Conduct regular audits to identify and address data exposure risks.

**IV. XML External Entities (XXE) (A7)**

* **Description:** Exploiting vulnerabilities in XML parsers that allow attackers to access local files or external resources.
* **Testing Methods:**
    * **Manual XXE Payload Testing:** Craft XXE payloads to attempt file reads, remote code execution, or denial of service.
    * **Automated Scanning:** Utilize tools specifically designed for XXE vulnerability scanning.
* **Key Considerations:**
    * **Disable External Entity Processing:**  Configure XML parsers to disable external entity processing.
