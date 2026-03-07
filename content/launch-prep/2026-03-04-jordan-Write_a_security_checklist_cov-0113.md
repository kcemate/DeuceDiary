# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T01:13:48.139326

Okay, here's a comprehensive security checklist covering the OWASP Top 10 vulnerabilities, broken down by category and with suggested actions. This checklist is designed to be a starting point and should be tailored to your specific application and environment.

**Important Note:** This is a *checklist*, not a guaranteed solution.  Regular testing, vulnerability scanning, and security awareness training are crucial.

---

**I. Application Security (Focus:  Code & Design)**

**A. Broken Access Control (OWASP Top 3)**

* **Description:**  Failure to properly restrict access to resources and functionality based on user roles and permissions.
* **Checklist Items:**
    * [ ] **Authentication Enforcement:**  Are all critical actions requiring authentication?  Are authentication mechanisms strong (e.g., multi-factor authentication)?
    * [ ] **Authorization Checks:** Are authorization checks consistently applied across the application? Are they granular enough? (e.g., Does a user with "read" access to a resource also have "write" access?)
    * [ ] **Session Management:**  Are session identifiers securely generated and managed? Are sessions invalidated upon logout or inactivity?  Are session fixation and session hijacking prevented?
    * [ ] **Role-Based Access Control (RBAC) Implementation:** Is RBAC implemented correctly, with clear roles, permissions, and assignments?
    * [ ] **Input Validation for Access Control:** Are access control mechanisms dependent on validated user input?
* **Remediation:** Implement robust authentication and authorization controls, use established RBAC frameworks, and thoroughly validate user input before granting access.

**B. Injection (SQL Injection, XSS, Command Injection)**

* **Description:**  Exploitation of vulnerabilities where attacker-controlled input is used to manipulate database queries, execute arbitrary code, or execute shell commands.
* **Checklist Items:**
    * [ ] **SQL Injection:** Are all database queries parameterized or using an ORM that performs proper escaping?  Are you sanitizing user input before using it in database queries?
    * [ ] **Cross-Site Scripting (XSS):** Are all user-supplied inputs properly encoded before being displayed in the browser? (Including data retrieved from databases)  Are you using Content Security Policy (CSP)?
    * [ ] **Command Injection:** Are you avoiding the use of `system()` or similar functions with user-supplied input?  If unavoidable, are you carefully validating and sanitizing input?
* **Remediation:** Employ parameterized queries, use a secure ORM, encode user input properly, implement CSP, and avoid dangerous functions.

---

**II. Cryptographic Vulnerabilities (Focus: Data Protection)**

**C. Cryptographic Failures**

* **Description:**  Using weak or insecure cryptographic algorithms, keys, or implementations, leading to data compromise.
* **Checklist Items:**
    [ ] **Strong Algorithms:** Are you using approved cryptographic algorithms (e.g., AES-256, SHA-256)?  Are you *avoiding* outdated or weak algorithms (e.g., DES)?
    [ ] **Key Management:** Are cryptographic keys securely generated, stored, and rotated?  Are keys protected from unauthorized access? (Use Hardware Security Modules (HSMs) where appropriate)
    [ ] **Secure Implementation:** Are cryptographic operations implemented correctly, following best practices? (e.g., proper padding, initialization vectors)
    [ ] **Transport Layer Security (TLS):**  Is TLS enforced for all communication?  Is the TLS configuration secure (e.g., strong cipher suites, forward secrecy)?
* **Remediation:** Implement current best practices for cryptography, use HSMs, enforce TLS, and regularly audit your cryptographic implementations.


**III. Insecure Design (Focus: Architectural Decisions)**

**D. Insecure
