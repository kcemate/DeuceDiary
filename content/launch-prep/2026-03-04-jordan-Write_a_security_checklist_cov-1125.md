# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-04T11:25:54.726399

Okay, here's a comprehensive security checklist covering the OWASP Top 10 vulnerabilities, designed to be adaptable for various applications and websites. It’s broken down by vulnerability category with specific checks and recommended actions.

**Important Notes:**

*   **This is a starting point.** You'll need to tailor this checklist to your specific application's architecture, technologies, and risk profile.
*   **Regular Audits are Crucial:** This checklist isn't a one-time activity. Implement ongoing security testing and monitoring.
*   **Layered Security:**  Don't rely on just one control. Implement a defense-in-depth strategy.

---

**OWASP Top 10 Security Checklist**

**1. Injection (SQL, XSS, Command, etc.)**

*   **Check:**
    *   Are all user inputs validated *before* being used in database queries, HTML, or system commands?
    *   Are parameterized queries or prepared statements used for all database interactions?
    *   Are appropriate escaping functions used for output to prevent XSS?
    *   Is input length and character sets enforced? (e.g., prevent oversized strings)
    *   Are command-line arguments properly sanitized?
*   **Actions:**
    *   Implement robust input validation libraries.
    *   Use ORM (Object-Relational Mapper) with built-in parameterization.
    *   Adopt a web application firewall (WAF) with injection protection.
    *   Train developers on injection vulnerabilities.

**2. Broken Authentication**

*   **Check:**
    *   Is weak password storage used (e.g., plain text, weak hashing)? (Confirm use of strong hashing algorithms like Argon2 or bcrypt)
    *   Is multi-factor authentication (MFA) supported for all users (especially administrators)?
    *   Are default credentials changed?
    *   Is session management secure (e.g., proper session expiration, protection against session fixation/hijacking)?
    *   Is account lockout implemented after failed login attempts?
    *   Is the process for password reset secure?
*   **Actions:**
    *   Enforce strong password policies (minimum length, complexity).
    *   Implement MFA using TOTP, SMS, or other methods.
    *   Secure session IDs (HTTPOnly, Secure flags).
    *   Use a reliable authentication service (e.g., OAuth 2.0, SAML).

**3. Sensitive Data Exposure**

*   **Check:**
    *   Is sensitive data (PII, API keys, credentials, etc.) stored securely (encrypted at rest and in transit)?
    *   Are logs containing sensitive data properly protected and monitored?
    *   Is data masking or tokenization used when displaying sensitive data to users?
    *   Are API keys and secrets properly managed (e.g., using secrets management tools)?
    *   Are error messages revealing sensitive information logged or displayed to users?
*   **Actions:**
    *   Implement encryption with strong algorithms (AES, etc.).
    *   Use secure storage solutions (hardware security modules, cloud KMS).
    *   Employ data loss prevention (DLP) technologies.
    *   Regularly review and remove unnecessary data.

**4. Broken Access Control**

*   **Check:**
    *   Is access control implemented consistently across all parts of the application?
    *   Are roles and permissions properly defined and enforced?
    *   Is cross-site scripting (XSS) prevented from being used to bypass access control?
    *   Are authorization checks performed on *every* request? (Not just on the initial route)
    *   Is the principle of least privilege followed?
*
