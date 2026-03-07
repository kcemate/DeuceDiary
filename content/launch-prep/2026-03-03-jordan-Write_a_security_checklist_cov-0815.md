# Write a security checklist covering OWASP top 10.
Agent: jordan
Generated: 2026-03-03T08:15:17.137200

## OWASP Top 10 Security Checklist

This checklist is designed to help you assess your application’s security posture against the OWASP Top 10 vulnerabilities. It's a starting point and should be tailored to your specific application and environment.

**Legend:**

* **Critical (C):** Immediate action required. High impact if exploited.
* **High (H):** Should be addressed promptly. Significant impact if exploited.
* **Medium (M):** Important to address as part of ongoing security efforts. Moderate impact if exploited.
* **Low (L):** Recommended to address, but less critical. Minimal impact if exploited.

---

**1. Injection (C)**

* **Description:** Exploiting vulnerabilities due to improper input validation, allowing attackers to execute arbitrary code or access data.
* **Checklist Items:**
    * [ ] Input validation implemented for all user-supplied data (SQL, command-line, etc.).
    * [ ] Parameterized queries used for all database interactions.
    * [ ] Stored procedures used where appropriate.
    * [ ] Output encoding implemented to prevent cross-site scripting (XSS).
    * [ ] Regularly scan for injection vulnerabilities using automated tools.


**2. Broken Authentication (C)**

* **Description:** Weaknesses in authentication mechanisms leading to unauthorized access.
* **Checklist Items:**
    [ ] Strong passwords enforced (length, complexity, regular rotation).
    [ ] Multi-Factor Authentication (MFA) implemented where feasible.
    [ ] Secure session management (HTTPOnly, Secure flags, Session Timeout).
    [ ] Proper handling of failed login attempts (rate limiting, account lockout).
    [ ] Proper logout functionality implemented.
    [ ] Regular review and testing of authentication processes.


**3. Sensitive Data Exposure (C)**

* **Description:** Exposure of sensitive data, including personally identifiable information (PII), credentials, or configuration details.
* **Checklist Items:**
    [ ] Data classification and sensitivity analysis performed.
    [ ] Data encryption in transit (HTTPS) and at rest.
    [ ] Secure storage of credentials (Vault, Key Management Systems).
    [ ] Regular audit logs to monitor access to sensitive data.
    [ ] Removal of sensitive data from production code and environments.
    [ ]  Avoid hardcoding credentials or API keys.


**4. Broken Access Control (H)**

* **Description:** Weaknesses in access control mechanisms allowing unauthorized access to resources.
* **Checklist Items:**
    [ ] Proper role-based access control (RBAC) implemented.
    [ ] Least privilege principle applied - users only granted necessary permissions.
    [ ] Securely enforced authorization checks before accessing any resource.
    [ ] Validation of user roles and permissions on every request.
    [ ] Avoid using URL parameters to control access – use proper authentication mechanisms.



**5. Security Misconfiguration (H)**

* **Description:** Resulting from poor configuration choices in the application, servers, and related infrastructure.
* **Checklist Items:**
    [ ] Default configurations changed and hardened.
    [ ] Unnecessary services and ports disabled.
    [ ] Secure configuration management practices (Infrastructure as Code).
    [ ] Regularly review and update security configurations.
    [ ] Vulnerability scanning of infrastructure components.
    [ ] Proper firewall configuration.



**6. Vulnerable and Outdated Components (H)**

* **Description:** Using software components with known vulnerabilities that have not been patched.
* **Checklist Items:**
    [ ] Maintain a Software Bill of Materials (SBOM).
    [ ] Regularly scan for vulnerable components.
    [ ] Promptly apply security patches.
    [ ] Use dependency management tools for automated updates.
    [ ] Monitor vendor security advisories.
