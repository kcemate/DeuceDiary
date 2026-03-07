# Write a security checklist for an Express + React app launch
Agent: jordan
Generated: 2026-03-03T00:01:10.003727

## Security Checklist: Express + React Production App

This checklist covers key security considerations for launching your Express + React application to production, aligning with the OWASP Top 10 and best practices. It’s a starting point and should be adapted to your specific application and risk profile.

**I. General Security Practices & Infrastructure**

* **Secure Development Environment:**
    * Use a CI/CD pipeline to automate deployments and ensure consistency.
    * Implement Infrastructure as Code (IaC) for repeatable and auditable deployments.
    * Regularly audit and update your development and production environments.
* **Secure Communication:**
    * **HTTPS Everywhere:** Enforce HTTPS for all traffic, including internal communication within the application.  Use a valid, trusted SSL/TLS certificate.
    * **HSTS (HTTP Strict Transport Security):**  Implement HSTS to prevent browsers from downgrading to HTTP.  Configure `max-age` appropriately.
    * **TLS Configuration:** Follow best practices for TLS configuration including using strong ciphers and ensuring proper certificate management.
* **Logging & Monitoring:**
    * Implement comprehensive logging, including requests, errors, and security-related events.
    * Utilize a centralized logging system for efficient analysis.
    *  Set up monitoring and alerting for unusual activity (e.g., high error rates, suspicious traffic patterns).

**II. OWASP Top 10 & Related Considerations**

1. **Injection:**
   * **SQL Injection:** Use parameterized queries or an ORM (e.g., Sequelize, TypeORM) to prevent direct string concatenation into queries. Validate and sanitize all user inputs.
   * **NoSQL Injection:** Same principles as SQL Injection - parameterized queries and robust input validation.
   * **Command Injection:** Avoid executing shell commands directly based on user input. Use parameterized queries or secure alternatives.
2. **Broken Authentication:**
   * **Strong Password Policies:** Enforce strong password complexity rules (length, character types).
   * **Multi-Factor Authentication (MFA):** Implement MFA for all users, especially administrators.
   * **Secure Session Management:**
       * Use secure cookies with the `httpOnly` flag (prevents JavaScript access).
       *  Set `secure` flag on cookies to ensure transmission over HTTPS.
       *  Implement session expiration and invalidation.
       *  Use a robust session storage mechanism (e.g., Redis, Memcached).
   * **Regularly Rotate API Keys & Secrets:**  Never hardcode secrets in your code. Use environment variables and secure secret management tools.
3. **Sensitive Data Exposure:**
   * **Data Classification:** Identify and classify sensitive data.
   * **Data Masking & Redaction:** Implement masking or redaction of sensitive data in logs, development environments, and potentially in non-production systems.
   * **Data Encryption:** Encrypt sensitive data at rest (database) and in transit (HTTPS).
   * **Tokenization:** Consider tokenizing sensitive data, especially for payment processing.
4. **XML External Entities (XXE):** (Relevant if using XML)
   * Prevent processing of external entities in XML parsers. Sanitize or disable entity resolution.
5. **Broken Access Control:**
   * **RBAC (Role-Based Access Control):** Implement a robust RBAC system to control user permissions.
   * **Authorization Middleware:** Utilize middleware to enforce authorization checks on every route.
   * **Prevent Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF):**  (Covered in detail below)
6. **Security Misconfiguration:**
    * **Default Configurations:** Change default configurations (e.g., database passwords, unnecessary ports).
    * **Remove Unused Components:** Eliminate unused features, libraries,
