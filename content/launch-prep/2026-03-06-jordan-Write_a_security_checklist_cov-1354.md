# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-06T13:54:40.948595

## OWASP Top 10 Security Checklist - Comprehensive

This checklist covers the vulnerabilities identified in the OWASP Top 10 (as of late 2023). It's designed to be used as a starting point for your security assessments and remediation efforts.  Remember to tailor it to your specific application, technology stack, and business context.

**I. Application Security Risks (All Top 10)**

**1. Injection (SQL, NoSQL, OS Command, LDAP):**

* **☐ Risk Assessment:**  Are we using user-supplied data directly in database queries, command execution, or other sensitive operations?
* **☐ Input Validation & Sanitization:** Are all user inputs rigorously validated against expected formats, types, and lengths?  Are appropriate escaping mechanisms used?
* **☐ Parameterized Queries/Prepared Statements:** Are we utilizing parameterized queries/prepared statements to separate data from code, preventing direct interpretation of user input?
* **☐ Least Privilege:**  Are database users and application processes running with the minimum necessary privileges?
* **☐ Monitoring & Logging:** Are injection attempts being logged and monitored for suspicious activity?

**2. Broken Authentication:**

* **☐ Strong Password Policies:** Are strong password policies enforced (length, complexity, rotation)?
* **☐ Multi-Factor Authentication (MFA):** Is MFA implemented for all user accounts, especially privileged ones?
* **☐ Secure Password Storage:** Are passwords securely hashed and salted using a robust algorithm (e.g., bcrypt, Argon2)? *Never* store passwords in plain text.
* **☐ Session Management:**  Are session IDs generated securely, invalidated upon logout, and protected from hijacking?
* **☐ Rate Limiting:**  Are login attempts rate-limited to prevent brute-force attacks?
* **☐ Account Lockout Policies:** Are account lockout policies in place after failed login attempts?


**3. Sensitive Data Exposure:**

* **☐ Data Classification:** Is data classified based on sensitivity (e.g., public, internal, confidential)?
* **☐ Data Encryption:** Is sensitive data encrypted both in transit (HTTPS) and at rest (database encryption)?
* **☐ Secure Storage:**  Is data stored securely, avoiding insecure storage locations (e.g., public cloud storage without encryption)?
* **☐ Access Controls:** Are access controls in place to restrict access to sensitive data based on the principle of least privilege?
* **☐ Data Masking/Tokenization:**  Are techniques like data masking or tokenization used for non-production environments or when displaying sensitive data?


**4. XML External Entities (XXE):**

* **☐ XML Parsing Restrictions:** Are XML parsing libraries configured to disable the processing of external entities?
* **☐ Input Validation:** Is user-supplied XML data thoroughly validated to prevent malicious entity references?
* **☐ Framework Security:** Are we using a framework or library that automatically mitigates XXE vulnerabilities?



**II. Specific Vulnerabilities (Remaining Top 10)**

**5. Broken Access Control:**

* **☐ Authorization Checks:** Are proper authorization checks implemented to ensure users can only access the resources they are permitted to access?
* **☐ Role-Based Access Control (RBAC):** Is RBAC used to manage user permissions?
* **☐ Input Validation (Access Control):**  Are user-supplied parameters validated to ensure they are legitimate values before applying access controls?
* **☐ Cross-Site Scripting (XSS) Prevention:** (See XSS below – closely related to access control)

**6. Security Misconfiguration:**

* **☐ Default Configurations:** Are default configurations of software, servers, and databases changed to more secure settings?
* **☐ Unnecessary Services:** Are unnecessary services and ports disabled?
* **☐ Vulnerable Software Versions:** Are software versions regularly updated to patch known vulnerabilities?
