# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T11:38:31.726793

Okay, here's a comprehensive security checklist covering the OWASP Top 10 vulnerabilities, broken down by category and with considerations for different levels of assessment (e.g., basic, intermediate, advanced).  This is a starting point - you’ll need to tailor it to your specific application, technology stack, and risk tolerance.

**I. General Considerations (Apply to All Checks)**

* **Regular Risk Assessments:** Conduct a formal risk assessment at least annually, and more frequently if significant changes are made to the application or infrastructure.
* **Security Training:** Ensure all developers, operations personnel, and relevant stakeholders receive regular security training.
* **Secure Development Lifecycle (SDLC):** Implement a secure SDLC that integrates security activities throughout the entire development process – from planning to deployment and maintenance.
* **Vulnerability Scanning:**  Automated vulnerability scanning should be performed regularly (at least monthly) on all systems and applications.  Don’t rely solely on automated scans; they need to be complemented by manual testing.
* **Penetration Testing:** Conduct annual or bi-annual penetration testing by qualified security professionals.
* **Logging & Monitoring:** Implement comprehensive logging and monitoring to detect and respond to security incidents.  Monitor for suspicious activity and unusual patterns.
* **Incident Response Plan:** Develop and regularly test an incident response plan.
* **Patch Management:** Establish a rigorous patch management process for all software and systems.  Prioritize critical vulnerabilities.
* **Access Control:** Implement the principle of least privilege – users and applications should only have the minimum access necessary to perform their tasks.

---

**II. OWASP Top 10 Vulnerabilities - Checklist**

**1. Injection (A1)**

* **Check:**
    * **Input Validation:**  Are all user inputs rigorously validated and sanitized *on both the client-side and server-side*?  (Client-side validation is for user experience, not security).
    * **Parameterized Queries/Prepared Statements:**  Are you using parameterized queries or prepared statements to prevent SQL injection? (Crucial for database security).
    * **Output Encoding:**  Are you properly encoding output to prevent cross-site scripting (XSS)?
    * **Command Injection:**  Are you avoiding the use of `eval()` or similar functions that can execute arbitrary commands based on user input?
    * **XML External Entity (XXE) Injection:**  Are you properly validating and disabling the processing of external XML entities?
* **Severity:** High
* **Tools:** Static analysis tools, dynamic analysis tools, manual code review

**2. Broken Authentication (A2)**

* **Check:**
    * **Strong Passwords:**  Are you enforcing strong password policies (minimum length, complexity, etc.)?
    * **Multi-Factor Authentication (MFA):**  Is MFA implemented for all critical accounts and applications?
    * **Session Management:**  Are sessions properly secured (e.g., secure cookies, session timeouts, session fixation prevention)?
    * **Password Storage:**  Are passwords hashed and salted securely using a strong hashing algorithm (e.g., Argon2, bcrypt)?  (Never store passwords in plain text!)
    * **Account Lockout:** Is account lockout implemented after multiple failed login attempts?
* **Severity:** High
* **Tools:**  Authentication testing tools, security audits

**3. Sensitive Data Exposure (A3)**

* **Check:**
    * **Data Classification:** Is sensitive data (PII, financial data, etc.) properly classified and identified?
    * **Encryption:** Is sensitive data encrypted in transit (TLS/SSL) and at rest?
    * **Tokenization/Masking:** Are sensitive data tokens or masks used instead of storing the actual data?
    * **Access Controls:** Are access controls implemented to restrict access to sensitive
