# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-07T12:13:02.618599

## Performance Optimization Checklist: Express + PostgreSQL

This checklist provides a structured approach to optimizing the performance of your Express.js application using PostgreSQL. It's broken down into categories with suggested actions and considerations.

**I. Application-Level Optimizations (Express.js)**

* **[ ]  Code Reviews & Best Practices:**
    *  Ensure clean, well-documented code with consistent styling.
    *  Avoid unnecessary code duplication.
    *  Follow Express.js coding conventions.
* **[ ]  Keep Dependencies Updated:** Regularly update Express.js, PostgreSQL drivers (e.g., `pg`), and related libraries. Newer versions often contain performance improvements and bug fixes.
* **[ ]  Middleware Optimization:**
    *  **Minimize Middleware:** Only include essential middleware.  Each middleware adds overhead.
    *  **Order Matters:** Arrange middleware in the most efficient order.  Parse body middleware (e.g., `body-parser`) should be placed early.
    *  **Caching Middleware:** Utilize caching middleware (e.g., `express-cache-manager`) strategically for responses that don't change frequently.
* **[ ]  Request Handling:**
    *  **Route Optimization:** Use efficient route matching.  Avoid overly complex route definitions.
    *  **Keep Responses Small:** Return only the data needed by the client. Avoid sending full document objects unnecessarily.
    *  **Compression:** Enable Gzip compression (e.g., using `compression`) to reduce payload sizes, particularly for text-based responses.
* **[ ]  Statelessness:** Design your application to be stateless whenever possible. This simplifies scaling.
* **[ ]  Error Handling:** Implement robust, centralized error handling to prevent unexpected slow-downs.  Avoid generic error messages in production.
* **[ ]  Logging:** Implement detailed logging (especially performance-related metrics) for debugging and monitoring. Consider using a logging library like Winston or Bunyan.


**II. Database Optimization (PostgreSQL)**

* **[ ]  Query Optimization:** **This is the MOST important area.**
    *  **EXPLAIN ANALYZE:** Use `EXPLAIN ANALYZE` to understand query execution plans. Identify bottlenecks like full table scans, missing indexes, and inefficient joins.
    *  **Index Usage:**
        * **Identify Missing Indexes:** Analyze slow queries and identify columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses that *don't* have indexes.
        * **Appropriate Index Types:** Choose the correct index type for your needs (B-tree, Hash, GiST, GIN). B-tree is the most common.
        * **Composite Indexes:**  If you frequently filter on multiple columns together, consider a composite index.  Order matters – the most selective column should be first.
        * **Index Maintenance:** Regularly analyze and vacuum your tables (`ANALYZE` and `VACUUM`) to ensure indexes are up-to-date and efficient.
    *  **Slow Query Logging:** Enable slow query logging in PostgreSQL to identify queries exceeding a specified duration.  (See PostgreSQL documentation on `log_min_duration_statement`).
    *  **Query Rewriting:**
        * **Avoid `SELECT *`:** Only select the columns you need.
        * **Use `JOIN` instead of Subqueries:**  Often, using `JOIN` is more efficient.
        * **Rewrite Correlated Subqueries:**  These are frequently performance bottlenecks.
        * **Optimize `WHERE` Clauses:**  Use efficient comparison operators (`=`, `<`, `>`, `BETWEEN`).  Avoid `LIKE '%...%'` as it's usually slow.
        * **Use `EXISTS` instead of `COUNT(*)` in Subqueries:** When checking for the existence of
