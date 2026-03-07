# Write a security checklist for an Express + React app launch
Agent: jordan
Generated: 2026-03-02T21:14:16.556580

## Express + React App Production Security Checklist

This checklist covers key security considerations for launching your Express + React app to production, drawing heavily from the OWASP Top 10 and incorporating best practices for a secure deployment.  It's a starting point; you’ll need to adapt it based on your specific application and architecture.

**I. Infrastructure & Deployment Security:**

* [ ] **Secure Server Environment:**  Use a reputable cloud provider (AWS, GCP, Azure) with security features enabled (firewalls, network segmentation, IAM roles).
* [ ] **HTTPS Configuration:**  Enforce HTTPS across your entire application using Let’s Encrypt or a similar certificate authority.
* [ ] **Regular Updates:**  Implement a process for patching servers, OS, and dependencies. Automate where possible.
* [ ] **Monitoring & Logging:**  Set up comprehensive logging and monitoring for security events, errors, and performance. Utilize a SIEM (Security Information and Event Management) system.
* [ ] **DDoS Protection:** Implement DDoS mitigation services (e.g., Cloudflare, AWS Shield) to protect against volumetric attacks.
* [ ] **Infrastructure as Code (IaC):** Use tools like Terraform or CloudFormation to manage your infrastructure securely and consistently.


**II.  OWASP Top 10 Mitigation:**

**1. Injection (SQL, NoSQL, Command)**
* [ ] **Parameterized Queries:** Use parameterized queries or ORMs to prevent SQL injection. *Never* construct SQL queries with user-supplied data directly.
* [ ] **NoSQL Injection:** Sanitize user input when interacting with NoSQL databases (MongoDB, etc.).
* [ ] **Command Injection:**  Avoid executing shell commands with user input.  If necessary, use safe APIs designed for specific tasks.


**2. Broken Authentication & Session Management**
* [ ] **Strong Password Policies:** Enforce minimum password length, complexity, and consider multi-factor authentication (MFA).
* [ ] **Secure Session Management:**  Use secure session IDs (e.g., random, long), HTTPOnly and Secure flags for cookies, and implement session timeouts.
* [ ] **Regular Password Changes:**  Consider encouraging regular password changes (though this isn’t always the most effective measure).
* [ ] **Logout Functionality:**  Implement a reliable logout functionality to invalidate session tokens.
* [ ] **Consider OAuth 2.0/OpenID Connect:**  Leverage established protocols for authentication and authorization rather than rolling your own.


**3. Sensitive Data Exposure**
* [ ] **Data Masking/Tokenization:**  Mask or tokenize sensitive data (e.g., PII, credit card information) in transit and at rest.
* [ ] **Encryption:** Encrypt sensitive data both in transit (TLS) and at rest (database encryption).
* [ ] **Secure Storage:**  Use a secure database solution with appropriate access controls and backups.
* [ ] **Avoid Storing Secrets in Code:**  Use environment variables or a secrets management service (e.g., HashiCorp Vault, AWS Secrets Manager) to store API keys, database passwords, and other sensitive information.



**4. XML External Entities (XXE)** - (Less relevant for React-only, but important for backend XML handling)
* [ ] **Disable External Entity Resolution:**  Configure XML parsers to disable the resolution of external entities.


**5. Broken Access Control**
* [ ] **Principle of Least Privilege:**  Grant users only the minimum permissions necessary to perform their tasks.
* [ ] **Role-Based Access Control (RBAC):**  Implement RBAC to manage user permissions effectively.
* [ ] **Validate All Access Requests:**  Thoroughly validate all access requests to ensure users are authorized to access the requested resources.
* [
