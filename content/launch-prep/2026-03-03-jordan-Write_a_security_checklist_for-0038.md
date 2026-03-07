# Write a security checklist for an Express + React app launch
Agent: jordan
Generated: 2026-03-03T00:38:19.008275

Okay, here’s a comprehensive security checklist for launching an Express + React application to production, covering the OWASP Top 10, CSP, rate limiting, input sanitization, and authentication hardening. This is a starting point; your specific needs will require tailoring.

**I. Overall Security Posture**

* **Security Team/Responsibility:** Define who is responsible for security: Devops, security engineers, or a dedicated team?
* **Security Monitoring:** Implement logging and monitoring for security events (errors, unusual activity, etc.).  Use tools like:
    * **ELK Stack (Elasticsearch, Logstash, Kibana):**  For centralized logging and analysis.
    * **Sentry, Rollbar:**  Error tracking and monitoring.
    * **Prometheus, Grafana:** For performance monitoring.
* **Vulnerability Scanning:**  Automated vulnerability scanning as part of your CI/CD pipeline. Tools:
    * **OWASP ZAP:** Open-source web application security scanner.
    * **Nessus:** Commercial vulnerability scanner (free home/small business version available).
    * **Snyk:**  Developer-focused security platform.
* **Regular Security Audits:**  Schedule regular (at least annual) security audits, ideally with a third-party.
* **Security Training:** Ensure developers and operations staff receive regular security training, focusing on common vulnerabilities and best practices.


**II. OWASP Top 10 & Mitigation Strategies**

1. **Injection (SQL, NoSQL, Command, etc.):**
   * **Mitigation:**
      * **Parameterized Queries/Prepared Statements:** *Always* use parameterized queries in your database interactions. This prevents malicious code from being injected.
      * **Input Validation & Sanitization:**  Validate *all* user input (client-side AND server-side).  Sanitize output to prevent injection.
      * **Least Privilege Principle:** Database users should have only the necessary permissions.

2. **Broken Authentication:**
   * **Mitigation:** (Detailed in Section V - Auth Hardening)
      * Multi-Factor Authentication (MFA)
      * Strong Password Policies
      * Secure Session Management
      * Regular Security Audits of Auth Logic

3. **Sensitive Data Exposure:**
   * **Mitigation:**
      * **Data Masking/Tokenization:** Mask or tokenize sensitive data at rest and in transit.
      * **Encryption:** Encrypt sensitive data at rest (database) and in transit (HTTPS).
      * **Secure Storage:**  Don’t store sensitive data (API keys, passwords) in client-side code. Use environment variables.

4. **XML External Entities (XXE):**
    * **Mitigation:**
       *  Disable XML External Entity Resolution in your Express app and React build.
       *  Strictly validate and sanitize any XML data.

5. **Broken Access Control:**
   * **Mitigation:**
      * **Role-Based Access Control (RBAC):** Implement RBAC to restrict access based on user roles.
      * **Authorization Middleware:** Use middleware to enforce access control rules before allowing requests to reach the relevant routes.
      * **Same-Site Cookie Attributes:** Configure `SameSite` cookies to prevent Cross-Site Request Forgery (CSRF) attacks.

6. **Security Misconfiguration:**
   * **Mitigation:**
      * **Secure Default Configurations:**  Use secure default configurations for your server, database, and applications.
      * **Regular Security Updates:** Patch your software regularly.
      * **Remove Unnecessary Features:** Disable or remove any unnecessary features that could introduce vulnerabilities.
      * **Immutable Infrastructure:** Utilize infrastructure-as-code (IaC) for consistent and reproducible environments.

7. **Vulnerable and Out
