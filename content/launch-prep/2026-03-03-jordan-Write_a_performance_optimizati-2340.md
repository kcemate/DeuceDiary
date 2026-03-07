# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T23:40:22.741499

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas to consider for optimizing your Express application's performance when using PostgreSQL as your database. It's categorized for easier navigation and prioritization.

**I. Database Optimization (PostgreSQL Focus):**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use `EXPLAIN ANALYZE` to pinpoint the queries with the slowest execution plans.
    * **Index Appropriate Columns:**  Index columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
    * **Composite Indexes:**  Consider composite indexes when querying multiple columns together.
    * **Partial Indexes:**  Index only a subset of data that frequently gets queried. (e.g., `WHERE status = 'active'`)
    * **Index Types:** Choose the right index type (B-tree, GiST, GIN, BRIN) based on your data and query patterns.
    * **Avoid Over-Indexing:** Too many indexes can slow down write operations.

* **[ ] Query Optimization:**
    * **Analyze Queries:** Regularly run `ANALYZE` to update PostgreSQL statistics used for query planning.
    * **Rewrite Slow Queries:**  Optimize complex queries for efficiency. Look for:
        * **Avoid `SELECT *`:**  Retrieve only the necessary columns.
        * **Use `JOIN`s Efficiently:** Understand different join types and optimize accordingly.
        * **Minimize `LIKE '%...%'`:** Leading wildcards in `LIKE` clauses are notoriously slow. Consider alternative search methods.
        * **Use `EXISTS` instead of `COUNT(*)`:** When you just need to know if a row exists.
    * **Use Prepared Statements:**  If you're executing the same query multiple times, use prepared statements to reduce parsing overhead.

* **[ ] PostgreSQL Configuration:**
    * **`shared_buffers`:**  Adjust this based on your server's RAM (generally 25-50% of RAM).
    * **`work_mem`:**  Increase this for operations like sorting and hashing.
    * **`maintenance_work_mem`:**  Increase this for maintenance operations like `VACUUM` and `ANALYZE`.
    * **`effective_cache_size`:**  Tell PostgreSQL how much RAM is available for caching data.
    * **`autovacuum`:** Ensure autovacuum is enabled and properly configured to prevent table bloat.
    * **Monitor Performance Metrics:**  Use `pg_stat_statements` to track query execution times and identify performance bottlenecks.


**II. Express Application Optimization:**

* **[ ] Connection Pooling:**
    * **Use a Connection Pooler:**  Employ a library like `pg-pool` or `sequelize`'s built-in connection pooler.  This avoids the overhead of creating and destroying database connections for each request.
    * **Configure Pool Size:**  Adjust the pool size based on your application's concurrency requirements.

* **[ ] Route Optimization:**
    * **Optimize Route Definitions:** Keep routes concise and efficient.
    * **Limit Data Returned:** Only return the necessary data in responses.
    * **Use `async/await`:**  Ensure proper handling of asynchronous operations to prevent blocking the event loop.

* **[ ] Middleware Optimization:**
    * **Minimize Middleware Usage:**  Each middleware function adds overhead. Remove unnecessary middleware.
    * **Batch Operations:** If possible, combine multiple database operations into a single request.

* **[ ] Code Efficiency:**
    * **Avoid Unnecessary Calculations:** Optimize calculations within your routes and middleware.
    * **Use Efficient Data Structures:** Choose appropriate data structures for your data.
    * **Caching:** Implement caching
