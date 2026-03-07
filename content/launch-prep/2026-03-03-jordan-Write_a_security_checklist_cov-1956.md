# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T19:56:51.500008

Okay, here's a comprehensive security checklist covering the OWASP Top 10 vulnerabilities, designed to be adaptable for various web applications and systems. This checklist is categorized by the OWASP Top 10 category and includes specific controls and considerations.

**Important Notes:**

*   **This is a checklist, not a solution.** It’s a starting point. You need to tailor it to your specific application, technology stack, and risk profile.
*   **Depth Matters:**  Don't just check "yes" or "no."  Understand the *why* behind the vulnerability and the potential impact.
*   **Regular Testing:** Security isn’t a one-time task. This checklist needs to be revisited and updated regularly as your application evolves and new threats emerge.
*   **Automation:** Utilize tools for vulnerability scanning, static analysis, and dynamic testing to automate portions of the process.

---

**OWASP Top 10 Security Checklist**

**1. Injection (SQL, Command, OS, etc.)**

*   **[ ] Input Validation:** Implement robust input validation on *all* user-supplied data (forms, URLs, APIs, cookies, etc.).  Use whitelisting (allow only known good characters) rather than blacklisting (trying to block bad ones).
*   **[ ] Parameterized Queries/Prepared Statements:**  Always use parameterized queries or prepared statements when interacting with databases. This prevents malicious SQL code from being executed.
*   **[ ] Escape User Input:**  Even with parameterized queries, escape output when displaying user-provided data to prevent cross-site scripting (XSS) or other injection attacks.
*   **[ ] Least Privilege:** Database users should have the minimum necessary privileges.
*   **[ ] Database Security Best Practices:** Follow database-specific security recommendations (e.g., limit stored procedures, restrict access).
*   **[ ] Command Injection Detection:** Actively monitor for command injection attempts. Sanitize and validate any shell commands generated from user input.

**2. Broken Authentication**

*   **[ ] Strong Password Policies:** Enforce strong password policies (length, complexity, change frequency).
*   **[ ] Multi-Factor Authentication (MFA):** Implement MFA wherever possible, especially for privileged accounts.
*   **[ ] Secure Session Management:**
    *   Use secure, unpredictable session IDs.
    *   Set appropriate session timeouts.
    *   Regenerate session IDs after authentication.
    *   Securely store session data (consider token-based authentication like JWT).
*   **[ ] Account Lockout Policies:** Implement account lockout mechanisms after multiple failed login attempts.
*   **[ ] Password Reset Mechanisms:**  Secure password reset flows that prevent abuse (e.g., rate limiting, CAPTCHAs).
*   **[ ] API Authentication:**  Secure API endpoints with robust authentication methods (OAuth 2.0, API Keys).

**3. Sensitive Data Exposure**

*   **[ ] Data Classification:** Identify and classify sensitive data (PII, financial data, etc.).
*   **[ ] Encryption at Rest:** Encrypt sensitive data stored in databases, filesystems, and backups.  Use strong encryption algorithms.
*   **[ ] Encryption in Transit:** Always use HTTPS/TLS for all communication, including API calls and data transfer.  Verify SSL/TLS certificates.
*   **[ ] Tokenization/Masking:**  Replace sensitive data with tokens or masks in non-production environments.
*   **[ ] Secure Storage:**  Store secrets (passwords, API keys) in a secure vault (HashiCorp Vault, AWS Secrets Manager, Azure Key Vault) – never in code or configuration files.
*   **[ ] Data Loss Prevention (DLP):** Implement DLP measures to prevent data leaks
