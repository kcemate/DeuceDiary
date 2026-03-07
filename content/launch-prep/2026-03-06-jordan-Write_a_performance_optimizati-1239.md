# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-06T12:39:53.283182

## Performance Optimization Checklist for Express + PostgreSQL

This checklist focuses on optimizing a typical Express.js application interacting with a PostgreSQL database. It's broken down into categories with varying levels of effort.

**I. Database Optimization (PostgreSQL Focus)**

* **[Low] Indexing:**
    * **Identify Slow Queries:** Use PostgreSQL's `EXPLAIN ANALYZE` command to identify queries without appropriate indexes.
    * **Create Indexes:**  Create indexes on columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.  Consider composite indexes for multiple columns.
    * **Index Types:** Experiment with different index types (B-tree, GIN, GiST) based on your data and query patterns. B-tree is usually a good starting point.
    * **Regular Index Maintenance:**  Ensure indexes are rebuilt regularly using `REINDEX` to maintain optimal performance.
* **[Medium] Query Optimization:**
    * **Use `EXPLAIN ANALYZE` Regularly:** Analyze queries to understand their execution plans and identify bottlenecks.
    * **Rewrite Slow Queries:**
        * **Avoid `SELECT *`:** Only select the columns you actually need.
        * **Use `WHERE` Clauses Effectively:**  Filter data early in the query.
        * **Optimize `JOIN`s:** Ensure join columns have indexes and use the most efficient join type (INNER, LEFT, RIGHT).
        * **Reduce Subqueries:**  Consider using `JOIN`s instead of subqueries where possible.
        * **Avoid `LIKE` with Leading Wildcards:**  `LIKE '%string%'` is notoriously slow. Consider alternatives like full-text search if appropriate.
    * **Parameterize Queries:**  Always use parameterized queries to prevent SQL injection and improve performance (Express's `pg` module handles this).
* **[High] Database Schema & Data Types:**
    * **Data Types:**  Use the most appropriate data types for your data. Smaller data types are generally faster.  Consider `JSONB` for flexible JSON data.
    * **Normalization:** Ensure your schema is properly normalized to reduce redundancy and improve data integrity.  Over-normalization can sometimes be detrimental.
    * **Column Lengths:** Choose appropriate column lengths to minimize storage and improve index efficiency.
    * **Denormalization (Strategically):**  Consider denormalizing frequently accessed data to reduce the number of joins.  Evaluate the trade-offs between read performance and data consistency.
* **[High] PostgreSQL Configuration:**
    * **`shared_buffers`:** Adjust this setting based on your server's RAM.  A higher value can improve PostgreSQL's caching performance. (Typically 25-50% of RAM).
    * **`work_mem`:**  Controls the amount of memory PostgreSQL can use for sorting and temporary operations. Increasing this can improve performance for complex queries.
    * **`maintenance_work_mem`:**  Memory used during maintenance operations like `VACUUM` and `CREATE INDEX`.
    * **`effective_cache_size`:** Tell PostgreSQL how much memory is available to its query cache.
    * **`wal_buffers`:** Adjust this based on write workload.
    * **Monitoring & Tuning:** Regularly monitor PostgreSQL's performance metrics (CPU usage, memory usage, disk I/O, query statistics) and adjust configuration settings accordingly. Use tools like `pg_stat_statements` to identify slow queries.


**II. Express.js & Middleware Optimization**

* **[Low] Code Optimization:**
    * **Efficient Data Transfer:**  Only transfer the data you need from the database to the client. Use destructuring to extract specific properties.
    * **Reduce Middleware Usage:**  Minimize the number of middleware you use, especially
