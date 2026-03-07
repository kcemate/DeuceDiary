# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T12:33:56.855725

Okay, here's a comprehensive security checklist covering the OWASP Top 10 vulnerabilities, broken down into categories with actionable steps and considerations.  This is a starting point – you'll need to tailor it to your specific application, environment, and risk tolerance.

**Important Disclaimer:** This checklist is for informational purposes only. It's not a substitute for professional security assessments or penetration testing.  Regularly update this checklist as vulnerabilities evolve and your application changes.

---

**I. Overall Security Governance & Practices**

* [ ] **Security Policy:** Do you have a documented security policy outlining acceptable use, incident response, and data protection practices? (Review & Update Annually)
* [ ] **Risk Assessment:** Have you conducted a thorough risk assessment to identify vulnerabilities and prioritize remediation efforts? (At least Annually, or after major changes)
* [ ] **Secure Development Lifecycle (SDLC):**  Do you incorporate security practices into every stage of the SDLC, from design to deployment and maintenance?
* [ ] **Security Awareness Training:**  Are all developers, administrators, and users trained on common security threats and best practices? (Annual, plus awareness campaigns)
* [ ] **Change Management:** Do you have a controlled change management process to minimize the risk of introducing vulnerabilities during updates and deployments?


**II. OWASP Top 10 Vulnerabilities - Checklist Breakdown**

**1. Broken Access Control (Risk Level: High)**

* [ ] **Authentication Mechanism:** Is multi-factor authentication (MFA) implemented for sensitive areas?
* [ ] **Authorization Checks:** Are authorization checks consistently enforced across all parts of the application? (Specifically for API endpoints, database access, and file access)
* [ ] **Session Management:** Is session management secure? (Regular session expiration, protection against session hijacking)
* [ ] **Input Validation:** Are all user inputs validated to prevent injection attacks (see #3)?
* [ ] **Role-Based Access Control (RBAC):** Is RBAC correctly implemented and enforced? Are roles properly defined and permissions granular?
* [ ] **Test Authentication/Authorization:** Regularly test authentication and authorization logic.

**2. Cryptographic Failures (Risk Level: High)**

* [ ] **Data in Transit:**  Is all sensitive data transmitted over HTTPS (TLS)?  Ensure strong cipher suites are used. (Enforce HTTPS by default)
* [ ] **Data at Rest:** Is sensitive data encrypted at rest using appropriate encryption algorithms? (Consider field-level encryption for databases)
* [ ] **Key Management:** Are cryptographic keys securely generated, stored, and rotated? (Use Hardware Security Modules (HSMs) if appropriate)
* [ ] **Password Storage:**  Are passwords hashed and salted using strong, modern algorithms (e.g., bcrypt, Argon2)?  **Never store passwords in plaintext!**
* [ ] **Token Security:**  Are tokens (JWTs, etc.) securely generated, validated, and managed? (Proper expiration times, refresh mechanisms)


**3. Injection (Risk Level: Critical)**

* [ ] **SQL Injection:**  Are all database queries parameterized or use an ORM to prevent SQL injection? (Never concatenate user input directly into SQL queries)
* [ ] **Cross-Site Scripting (XSS):**  Are all user-supplied data properly escaped or sanitized before being displayed in the browser? (Use a context-aware escaping library)
* [ ] **Command Injection:**  Are all system commands executed securely, using parameterized commands or avoiding user input within commands?
* [ ] **LDAP Injection:**  Similar to SQL Injection, protect against LDAP injection vulnerabilities in applications that use LDAP directories.
* [ ] **NoSQL Injection:**  When using NoSQL databases, validate and sanitize user input carefully to prevent injection vulnerabilities.


**4. In
