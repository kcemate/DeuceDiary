# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T13:16:29.669875

## Performance Optimization Checklist for Express + PostgreSQL

This checklist covers performance optimization strategies for your Express.js application interacting with a PostgreSQL database. It's broken down into categories and prioritized for impact.

**I. Database Optimization (PostgreSQL Focus)**

* **[High Priority] Indexing:**
    * **Identify Slow Queries:** Use PostgreSQL's `auto_explain` extension to log slow queries and understand bottlenecks. Also, use tools like `pg_stat_statements` to identify frequently executed, slow queries.
    * **Add Indexes:**  Create indexes on columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.  **Don't over-index!**  Each index adds overhead to writes.
    * **Composite Indexes:** Consider composite indexes for queries with multiple filter conditions on the same table.
    * **Index Types:**  Choose the right index type (B-tree, Hash, GiST, GIN) based on your data and query patterns. B-tree is usually the best starting point.
    * **Regularly Review Indexes:**  PostgreSQL can automatically drop unused indexes. Monitor this and revisit index definitions periodically.
* **[High Priority] Query Optimization:**
    * **EXPLAIN ANALYZE:** Use `EXPLAIN ANALYZE` to understand the query execution plan and identify costly operations (e.g., full table scans, nested loops).
    * **Rewrite Slow Queries:** Optimize SQL queries for efficiency.  Common techniques:
        * **Avoid `SELECT *`:**  Specify only the columns you need.
        * **Use `JOIN` instead of subqueries (where appropriate):**  `JOIN`s are often optimized better by the database.
        * **Use `WHERE` clauses to filter data early:** Reduce the amount of data processed.
        * **Optimize `ORDER BY` clauses:**  Ensure indexes are used if ordering is frequent.
        * **Avoid using `LIKE '%...'`:** These are slow. Consider full-text search if appropriate.
    * **Prepared Statements:** Use prepared statements to reduce parsing overhead for repeated queries.
* **[Medium Priority] Database Configuration:**
    * **Memory Allocation:**  Tune PostgreSQL's memory settings (shared_buffers, work_mem, maintenance_work_mem) based on your workload and server resources.
    * **Connection Pooling:**  Use a connection pooling library (like `pg-pool` or `node-postgres`) to reuse database connections instead of creating new ones for each request. This drastically reduces connection establishment overhead.
    * **Background Processes:**  Configure PostgreSQL's background processes (e.g., autovacuum, statistics gathering) to maintain optimal performance.
* **[Low Priority] Data Types:**
    * **Choose Appropriate Data Types:** Use the smallest data type that can accommodate your data to minimize storage space and improve performance.


**II. Express.js Optimization**

* **[High Priority] Connection Pooling:** (See Database Optimization - pg-pool or node-postgres) - This is the *most* important Express.js-related optimization.
* **[High Priority] Middleware Optimization:**
    * **Remove Unused Middleware:**  Disable or remove middleware that isn't being used.
    * **Order Middleware Carefully:**  Place performance-critical middleware (e.g., authentication, compression) later in the chain to minimize overhead.
* **[Medium Priority] Request Handling:**
    * **Minimize Request Size:**  Reduce the amount of data transmitted in requests (e.g., use pagination, compress responses).
    * **Async/Await Effectively:**  Use `async/await` to avoid blocking the event loop.
    * **Avoid Callback Hell:** Utilize Promises or async/await to simplify asynchronous code.
* **
