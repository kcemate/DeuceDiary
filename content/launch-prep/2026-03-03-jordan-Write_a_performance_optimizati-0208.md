# Write a performance optimization checklist for an Express.js
Agent: jordan
Generated: 2026-03-03T02:08:42.864022

## Performance Optimization Checklist for Express.js + PostgreSQL App on Railway

This checklist covers key optimization areas for an Express.js application running on Railway, specifically focusing on PostgreSQL database performance and related aspects.

**I. Database Optimization (PostgreSQL - Most Critical)**

* **[ ] Indexing:**
    * **Analyze Queries:** Use `EXPLAIN ANALYZE` on slow queries to identify missing or inefficient indexes.  Railway's monitoring tools can also highlight slow queries.
    * **Index Relevant Columns:**  Index columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
    * **Composite Indexes:** Create composite indexes for queries using multiple columns together in the same clause. Consider the order of columns in the index.
    * **Partial Indexes:**  If you frequently query a subset of data based on a specific column, consider a partial index.
    * **Index Types:**  Choose the appropriate index type (B-tree, GiST, GIN, BRIN) based on your data types and query patterns.  B-tree is usually a good starting point.
    * **Regularly Review Indexes:**  Over-indexing can negatively impact write performance.  Remove unused or redundant indexes.
* **[ ] Query Optimization:**
    * **Avoid `SELECT *`:**  Specify only the columns needed in your queries.
    * **Use `WHERE` Clauses Effectively:** Filter data as early as possible in your query.
    * **Optimize `JOIN`s:**  Ensure `JOIN` conditions use indexed columns. Use `INNER JOIN` where possible, as it's generally faster than `LEFT JOIN` or `RIGHT JOIN`.
    * **Limit Results with `LIMIT`:**  Especially in API endpoints, use `LIMIT` to avoid returning excessive data.
    * **Avoid `LIKE '%'`:** Leading wildcards in `LIKE` clauses are notoriously slow. If possible, refactor the query or consider full-text search solutions.
    * **Use `EXISTS` instead of `COUNT(*)`:**  When checking if a record exists, `EXISTS` is generally more efficient.
    * **Analyze Query Plans:** Regularly review query plans to identify bottlenecks and areas for improvement.
* **[ ] PostgreSQL Configuration:**
    * **`shared_buffers`:**  Adjust this setting based on available RAM. Generally, 25-50% of RAM is a good starting point.
    * **`effective_cache_size`:**  Let PostgreSQL know how much memory is available for caching.
    * **`work_mem`:**  Controls memory used for sorting and other operations. Increase if you have a lot of sorting.
    * **`maintenance_work_mem`:**  Memory used during maintenance tasks (e.g., `VACUUM`).
    * **`autovacuum`:**  Enable and configure autovacuum to prevent table bloat and maintain performance.  Consider a more aggressive configuration.
    * **Connection Pooling:** Railway provides connection pooling, but verify it's configured optimally. (See section on Connection Pooling)


**II. Application Layer (Express.js)**

* **[ ] Connection Pooling (Important):** Railway automatically manages connection pooling for PostgreSQL, but verify the settings:
    * **Pool Size:**  Adjust the connection pool size based on anticipated concurrent requests. Too small and you'll experience connection timeouts; too large and you'll strain resources.  Start with Railway's default and monitor.
    * **Idle Timeout:**  Set an appropriate idle timeout to prevent connections from remaining open unnecessarily.
* **[ ] Code Optimization:**
    * **Efficient Data Transfer:**  Use efficient data serialization/deserialization methods.  JSON.stringify/parse is standard.
    * **Reduce Middleware
