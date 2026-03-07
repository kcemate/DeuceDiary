# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T08:21:35.646129

## Performance Optimization Checklist: Express + PostgreSQL

This checklist covers key areas for optimizing your Express.js application running against a PostgreSQL database. It's divided into categories with varying levels of effort and impact.

**I. Database Optimization (PostgreSQL)**

* **[High Priority] Indexing:**
    * **Identify Slow Queries:** Use `pg_stat_statements` to identify queries with high execution times.
    * **Analyze Data Types:** Ensure appropriate data types are used (e.g., `INTEGER` vs. `BIGINT`, `TEXT` vs. `VARCHAR`).
    * **Index Frequently Queried Columns:** Create indexes on columns used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.  Consider composite indexes for frequently used combinations.
    * **Avoid Over-Indexing:** Too many indexes can slow down writes. Regularly review and remove unused indexes.
    * **Partial Indexes:**  Use partial indexes to index only a subset of rows based on a condition (e.g., `CREATE INDEX idx_users_active ON users (id) WHERE is_active = TRUE;`).
* **[High Priority] Query Optimization:**
    * **EXPLAIN Analyze:** Use `EXPLAIN ANALYZE` to understand query execution plans and identify bottlenecks.  Pay attention to:
        * **Sequential Scans:** These are often the biggest performance killers.  Add indexes.
        * **Nested Loop Joins:**  Optimize by adding indexes or restructuring queries.
        * **Temporary Tables:**  Minimize the use of temporary tables.
    * **Write Optimized Queries:**
        * **Avoid `SELECT *`:** Select only the necessary columns.
        * **Use `JOIN` instead of Subqueries (where appropriate):**  `JOIN` operations are generally more efficient.
        * **Use `LIMIT` and `OFFSET` judiciously:**  Optimize pagination.
        * **Use `WHERE` clauses effectively:** Filter data as early as possible in the query.
        * **Avoid `LIKE '%...%'`:**  These are slow for full table scans. Consider full-text search if applicable.
    * **Use Materialized Views (for complex, frequently executed queries):**  These pre-calculate results, significantly speeding up retrieval.
* **[Medium Priority] PostgreSQL Configuration:**
    * **`shared_buffers`:**  Adjust to 25-50% of system RAM (PostgreSQL will manage this).
    * **`work_mem`:**  Adjust to allow PostgreSQL to buffer data in memory for sorting and other operations.
    * **`effective_cache_size`:**  Tell PostgreSQL how much RAM is available for caching.
    * **`maintenance_work_mem`:**  Increase for operations like `VACUUM` and `CREATE INDEX`.
    * **`wal_buffers`:**  Increase to handle write-ahead logging efficiently.
* **[Low Priority] Regular Maintenance:**
    * **`VACUUM`:**  Regularly run `VACUUM` to reclaim dead tuples and improve query performance. Consider `VACUUM FULL` (with caution).
    * **`ANALYZE`:**  Update statistics used by the query planner.
    * **`pg_repack`:** (Advanced)  Allows for a faster index rebuild without downtime.



**II. Express.js Optimization**

* **[High Priority] Route Handling:**
    * **Minimize Route Overhead:** Use the `express.Router()` for specific sub-routes to reduce context switching overhead.
    * **Optimize Route Logic:** Keep route handlers concise and efficient.  Avoid complex calculations or operations within route handlers.
    * **Caching Middleware:** Implement caching middleware for frequently accessed data, reducing database queries.
* **[Medium Priority
