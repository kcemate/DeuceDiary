# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T13:31:58.571821

Okay, here's a security checklist covering the OWASP Top 10, designed to help you assess and improve the security of your web applications. This is a comprehensive list, and the level of detail needed for each item will vary based on your application's complexity and risk profile.

**Important Notes:**

*   **This is a checklist, not a magic bullet.**  It's a starting point. Thorough risk assessment and prioritization are crucial.
*   **Regular Review:** Security is an ongoing process. Review and update this checklist regularly.
*   **Context Matters:**  Adapt this checklist to your specific application, technology stack, and business needs.
*   **Automation:**  Where possible, incorporate automated scanning tools to identify vulnerabilities.

---

**OWASP Top 10 Security Checklist**

**1. Injection (A1)**

*   **Description:** Attackers inject malicious code (SQL, XSS, Command Injection, etc.) into an application to execute unintended commands or access sensitive data.
*   **Checklist Items:**
    *   [ ]  **Input Validation:**  Strictly validate *all* user inputs at the server-side, not just client-side. Implement whitelisting (allow only known good input) instead of blacklisting (blocking known bad input).
    *   [ ]  **Parameterized Queries/Prepared Statements:**  Use parameterized queries or prepared statements for all database interactions to prevent SQL injection.
    *   [ ]  **Output Encoding:** Encode all data displayed to users to prevent XSS.
    *   [ ]  **Command Injection Prevention:**  Avoid using `exec()` or similar functions that execute shell commands with user-supplied input. If necessary, use safe alternatives and strictly validate inputs.
    *   [ ]  **Context-Aware Validation:** Ensure validation rules are appropriate for the context (e.g., numeric validation, email validation, URL validation).

**2. Broken Authentication (A2)**

*   **Description:** Flaws in authentication and session management allow attackers to impersonate users or gain unauthorized access.
*   **Checklist Items:**
    *   [ ]  **Strong Password Policies:** Enforce strong password policies (minimum length, complexity, regular changes).
    *   [ ]  **Multi-Factor Authentication (MFA):** Implement MFA for all users, especially those with privileged access.
    *   [ ]  **Secure Session Management:**
        *   Use strong, unpredictable session IDs.
        *   Set appropriate session timeouts.
        *   Regenerate session IDs after authentication.
        *   Securely store session data.
    *   [ ]  **Rate Limiting:**  Implement rate limiting on login attempts to prevent brute-force attacks.
    *   [ ]  **Account Lockout:** Implement account lockout mechanisms after multiple failed login attempts.
    *   [ ]  **Password Reset Mechanisms:** Secure password reset processes (preventing account takeover).

**3. Sensitive Data Exposure (A3)**

*   **Description:**  Failure to properly protect sensitive data (PII, credentials, API keys, etc.) can lead to data breaches.
*   **Checklist Items:**
    *   [ ]  **Data Classification:** Identify and classify sensitive data.
    *   [ ]  **Encryption at Rest:** Encrypt sensitive data stored in databases, files, and backups.
    *   [ ]  **Encryption in Transit:** Use HTTPS/TLS for all communication channels.
    *   [ ]  **Key Management:** Implement a robust key management system for storing and rotating encryption keys.
    *   [ ]  **Data Masking/Tokenization:**  Consider using data masking or tokenization for non-production environments.
    *   [ ]  **Regular Audits:**
