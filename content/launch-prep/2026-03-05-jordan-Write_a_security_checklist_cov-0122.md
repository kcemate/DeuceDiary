# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-05T01:22:50.444092

Okay, here's a comprehensive security checklist covering the OWASP Top 10 vulnerabilities, broken down by category with actionable steps and considerations. This checklist is designed to be adaptable to different web application types and development practices.  **It's a starting point – you'll need to tailor it to your specific application and environment.**

**I. Executive Summary**

This checklist aims to help you identify and mitigate vulnerabilities based on the OWASP Top 10. It’s divided into categories aligned with each vulnerability.  Regular testing, code reviews, and security training are crucial to maintain a secure application.

**II. Checklist Breakdown (Aligned with OWASP Top 10)**

**A. Injection (All Top 10)** – *Critical*
* **SQL Injection:**
    * [ ] **Input Validation:** Implement strict input validation on *all* user-supplied data going into database queries (including forms, API parameters, URL parameters, cookies, etc.). Use whitelisting (allow only known good characters/patterns) instead of blacklisting.
    * [ ] **Parameterized Queries/Prepared Statements:**  *Always* use parameterized queries or prepared statements.  Never concatenate user input directly into SQL queries.
    * [ ] **Least Privilege:** Database users should have the minimum necessary permissions.
    * [ ] **Escaping:** While Parameterized Queries are best, if escaping is necessary, use a well-tested and reliable escaping library.
    * [ ] **Regular Expression Review:** Review regex used to sanitize input. Poorly written regex can still be vulnerable.
* **Cross-Site Scripting (XSS):**
    * [ ] **Output Encoding:**  Encode *all* user-supplied data before displaying it in web pages. Use context-aware encoding (HTML, JavaScript, URL).
    * [ ] **Content Security Policy (CSP):** Implement a strict CSP to control the sources from which the browser can load resources, mitigating XSS.
    * [ ] **HTTPOnly Cookie Attribute:** Set the `HTTPOnly` flag on cookies to prevent JavaScript from accessing them.
    * [ ] **Sanitize HTML:** Use a trusted HTML sanitizer library to remove potentially malicious HTML tags and attributes.
* **Command Injection:**
    * [ ] **Avoid Executing Shell Commands:**  Minimize the use of shell commands directly based on user input.  If absolutely necessary, use a framework that properly escapes user input.
    * [ ] **Use Safe Alternatives:** Wherever possible, use built-in functions or APIs that don't require executing shell commands.
    * [ ] **Input Validation & Whitelisting:** Rigorous input validation and whitelisting for command parameters.
* **LDAP Injection:** Similar to SQL injection principles – always parameterize queries when interacting with LDAP directories.

**B. Authentication (All Top 10)** – *Critical*
* [ ] **Strong Password Policies:** Enforce strong password complexity requirements (length, character types).
* [ ] **Multi-Factor Authentication (MFA):**  Implement MFA for all users, especially privileged accounts.
* [ ] **Secure Password Storage:**  Use a strong hashing algorithm (bcrypt, Argon2) with a unique salt for all password hashes. *Never* store passwords in plain text.
* [ ] **Session Management:** Use secure session management techniques (HTTPS only, session timeouts, secure cookies).
* [ ] **Brute-Force Protection:** Implement rate limiting and account lockout mechanisms to prevent brute-force attacks.
* [ ] **Authentication API Security:** Secure your authentication APIs against common vulnerabilities (e.g., credential stuffing).

**C. Sensitive Data Exposure (A1, A2, A5)** – *High*
* **Storing Sensitive Data:**
    * [ ] **Encryption at Rest:** Encrypt sensitive data
