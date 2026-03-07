# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T09:22:40.481662

Okay, here's a security checklist covering the OWASP Top 10 vulnerabilities, broken down into categories and with levels of effort/impact. This is a comprehensive starting point – you'll need to tailor it to your specific application and environment.

**Important Disclaimer:** This checklist is for informational purposes only. It's not a replacement for professional security assessments and penetration testing.  It's a tool to guide your security efforts.

**I. Planning & Governance (Ongoing - Low Effort/High Impact)**

* [ ] **Security Policy:** Do you have a documented security policy that outlines your organization's security standards and responsibilities? (Review & Update Annually)
* [ ] **Risk Assessment:** Have you performed a regular risk assessment to identify vulnerabilities and prioritize remediation? (Quarterly Minimum)
* [ ] **Security Awareness Training:** Do all developers, operations staff, and relevant personnel receive regular security awareness training (at least annually)?
* [ ] **Secure Development Lifecycle (SDLC):** Do you integrate security considerations into every stage of the development lifecycle (requirements, design, coding, testing, deployment, maintenance)?
* [ ] **Change Management:** Do you have a formal change management process that includes security reviews for all changes?

**II. OWASP Top 10 Vulnerabilities Checklist**

**1. Injection (Low/Medium Effort/High Impact)**
   * [ ] **Input Validation:**  Do you rigorously validate *all* user inputs (e.g., URLs, forms, APIs) to prevent malicious code from being injected.
   * [ ] **Parameterized Queries/Prepared Statements:**  Are you using parameterized queries or prepared statements (in databases) to separate data from code? (Critical for SQL Injection)
   * [ ] **Output Encoding:**  Are you properly encoding outputs to prevent cross-site scripting (XSS) vulnerabilities?
   * [ ] **Command Injection Testing:**  Are you testing for command injection vulnerabilities in your applications, particularly in areas where user input is used in shell commands?

**2. Broken Authentication (High Effort/High Impact)**
   * [ ] **Strong Password Policies:** Do you enforce strong password policies (minimum length, complexity, regular changes)?
   * [ ] **Multi-Factor Authentication (MFA):**  Are you implementing MFA for all users, especially those with privileged access? (Prioritize)
   * [ ] **Session Management:** Is session management secure (e.g., using secure cookies, session timeouts, proper session invalidation)?
   * [ ] **Authentication Protocol Security:**  Are you using secure authentication protocols (e.g., OAuth 2.0, OpenID Connect) and following best practices?
   * [ ] **Brute Force Protection:**  Are you implementing mechanisms to prevent brute-force attacks (e.g., rate limiting, account lockout)?

**3. Sensitive Data Exposure (Medium/High Effort/High Impact)**
   * [ ] **Data Classification:** Do you classify your data based on sensitivity (e.g., public, internal, confidential)?
   * [ ] **Encryption:**  Are you encrypting sensitive data at rest and in transit (using TLS/SSL)?
   * [ ] **Tokenization/Masking:**  Are you using tokenization or masking to protect sensitive data when it's not actively being used?
   * [ ] **Data Loss Prevention (DLP):**  Do you have DLP measures in place to prevent the unauthorized transmission or access of sensitive data?
   * [ ] **Access Control:**  Are access controls strictly enforced based on the principle of least privilege?


**4. XML External Entities (XXE) (Medium Effort/Medium Impact)**
   * [ ] **Disable External Entities:**  Are you disabling the processing of external entities in XML parsers?  (Simple but effective
