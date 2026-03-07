# Write a security checklist for an Express + React app launch
Agent: jordan
Generated: 2026-03-03T01:52:28.405498

Okay, here's a comprehensive security checklist for an Express + React app launching to production, covering the OWASP Top 10, CSP, rate limiting, input sanitization, and auth hardening.  This is designed to be a starting point; you'll need to adapt it based on your specific application and architecture.

**I. General Security Practices & Documentation**

*   **Secure Development Lifecycle (SDL):** Implement a robust SDL that includes security reviews, vulnerability scanning, and penetration testing.
*   **Dependency Management:**
    *   **Software Composition Analysis (SCA):** Regularly scan your project dependencies (Node.js, React, libraries) for vulnerabilities using tools like Snyk, Dependabot, or WhiteSource.
    *   **Pin Dependencies:**  Specify exact versions of dependencies to prevent unexpected updates introducing vulnerabilities.
    *   **Remove Unused Dependencies:** Reduce the attack surface by removing any unnecessary libraries.
*   **Code Reviews:** Mandatory security-focused code reviews for *all* changes.
*   **Security Documentation:** Create and maintain documentation outlining security procedures, policies, and known vulnerabilities.
*   **Incident Response Plan:** Have a documented plan for handling security incidents (breaches, vulnerabilities, etc.).
*   **Regular Audits:** Schedule regular security audits (internal or external) to identify and address potential weaknesses.



**II. OWASP Top 10 - Specific Checks**

1.  **Injection (SQL, NoSQL, Command, etc.):**
    *   **Input Validation & Sanitization:** (See section IV – Detailed Input Handling) – Critical for *all* user inputs.
    *   **Parameterized Queries/Prepared Statements:** Use parameterized queries or prepared statements for *all* database interactions. Never concatenate user input directly into SQL queries.
    *   **Object-Relational Mapping (ORM) Security:** If using an ORM, understand its security features and vulnerabilities.

2.  **Broken Authentication:**
    *   **Multi-Factor Authentication (MFA):** Strongly recommended, especially for sensitive operations.
    *   **Strong Password Policies:** Enforce minimum length, complexity, and regular password changes.
    *   **Rate Limiting:** Implement rate limiting on login attempts (see section V).
    *   **Session Management:** Use secure session management techniques (HTTPS-only sessions, appropriate session timeouts, secure session ID generation).
    *   **Logout Functionality:** Ensure a reliable and secure logout function.
    *   **Account Lockout:** Implement account lockout after failed login attempts to prevent brute-force attacks.

3.  **Sensitive Data Exposure:**
    *   **Data Masking/Redaction:** Mask or redact sensitive data in logs, error messages, and databases.
    *   **Encryption at Rest:** Encrypt sensitive data stored in databases or files.
    *   **Encryption in Transit:**  *Always* use HTTPS (TLS/SSL) for all communication. Ensure valid certificates and proper configuration.  Consider using HSTS (HTTP Strict Transport Security).
    *   **Avoid Hardcoding Secrets:** Never hardcode API keys, passwords, or other sensitive information directly into your code. Use environment variables or a secure secrets management solution.

4.  **XML External Entities (XXE):**
    *   **Disable External Entity Resolution:** Configure your application to disable the parsing of external entities in XML inputs (if applicable – less common in modern React apps but important for backend).

5.  **Broken Access Control:**
    *   **Least Privilege:**  Grant users and components only the minimum necessary permissions.
    *   **Role-Based Access Control (RBAC):**  Implement RBAC to manage user permissions effectively.
    *   **Authorization Checks:**  Always perform authorization checks before granting access to resources or functionality.
