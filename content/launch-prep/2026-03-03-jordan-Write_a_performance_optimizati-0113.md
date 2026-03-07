# Write a performance optimization checklist for an Express.js
Agent: jordan
Generated: 2026-03-03T01:13:04.205499

## Performance Optimization Checklist for Express.js + PostgreSQL App on Railway

This checklist focuses on optimizing your Express.js application running on Railway, specifically considering the database (PostgreSQL) and the overall user experience.  It's broken down into key categories with actionable steps and considerations.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use PostgreSQL’s `pg_stat_statements` extension to identify queries with high execution times.
    * **Analyze Query Plans:**  Use `EXPLAIN ANALYZE` for slow queries to understand the execution plan and identify missing indexes.
    * **Create Appropriate Indexes:** Add indexes on columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.  Consider composite indexes for frequently combined conditions.
    * **Index Type Selection:**  Choose the appropriate index type (B-tree, GiST, GIN, etc.) based on your data and query patterns.
    * **Regular Index Maintenance:** Monitor index usage and rebuild/reorganize indexes periodically to maintain optimal performance. (Consider automated maintenance scripts).
* **[ ] Query Optimization:**
    * **Avoid `SELECT *`:** Retrieve only the columns needed to reduce data transfer.
    * **Use `WHERE` Clauses Effectively:** Filter data as early as possible in the query.
    * **Optimize `JOIN` Operations:** Ensure `JOIN` columns are indexed. Use the most efficient `JOIN` type (INNER, LEFT, RIGHT) appropriate for your data relationships.
    * **Avoid `LIKE '%...%'`:**  Leading wildcards in `LIKE` queries prevent index usage.  Consider full-text search if necessary.
    * **Use `LIMIT` and `OFFSET` Carefully:**  For pagination, `LIMIT` and `OFFSET` can become slow with large datasets.  Consider using keyset pagination for better performance.
    * **Review Subqueries:**  Subqueries can sometimes be inefficient.  Rewrite them as joins if possible.
    * **Use Window Functions:** If appropriate, window functions can often replace complex queries.
    * **PostgreSQL Specific:** Utilize PostgreSQL's features like CTEs (Common Table Expressions) for readability and potential optimization.
* **[ ] Connection Pooling:** Railway's environment automatically handles connection pooling for your database. Verify this is configured correctly.  Monitor connection pool usage.


**II. Express.js Application Optimization**

* **[ ] Code Profiling:** Use profiling tools to identify bottlenecks in your Express.js code (e.g., slow middleware, inefficient route handlers).
* **[ ] Minimize Middleware:**  Load only the necessary middleware.  Remove unused or redundant middleware.
* **[ ] Efficient Route Handlers:**  Optimize route handlers for speed. Avoid unnecessary database queries or complex calculations within route handlers.
* **[ ] Asynchronous Operations:**  Always use asynchronous operations (Promises, `async/await`) to avoid blocking the event loop.
* **[ ] Error Handling:**  Implement robust error handling to prevent crashes and provide informative error messages.
* **[ ] Logging:** Implement detailed logging for debugging and monitoring.  Use a structured logging library for easier analysis.
* **[ ] Code Quality:** Employ best practices for code style, maintainability, and security.



**III. Caching**

* **[ ] Browser Caching:** Leverage browser caching for static assets (images, CSS, JavaScript) using appropriate HTTP headers (Cache-Control, Expires). Railway generally handles this.
* **[ ] Express.js Caching Middleware:**  Utilize caching middleware (e.g., `express-cache-control`) to cache responses based on request headers, query parameters, or other relevant factors.
* **[ ] In-Memory Caching (Redis or Memcached
