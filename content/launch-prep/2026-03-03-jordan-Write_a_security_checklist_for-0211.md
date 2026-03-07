# Write a security checklist for an Express + React app launch
Agent: jordan
Generated: 2026-03-03T02:11:02.318577

Okay, here's a detailed security checklist for launching an Express + React app to production, covering the OWASP Top 10, CSP, rate limiting, input sanitization, and authentication hardening.  This is a comprehensive list, and the depth of each item will depend on your app's complexity and risk tolerance.

**I. General & Infrastructure Security**

*   **Secure Development Environment:**
    *   Use a secure CI/CD pipeline.
    *   Regularly audit code repositories for vulnerabilities.
    *   Implement robust logging and monitoring for suspicious activity.
*   **Server Configuration:**
    *   Use a reputable hosting provider with strong security measures (e.g., AWS, Azure, Google Cloud).
    *   Configure firewalls to restrict access to necessary ports.
    *   Regularly patch the operating system and any server software.
    *   Use HTTPS (TLS/SSL) for all communication.  Ensure a valid certificate from a trusted Certificate Authority (CA).
    *   Implement a Web Application Firewall (WAF) – Cloudflare, AWS WAF, Azure WAF, etc. – to protect against common web attacks.
*   **Database Security:**
    *   Use strong passwords for database accounts.
    *   Restrict database access to only authorized applications.
    *   Regularly back up the database.
    *   Implement database auditing.
    *   Encrypt sensitive data at rest and in transit.

**II. OWASP Top 10 & Technical Security Controls**

**1. Injection (SQL, NoSQL, Command, etc.)**
*   **Input Validation:** Implement strict input validation on *all* user-supplied data *before* processing (front-end and back-end).  Use whitelisting instead of blacklisting.
*   **Parameterized Queries/Prepared Statements:**  *Always* use parameterized queries/prepared statements in your database interactions.  Never concatenate user input directly into SQL queries.
*   **NoSQL Injection:** Similarly, sanitize all user input when interacting with NoSQL databases. Be aware of MongoDB injection, DynamoDB injection, etc.

**2. Broken Authentication & Session Management**
*   **Strong Password Policies:** Enforce strong password requirements (length, complexity, etc.).
*   **Multi-Factor Authentication (MFA):** Implement MFA for all users, especially administrators.
*   **Session Management:** Use secure session management practices:
    *   Short session timeouts.
    *   HTTPOnly and Secure flags on session cookies.
    *   Regenerate session IDs after login and sensitive operations.
    *   Avoid storing sensitive data in session cookies.
*   **Rate Limiting:** Implement rate limiting to prevent brute-force attacks against login endpoints.
*   **Password Reset Flows:** Secure password reset flows with email verification and CAPTCHAs.

**3. Sensitive Data Exposure**
*   **Data Masking/Tokenization:** Mask or tokenize sensitive data in logs, databases, and storage.  Avoid logging sensitive information whenever possible.
*   **Secure Storage:**  Never store sensitive data in client-side code.  Use secure backend storage.
*   **Secrets Management:**  Use a dedicated secrets management solution (e.g., HashiCorp Vault, AWS Secrets Manager, Azure Key Vault) to store API keys, database credentials, and other sensitive information.  Never hardcode secrets in your application code.

**4. XML External Entities (XXE)**
*   **Disable XXE Vulnerabilities:**  Configure your server and libraries to properly handle and disable XXE vulnerabilities.  Carefully validate XML inputs.

**5. Broken Access Control**
*   **Authorization Checks:**  Implement robust authorization checks on *every* API endpoint and route to ensure users only have access to the
