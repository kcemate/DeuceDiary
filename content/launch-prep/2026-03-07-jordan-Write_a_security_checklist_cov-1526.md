# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-07T15:26:41.392578

## Security Checklist: Covering OWASP Top 10 (2021)

This checklist is designed to help you systematically assess your application’s security posture against the OWASP Top 10 vulnerabilities. It’s a starting point and should be tailored to your specific application and environment.

**I. Application Security Assessment – Overall**

*   **Frequency:** Conduct regular security assessments – at least annually, and ideally with each significant code change or deployment.
*   **Documentation:** Maintain comprehensive documentation of your security architecture, policies, and procedures.
*   **Risk Assessment:** Perform a thorough risk assessment to identify and prioritize vulnerabilities based on potential impact and likelihood.
*   **Secure Development Lifecycle (SDLC):** Implement a robust SDLC that incorporates security considerations at every stage, from design to deployment and maintenance.
*   **Developer Training:**  Ensure developers are trained on secure coding practices and common vulnerabilities.
*   **Static Analysis Security Testing (SAST):** Implement SAST tools to automatically scan code for vulnerabilities.
*   **Dynamic Analysis Security Testing (DAST):** Implement DAST tools to test the running application for vulnerabilities.
*   **Penetration Testing:** Engage a qualified penetration testing team to conduct regular penetration tests.
*   **Vulnerability Scanning:** Utilize automated vulnerability scanners to identify known vulnerabilities in your infrastructure and applications.

---

**II. OWASP Top 10 Vulnerabilities & Checklist Items**

**1. Broken Access Control (Critical)**

*   ☐ **Authentication Mechanisms:** Are strong authentication methods (e.g., multi-factor authentication - MFA) enforced for all users?
*   ☐ **Authorization Checks:** Are authorization checks consistently applied throughout the application to restrict access to sensitive data and functionality? (RBAC, ABAC)
*   ☐ **Session Management:** Is session management secure (e.g., proper session timeout, regenerating session IDs, HTTPOnly and Secure flags)?
*   ☐ **API Access Control:** Do APIs have robust authentication and authorization mechanisms to prevent unauthorized access?
*   ☐ **Input Validation:** Is input validation consistently performed to prevent users from bypassing access control rules?

**2. Injection (Critical)**

*   ☐ **SQL Injection:** Are all user inputs properly sanitized and parameterized to prevent SQL injection attacks? (Use ORMs, prepared statements)
*   ☐ **Cross-Site Scripting (XSS):** Are all user-supplied data properly escaped before being displayed in the browser? (Context-aware output encoding)
*   ☐ **Command Injection:** Are all user inputs properly validated and sanitized to prevent command injection attacks?
*   ☐ **LDAP Injection:** Are all user inputs properly validated and sanitized to prevent LDAP injection attacks?
*   ☐ **Other Injection Vectors:**  Are you considering other potential injection vulnerabilities based on your technology stack?


**3. Cryptographic Failures (High)**

*   ☐ **Data Encryption:** Is sensitive data (e.g., passwords, financial information) encrypted both in transit (TLS/SSL) and at rest?
*   ☐ **Key Management:** Are cryptographic keys securely generated, stored, and rotated?  (Use Hardware Security Modules - HSMs)
*   ☐ **Hashing Algorithms:** Are strong, up-to-date hashing algorithms used for password storage? (e.g., Argon2, bcrypt)
*   ☐ **Secure Random Number Generation:** Are random numbers used for cryptographic purposes generated securely? (Use cryptographically secure random number generators - CSPRNGs)


**4. Insecure Design (High)**

*   ☐ **Threat Modeling:**  Have you conducted a threat model to identify potential attack vectors and prioritize security controls?
*   ☐ **Secure Architecture:** Is the application designed with security best practices in mind (e.g., least privilege, defense in depth)?
*   ☐ **
