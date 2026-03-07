# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T16:10:37.168895

Okay, here's a comprehensive security checklist covering the OWASP Top 10 vulnerabilities, broken down by category and with actionable steps. This checklist is designed to be used as a starting point and should be adapted to your specific application and environment.

**Important Disclaimer:** This is a general checklist. A thorough security assessment requires expert analysis and testing.  It's not a substitute for professional security consulting.

---

**I. General Security Practices (Applicable to All)**

* [ ] **Regular Security Awareness Training:** Ensure all developers, operations staff, and relevant personnel receive training on common vulnerabilities and secure coding practices.
* [ ] **Security Code Reviews:** Implement mandatory security code reviews for all changes, focusing on OWASP Top 10 vulnerabilities. Utilize automated tools to assist.
* [ ] **Static Application Security Testing (SAST):** Integrate SAST tools into the development pipeline to identify vulnerabilities early.
* [ ] **Dynamic Application Security Testing (DAST):** Perform DAST scans (e.g., using OWASP ZAP, Burp Suite) to identify vulnerabilities while the application is running.
* [ ] **Software Composition Analysis (SCA):**  Use SCA tools to identify vulnerabilities in third-party libraries and dependencies.  Maintain an inventory of all dependencies.
* [ ] **Vulnerability Management Program:** Establish a process for identifying, prioritizing, and remediating vulnerabilities.
* [ ] **Incident Response Plan:**  Develop and regularly test an incident response plan to handle security breaches effectively.
* [ ] **Secure Development Lifecycle (SDLC):** Integrate security into every stage of the development lifecycle – from requirements gathering to deployment and maintenance.


**II. OWASP Top 10 Vulnerabilities & Checklist Items**

**1. Broken Access Control (Top Priority)**

* [ ] **Authentication Verification:** Are all users authenticated before accessing sensitive data or functionality?  Implement multi-factor authentication (MFA) where appropriate.
* [ ] **Authorization Checks:** Are authorization checks performed consistently and correctly to restrict access based on user roles and permissions? (Principle of Least Privilege)
* [ ] **Session Management:**  Are sessions handled securely (e.g., session timeouts, invalidation on logout, protection against session hijacking)?
* [ ] **Input Validation:**  Proper input validation (discussed in other sections) is *critical* for access control.  Incorrect input can bypass access controls.
* [ ] **API Security:**  If using APIs, review access control mechanisms carefully – authentication, authorization, rate limiting.


**2. Injection (High Priority)**

* [ ] **SQL Injection Prevention:**
    * [ ] Use parameterized queries or prepared statements instead of string concatenation.
    * [ ] Sanitize all user input that is used in SQL queries.
    * [ ] Employ an Object-Relational Mapper (ORM) – when used correctly, can help prevent SQL injection.
* [ ] **Cross-Site Scripting (XSS) Prevention:**
    * [ ] Escape all user-generated content before displaying it on a web page.
    * [ ] Use Content Security Policy (CSP) to control the resources a browser is allowed to load.
* [ ] **Command Injection Prevention:**
    * [ ] Avoid constructing shell commands using user input.
    * [ ] If command execution is necessary, use a safe execution library.
    * [ ] Properly sanitize and validate all input before using it in a shell command.
* [ ] **LDAP Injection Prevention:** Apply similar principles to LDAP queries, validating and sanitizing inputs.


**3. Cryptographic Failures (High Priority)**

* [ ] **Strong Encryption:** Use strong, industry-standard encryption algorithms (e.g., AES-256) for sensitive data at rest and in transit.
* [ ] **Secure Key Management:**
