# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T17:18:14.368229

Okay, here's a comprehensive security checklist covering the OWASP Top 10 vulnerabilities, categorized for clarity and with actionable steps. This checklist is designed to be adaptable to various applications and development environments.  It's a starting point - you'll need to tailor it to your specific context.

**Important Note:** This is a *checklist*, not a fully automated solution.  Regular penetration testing and security audits are crucial for a truly secure application.

---

**OWASP Top 10 Security Checklist**

**1. Injection (A1)** –  SQL Injection, Command Injection, etc.
   * **Goal:** Prevent attackers from injecting malicious code into your application.
   * **Checklist Items:**
      * [ ] **Input Validation:** Implement robust input validation on *all* user inputs (forms, URLs, API requests, database queries, etc.). Use whitelisting (allowing only known good characters) instead of blacklisting (trying to block bad ones).
      * [ ] **Parameterized Queries/Prepared Statements:**  **ALWAYS** use parameterized queries or prepared statements when interacting with databases.  This prevents SQL injection.
      * [ ] **Output Encoding:** Properly encode output to prevent Cross-Site Scripting (XSS) vulnerabilities if injecting data into HTML.
      * [ ] **Command Injection Prevention:** If using commands (system calls) based on user input, avoid this approach entirely or, if necessary, rigorously sanitize and validate. Use escaping functions appropriately.
      * [ ] **Regular Security Training:**  Ensure developers understand injection vulnerabilities and best practices.
   * **Tools:** Static analysis tools (e.g., SonarQube), dynamic application security testing (DAST) tools.


**2. Broken Authentication (A2)** – Weak Credentials, Session Management Issues
   * **Goal:**  Securely manage user authentication and authorization.
   * **Checklist Items:**
      * [ ] **Strong Password Policies:** Enforce strong password policies (length, complexity, regular changes).
      * [ ] **Multi-Factor Authentication (MFA):** Implement MFA where possible, especially for sensitive accounts.
      * [ ] **Secure Session Management:**
         * [ ]  Use secure cookies (HTTPOnly, Secure flags).
         * [ ]  Regenerate session IDs after login.
         * [ ]  Implement session timeouts.
         * [ ]  Protect session management endpoints.
      * [ ] **Rate Limiting:** Implement rate limiting on login attempts to prevent brute-force attacks.
      * [ ] **Disable Default Credentials:** Remove or change any default usernames and passwords.
   * **Tools:** Vulnerability scanners, penetration testing.



**3. Sensitive Data Exposure (A3)** – Stored Credentials, Personal Information, API Keys
   * **Goal:** Protect sensitive data at rest and in transit.
   * **Checklist Items:**
      * [ ] **Data Classification:** Identify and classify all sensitive data.
      * [ ] **Encryption at Rest:** Encrypt sensitive data stored in databases, files, and backups.
      * [ ] **Encryption in Transit:**  Use HTTPS (TLS) for all communication.  Verify TLS certificates.
      * [ ] **Secure Credential Storage:**  Never store passwords or API keys directly in source code. Use environment variables, secrets management systems (e.g., HashiCorp Vault, AWS Secrets Manager), or dedicated key management services.
      * [ ] **Data Masking/Tokenization:**  Mask or tokenize sensitive data where appropriate (e.g., in non-production environments).
      * [ ] **Regular Access Reviews:**  Review and restrict access to sensitive data based on the principle of least privilege.
   * **Tools:**  Secrets management tools, data loss prevention (DLP) solutions.



**4.
