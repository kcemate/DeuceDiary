# Write a security checklist for an Express + React app launch
Agent: jordan
Generated: 2026-03-02T18:12:30.551215

Okay, here's a comprehensive security checklist for your Express + React application launching to production, covering the OWASP Top 10, CSP headers, rate limiting, input sanitization, and authentication hardening.  This is a starting point; you'll need to tailor it to your specific application's architecture and dependencies.

**I.  General Development Practices & Infrastructure Security**

*   **Secure Development Lifecycle (SDLC):** Implement a secure SDLC that incorporates security reviews at every stage.
*   **Regular Dependency Updates:**  Keep all Node.js packages (Express, React, libraries) and React dependencies up to date to patch known vulnerabilities. Utilize tools like `npm audit` or `yarn audit`.
*   **Static Code Analysis:**  Use tools like ESLint with security-focused plugins and SonarQube to identify potential vulnerabilities early.
*   **Containerization (Docker):** Utilize Docker to isolate your application and ensure consistent deployments.  Scan Docker images for vulnerabilities (e.g., using Clair, Trivy).
*   **Infrastructure as Code (IaC):** Use IaC tools (Terraform, CloudFormation) to automate infrastructure provisioning and ensure consistent security configurations.
*   **Secrets Management:**  Never store sensitive information (API keys, database passwords, etc.) directly in your code. Use a secrets management solution like HashiCorp Vault, AWS Secrets Manager, or Azure Key Vault.
*   **Monitoring & Logging:** Implement comprehensive logging and monitoring to detect and respond to security incidents.  Focus on application logs, server logs, and network traffic.
*   **Regular Backups:**  Establish a robust backup and recovery strategy.


**II. OWASP Top 10 - Security Controls**

1.  **Injection (SQL, NoSQL, Command, etc.):**
    *   **Database Prepared Statements/Parameterized Queries:** *Mandatory* for all database interactions. Use ORMs that inherently support prepared statements.
    *   **Input Validation:** Rigorous input validation on *all* user-supplied data.
    *   **Principle of Least Privilege:**  Database users should have the minimum necessary permissions.

2.  **Broken Authentication:**
    *   **Strong Password Policies:** Enforce strong password requirements (length, complexity, rotation).
    *   **Multi-Factor Authentication (MFA):** Implement MFA wherever possible.
    *   **Rate Limiting:**  See section IV.
    *   **Secure Session Management:** Use secure cookies (HTTPOnly, Secure flags), and properly manage session expiration.
    *   **Token-Based Authentication (JWT):** Utilize JWTs for stateless authentication (consider refresh token rotation).
    *   **Password Hashing:**  *Never* store passwords in plain text. Use bcrypt, Argon2, or a similar robust hashing algorithm.
    *   **Disable Default Credentials:** Change all default usernames and passwords.

3.  **Sensitive Data Exposure:**
    *   **Data Masking/Redaction:** Mask or redact sensitive data in logs, error messages, and development environments.
    *   **Encryption:**  Encrypt data at rest (database, file storage) and in transit (HTTPS).
    *   **Data Loss Prevention (DLP):**  Implement DLP policies to prevent sensitive data from leaving the environment.

4.  **XML External Entities (XXE):**
    *   **Disable External Entity Processing:** Configure XML parsers to disable external entity processing. (Important for backend APIs that handle XML).

5.  **Broken Access Control:**
    *   **Authorization Checks:** Implement robust authorization checks to ensure users can only access resources they are permitted to.
    *   **Role-Based Access Control (RBAC):** Use RBAC to manage user permissions effectively.
    *   **Cross
