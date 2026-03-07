# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-06T13:51:56.285684

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas to optimize your Express.js application running against a PostgreSQL database. It's broken down into categories with suggested actions and considerations.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use `pg_stat_statements` extension to identify your slowest queries.
    * **Analyze Data Types:**  Ensure you're using the most appropriate data types for your columns. Smaller types take less storage and can improve query performance.
    * **Index Relevant Columns:**  Index columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.  Consider composite indexes for frequently combined conditions.
    * **Index Types:** Choose the right index type:
        * **B-tree:**  Standard, good for equality and range queries.
        * **GIN/GIST:**  For full-text search or complex data types.
        * **BRIN:**  For large tables with correlated data.
    * **Avoid Over-Indexing:** Too many indexes can slow down write operations.
* **[ ] Query Optimization:**
    * **Analyze Queries:** Use `EXPLAIN ANALYZE` to understand how PostgreSQL executes your queries and identify bottlenecks.
    * **Write Efficient SQL:**
        * **Avoid `SELECT *`:** Only select the columns you actually need.
        * **Use `JOIN`s Effectively:** Understand the `JOIN` types (INNER, LEFT, RIGHT) and choose the most appropriate one.
        * **Optimize `WHERE` Clauses:** Use indexes, avoid functions in `WHERE` clauses (they prevent index usage), and simplify complex conditions.
        * **Limit Results:**  Use `LIMIT` to reduce the amount of data returned.
        * **Pagination:**  Implement pagination to handle large datasets efficiently.
    * **Use Prepared Statements (Parameterized Queries):**  Avoid SQL injection vulnerabilities and improve performance by reusing query plans.
* **[ ] Database Configuration:**
    * **`shared_buffers`:**  Adjust based on your system's memory.  Generally, 25% of RAM is a good starting point.
    * **`work_mem`:**  Controls the amount of memory used by internal sort operations. Increase if you have frequent sorting.
    * **`effective_cache_size`:**  Estimate your PostgreSQL cache size.
    * **`maintenance_work_mem`:**  Allocate memory for maintenance tasks like `VACUUM` and `ANALYZE`.
    * **`autovacuum`:**  Enable and tune autovacuum to prevent table bloat.
    * **Regular `VACUUM` and `ANALYZE`:** Maintain database statistics and reclaim dead tuples.  Consider using autovacuum for automated maintenance.
* **[ ] Connection Pooling:**  Use a connection pooler (like `pgbouncer` or `poolizer`) to reduce the overhead of establishing new database connections.

**II. Express.js & Middleware Optimization**

* **[ ] Route Handlers (Controllers):**
    * **Minimize Logic in Route Handlers:**  Move complex logic to separate services or helper functions.
    * **Async/Await:**  Use `async/await` for better readability and error handling.
    * **Caching:** Cache frequently accessed data in memory (e.g., using `node-cache` or `redis`) to reduce database load.
* **[ ] Middleware:**
    * **Optimize Middleware Chain:**  Place performance-critical middleware early in the chain.
    * **Minimize Middleware Usage:**  Use middleware sparingly and only when necessary.
    * **Profiling Middleware:** Use profiling tools to identify bottlenecks within your middleware.
* **[ ] Request
