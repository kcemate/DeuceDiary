# Write a security checklist for an Express + React app launch
Agent: jordan
Generated: 2026-03-02T17:36:02.553718

## Security Checklist: Express + React Production Launch

This checklist outlines security considerations for launching an Express + React application to production, focusing on the OWASP Top 10 vulnerabilities and best practices. It's not exhaustive, and thorough auditing and penetration testing are recommended.

**I. Overall Security Posture & Governance**

* [ ] **Security Policy Document:**  A documented security policy outlining responsibilities, procedures, and standards.
* [ ] **Developer Training:** Security training for all developers on OWASP Top 10, secure coding practices, and common vulnerabilities.
* [ ] **Static Analysis Security Testing (SAST):** Integrate SAST tools into the CI/CD pipeline to automatically scan code for vulnerabilities. (e.g., ESLint with security plugins)
* [ ] **Dependency Management:** Utilize a dependency management tool (npm/yarn) and regularly audit all dependencies for vulnerabilities using tools like Snyk, Dependabot, or npm audit.
* [ ] **Secure CI/CD Pipeline:**  Ensure the CI/CD pipeline itself is secured - access controls, vulnerability scanning, and automated deployments.


**II.  OWASP Top 10 Considerations**

1. **Injection (SQL, NoSQL, Command)**
   * [ ] **Parameterized Queries:**  Always use parameterized queries or ORM features to prevent SQL injection.
   * [ ] **Input Validation:**  Strictly validate all user input on the server-side *and* client-side.
   * [ ] **No.Sqli Libraries:**  Avoid using outdated or vulnerable libraries.
   * [ ] **Regular Updates:** Keep your database and ORM libraries up-to-date.


2. **Broken Authentication & Session Management**
   * [ ] **Strong Password Policies:** Enforce strong password requirements (length, complexity, etc.).
   * [ ] **Multi-Factor Authentication (MFA):**  Implement MFA for all users, especially administrators.
   * [ ] **Secure Session Management:**  Use secure, server-side session management. Avoid relying solely on client-side sessions.
   * [ ] **Token-Based Authentication (JWT):** Consider using JWT for stateless authentication.  If using JWT, implement robust signing keys and refresh token management.
   * [ ] **Session Timeout:**  Implement session timeouts to limit access if a user becomes inactive.
   * [ ] **Logout Functionality:** Provide a clear and secure logout functionality.


3. **Sensitive Data Exposure**
   * [ ] **Data Encryption:** Encrypt sensitive data at rest (database) and in transit (HTTPS).
   * [ ] **Data Masking/Redaction:**  Mask or redact sensitive data in logs and development environments.
   * [ ] **Minimize Data Storage:**  Only store the minimum amount of sensitive data necessary.
   * [ ] **Regular Data Audits:**  Conduct regular audits to identify and remove unnecessary data.


4. **XML External Entities (XXE)**
   * [ ] **Disable XXE Vulnerabilities:**  Disable XXE processing in your XML parsers.
   * [ ] **Validate XML Input:**  Strictly validate XML input to prevent malicious XML being processed.


5. **Broken Access Control**
   * [ ] **Least Privilege Principle:**  Grant users and services only the minimum necessary access permissions.
   * [ ] **Role-Based Access Control (RBAC):** Implement RBAC to manage access based on user roles.
   * [ ] **Authorization Checks:**  Implement robust authorization checks on every API endpoint to ensure users can only access resources they are authorized to access.



**III. React Specific Security**

* [ ] **Component Security:**  Sanitize user input within React components, particularly when constructing HTML.  Use libraries like DOMPurify.
* [ ] **XSS Prevention
