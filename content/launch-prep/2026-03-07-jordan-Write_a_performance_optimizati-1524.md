# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-07T15:24:00.799495

## Performance Optimization Checklist: Express + PostgreSQL

This checklist focuses on optimizing performance for a common Express.js application using PostgreSQL as the database. It's broken down into categories with actionable items and suggested priorities.

**I. Database Optimization (PostgreSQL Focus)**

* **High Priority (Immediate Impact):**
    * **Indexing:**  This is *the* most impactful change.
        * **Analyze Queries:** Use `EXPLAIN ANALYZE` to understand query execution plans and identify missing indexes.
        * **Index Key Columns:**  Index columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
        * **Composite Indexes:** Consider composite indexes for queries filtering on multiple columns.
        * **Partial Indexes:** Index only a subset of rows that frequently satisfy a specific condition (e.g., `WHERE status = 'active'`).
        * **Regularly Rebuild Indexes:** Use `REINDEX` periodically, especially after significant data changes.
    * **Query Optimization:**
        * **Use Prepared Statements:** Avoid constructing SQL queries dynamically with string concatenation.  Use parameterized queries to prevent SQL injection and improve performance by allowing PostgreSQL to cache the query plan.
        * **Avoid `SELECT *`:** Only select the columns you actually need.
        * **Optimize `JOIN`s:** Ensure `JOIN` columns are indexed and have compatible data types. Consider `INNER JOIN` vs. `LEFT JOIN` depending on your requirements.
        * **Limit Results:** Use `LIMIT` to restrict the number of rows returned, especially in API endpoints.
        * **Use `WHERE` Clauses Effectively:** Filter data as early as possible in the query.
        * **Analyze Query Execution Plans (again!):**  Continuously monitor and adjust your queries.
* **Medium Priority (Significant Impact):**
    * **Database Configuration:**
        * **`shared_buffers`:** Adjust based on available RAM and workload. Generally, a higher value (up to 25%) is recommended.
        * **`work_mem`:** Controls the amount of memory used for sorting and hashing. Increase if you have many complex queries.
        * **`effective_cache_size`:** Tells the query planner how much memory PostgreSQL can use for caching.
        * **`maintenance_work_mem`:** Memory allocated for maintenance tasks like index creation and vacuuming.
    * **Vacuuming & Analyzing:**
        * **Regularly `VACUUM`:** Prevents table bloat and improves performance. Consider `VACUUM FULL` (carefully) for large tables.
        * **Regularly `ANALYZE`:**  Updates PostgreSQL's statistics used by the query planner.
    * **Connection Pooling:**  Use a connection pooler like `pg-pool` or `node-postgres's` built-in pooling to reduce connection overhead.
* **Low Priority (Incremental Improvement):**
    * **Data Type Optimization:** Use the most appropriate data types for your columns (e.g., `INTEGER` instead of `BIGINT` if your values won't exceed the range of `INTEGER`).
    * **Normalization:** Ensure your database schema is properly normalized to avoid data redundancy.  (However, over-normalization can sometimes hinder performance, so find a balance).


**II. Express.js & Middleware Optimization**

* **High Priority (Immediate Impact):**
    * **Efficient Route Handlers:**
        * **Avoid Synchronous Operations:** Use asynchronous functions (`async/await`) for database queries and other I/O operations.
        * **Route Specificity:**  Use precise route patterns (e.g., `/api/users/:userId`) to minimize the number of routes that match.
        * **Keep Route Handlers Short:**  Each
