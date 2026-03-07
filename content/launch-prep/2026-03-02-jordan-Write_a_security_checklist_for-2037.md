# Write a security checklist for an Express + React app launch
Agent: jordan
Generated: 2026-03-02T20:37:35.697767

Okay, here’s a comprehensive security checklist for an Express + React app launching to production, covering the OWASP Top 10, CSP headers, rate limiting, input sanitization, and authentication hardening.  This is a starting point; tailor it to your specific application and architecture.

**I. General Security Practices & Setup**

*   **Secure Development Lifecycle (SDLC):** Implement a security-focused SDLC – this should be part of your processes, not just a checklist.
*   **Regular Security Audits & Penetration Testing:**  Schedule regular audits (static & dynamic analysis) and penetration testing by a reputable third-party.
*   **Vulnerability Scanning:** Integrate vulnerability scanners (e.g., Snyk, SonarQube) into your CI/CD pipeline.
*   **Dependency Management:**
    *   **Keep Dependencies Updated:** Regularly update Node.js, React, Express, and all dependencies to patch known vulnerabilities.  Use `npm audit` or `yarn audit`.
    *   **Supply Chain Security:**  Use a package manager that has robust vulnerability scanning and traceability.  Consider using a Software Bill of Materials (SBOM) solution.
*   **Configuration Management:**  Use Infrastructure as Code (IaC) to consistently deploy and manage secure configurations.
*   **Logging & Monitoring:** Implement robust logging for all critical events (authentication, authorization, errors, etc.).  Use a Security Information and Event Management (SIEM) system for centralized monitoring and alerting.
*   **Incident Response Plan:** Have a documented plan for responding to security incidents.



**II. Addressing the OWASP Top 10**

1.  **Injection:**
    *   **SQL Injection:**  *Never* concatenate user-supplied data directly into SQL queries. Use parameterized queries or an ORM that handles escaping properly (e.g., Sequelize, Prisma).
    *   **NoSQL Injection:**  Same principles apply for NoSQL databases – use parameterized queries or ORM features.
    *   **Command Injection:** Avoid constructing shell commands from user input. Use safe alternatives like `exec()` with carefully validated arguments.
    *   **LDAP Injection:** Similar precautions to SQL injection – parameterized queries.

2.  **Broken Authentication:**
    *   **Strong Password Policies:** Enforce strong password requirements (length, complexity, character types).
    *   **Multi-Factor Authentication (MFA):** Implement MFA for all user accounts, especially admin accounts.
    *   **Secure Password Storage:**  Use bcrypt, Argon2, or similar robust hashing algorithms with salt for storing passwords.  *Never* store passwords in plain text.
    *   **Session Management:** Implement secure session management:
        *   Use secure cookies with the `HttpOnly` and `Secure` flags.
        *   Rotate session IDs frequently.
        *   Implement session timeout.
    *   **Logout Functionality:** Ensure a proper logout function invalidates all session data.

3.  **Sensitive Data Exposure:**
    *   **Data Masking/Tokenization:** Mask or tokenize sensitive data in logs, UI, and database schemas where appropriate.
    *   **Encryption at Rest:** Encrypt sensitive data stored in the database.
    *   **Encryption in Transit:** Always use HTTPS (TLS/SSL) for all communication.

4.  **XML External Entities (XXE):**  (More relevant if you’re using XML)
    *   **Disable External Entities:** Configure XML parsers to disable the processing of external entities.  This prevents attackers from potentially reading local files or making external requests.

5.  **Broken Access Control:**
    *   **Principle of Least Privilege:** Users and services should only have the minimum permissions necessary to perform their tasks.
    *   **
