# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-07T01:33:16.936178

## OWASP Top 10 Security Checklist

This checklist covers the key areas of the OWASP Top 10 vulnerabilities, providing a framework for assessing and mitigating risks in your application. It’s designed to be a starting point – tailor it to your specific application and environment.

**Frequency of Review:** This checklist should be reviewed and updated regularly (at least quarterly) and after any significant code changes, infrastructure updates, or security incidents.

**Categories:**

* **A. Injection:** (SQL Injection, Command Injection, LDAP Injection, etc.)
* **B. Broken Authentication:** (Weak Passwords, Lack of Multi-Factor Authentication, etc.)
* **C. Sensitive Data Exposure:** (Storing Data Insecurely, Insecure Communication, etc.)
* **D. XML External Entities (XXE):**
* **E. Broken Access Control:** (Insufficient Authorization, IDOR - Insecure Direct Object Reference)
* **F. Security Misconfiguration:** (Default Credentials, Unnecessary Services, Insecure Defaults)
* **G. Cross-Site Scripting (XSS):**
* **H. Insecure Deserialization:**
* **I. Using Components with Known Vulnerabilities:**
* **J. Insufficient Logging & Monitoring:**

---

**A. Injection**

* [ ] **Review Input Validation:**  Are all user inputs validated on both the client and server sides? Does validation handle all possible input types (e.g., numeric, email, date)?
* [ ] **Use Parameterized Queries/Prepared Statements:**  Are all database queries using parameterized queries or prepared statements to prevent SQL injection?
* [ ] **Avoid Dynamic SQL Construction:**  Is dynamic SQL construction avoided entirely or properly escaped?
* [ ] **Command Injection Protection:**  Are all system commands securely called, with appropriate sanitization and limiting user input?
* [ ] **LDAP Injection Protection:** Are LDAP queries properly constructed and sanitized to prevent injection vulnerabilities?


**B. Broken Authentication**

* [ ] **Strong Password Policies:** Are strong password policies enforced (length, complexity, etc.)?
* [ ] **Multi-Factor Authentication (MFA):** Is MFA implemented for all sensitive accounts and functionality?
* [ ] **Secure Session Management:** Are session IDs generated securely and protected with appropriate HTTPOnly and Secure flags?
* [ ] **Rate Limiting:** Are login attempts rate-limited to prevent brute-force attacks?
* [ ] **Password Reset Mechanisms:** Are password reset mechanisms robust and secure (e.g., token-based, account verification)?
* [ ] **Account Lockout Policies:** Are account lockout policies implemented after failed login attempts?


**C. Sensitive Data Exposure**

* [ ] **Data Classification:**  Is data classified based on sensitivity level?
* [ ] **Data Encryption at Rest:** Is sensitive data encrypted at rest (database, storage)?
* [ ] **Data Encryption in Transit:** Is sensitive data encrypted in transit (HTTPS, TLS)?  Verify certificate validity and configuration.
* [ ] **Secure Storage of Sensitive Data:** Is sensitive data stored securely, avoiding default configurations and unnecessary storage?  Avoid storing personally identifiable information (PII) whenever possible.
* [ ] **Masking/Redaction:**  Are sensitive data masked or redacted in logs, reports, and other non-production environments?


**D. XML External Entities (XXE)**

* [ ] **Disable External Entity Resolution:**  Is external entity resolution disabled in all XML parsers? (This is the primary mitigation).
* [ ] **Input Validation:**  Validate XML input against a known, trusted schema.
* [ ] **Content-Type Validation:**  Ensure the Content-Type header is correctly set and validated.


**E. Broken Access Control**

* [ ] **Principle of Least Privilege:**  Are
