# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T23:33:46.406279

## Performance Optimization Checklist: Express + PostgreSQL

This checklist provides a comprehensive guide to optimizing your Express.js application interacting with a PostgreSQL database. It's broken down into categories for easier navigation. **Remember to prioritize based on your specific application's needs and bottlenecks.**

**I. Database Optimization (PostgreSQL Focused)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use `EXPLAIN ANALYZE` on slow queries to pinpoint missing or ineffective indexes.
    * **Index Frequently Queried Columns:**  Index columns used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
    * **Composite Indexes:** Create composite indexes for queries with multiple columns frequently used together.
    * **Index Types:** Choose the right index type (B-tree, GiST, GIN, BRIN) based on your data and query patterns. GiST and GIN are often useful for complex searches.
    * **Partial Indexes:** Index only a subset of rows that meet specific criteria (e.g., `WHERE status = 'active'`).
    * **Regular Index Maintenance:**  Run `VACUUM` and `ANALYZE` regularly to maintain index health and statistics.
* **[ ] Query Optimization:**
    * **Avoid `SELECT *`:** Only select the necessary columns to reduce network traffic and database processing.
    * **Use `LIMIT`:**  Especially when fetching a large number of records, use `LIMIT` to control the result set.
    * **Optimize `JOIN`s:**  Ensure `JOIN`s are efficient (using proper indexes, correct `JOIN` types - INNER, LEFT, RIGHT).
    * **Use `WHERE` clauses effectively:**  Filter data as early as possible in the query.
    * **Rewrite Complex Queries:**  Break down complex queries into smaller, more manageable ones using temporary tables or Common Table Expressions (CTEs).
    * **Avoid Functions in `WHERE` Clauses:** Functions applied to columns in `WHERE` clauses often prevent index usage.
    * **Use Prepared Statements:**  Reusing prepared statements significantly reduces parsing overhead for repeated queries.
* **[ ] Database Configuration:**
    * **`shared_buffers`:**  Increase the `shared_buffers` setting to allow PostgreSQL to cache more data in memory. (Generally 25-50% of system RAM)
    * **`work_mem`:**  Increase this value to allow PostgreSQL to sort and hash more data in memory.
    * **`effective_cache_size`:**  Tell PostgreSQL how much memory is available for caching.
    * **`maintenance_work_mem`:**  Increase for operations like `VACUUM` and `CREATE INDEX`.
    * **Connection Pool Size:** Configure a sufficient connection pool in Express to avoid the overhead of constantly creating and destroying connections.
* **[ ] Data Types:** Use the most appropriate data types for your columns to minimize storage space and improve performance. (e.g., `INTEGER` instead of `BIGINT` if the range isn't needed).


**II. Express.js Application Optimization**

* **[ ] Connection Pooling:**  Use a connection pool library (like `pg-pool`) for your PostgreSQL connection in Express. This avoids the overhead of repeatedly establishing connections.
* **[ ] Middleware Optimization:**
    * **Remove Unused Middleware:**  Minimize the number of middleware functions used to reduce processing time.
    * **Efficient Middleware:** Ensure your middleware functions are optimized (e.g., use asynchronous functions with `async/await`).
* **[ ] Route Handling:**
    * **Route Specificity:**  Use specific route patterns (e.g., `/users/:userId`) to avoid wildcard matching.
    * **Route Caching:**  Consider caching frequently
