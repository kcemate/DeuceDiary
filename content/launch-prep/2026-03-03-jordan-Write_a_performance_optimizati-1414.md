# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T14:14:19.571713

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas to focus on when optimizing the performance of an Express.js application connected to a PostgreSQL database. It's categorized for clarity and covers various aspects, from code to infrastructure.

**I. Database Optimization (PostgreSQL)**

* **[ ] Query Optimization:**
    * **[ ] Analyze Queries:** Use `EXPLAIN ANALYZE` to understand query execution plans and identify bottlenecks (e.g., full table scans, inefficient joins).
    * **[ ] Indexing:**
        * **[ ] Identify Missing Indexes:**  Analyze queries with slow execution times and consider adding indexes on columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
        * **[ ] Review Existing Indexes:** Ensure indexes are still relevant and efficient.  Too many indexes can hurt write performance.
        * **[ ] Index Types:** Choose appropriate index types (B-tree, GiST, GIN, HASH) based on query patterns.
        * **[ ] Composite Indexes:**  Consider composite indexes for queries that filter on multiple columns together.
    * **[ ] Rewrite Queries:**
        * **[ ] Avoid `SELECT *`:** Only select necessary columns.
        * **[ ] Use `WHERE` Clauses Effectively:** Filter data early in the query to reduce the amount of data processed.
        * **[ ] Optimize `JOIN`s:** Use appropriate `JOIN` types (INNER, LEFT, RIGHT) and ensure `JOIN` columns are indexed.
        * **[ ] Avoid `LIKE '%...%'` (Leading Wildcards):**  These are notoriously slow for full table scans.  Consider alternative approaches like full-text search.
        * **[ ] Utilize `EXISTS` instead of `COUNT(*)` when checking for existence:** `EXISTS` can short-circuit when a matching row is found.
        * **[ ] Avoid `ORDER BY` on unindexed columns:**  Sorting is often a performance bottleneck.
    * **[ ] Query Hints:** (Use with caution, understand the consequences) –  Can sometimes force PostgreSQL to use specific index strategies or join orders.
* **[ ] Schema Design:**
    * **[ ] Normalization:**  Ensure your schema is properly normalized to reduce data redundancy and improve data integrity.
    * **[ ] Data Types:**  Choose appropriate data types based on the expected data.  Using `TEXT` when `VARCHAR` would suffice can impact performance.
    * **[ ] Partitioning:** (For large tables) – Consider partitioning tables based on a logical grouping (e.g., date range, geographic region) to improve query performance and manageability.
* **[ ] PostgreSQL Configuration:**
    * **[ ] `shared_buffers`:**  Allocate enough memory to the `shared_buffers` setting to cache frequently accessed data.  (Typically 25-50% of system RAM)
    * **[ ] `work_mem`:**  Increase `work_mem` to allow PostgreSQL to perform more operations in memory, reducing disk I/O.
    * **[ ] `maintenance_work_mem`:** Increase this for maintenance operations like `VACUUM` and `ANALYZE`.
    * **[ ] `effective_cache_size`:**  Inform PostgreSQL about the amount of memory available for caching.
    * **[ ] `max_connections`:** Set a reasonable `max_connections` value to handle concurrent requests.
    * **[ ]  Regularly Run `VACUUM` and `ANALYZE`:**  `VACUUM` reclaims space and updates statistics, while `ANALYZE` updates table statistics used by the query planner.
* **[ ] Connection Pooling:** Utilize a robust connection pool
