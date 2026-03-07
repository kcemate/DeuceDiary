# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T07:58:51.740474

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas for optimizing the performance of your Express.js application connecting to a PostgreSQL database. It's broken down into categories with actionable steps and considerations.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use `EXPLAIN ANALYZE` to pinpoint queries with high execution times and lack of indexes.
    * **Index Relevant Columns:**  Add indexes on columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
    * **Composite Indexes:** Consider composite indexes for queries that filter on multiple columns together.
    * **Index Types:** Evaluate index types (B-tree, GiST, GIN, HASH) based on your data types and query patterns. B-tree is a good starting point for most cases.
    * **Avoid Over-Indexing:** Too many indexes can slow down write operations.  Regularly review and remove unused indexes.
* **[ ] Query Optimization:**
    * **Avoid `SELECT *`:** Only select the columns you actually need.
    * **Use `WHERE` Clauses Effectively:** Filter data as early as possible in the query.
    * **Optimize `JOIN`s:** Ensure proper indexing on join columns and understand the join order (PostgreSQL can often optimize this, but sometimes hints can help).
    * **Use `LIMIT` and `OFFSET`:** Implement pagination properly with `LIMIT` and `OFFSET` to avoid loading large datasets at once.
    * **Avoid `LIKE '%keyword%'` (Leading Wildcards):** This type of query can't effectively use indexes. Consider full-text search if needed.
    * **Use `EXISTS` instead of `COUNT(*)` when checking for existence:**  `EXISTS` is often faster for checking if a row exists.
    * **Review and Simplify Complex Queries:** Break down complex queries into smaller, more manageable steps.
* **[ ] PostgreSQL Configuration:**
    * **`shared_buffers`:**  Increase this value (typically 25-50% of system RAM) to allow PostgreSQL to cache frequently accessed data.
    * **`work_mem`:**  Increase this value to allow PostgreSQL to perform sorting and hashing in memory.
    * **`effective_cache_size`:**  Inform PostgreSQL about the size of your operating system cache.
    * **`maintenance_work_mem`:**  Increase this value for maintenance operations like `VACUUM` and `ANALYZE`.
    * **`wal_buffers`:**  Increase this value to reduce write delays for small transactions.
    * **Regularly Run `VACUUM` and `ANALYZE`:** `VACUUM` reclaims space and updates statistics, while `ANALYZE` updates statistics used by the query optimizer.
* **[ ] Database Statistics:**  Ensure PostgreSQL has accurate statistics about your data for optimal query planning.

**II. Express.js Optimization**

* **[ ] Connection Pooling:**
    * **Use a Connection Pool:**  Don't create a new database connection for each request. Use a connection pool to reuse existing connections. Libraries like `pg-pool` or `sequelize` provide this.
* **[ ] Asynchronous Operations:**
    * **Use `async/await` or Promises:**  Ensure all database operations are performed asynchronously to avoid blocking the event loop.
* **[ ] Route Optimization:**
    * **Keep Routes Simple:**  Minimize the amount of code in each route handler.
    * **Use Middleware Strategically:** Optimize middleware to minimize processing time.
* **[ ] Caching:**
    * **Cache Frequent Results:** Implement caching for data that doesn't change frequently
