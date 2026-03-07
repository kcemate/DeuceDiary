# Write a performance optimization checklist for an Express.js
Agent: jordan
Generated: 2026-03-02T23:40:14.779266

Okay, here’s a comprehensive performance optimization checklist specifically geared towards an Express.js + PostgreSQL app launching on Railway, covering database indexes, query optimization, caching, CDN, and compression.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use PostgreSQL's `pg_stat_statements` extension to identify the queries consuming the most time. Install it if necessary: `CREATE EXTENSION pg_stat_statements;`
    * **Analyze Query Plans:**  Use `EXPLAIN ANALYZE` on slow queries to understand how PostgreSQL is executing them. Look for table scans, missing indexes, and inefficient joins.
    * **Index Key Columns:**  Add indexes to columns frequently used in `WHERE` clauses, `JOIN` conditions, and `ORDER BY` clauses. Prioritize columns with high cardinality (many distinct values).
    * **Composite Indexes:**  If you frequently query on multiple columns together, create a composite index covering those columns.
    * **Index Types:** Consider appropriate index types:
        * **B-Tree:** Default, suitable for most use cases.
        * **Hash:**  Faster for equality comparisons, but not suitable for range queries.
        * **GIN/GIST:**  For complex data types, full-text search, or geospatial data.
* **[ ] Query Optimization:**
    * **Avoid `SELECT *`:** Only select the columns you actually need. This reduces data transfer and memory usage.
    * **Use `WHERE` Clauses Effectively:** Filter data as early as possible in the query.
    * **Optimize `JOIN`s:**
        * Ensure `JOIN` columns are indexed.
        * Understand the type of `JOIN` (INNER, LEFT, RIGHT) and choose the most appropriate one.
        * Avoid unnecessary `JOIN`s.
    * **Use `LIMIT` and `OFFSET` Carefully:**  For pagination, `LIMIT` and `OFFSET` can be slow, especially with large datasets. Consider using keyset pagination (also known as "seek method") for improved performance.
    * **Subqueries vs. Joins:**  Evaluate if subqueries can be replaced with efficient `JOIN`s or vice versa.
    * **Rewrite Complex Queries:**  Break down complex queries into smaller, more manageable ones.
    * **Use Prepared Statements:**  Reusable prepared statements can significantly reduce query parsing overhead.
* **[ ] PostgreSQL Configuration:**
    * **`shared_buffers`:**  Increase this setting (typically 25-50% of RAM) to allow PostgreSQL to cache data in memory.  Railway often restricts this, investigate the limits.
    * **`effective_cache_size`:**  Tell PostgreSQL how much RAM is available for caching.
    * **`work_mem`:**  Controls the amount of memory used for sorts and temporary tables.  Increase if you see significant memory usage during sorting.
    * **`maintenance_work_mem`:**  Memory used during maintenance operations (e.g., `VACUUM`, `ANALYZE`).
    * **Connection Pooling:**  Use a PostgreSQL connection pooler (e.g., PgBouncer) to reduce the overhead of establishing new connections. Railway provides this service.

**II. Express.js Application Optimization**

* **[ ] Middleware:**
    * **Minimize Middleware:**  Only use middleware you absolutely need.  Each piece adds overhead.
    * **Order Matters:**  Place performance-sensitive middleware (e.g., authentication) closer to the request path.
* **[ ] Code Optimization:**
    * **Efficient Data Handling:**  Use streams and generators when dealing with large datasets.
    * **Avoid Synchronous Operations:**  Prefer asynchronous operations (Promises, async/await
