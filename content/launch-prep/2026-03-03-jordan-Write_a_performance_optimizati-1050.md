# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T10:50:18.215054

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas to consider when optimizing your Express.js application interacting with a PostgreSQL database. It's broken down into categories with estimated impact levels (Low, Medium, High).

**I. Database Optimization (PostgreSQL)**

* **Indexing (High - Ongoing):**
    * **Analyze Queries:** Use `EXPLAIN ANALYZE` on slow queries to identify missing indexes and areas for improvement.
    * **Index Appropriate Columns:** Index columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
    * **Composite Indexes:** Consider composite indexes for queries using multiple columns.
    * **Partial Indexes:**  Index only a subset of rows based on a condition. (Low - Dependent on specific use case)
    * **Index Type Selection:**  Choose the right index type (B-tree, Hash, GiST, GIN) based on your query patterns.  B-tree is generally the best starting point.
* **Query Optimization (High - Critical):**
    * **Avoid `SELECT *`:**  Only select the columns you need.
    * **Use `JOIN`s Wisely:**  Optimize join types (INNER, LEFT, RIGHT) based on your data and requirements.
    * **Rewrite Complex Queries:** Break down complex queries into smaller, more manageable ones. Use temporary tables or Common Table Expressions (CTEs) for intermediate results.
    * **Use `EXISTS` instead of `COUNT(*)`:**  When you only need to know if something exists, `EXISTS` is often faster.
    * **Limit Results with `LIMIT`:** Use `LIMIT` to avoid retrieving unnecessary data.
    * **Use `WHERE` clauses Effectively:** Filter data as early as possible in the query.
    * **Parameterize Queries:**  Use parameterized queries to prevent SQL injection and improve performance by allowing PostgreSQL to cache query plans.
* **Database Configuration (Medium - Ongoing):**
    * **`shared_buffers`:**  Increase this value to allow PostgreSQL to cache more data in memory. (Generally, 25-50% of system RAM is a good starting point).
    * **`work_mem`:**  Increase this value to allow PostgreSQL to perform sorting and other memory-intensive operations in memory.
    * **`effective_cache_size`:**  Provide an estimate of available memory for caching.
    * **`maintenance_work_mem`:**  Increase this value for tasks like `VACUUM` and `CREATE INDEX`.
    * **`autovacuum`:** Ensure `autovacuum` is enabled and properly configured to automatically clean up dead tuples.
    * **Monitor Disk I/O:**  Slow disk I/O can be a major bottleneck. Consider using faster storage (SSD) or optimizing your database schema.
* **Data Modeling (High - Initial):**
    * **Normalization:** Ensure your database is properly normalized to reduce data redundancy and improve data integrity.
    * **Data Types:**  Use the most appropriate data types for your columns. Avoid using large text fields when smaller ones will suffice.

**II. Express.js Application Optimization**

* **Middleware Optimization (Medium - Ongoing):**
    * **Order Middleware Carefully:**  Place performance-critical middleware (like authentication) before slower middleware.
    * **Remove Unused Middleware:**  Delete any middleware that isn't actively used.
    * **Caching Middleware:**  Consider using caching middleware (e.g., `express-cache-manager`) to cache responses.
* **Routing Optimization (Low - Ongoing):**
    * **Efficient Route Handlers:** Keep route handlers concise and avoid unnecessary computations.
    * **Route Parameters:** Validate and sanitize route parameters to
