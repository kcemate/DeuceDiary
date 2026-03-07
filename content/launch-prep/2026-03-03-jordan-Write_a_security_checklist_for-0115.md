# Write a security checklist for an Express + React app launch
Agent: jordan
Generated: 2026-03-03T01:15:23.063166

Okay, here's a comprehensive security checklist for launching an Express + React app to production, covering the OWASP Top 10, CSP, Rate Limiting, Input Sanitization, and Auth Hardening. This is designed to be a starting point; you’ll need to tailor it to your specific application and its risks.

**I. General Security Practices & Architecture**

* **Secure Development Lifecycle (SDLC):** Implement a formal SDLC that incorporates security reviews at every stage (planning, design, development, testing, deployment).
* **Dependency Management:**
    * **Regular Audits:**  Use tools like Snyk, Dependabot, or OWASP Dependency-Check to continuously scan for vulnerable dependencies in both your Express and React codebases.
    * **Keep Up-to-Date:** Patch vulnerabilities promptly.  Establish a process for managing and applying security patches.
    * **Minimize Dependencies:**  Only include necessary libraries.  Reduce the attack surface.
* **Infrastructure Security:**
    * **Secure Server Configuration:** Utilize a reputable cloud provider (AWS, Azure, Google Cloud) and follow their security best practices for server configuration (firewalls, access control, regular updates).
    * **Monitoring & Logging:** Implement comprehensive logging to track application activity, errors, and suspicious behavior. Utilize a robust SIEM (Security Information and Event Management) system for analysis.
    * **Regular Vulnerability Scanning:**  Schedule automated vulnerability scans of your servers and application.
* **Code Review:** Mandatory code reviews by multiple developers, with a focus on security aspects.

**II. OWASP Top 10 Mitigation**

| **OWASP Top 10**          | **Mitigation Strategies**                                                                                                                                                                                                                                                                        |
|--------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **1. Injection**          | **Input Validation & Sanitization:** Rigorous validation of all user inputs. Use parameterized queries/prepared statements to prevent SQL injection.  For NoSQL injection, validate and escape data appropriately (e.g., prevent dynamic query construction).  Sanitize data for XSS.   |
| **2. Broken Authentication** | **Multi-Factor Authentication (MFA):** Strongly consider MFA for all users, especially admin accounts. **Strong Password Policies:** Enforce strong passwords, regularly rotated, and prohibit password reuse. **Session Management:** Secure session handling (HTTPOnly, Secure flags, short session timeouts, prevent session fixation). |
| **3. Sensitive Data Exposure**| **Encryption:** Use TLS/SSL for all data in transit.  Encrypt sensitive data at rest (database, file storage).  **Data Masking/Tokenization:** Mask or tokenize sensitive data where it’s not needed in its raw form.  **Data Minimization:** Only collect and store the data that is absolutely necessary.      |
| **4. XML External Entities (XXE)** | **Disable External Entity Processing:** Ensure your XML parsing libraries are configured to disable external entity processing. Use a tool to check for XXE vulnerabilities. |
| **5. Broken Access Control** | **Role-Based Access Control (RBAC):** Implement RBAC to restrict user access to resources based on their roles. **Authorization Checks:**  Validate user permissions before granting access to sensitive operations and data.  **Defense in Depth:** Multiple layers of access control. |
| **6. Security Misconfiguration** | **Secure Defaults:**  Use secure configuration settings by default. **Regular Configuration Audits:**  Review and update configuration files to ensure they are secure.  **Remove Unnecessary Services:**  Disable or remove any unnecessary services or features.  |
| **7. Vulnerable and Outdated Components** | **Dependency Management (as above)** – Frequent scanning, patching, and updating.
