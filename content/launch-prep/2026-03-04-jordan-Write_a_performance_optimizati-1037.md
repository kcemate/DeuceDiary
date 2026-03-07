# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T10:37:50.244607

## Performance Optimization Checklist: Express + PostgreSQL

This checklist focuses on optimizing the performance of your Express.js application backed by a PostgreSQL database. It's broken down into categories with actionable steps and estimated effort levels (Low, Medium, High).

**I. Database Optimization (PostgreSQL)**

* **Understanding Your Data Model (Low - 2 hours)**
    * **Normalization:** Ensure your database schema is properly normalized to reduce redundancy and improve data integrity.
    * **Data Types:** Choose the most appropriate data types for each column.  Smaller data types consume less storage and improve query performance. (e.g., use `INTEGER` instead of `BIGINT` if appropriate).
    * **Indexing:** **Critical!** Identify and create indexes on columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses.  Monitor index usage and remove unused ones.
    * **Consider Column Ordering in Tables:**  The order of columns in a table can sometimes affect index performance.
* **Query Optimization (Medium - 4-8 hours)**
    * **EXPLAIN ANALYZE:**  Use `EXPLAIN ANALYZE` on slow queries to identify bottlenecks. Understand the query plan and pinpoint where the most time is spent (e.g., full table scans, inefficient joins).
    * **Slow Query Logging:** Enable PostgreSQL slow query logging to capture queries exceeding a defined threshold. Analyze these logs regularly.
    * **Optimize WHERE Clauses:**
        * **Use Indexes:**  Ensure your `WHERE` clauses use indexed columns effectively.
        * **Avoid `LIKE '%...%'` (Leading Wildcards):**  These are notoriously slow because they usually prevent index usage.  Consider alternative search methods if possible.
        * **Use `IN` instead of multiple `OR` conditions:** Can often lead to better index utilization.
    * **Optimize JOINs:**
        * **Join Order:** PostgreSQL often chooses an optimal join order, but sometimes manually suggesting a specific order can help.
        * **Use `INNER JOIN` when appropriate:** `INNER JOIN` generally performs better than `LEFT JOIN` if you only need matching rows.
        * **Ensure Join Columns are Indexed:**  Both tables participating in the join must have indexed join columns.
    * **Limit Results:** Use `LIMIT` clauses to avoid retrieving more data than necessary.  Combine with `OFFSET` for pagination.
    * **Use Prepared Statements/Parameterized Queries:**  This prevents SQL injection and allows PostgreSQL to reuse query plans. (Express’s ORM should handle this).
    * **Avoid `SELECT *`:**  Retrieve only the columns you need.
* **PostgreSQL Configuration (Medium - 4-8 hours)**
    * **`shared_buffers`:** Adjust this value (typically 25-50% of RAM) to optimize PostgreSQL's in-memory caching.
    * **`work_mem`:**  Increase this value to allow PostgreSQL to perform more sorting and hashing operations in memory.
    * **`effective_cache_size`:**  Tell PostgreSQL about the amount of RAM available for caching.
    * **`maintenance_work_mem`:**  Increase this value for maintenance operations like `VACUUM` and `ANALYZE`.
    * **`autovacuum`:** Ensure autovacuum is enabled and properly configured to prevent table bloat.
    * **`wal_buffers`:**  Increase this to improve write performance.
* **Database Statistics (Low - 1 hour)**
    * **`ANALYZE`:** Regularly run `ANALYZE` to update PostgreSQL's statistics about table data.  This helps the query planner make better decisions.
    * **`VACUUM`:**  Run `VACUUM` to reclaim dead tuples and update table
