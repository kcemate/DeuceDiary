# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T17:40:59.634374

Okay, here's a security checklist covering the OWASP Top 10 vulnerabilities, broken down by category and with actionable steps. This is a comprehensive checklist – adapt it to your specific application and environment.

**Important Disclaimer:** This checklist is a starting point.  Security is an ongoing process, not a one-time fix.  Regular testing, code reviews, and security training are crucial.

---

**I. Application Security (General Checks – Applicable to all Top 10)**

*   **Secure Coding Practices:**
    *   [ ] Implement secure coding standards (e.g., OWASP Secure Coding Practices, CERT Secure Coding Standard).
    *   [ ] Conduct regular code reviews, focusing on security.
    *   [ ] Use static and dynamic code analysis tools.
    *   [ ] Implement input validation and output encoding consistently.
    *   [ ] Leverage security libraries and frameworks – keep them updated.
*   **Dependency Management:**
    *   [ ] Maintain a Software Bill of Materials (SBOM) – Track all software components.
    *   [ ] Regularly scan dependencies for vulnerabilities.
    *   [ ] Utilize dependency management tools (e.g., Maven, npm, pip).
    *   [ ] Keep dependencies updated promptly – prioritize critical security patches.
*   **Configuration Management:**
    *   [ ] Securely configure servers, databases, and applications.
    *   [ ] Disable default accounts and passwords.
    *   [ ] Harden operating systems and applications.
    *   [ ] Implement strong access controls.
    *   [ ] Regularly review and update configurations.
*   **Logging and Monitoring:**
    *   [ ] Implement comprehensive logging of security-related events.
    *   [ ] Monitor logs for suspicious activity using SIEM (Security Information and Event Management) systems.
    *   [ ] Set up alerts for critical security events.
*   **Vulnerability Scanning:**
     * [ ] Implement regular vulnerability scanning (SAST, DAST, SCA)

**II. OWASP Top 10 Vulnerabilities – Checklist by Category**

**1. Injection (SQL, Command, LDAP)**

*   [ ]  Input Validation: Implement robust input validation on *all* user-supplied data.  Use parameterized queries/prepared statements to prevent SQL injection.
*   [ ]  Output Encoding:  Encode all data before displaying it to prevent Cross-Site Scripting (XSS) – indirectly related.
*   [ ]  Stored Procedures: Use stored procedures with parameterized queries instead of building SQL queries dynamically.
*   [ ]  Least Privilege:  Run applications with the least privileges necessary.
*   [ ]  Regular Updates:  Keep database drivers and software components updated.

**2. Broken Authentication**

*   [ ]  Strong Password Policies: Enforce strong password policies (length, complexity, rotation).
*   [ ]  Multi-Factor Authentication (MFA): Implement MFA wherever possible.
*   [ ]  Rate Limiting: Implement rate limiting to prevent brute-force attacks.
*   [ ]  Session Management: Securely manage user sessions (e.g., use secure cookies, invalidate sessions on logout).
*   [ ]  Account Lockout: Implement account lockout mechanisms after multiple failed login attempts.
*   [ ]  Password Reset: Provide a secure password reset mechanism.

**3. Sensitive Data Exposure**

*   [ ]  Data Classification: Classify data based on sensitivity.
*   [ ]  Encryption at Rest: Encrypt sensitive data at rest using strong encryption algorithms.
*   [ ]  Encryption in Transit: Use HTTPS/TLS for all communication.
*   [ ]  Tokenization/Masking:  Consider tokenization or masking for sensitive data when it's not
