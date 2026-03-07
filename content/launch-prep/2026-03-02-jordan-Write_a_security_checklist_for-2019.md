# Write a security checklist for an Express + React app launch
Agent: jordan
Generated: 2026-03-02T20:19:27.457493

## Express + React Production Security Checklist

This checklist covers key security considerations for a production Express + React application, focusing on the OWASP Top 10 and best practices. It's a starting point; thorough testing and ongoing monitoring are crucial.

**I. General Security Practices**

* **Secure Development Lifecycle (SDL):** Implement a robust SDL including threat modeling, security testing, and vulnerability management.
* **Dependency Management:**
    * Regularly update all dependencies (Node.js, React, Express, libraries) to patch vulnerabilities. Use tools like `npm audit` or `yarn audit`.
    * Employ a Software Composition Analysis (SCA) tool for automated vulnerability scanning.
* **Code Reviews:** Conduct thorough code reviews with a security focus.
* **Configuration Management:**  Securely manage configuration files (API keys, database credentials). Use environment variables and secure storage solutions.
* **Logging & Monitoring:** Implement comprehensive logging for all security-related events (errors, suspicious activity). Utilize a robust monitoring solution for alerts and anomaly detection.
* **Incident Response Plan:**  Have a documented incident response plan in place to handle security breaches effectively.


**II. OWASP Top 10 - Specific Checks**

1. **Injection (SQL, NoSQL, Command, etc.):**
    * **Input Validation:**  Strictly validate all user inputs on both the client and server-side. Use whitelisting (allowing only known good inputs) over blacklisting (blocking known bad inputs).
    * **Parameterized Queries/Prepared Statements:** Always use parameterized queries or prepared statements for database interactions.  Never concatenate user input directly into SQL queries.
    * **NoSQL Injection:**  Carefully sanitize data when constructing NoSQL queries. Understand the specific injection vectors for your database.
    * **Command Injection:** Avoid using `exec()` or similar functions with user-provided data. If unavoidable, rigorously sanitize and validate.

2. **Broken Authentication & Session Management:**
    * **Strong Password Policies:** Enforce strong password complexity requirements.
    * **Multi-Factor Authentication (MFA):**  Implement MFA wherever possible.
    * **Secure Session Management:**
        * Use secure cookies (HttpOnly, Secure, SameSite) to protect session IDs.
        * Implement session timeouts.
        * Regenerate session IDs after authentication.
        * Store session data securely on the server.
    * **Token-Based Authentication (JWT):**  Consider using JWTs for stateless authentication.
        * Properly sign and verify JWTs.
        * Rotate JWT keys regularly.
        * Implement refresh token strategies carefully.

3. **Sensitive Data Exposure:**
    * **Encryption at Rest:** Encrypt sensitive data stored in databases, file systems, and backups.
    * **Encryption in Transit:** Use HTTPS (TLS/SSL) for all communication between the client and server, and between backend services.
    * **Data Masking & Redaction:**  Mask or redact sensitive data in logs, debug outputs, and development environments.
    * **Data Minimization:**  Only collect and store the data necessary for the application's functionality.

4. **XML External Entities (XXE):**  (Less common in React, more relevant to backend API)
    * **Disable External Entity Resolution:**  Configure your XML parser to disable external entity resolution.
    * **Input Validation:** Sanitize XML input to prevent malicious entities.

5. **Broken Access Control:**
    * **Role-Based Access Control (RBAC):** Implement RBAC to control user access to resources and functionality.
    * **Authorization Checks:** Perform thorough authorization checks on every API endpoint.
    * **Cross-Site Scripting (XSS) Protection:** (See below)
    * **API Key Management:** Use API keys to restrict access
