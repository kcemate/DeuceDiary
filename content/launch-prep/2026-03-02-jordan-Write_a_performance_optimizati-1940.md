# Write a performance optimization checklist for an Express.js
Agent: jordan
Generated: 2026-03-02T19:40:53.911247

## Performance Optimization Checklist: Express.js + PostgreSQL App on Railway

This checklist covers key performance optimization strategies for your Express.js app deployed on Railway, focusing on database performance, query optimization, caching, CDN, and compression.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use PostgreSQL's `pg_stat_statements` extension to identify the slowest queries. Install and enable it: `CREATE EXTENSION pg_stat_statements;`
    * **Index Strategically:**  Add indexes on columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses.
    * **Composite Indexes:** Consider composite indexes for multiple columns frequently used together.
    * **Index Type:**  Choose the appropriate index type (B-tree, Hash, GiST, GIN) based on your query patterns. B-tree is the most common and generally a good starting point.
    * **Regularly Review Indexes:**  Monitor `pg_stat_statements` to ensure indexes are still being used and are effective.  Remove unused indexes.
* **[ ] Query Optimization:**
    * **EXPLAIN ANALYZE:** Use `EXPLAIN ANALYZE` to understand how PostgreSQL executes your queries and identify bottlenecks (e.g., full table scans, inefficient joins).
    * **Rewrite Slow Queries:** Refactor queries to use more efficient join strategies, reduce the amount of data scanned, and avoid using `SELECT *`.
    * **Use `LIMIT` and `OFFSET` Carefully:** When using pagination, ensure your queries are optimized for `LIMIT` and `OFFSET` to avoid performance issues. Consider keyset pagination for large datasets.
    * **Materialized Views:**  For complex, frequently queried data, consider materialized views to pre-compute and store the results.
    * **Parameterization:**  Use parameterized queries to prevent SQL injection and improve performance by allowing PostgreSQL to cache query plans.
* **[ ] Database Configuration:**
    * **Connection Pool:**  Railway typically handles connection pooling for you. Verify the connection pool size is appropriate for your application's concurrency.  Experiment to find the optimal setting.
    * **`shared_buffers`:**  Adjust PostgreSQL's `shared_buffers` setting (typically 25-50% of RAM) to allow more data to be cached in memory.
    * **`work_mem`:**  Increase `work_mem` (the amount of memory PostgreSQL uses for sorting and operations) if you see frequent disk I/O during sorting.
    * **`maintenance_work_mem`:**  Allocate more memory for maintenance operations like `VACUUM` and `ANALYZE`.



**II. Express.js Application Optimization**

* **[ ] Code Efficiency:**
    * **Efficient Data Structures:** Use appropriate data structures in your Express.js code (e.g., Maps for fast lookups).
    * **Avoid Large Calculations in Requests:** Offload complex calculations to the database or background processes.
    * **Minimize Middleware:**  Remove unnecessary middleware.
    * **Proper Error Handling:** Implement robust error handling to prevent unexpected performance degradation.
* **[ ] Asynchronous Operations:**
    * **`async/await`:**  Use `async/await` for asynchronous operations to avoid blocking the event loop.
* **[ ] Logging:**  Use minimal logging, focusing on critical errors and performance metrics. Excessive logging can impact performance.

**III. Caching**

* **[ ] In-Memory Caching (Redis):**  Railway provides a built-in Redis service. Utilize it for:
    * **Frequently Accessed Data:** Cache results from database queries that don't change often.
    * **Session Data:**  Cache user session data to reduce database
