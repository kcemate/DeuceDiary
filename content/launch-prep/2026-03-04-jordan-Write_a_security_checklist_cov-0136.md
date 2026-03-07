# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T01:36:31.841844

## OWASP Top 10 Security Checklist - A Comprehensive Guide

This checklist covers the core vulnerabilities identified in the OWASP Top 10, categorized by application type and with actionable steps for mitigation.  It's designed to be a starting point and should be tailored to your specific application and environment.

**I. Injection (Critical)**

* **Description:** Exploits vulnerabilities when user-supplied data is improperly incorporated into commands or queries.
* **Checklist Items:**
    * [ ] **Input Validation:**  Implement strict input validation on *all* user inputs (forms, APIs, command-line, etc.).  Use whitelisting (allowing only known good characters/patterns) instead of blacklisting.
    * [ ] **Parameterized Queries/Prepared Statements:** Use parameterized queries or prepared statements to prevent SQL injection.  Don't concatenate user input directly into SQL queries.
    * [ ] **Command Injection Prevention:** Avoid using shell commands directly with user input. If necessary, use safe alternatives like built-in libraries or functions.
    * [ ] **XML External Entity (XXE) Prevention:** Disable or restrict the processing of external entities in XML parsing.
    * [ ] **LDAP Injection Prevention:** Properly sanitize LDAP queries to prevent injection attacks.
* **Tools:** Static code analysis tools, dynamic application security testing (DAST), manual code review.


**II. Broken Authentication (Critical)**

* **Description:** Weaknesses in authentication mechanisms that allow attackers to impersonate users.
* **Checklist Items:**
    * [ ] **Strong Password Policies:** Enforce strong password complexity requirements (length, character types).
    * [ ] **Multi-Factor Authentication (MFA):** Implement MFA wherever possible, especially for sensitive accounts.
    * [ ] **Session Management:** Securely manage user sessions (session IDs, timeouts, cookies).  Use HTTP-only and secure cookies.
    * [ ] **Brute-Force Protection:** Implement rate limiting, account lockout, and CAPTCHA to prevent brute-force attacks.
    * [ ] **Password Reset Mechanisms:** Implement secure password reset flows with proper verification.
    * [ ] **Authentication Protocol Security:**  Ensure use of secure authentication protocols like OAuth 2.0, OpenID Connect, and SAML.
* **Tools:**  Security scanners, penetration testing, monitoring login attempts.


**III. Sensitive Data Exposure (Critical)**

* **Description:** Failure to protect sensitive data in transit and at rest.
* **Checklist Items:**
    * [ ] **Data Classification:** Identify and categorize sensitive data (PII, PHI, financial information).
    * [ ] **Encryption:** Encrypt sensitive data in transit (HTTPS/TLS) and at rest (database, storage).
    * [ ] **Tokenization/Masking:**  Use tokenization or masking to protect sensitive data when it doesn't need to be fully revealed.
    * [ ] **Data Loss Prevention (DLP):** Implement DLP solutions to monitor and prevent sensitive data from leaving the organization.
    * [ ] **Access Control:** Implement granular access controls based on the principle of least privilege.
* **Tools:**  SSL/TLS scanners, encryption audits, data loss prevention tools.


**IV. Broken Access Control (High)**

* **Description:** Failure to properly restrict access to resources based on user roles and permissions.
* **Checklist Items:**
    * [ ] **Role-Based Access Control (RBAC):** Implement RBAC to define and manage user permissions.
    * [ ] **Authorization Checks:** Ensure that all actions are authorized before executing them.
    * [ ] **Cross-Site Scripting (XSS) Mitigation:** Implement proper input validation and output encoding to prevent XSS attacks (which can bypass access controls).
    * [
