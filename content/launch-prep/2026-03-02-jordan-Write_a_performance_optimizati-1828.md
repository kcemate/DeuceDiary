# Write a performance optimization checklist for an Express.js
Agent: jordan
Generated: 2026-03-02T18:28:24.276222

## Performance Optimization Checklist for Express.js + PostgreSQL App on Railway

This checklist outlines key areas to optimize your Express.js application running on Railway, particularly focusing on PostgreSQL database performance, caching, and delivery optimization.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Analyze Queries:** Use `EXPLAIN ANALYZE` on slow queries to identify missing or inefficient indexes.
    * **Index Key Columns:**  Index columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses.
    * **Composite Indexes:** Consider composite indexes for queries that filter on multiple columns simultaneously.
    * **Data Types:** Use the most appropriate data types for your columns to minimize storage and optimize comparisons.  Don't use `VARCHAR` for numeric IDs.
    * **Index Maintenance:**  Regularly run `VACUUM` and `ANALYZE` to keep the database statistics up-to-date and maintain index efficiency. (Railway provides automated tasks for this).
* **[ ] Query Optimization:**
    * **Avoid `SELECT *`:** Only select the necessary columns.
    * **Use `JOIN`s Efficiently:** Optimize join conditions and ensure you're using the correct join type (INNER, LEFT, RIGHT).
    * **Limit Results:**  Use `LIMIT` clauses to retrieve only the required number of records, especially when pagination is involved.
    * **Subqueries:**  Re-write subqueries as joins where possible, as subqueries can be less efficient.
    * **Prepared Statements:** Use prepared statements to avoid repeated parsing and compilation of the same queries (Express.js drivers handle this).
    * **Raw SQL (Sparingly):** If complex logic is difficult to express in ORM queries, use raw SQL with careful attention to performance.
* **[ ] Database Configuration:**
    * **Connection Pool Size:** Tune the connection pool size in your Express.js app based on your application's workload. (Railway allows configuration.)
    * **PostgreSQL Settings:**  Review and adjust PostgreSQL configuration parameters like `shared_buffers`, `work_mem`, and `effective_cache_size` based on your database workload and Railway's resource limits. (Careful - these can significantly impact Railway's performance)

**II. Express.js App Optimization**

* **[ ] Code Efficiency:**
    * **Avoid Unnecessary Calculations:** Optimize algorithms and calculations within your route handlers.
    * **Minimize Data Transfer:** Only transfer data that’s actually needed by the client.
    * **Asynchronous Operations:**  Utilize `async/await` for handling asynchronous operations, improving responsiveness.
    * **Code Reviews:**  Implement code reviews to catch performance bottlenecks early on.
* **[ ] Route Handling:**
    * **Route Prioritization:** Optimize the order of your routes, placing frequently accessed routes earlier in your application.
    * **Handler Efficiency:** Keep route handlers concise and focused, avoiding unnecessary operations within them.
* **[ ] Logging:**
    * **Controlled Logging:** Use logging strategically to monitor performance without significantly impacting response times.  Avoid logging in production.



**III. Caching**

* **[ ] Server-Side Caching:**
    * **Redis/Memcached Integration:** Utilize a caching layer (like Redis, supported by Railway) to store frequently accessed data.  This significantly reduces the load on the PostgreSQL database.
    * **Cache Keys:** Design effective cache keys for efficient retrieval of cached data.
    * **Cache Invalidation:** Implement a strategy for invalidating the cache when data changes (e.g., time-to-live, event-based invalidation).
* **[ ] Browser Caching:**
    * **HTTP Headers:** Configure appropriate HTTP headers (e.g., `
