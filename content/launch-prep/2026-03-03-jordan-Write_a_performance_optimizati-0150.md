# Write a performance optimization checklist for an Express.js
Agent: jordan
Generated: 2026-03-03T01:50:08.715520

## Performance Optimization Checklist: Express.js + PostgreSQL App on Railway

This checklist covers key performance optimization areas for your Express.js application deployed on Railway, specifically focusing on database, query, caching, CDN, and compression.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use PostgreSQL's `auto_explain` extension or logging to pinpoint queries taking longer than expected.
    * **Analyze Queries:** Use `EXPLAIN ANALYZE` to understand query execution plans and identify missing or inefficient indexes.
    * **Add Indexes:** Create indexes on frequently queried columns, particularly for `WHERE`, `JOIN`, and `ORDER BY` clauses.  Consider composite indexes for multiple related columns.
    * **Index Types:**  Evaluate different index types (B-tree, Hash, GiST, GIN) based on data types and query patterns.  B-tree is generally a good starting point.
    * **Index Maintenance:** Regularly review and drop unused or redundant indexes to reduce write overhead.  Use `VACUUM ANALYZE` periodically to keep statistics up-to-date.
* **[ ] Query Optimization:**
    * **Avoid `SELECT *`:**  Only retrieve the necessary columns.
    * **Use `JOIN`s Efficiently:**  Ensure proper indexing on join columns. Consider using `INNER JOIN` over `LEFT JOIN` when appropriate.
    * **Optimize `WHERE` Clauses:**  Use the most efficient operators.  Avoid using functions in `WHERE` clauses that prevent index usage.
    * **Limit Results:** Use `LIMIT` to only retrieve the required number of results, especially in APIs.
    * **Batch Operations:**  Instead of multiple individual database calls, use batch operations where possible (e.g., `INSERT ... VALUES (...), (...), ...`).
    * **Subqueries:**  Evaluate subqueries carefully - often, they can be rewritten as joins for better performance.
    * **Prepared Statements:**  Utilize prepared statements to avoid repeated parsing and compilation of queries.
* **[ ] PostgreSQL Configuration:**
    * **`shared_buffers`:**  Adequately configure this setting for PostgreSQL to maximize memory usage for caching data. (Usually 25-50% of system RAM)
    * **`effective_cache_size`:**  Tell PostgreSQL how much RAM is available for caching.
    * **`work_mem`:**  Increase this for operations like sorting and hashing, allowing PostgreSQL to do more work in memory.
    * **Connection Pooling:** Railway automatically handles connection pooling for your database. Verify this is configured correctly.

**II. Express.js Application Optimization**

* **[ ] Code Optimization:**
    * **Minimize Middleware Usage:** Reduce the number of middleware you use to minimize overhead.
    * **Efficient Route Handlers:**  Keep route handlers concise and performant.  Offload complex logic to separate services.
    * **Asynchronous Operations:** Utilize `async/await` for asynchronous operations to prevent blocking the event loop.
    * **Avoid Synchronous Calls:**  Minimize synchronous database calls within your Express.js routes.
* **[ ] Request Validation:**  Use a validation library (e.g., Joi) for thorough input validation to prevent malicious data from entering your application.
* **[ ] Error Handling:** Implement robust error handling with proper logging to aid in debugging and identifying performance bottlenecks.


**III. Caching**

* **[ ] In-Memory Cache (Redis):** Railway offers built-in Redis. Use it for:
    * **Frequently Accessed Data:** Cache data that doesn't change often.
    * **API Responses:** Cache entire API responses to reduce database load.
    * **Session Data:**  Cache user session data
