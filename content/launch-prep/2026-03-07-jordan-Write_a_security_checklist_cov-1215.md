# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-07T12:15:43.495029

## OWASP Top 10 Security Checklist

This checklist covers the core vulnerabilities identified in the OWASP Top 10. It’s designed to be a starting point for your security assessments and should be tailored to your specific application and environment.

**Note:** This checklist focuses on identifying potential vulnerabilities and doesn't detail remediation steps. That requires separate planning and implementation.

**1. Injection (SQL, XSS, Command, etc.) - Risk: High**

* **Goal:** Prevent attackers from injecting malicious code into your application.
* **Checklist Items:**
    * **Input Validation:** Are all user inputs validated rigorously on the server-side? (Whitelist approach is preferred)
    * **Parameterized Queries:** Are you using parameterized queries (prepared statements) with database connections? (Avoid string concatenation)
    * **Output Encoding:**  Is output properly encoded to prevent Cross-Site Scripting (XSS) attacks? (Context-aware encoding)
    * **Command Injection Protection:** Are you sanitizing and validating command-line inputs to prevent command injection?
    * **Configuration Management:** Are secrets (usernames, passwords, database connection strings) securely stored and not hardcoded in the application?


**2. Broken Authentication - Risk: High**

* **Goal:** Securely manage user identities and access control.
* **Checklist Items:**
    * **Strong Password Policies:** Are strong password requirements enforced (length, complexity, rotation)?
    * **Multi-Factor Authentication (MFA):** Is MFA implemented for critical accounts and applications?
    * **Session Management:** Are session IDs securely generated, validated, and invalidated on logout?
    * **Rate Limiting:** Are login attempts rate-limited to prevent brute-force attacks?
    * **Account Lockout:** Is there an account lockout mechanism after multiple failed login attempts?
    * **Privilege Separation:** Are users assigned only the necessary permissions to perform their tasks?


**3. Sensitive Data Exposure - Risk: High**

* **Goal:** Protect sensitive data at rest, in transit, and in use.
* **Checklist Items:**
    * **Data Classification:**  Is sensitive data identified and classified appropriately?
    * **Encryption at Rest:** Is sensitive data encrypted when stored (e.g., database, file storage)?
    * **Encryption in Transit:** Is data transmitted over the network encrypted (HTTPS, TLS)?
    * **Tokenization/Masking:** Are sensitive data elements tokenized or masked where possible? (e.g., credit card numbers)
    * **Data Loss Prevention (DLP):** Are DLP measures in place to prevent sensitive data from leaving the organization?


**4. XML External Entities (XXE) - Risk: Medium**

* **Goal:** Prevent attackers from exploiting XML parsers to access local files or external resources.
* **Checklist Items:**
    * **Disable External Entity Resolution:** Ensure your XML parser is configured to disable external entity resolution.
    * **Input Validation:** Carefully validate any XML input to ensure it doesn't contain malicious entities.
    * **Regular Updates:** Keep your XML parser and libraries up-to-date with security patches.


**5. Broken Access Control - Risk: High**

* **Goal:** Enforce proper access control mechanisms to restrict access to resources and functionality.
* **Checklist Items:**
    * **Role-Based Access Control (RBAC):**  Is RBAC implemented to manage user permissions effectively?
    * **Authorization Checks:** Are authorization checks performed for every access request, regardless of input source?
    * **Access Control Lists (ACLs):** Are ACLs properly configured to control access to files and directories?
    * **Consistent Enforcement:**  Are access control policies consistently enforced across all application tiers?


**6. Security
