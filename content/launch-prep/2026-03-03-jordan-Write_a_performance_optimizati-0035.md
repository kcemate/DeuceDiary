# Write a performance optimization checklist for an Express.js
Agent: jordan
Generated: 2026-03-03T00:35:59.256642

Okay, here's a comprehensive performance optimization checklist specifically tailored for an Express.js + PostgreSQL app launching on Railway, covering database indexing, query optimization, caching, CDN, and compression.  It's broken down into categories with detailed considerations.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use PostgreSQL's `pg_stat_statements` extension to identify the queries consuming the most time and resources.  Railway allows installing extensions.
    * **Index Key Columns:** Create indexes on columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
    * **Composite Indexes:**  Consider composite (multi-column) indexes if queries frequently use multiple columns together.
    * **Index Type:** Choose the appropriate index type: `B-tree` (default, good for equality and range queries), `GIN` (good for searching text and arrays), `GiST` (for more complex data types).
    * **Index Maintenance:** Regularly review and rebuild indexes, especially after significant data changes.  PostgreSQL has automatic maintenance, but monitoring is still vital.
* **[ ] Query Optimization:**
    * **EXPLAIN ANALYZE:**  Use `EXPLAIN ANALYZE` before any new query or after modifying existing ones to understand the query plan and identify bottlenecks. Pay attention to the `cost` and `rows` estimates.
    * **Avoid `SELECT *`:**  Only select the columns you need.  Retrieving unnecessary data increases network traffic and processing time.
    * **Use `JOIN`s Wisely:** Ensure proper indexing on join columns and review query plans for efficient join strategies.
    * **Optimize `WHERE` Clauses:**
        * Use specific values instead of wildcard searches (`LIKE '%keyword%'` is slow).
        * Avoid functions in `WHERE` clauses that prevent index usage (e.g., `WHERE UPPER(column) = 'VALUE'`).  Pre-process the data if possible.
    * **Limit Result Sets:** Use `LIMIT` clauses whenever possible to restrict the number of returned rows, especially when pagination is involved.
    * **Subqueries vs. `JOIN`s:**  Review if subqueries can be replaced with `JOIN`s for potentially better performance.
    * **Use `WITH` (Common Table Expressions - CTEs):** Can sometimes improve readability and, in some cases, performance by optimizing subqueries.
* **[ ] PostgreSQL Configuration:**
    * **`shared_buffers`:**  Tune this value based on your server's memory to allow PostgreSQL to cache data efficiently.
    * **`work_mem`:**  Increase this if you have queries that perform a lot of in-memory sorting or hashing.
    * **`effective_cache_size`:**  Help PostgreSQL estimate the size of its shared buffer to make better caching decisions.
    * **Connection Pooling:** Use a connection pooler (like PgBouncer) to manage connections and reduce the overhead of creating new connections for each request.  Railway can manage this.



**II. Express.js Application Optimization**

* **[ ] Code Profiling:** Use a profiler (e.g., `node --inspect`) to identify slow code execution within your Express.js routes and middleware.
* **[ ] Minimize Middleware:** Only include necessary middleware. Each piece adds overhead.
* **[ ] Efficient Data Processing:** Avoid synchronous operations within Express routes. Use async/await to handle asynchronous operations efficiently.
* **[ ] Route Optimization:**  Make sure your route handlers are concise and perform only the necessary tasks.
* **[ ] Request Validation:** Validate incoming data carefully to avoid unexpected errors and inefficient queries. Use a library like `express-validator`.



**III. C
