# Write a security checklist for an Express + React app launch
Agent: jordan
Generated: 2026-03-02T16:59:56.975187

## Security Checklist: Express + React App Launching to Production

This checklist covers key security considerations for your Express + React application as you prepare for production deployment. It's a starting point and should be tailored to your specific application and environment.

**I. General Security Practices & Foundations:**

* **Secure Development Lifecycle (SDLC):** Implement a robust SDLC that incorporates security at every stage – planning, design, development, testing, and deployment.
* **Regular Security Audits & Penetration Testing:**  Plan for both internal and external security audits and, ideally, professional penetration testing before launch and periodically thereafter.
* **Dependency Management:**
    * **Keep Dependencies Updated:**  Utilize tools like `npm audit` or `yarn audit` and regularly update all dependencies to the latest secure versions. Prioritize security updates.
    * **Vulnerability Scanning:** Integrate vulnerability scanning tools into your CI/CD pipeline to automatically detect and alert on vulnerable dependencies.
* **Logging & Monitoring:** Implement comprehensive logging and monitoring.  Capture relevant security events (e.g., authentication attempts, errors, unusual activity) for analysis and alerts.
* **Secure Deployment Environment:**
    * **Secure Server Configuration:** Utilize hardened server images (e.g., AWS AMIs, DigitalOcean Images) with minimal installed packages and up-to-date security patches.
    * **Regular Patching:** Ensure the server operating system and any related software are patched promptly.
    * **Access Control:** Implement strict access controls, limiting access to sensitive resources and data.
* **Incident Response Plan:**  Have a documented incident response plan in place to address security breaches or vulnerabilities.

**II. OWASP Top 10 & Related Vulnerabilities:**

| OWASP Top 10 Category | Specific Checks                                                                                                      | Mitigation Strategies                                                                                             |
|-----------------------|-------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| **A1: Injection**       |  SQL Injection, NoSQL Injection, Command Injection –  Sanitize all user inputs.  Use parameterized queries/prepared statements.  Implement input validation. | Parameterized Queries, Input Validation, Stored Procedures (SQL), Escaping (where appropriate)                |
| **A2: Broken Authentication** | Weak passwords, Session hijacking, Lack of multi-factor authentication (MFA)  | Strong password policies, Implement MFA, Secure session management,  Implement rate limiting.           |
| **A3: Sensitive Data Exposure** |  Storing sensitive data (passwords, API keys, PII) in plain text, Insecure storage of data | Encryption (at rest and in transit), Data masking/tokenization, Access control, Least privilege principle.       |
| **A4: XML External Entities** |  Vulnerable to XML External Entity injection. (Less common in React but consider if using XML parsing)     |  Disable XML External Entity processing.  Validate all XML input.                                               |
| **A5: Broken Access Control** |  Insufficient authorization checks, Exposure of internal URLs, Missing access controls.                    | Implement robust authorization schemes, Enforce least privilege, Verify user permissions on all actions.            |
| **A6: Security Misconfiguration** | Default passwords, Unnecessary services running, Misconfigured security settings.                         | Harden server configurations, Remove default accounts, Disable unnecessary services, Regularly review security settings. |
| **A7: Vulnerable and Outdated Components** | Using vulnerable libraries, Failing to update libraries.                                                 | Dependency Management, Vulnerability Scanning,  Automated updates.                                          |
| **A8: Identification and Authentication Issues** |  Missing authentication, Insecure authentication protocols,  Insecure session management.            | Implement robust authentication mechanisms, Use secure protocols (HTTPS, OAuth), Secure session management.       |
|
