# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T09:00:16.377144

## OWASP Top 10 Security Checklist

This checklist covers the top 10 web application security risks as defined by the OWASP (Open Web Application Security Project). It’s designed to be a starting point and should be tailored to your specific application and environment.  It's broken down by category, with questions to guide your assessment and suggested remediation steps.

**I. Injection (30%)**

* **Question 1: Input Validation:** Are all user inputs validated on both the client and server sides? (Crucial for all Injection types)
* **Question 2: SQL Injection:** Are parameterized queries or Object-Relational Mappers (ORMs) used to prevent SQL injection? (Check against string concatenation in SQL queries)
* **Question 3: NoSQL Injection:**  Are you using parameterized queries or escaping techniques to prevent NoSQL injection vulnerabilities, particularly when using document databases like MongoDB?
* **Question 4: Command Injection:** Are you directly executing system commands based on user input? If so, is input sanitized to prevent malicious commands?
* **Question 5: LDAP Injection:** Are you properly escaping and validating input when interacting with LDAP directories?


**II. Authentication & Authorization (24%)**

* **Question 6: Broken Authentication:** 
    *  Is weak or default passwords enforced? (Use strong password policies & hashing)
    *  Is multi-factor authentication (MFA) implemented for sensitive accounts?
    *  Are account lockout policies in place to prevent brute-force attacks?
    *  Are sessions properly managed and invalidated upon logout?
* **Question 7: Broken Access Control:**
    *  Are access controls consistently enforced based on roles and permissions?
    *  Is cross-site scripting (XSS) or other vulnerabilities leveraged to bypass access restrictions?
    *  Are there checks to prevent unauthorized access to sensitive data and functionalities?


**III. Cryptography (14%)**

* **Question 8: Using Outdated Cryptography:** Are you using deprecated or vulnerable cryptographic algorithms (e.g., MD5, SHA1)? (Upgrade to stronger algorithms like SHA-256 or higher)
* **Question 9: Improper Cryptographic Storage:** Is sensitive data (e.g., passwords, API keys) stored securely using appropriate hashing algorithms with salting? (Never store passwords in plain text!)
* **Question 10: Using Weak Random Number Generation:** Are you using a cryptographically secure random number generator (CSPRNG) for generating security tokens and secrets?



**IV.  Mass Assignment (11%)**

* **Question 11: Mass Assignment:**  Are you properly restricting the properties that can be set during object instantiation or updates to avoid unintended exposure of sensitive data? (e.g., automatically including `user_id` when creating a user object).



**V.  Security Misconfiguration (9%)**

* **Question 12: Default Credentials:** Are default credentials for applications, databases, and servers changed immediately?
* **Question 13: Insecure Configurations:** Are server configurations secure, including disabling unnecessary services, setting appropriate file permissions, and implementing proper firewall rules?
* **Question 14:  Unnecessary Services:**  Are all unnecessary services and components installed and running?
* **Question 15:  Insufficient Logging & Monitoring:** Are logs collected and monitored for suspicious activity?


**VI. Vulnerable and Outdated Components (8%)**

* **Question 16: Missing Update Management:** Do you have a process for tracking and applying security patches to all software components (OS, web server, frameworks, libraries)?
* **Question 17: Outdated Components:** Are you using the latest versions of all software components to mitigate known vulnerabilities? (Regular vulnerability scanning is
