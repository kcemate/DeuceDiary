# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T13:09:21.576794

## OWASP Top 10 Security Checklist

This checklist covers the key vulnerabilities identified in the OWASP Top 10 (as of Oct 26, 2023). It’s designed to be a starting point and should be tailored to your specific application and environment.  Frequency of review and remediation should be determined based on risk assessment.

**I. A01:2021 - Injection**

* **Definition:** Vulnerabilities where an attacker can insert malicious code into an application, often through user input.
* **Checklist Items:**
    * [ ]  Input validation performed consistently at all entry points (databases, APIs, web forms, etc.)?
    * [ ]  Use parameterized queries or prepared statements for all database interactions?
    * [ ]  Encoding/escaping of all user-supplied data before using it in commands or scripts?
    * [ ]  Regularly review and update third-party libraries and frameworks for injection vulnerabilities?
    * [ ]  Implement Web Application Firewalls (WAFs) to detect and block common injection attacks?
    * [ ]  Are there any internal systems accepting user input that could be exploited?


**II. A02:2021 - Broken Access Control**

* **Definition:** Vulnerabilities where an attacker can access resources they shouldn’t, bypassing authorization checks.
* **Checklist Items:**
    * [ ]  Access controls implemented consistently across all parts of the application?
    * [ ]  Role-Based Access Control (RBAC) or Attribute-Based Access Control (ABAC) correctly configured?
    * [ ]  Session management secure – using strong, unpredictable session IDs and proper session expiration?
    * [ ]  API authentication and authorization checks enforced correctly?
    * [ ]  Prevent horizontal and vertical privilege escalation? (e.g., users can’t access data from other users, admin can’t gain elevated privileges)
    * [ ]  Regularly reviewed and tested access control configurations?


**III. A03:2021 - Cryptographic Failures**

* **Definition:** Vulnerabilities related to weaknesses in encryption and key management.
* **Checklist Items:**
    [ ]  Sensitive data (passwords, credit card numbers, personal information) properly encrypted at rest and in transit?
    [ ]  Strong cryptographic algorithms used (e.g., AES-256 for data, TLS 1.2 or higher for transport)?
    [ ]  Keys securely generated, stored, and rotated regularly? (Consider Hardware Security Modules - HSMs)
    [ ]  Avoid weak or outdated encryption protocols? (e.g., SSLv3, RC4)
    [ ]  Verification that all storage mechanisms are using appropriate encryption?
    [ ]  Key Management System (KMS) implemented and regularly audited?



**IV. A04:2021 - Insecure Design**

* **Definition:**  Vulnerabilities stemming from flaws in the overall design of the application.
* **Checklist Items:**
    [ ]  Threat modeling performed regularly to identify potential vulnerabilities?
    [ ]  Security requirements defined and integrated into the development lifecycle?
    [ ]  Application architecture designed to minimize the attack surface? (e.g., separation of concerns)
    [ ]  Proper consideration of common security threats during design (e.g., injection, XSS)?
    [ ]  Secure coding practices followed consistently?


**V. A05:2021 - Vulnerable and Outdated Components**

* **Definition:** Using software components with known vulnerabilities.
* **Checklist Items:**
    [ ]  Software bill of materials (SBOM) maintained for all third-party components?
    [ ]  Regularly scan
