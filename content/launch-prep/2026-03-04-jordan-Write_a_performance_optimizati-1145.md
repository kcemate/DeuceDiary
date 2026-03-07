# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T11:45:38.339324

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas to focus on when optimizing the performance of your Express.js application interacting with a PostgreSQL database. It's broken down into categories with actionable steps.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Analyze Query Patterns:**  Use `EXPLAIN ANALYZE` on slow queries to identify missing indexes and inefficient access paths.
    * **Create Appropriate Indexes:**  Index columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses. Consider composite indexes for multiple related columns.
    * **Index Types:** Choose the right index type:
        * `B-Tree`:  Default, good for equality and range queries.
        * `Hash`:  Best for equality queries, but less flexible.
        * `GIN/GIST`:  For full-text search or complex data types.
    * **Regular Index Maintenance:**  Run `VACUUM` and `ANALYZE` regularly to keep statistics and defragment indexes.
* **[ ] Query Optimization:**
    * **Use `EXPLAIN ANALYZE` Frequently:** This is *the* most important step! Understand how PostgreSQL is executing your queries.
    * **Avoid `SELECT *`:** Retrieve only the columns you need.
    * **Write Efficient WHERE Clauses:** Filter data as early as possible in the query.
    * **Optimize JOINs:** Ensure indexes are on the join columns and understand the join order.  Prefer `INNER JOIN` where appropriate.
    * **Avoid `LIKE '%string%'` (Leading Wildcards):** This usually requires a full table scan. Consider full-text search indexes if you need fuzzy searching.
    * **Use `LIMIT` Effectively:**  Limit the number of rows returned if you don't need all of them.
    * **Stored Procedures:** For complex logic that's frequently executed, consider using stored procedures to reduce network traffic and improve performance.
* **[ ] Database Configuration:**
    * **Memory Allocation:**  Adjust `shared_buffers`, `work_mem`, and `maintenance_work_mem` based on your server's resources and workload.
    * **Connection Pooling:** Use a connection pooler like pgPoolModule or Node.js’s built-in connection pooling to reduce the overhead of establishing new connections.
    * **Logging:** Monitor PostgreSQL logs for slow queries and other performance issues.
    * **Hardware:** Ensure sufficient CPU, RAM, and disk I/O for your database. Consider SSDs for faster storage.

**II. Express.js Application Optimization**

* **[ ] Code Optimization:**
    * **Minimize Database Calls:**  Batch operations where possible.  Avoid making multiple small queries when a single larger query can achieve the same result.
    * **Optimize Data Transfer:**  Only transfer data that's needed. Avoid sending large JSON objects unnecessarily.
    * **Caching:** Implement caching mechanisms (e.g., Redis, Memcached) to store frequently accessed data.  Consider using Express’s built-in caching middleware.
    * **Efficient Data Handling:**  Use efficient data structures and algorithms.
    * **Avoid Callback Hell:** Use Promises or async/await for asynchronous operations to improve readability and maintainability.
* **[ ] Middleware Optimization:**
    * **Choose Lightweight Middleware:**  Carefully select middleware and avoid those with significant performance overhead.
    * **Configure Middleware Effectively:**  Tune middleware settings for optimal performance.
* **[ ] Routing Optimization:**
    * **Minimize Route Complexity:** Simplify your routes and avoid complex logic within them.
    * **Route Parameter Validation:**  Validate route parameters early to prevent unnecessary database queries.
* **[ ] Request/Response Size
