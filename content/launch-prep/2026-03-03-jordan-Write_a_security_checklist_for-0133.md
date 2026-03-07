# Write a security checklist for an Express + React app launch
Agent: jordan
Generated: 2026-03-03T01:33:53.932912

Okay, here's a comprehensive security checklist for an Express + React application launching to production, covering the OWASP Top 10, CSP headers, rate limiting, input sanitization, and auth hardening. This is a starting point; adapt it to your specific app and its complexity.

**I. Overall Security Strategy**

* **Secure Development Lifecycle (SDLC):**  Integrate security considerations into *every* stage of the development process – planning, design, coding, testing, and deployment.
* **Regular Security Audits:** Conduct periodic audits (manual and automated) to identify and address vulnerabilities.
* **Dependency Management:** Maintain up-to-date dependencies and use a vulnerability scanning tool (e.g., Snyk, Dependabot) to proactively identify and remediate vulnerabilities.
* **Monitoring & Logging:** Implement robust logging and monitoring to detect and respond to security incidents.  Centralize logs for easier analysis.
* **Incident Response Plan:** Have a documented plan for handling security incidents.  Test this plan periodically.


**II. OWASP Top 10 - Specific Checks**

1. **Injection (SQL, Command, etc.)**
   * **Check:** Ensure proper parameterization or prepared statements are used when interacting with databases. Avoid string concatenation to build queries.  Review all database interactions.
   * **React:** Validate all data received from the user *before* passing it to the backend.
   * **Express:** Use ORM (e.g., Sequelize, Prisma) which often handles parameterization for you.
   * **Tools:**  Static analysis tools can help identify potential injection vulnerabilities.

2. **Broken Authentication**
   * **Check:** Implement multi-factor authentication (MFA). Enforce strong password policies (length, complexity).  Regularly rotate API keys and secrets.  Audit authentication logs.
   * **React:** Securely store JWT tokens. Avoid storing sensitive information in the frontend.
   * **Express:** Use a robust authentication library (e.g., Passport.js) with proper middleware.
   * **Auth Hardening (see Section V)**

3. **Sensitive Data Exposure**
   * **Check:**  Never store sensitive information (passwords, API keys, PII) in client-side code or the frontend.  Encrypt sensitive data both in transit and at rest.  Minimize the amount of sensitive data stored.
   * **React:** Never store credentials locally.
   * **Express:**  Use environment variables to store secrets. Use a secrets management system (e.g., HashiCorp Vault) for sensitive secrets.

4. **XML External Entities (XXE)** – *Less relevant for your app, but good to be aware of.*
   * **Check:**  If using XML parsing, ensure it's disabled or properly configured to prevent XXE attacks.
   * **React/Express:**  Not typically a concern, but verify XML parsing libraries are up-to-date.

5. **Broken Access Control**
    * **Check:** Implement proper access control mechanisms to restrict user access to sensitive resources and functionalities.  Enforce role-based access control (RBAC).
    * **React:** Ensure front-end routes are properly protected based on user roles.
    * **Express:** Use middleware to enforce access control rules based on user roles/permissions.


**III.  Cross-Site Scripting (XSS) & Content Security Policy (CSP)**

* **XSS:**
    * **Check:** Sanitize all user-generated content displayed on the React frontend. Use a library like `DOMPurify` or implement similar sanitization techniques.
    * **React:**  Always escape data before rendering it in the DOM.
* **CSP:**
    * **Implement:** Configure CSP headers in your web server to mitigate X
