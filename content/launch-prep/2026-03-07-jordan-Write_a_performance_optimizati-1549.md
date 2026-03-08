# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-07T15:49:00.133048

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas to focus on when optimizing a web application built with Express and PostgreSQL. It's broken down into categories with actionable steps. Remember to prioritize based on your application's specific bottlenecks.

**I. Database Optimization (PostgreSQL Focus)**

* **[ ] Indexing:**
    * **Analyze Queries:** Use `EXPLAIN ANALYZE` on slow queries to identify missing or ineffective indexes.
    * **Proper Index Types:** Choose the right index type (B-Tree, GiST, GIN, BRIN) based on your query patterns.
    * **Composite Indexes:** Create composite indexes for queries that filter on multiple columns frequently.
    * **Covering Indexes:**  Consider covering indexes to avoid extra database lookups.
    * **Index Maintenance:** Regularly run `VACUUM ANALYZE` to keep indexes updated and statistics accurate.
* **[ ] Query Optimization:**
    * **Avoid `SELECT *`:** Only select the columns you actually need.
    * **Use `WHERE` Clauses Effectively:** Filter data as early as possible in the query.
    * **Optimize `JOIN`s:**  Understand the join types and use the most efficient join strategy (INNER, LEFT, RIGHT).
    * **Avoid `LIKE '%...%'` (Leading Wildcards):**  These are notoriously slow. Consider full-text search alternatives if applicable.
    * **Use `LIMIT`:**  Always include `LIMIT` clauses to avoid retrieving unnecessary data.
    * **Subqueries:**  Optimize nested queries or refactor them into joins.
    * **Common Table Expressions (CTEs):**  CTEs can sometimes improve readability and, in some cases, performance.
* **[ ] Database Configuration:**
    * **`shared_buffers`:**  Adjust based on your server's memory and workload (generally 25-50% of RAM).
    * **`work_mem`:**  Increase for operations like sorting and hashing.
    * **`effective_cache_size`:**  Provide an estimate of your server's memory available for caching.
    * **`maintenance_work_mem`:** Allocate more memory for maintenance tasks like `VACUUM` and `ANALYZE`.
    * **Connection Pooling:**  Use a connection pooler (like PgBouncer or connection pooling within your Express app) to reduce connection overhead.
* **[ ] Data Types:**
    * **Choose Efficient Types:**  Use the smallest appropriate data types to minimize storage and processing.
    * **Avoid `TEXT` When Possible:**  If storing short strings, consider `VARCHAR`.

**II. Express.js Optimization**

* **[ ] Code Efficiency:**
    * **Minimize Middleware Usage:**  Only use middleware that's truly necessary.
    * **Optimize Route Handlers:**  Keep route handlers concise and efficient.
    * **Caching:** Implement caching strategies (e.g., Redis, Memcached) for frequently accessed data.
    * **Use Asynchronous Operations:** Utilize `async/await` or Promises correctly to avoid blocking the event loop.
    * **Avoid Callback Hell:**  Use Promises or async/await to write cleaner, more maintainable asynchronous code.
* **[ ] Request Handling:**
    * **Limit Request Size:**  Implement measures to prevent excessively large requests.
    * **Session Management:**  Optimize session storage (consider Redis for shared sessions).
* **[ ] Express Settings:**
    * **`keepAlive`:**  Enable `keepAlive` for HTTP connections to reuse existing connections.
    * **`compression`:**  Enable gzip compression for responses to reduce bandwidth.
* **[ ] Static Files:**  Serve static assets (images, CSS, JavaScript)
