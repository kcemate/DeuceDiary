# Write a performance optimization checklist for an Express.js
Agent: jordan
Generated: 2026-03-02T20:17:11.405460

## Performance Optimization Checklist: Express.js + PostgreSQL App on Railway

This checklist outlines key optimizations for your Express.js application using PostgreSQL, deployed on Railway. It covers various aspects from database tuning to front-end delivery.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Analyze Queries:** Use `EXPLAIN ANALYZE` on your slow queries to identify missing indexes and execution paths.
    * **Index Key Columns:**  Index columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
    * **Composite Indexes:** Consider composite indexes for queries using multiple columns.
    * **Partial Indexes:**  Create partial indexes on a subset of rows based on a specific condition if frequently queried. (e.g., `idx_users_active` on `users` table where `is_active = true`)
    * **Index Maintenance:** Regularly monitor index usage and rebuild/reorganize indexes (especially after significant data changes) - Railway’s database metrics should provide insights.
* **[ ] Query Optimization:**
    * **Avoid `SELECT *`:**  Retrieve only the necessary columns.
    * **Use `WHERE` Clauses Effectively:** Filter data as early as possible in the query.
    * **Optimize `JOIN`s:** Ensure `JOIN` conditions are indexed and use the appropriate `JOIN` type (INNER, LEFT, RIGHT) based on your needs.
    * **Use `EXISTS` instead of `COUNT(*)`:**  When checking for the existence of rows, `EXISTS` is often faster.
    * **Subqueries vs. Joins:** Analyze whether subqueries or joins are more performant for specific scenarios.
    * **Limit Results:** Use `LIMIT` clauses to restrict the number of rows returned, especially in API endpoints.
    * **Analyze Query Plans:** Use `EXPLAIN ANALYZE` to understand how the database is executing your queries.
* **[ ] Database Server Configuration (Railway):**
    * **Memory Allocation:**  Ensure your PostgreSQL instance on Railway has sufficient memory allocated for the workload. Monitor memory usage.
    * **Connection Pool Size:**  Adjust the connection pool size in your Express.js application.  A properly configured pool reduces connection overhead.
    * **`shared_buffers`:**  Optimize this PostgreSQL parameter for your workload – generally, 25-50% of RAM is a good starting point.
    * **`work_mem`:** Adjust to improve sorting and hashing performance.
    * **Monitoring:** Utilize Railway’s database metrics (CPU, memory, query performance, connection count) to proactively identify bottlenecks.


**II. Express.js Application Optimization**

* **[ ] Code Profiling:** Use profiling tools to identify slow code sections in your Express.js application.
* **[ ] Asynchronous Operations:** Utilize `async/await` for all asynchronous operations (database queries, network requests) to avoid blocking the event loop.
* **[ ] Minimize Middleware:**  Only use essential middleware in your Express.js application.
* **[ ] Efficient Data Handling:** Process and format data efficiently to avoid unnecessary overhead.
* **[ ] Validation & Sanitization:** Validate and sanitize user input to prevent vulnerabilities and improve performance.
* **[ ] Session Management:** Optimize session storage (consider Redis if needed for large session data).  Railway provides easy integration with Redis.



**III. Caching**

* **[ ] In-Memory Caching:** Utilize in-memory caching (e.g., `node-cache`, `memory-cache`) for frequently accessed data within your Express.js application.
* **[ ] Redis Caching:**  Implement Redis caching for:
    * **API Responses:** Cache responses to API endpoints based on request
