# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T18:23:17.104808

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas to consider when optimizing the performance of your Express (Node.js) application interacting with a PostgreSQL database. It's broken down into categories for clarity and includes potential solutions.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:** This is *the most critical* area.
    * **Identify Slow Queries:** Use `pg_stat_statements` extension to identify queries consuming the most resources.  Install and configure: `SELECT pg_stats('public') WHERE query LIKE '%your_slow_query%';`
    * **Analyze Queries:**  Use `EXPLAIN ANALYZE` on slow queries to understand the execution plan.
    * **Index Appropriate Columns:**  Index columns used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses. Consider composite indexes for multi-column queries.
    * **Index Data Types:** Ensure indexes are built on the correct data types.
    * **Regularly Review Indexes:** Don't over-index! Remove unused indexes.
* **[ ] Query Optimization:**
    * **Write Efficient SQL:** Avoid `SELECT *` - always select only the necessary columns.
    * **Use `JOIN`s Correctly:** Optimize `JOIN` order and use appropriate `JOIN` types (INNER, LEFT, RIGHT).
    * **Minimize Subqueries:**  Often, subqueries can be rewritten as `JOIN`s for better performance.
    * **Use `LIMIT` and `OFFSET` for Pagination:**  Ensure you have proper indexing for efficient pagination.
    * **Avoid `LIKE '%string%'` (Leading Wildcard):** This is *extremely* slow and requires full table scans. Consider alternative approaches like full-text search if applicable.
    * **Use `EXISTS` Instead of `COUNT(*)` in Subqueries:**  `EXISTS` often performs better when checking for the existence of rows.
* **[ ] Database Configuration:**
    * **`shared_buffers`:**  Allocate enough memory to PostgreSQL's shared buffer cache (typically 25% of system RAM).
    * **`work_mem`:**  Controls the memory used by internal sort operations. Increase if you see many temporary files.
    * **`maintenance_work_mem`:**  Memory used for maintenance tasks like `VACUUM` and `CREATE INDEX`.
    * **`effective_cache_size`:**  Inform PostgreSQL about the amount of memory available for caching.
    * **`autovacuum`:**  Enable and properly configure `autovacuum` to prevent table bloat and keep statistics up-to-date.
    * **Regularly `VACUUM` and `ANALYZE` Tables:**  `VACUUM` reclaims space, and `ANALYZE` updates table statistics for the query optimizer.  Consider `VACUUM FULL` sparingly.
* **[ ] Connection Pooling:**  Use a robust connection pooling solution (e.g., `pg-pool`, `node-postgres`’s connection pooling) to reduce the overhead of establishing new connections.


**II. Express Application Optimization**

* **[ ] Efficient Routing:**
    * **Minimize Route Complexity:** Keep routes focused and straightforward.
    * **Use Route Parameters Effectively:** Design routes that accurately match the data being requested.
    * **Consider Route Groups:**  Organize routes with common prefixes for better readability and potential optimization.
* **[ ] Asynchronous Operations (Crucial):**
    * **Always Use `async/await`:**  Never perform blocking operations in the main event loop. This is critical for Node.js performance.
    * **Use Promises/Callbacks Correctly:**  Ensure proper handling of asynchronous operations.
*
