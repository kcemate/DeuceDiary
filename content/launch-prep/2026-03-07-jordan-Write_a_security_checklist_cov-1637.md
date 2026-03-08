# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-07T16:37:03.542072

## OWASP Top 10 Security Checklist

This checklist covers the key vulnerabilities identified in the OWASP Top 10 (as of October 2023) and provides a framework for assessing your application’s security posture. It's designed to be a starting point and should be tailored to your specific application and environment.

**Note:** This is a high-level checklist.  Each section requires more detailed investigation and specific mitigation strategies.

**I. Injection (A - High)**

* **[ ] Input Validation & Sanitization:**  Are all user inputs rigorously validated on both the client-side and server-side? Does the system use a whitelist approach (allowing only known good characters/patterns)?
* **[ ] Parameterized Queries:**  Are you using parameterized queries (prepared statements) or ORMs to prevent SQL injection?  (Never directly concatenate user input into SQL queries.)
* **[ ] Stored Procedures:** If using stored procedures, are they properly parameterized and reviewed for potential vulnerabilities?
* **[ ] Command Injection:** Are you avoiding the execution of shell commands based on user input? If unavoidable, are they properly sanitized and carefully controlled?
* **[ ] XML External Entity (XXE) Injection:** Are you validating XML input and disabling external entity resolution?


**II. Broken Authentication (B - High)**

* **[ ] Strong Password Policies:** Are you enforcing strong password complexity requirements (length, characters, no common passwords)?
* **[ ] Multi-Factor Authentication (MFA):** Is MFA implemented for all users, particularly those with privileged access?
* **[ ] Session Management:** Are sessions properly secured with unique IDs, timeouts, and secure cookies (HTTPOnly, Secure flags)?
* **[ ] Account Lockout:** Are accounts locked out after multiple failed login attempts?
* **[ ] Password Reset Mechanisms:** Are password reset mechanisms secure and resistant to brute-force attacks?  (Rate limiting, verification codes)
* **[ ] API Authentication:**  Are APIs securely authenticated and authorized, often using API keys or OAuth?


**III. Sensitive Data Exposure (C - High)**

* **[ ] Data Classification:** Is sensitive data (PII, financial information, etc.) properly classified and handled?
* **[ ] Encryption in Transit:** Is all sensitive data transmitted over the network encrypted using HTTPS/TLS with strong ciphers?
* **[ ] Encryption at Rest:** Is sensitive data encrypted at rest using appropriate encryption algorithms and key management practices?
* **[ ] Data Masking/Tokenization:** Are techniques like data masking or tokenization used to protect sensitive data when it's not actively being used?
* **[ ] Logging and Monitoring:** Are logs properly configured to capture and monitor access to sensitive data?
* **[ ] Secure Data Disposal:** Are processes in place for securely disposing of data when it’s no longer needed?



**IV. Broken Access Control (D - High)**

* **[ ] Authorization Mechanisms:** Are robust authorization mechanisms in place to control access to resources based on user roles and permissions?
* **[ ] Principle of Least Privilege:** Are users and applications granted only the minimum level of access necessary to perform their tasks?
* **[ ] Cross-Site Scripting (XSS) Mitigation:** (See XSS below - often overlaps with access control issues)
* **[ ] Resource Access Control:**  Are resources properly protected against unauthorized access, both internally and externally?
* **[ ] Identity Management:** Is a centralized identity management system used to manage user identities and permissions?


**V. Security Misconfiguration (E - High)**

* **[ ] Default Configurations:** Are all default configurations changed to secure settings (e.g., disabling directory listing, setting secure HTTP headers)?
* **[ ] Unnecessary Services:** Are all unnecessary services and features disabled?
*
