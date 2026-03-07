# Write a security checklist for an Express + React app launch
Agent: jordan
Generated: 2026-03-02T20:55:49.585049

Okay, here's a comprehensive security checklist for an Express + React app launching to production, covering the OWASP Top 10, CSP headers, rate limiting, input sanitization, and auth hardening.  This is a starting point; your specific needs will likely require tailoring.

**I. General Security Posture & Infrastructure**

* **Secure DevOps Pipeline:**
    * **Static Code Analysis (SAST):** Integrate tools like ESLint, SonarQube, or CodeClimate to automatically scan code for vulnerabilities and style issues.
    * **Dynamic Application Security Testing (DAST):** Use tools like OWASP ZAP or Burp Suite to simulate attacks on the running application.
    * **Infrastructure as Code (IaC):** Use tools like Terraform or CloudFormation to ensure consistent and secure infrastructure configurations.
    * **Immutable Deployments:**  Favor immutable deployments to minimize the attack surface.
* **Monitoring & Logging:**
    * **Centralized Logging:**  Collect logs from all components (Express backend, React frontend, databases) in a central location (e.g., Elasticsearch, Splunk).
    * **Real-time Monitoring:** Implement monitoring tools (e.g., Prometheus, Grafana) to track key metrics and detect anomalies.
    * **Security Information and Event Management (SIEM):** Integrate logs into a SIEM system for threat detection and analysis.
* **Regular Vulnerability Scanning:**  Schedule automated scans of your entire environment (servers, databases, dependencies).
* **Patch Management:** Establish a robust process for patching vulnerabilities promptly.
* **Secrets Management:** Never store sensitive information (API keys, database passwords) directly in code or configuration files.  Use a secrets management solution (e.g., HashiCorp Vault, AWS Secrets Manager, Azure Key Vault).

**II. OWASP Top 10 & Related Considerations**

1. **Injection:**
   * **SQL Injection:**  Always use parameterized queries or an ORM (like Sequelize or TypeORM) to prevent SQL injection vulnerabilities.
   * **NoSQL Injection:** Similarly, if using NoSQL databases, use parameterized queries or appropriate escaping.
   * **Command Injection:**  Avoid using user input directly in system commands.  If necessary, carefully validate and sanitize.
2. **Broken Authentication:**
   * **Multi-Factor Authentication (MFA):** Strongly recommended.
   * **Strong Password Policies:** Enforce complex password requirements.
   * **Rate Limiting:** (See section IV)
   * **Session Management:** Use secure session management techniques (HTTPOnly cookies, secure flags).  Consider short session timeouts.
   * **Token-Based Authentication (JWT):**  Implement JWTs correctly, including secure signing keys and proper expiration strategies.
3. **Sensitive Data Exposure:**
   * **Data Encryption at Rest:** Encrypt sensitive data stored in databases and file systems.
   * **Data Masking/Tokenization:** Use data masking or tokenization techniques to protect sensitive data in non-production environments.
   * **Secure Storage of Credentials:**  (Covered in Auth Hardening)
4. **XML External Entities (XXE):**  (Less relevant for modern apps, but still consider in legacy systems)  Validate XML input carefully.
5. **Broken Access Control:**
   * **Principle of Least Privilege:**  Grant users only the minimum necessary permissions.
   * **Role-Based Access Control (RBAC):** Implement RBAC to manage user permissions effectively.
   * **Cross-Site Scripting (XSS):** (See Section VI)
6. **Security Misconfiguration:**
   * **Default Configurations:** Change default passwords and settings.
   * **Unnecessary Services:** Disable or remove unnecessary services and ports.
   * **Container Security:** Secure container images (
