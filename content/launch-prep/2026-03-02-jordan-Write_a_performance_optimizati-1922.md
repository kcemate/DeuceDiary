# Write a performance optimization checklist for an Express.js
Agent: jordan
Generated: 2026-03-02T19:22:48.303172

## Performance Optimization Checklist - Express.js + PostgreSQL App on Railway

This checklist covers key performance optimization areas for an Express.js application using PostgreSQL, deployed on Railway.  It's broken down into categories with actionable items and considerations.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use PostgreSQL's `auto_explain` extension (enable in `postgresql.conf`) or tools like `pg_stat_statements` to identify the slowest queries.
    * **Analyze Query Plans:** Regularly examine the query execution plans (using `EXPLAIN` or `EXPLAIN ANALYZE`) to understand how PostgreSQL is executing your queries.
    * **Index Relevant Columns:**  Add indexes on columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.  Prioritize columns with high cardinality (many distinct values).
    * **Composite Indexes:** Consider composite indexes when queries filter on multiple columns together.
    * **Index Types:**  Choose the appropriate index type (B-tree, GiST, GIN) based on your data types and query patterns.
    * **Regularly Review Indexes:** Indexes add overhead to writes, so regularly review their usage and remove unused ones.  Use `pg_stat_all_indexes` to monitor index usage.

* **[ ] Query Optimization:**
    * **Avoid `SELECT *`:**  Only select the columns you need. This reduces data transfer and memory usage.
    * **Use `LIMIT`:**  When possible, use `LIMIT` clauses to restrict the amount of data returned, especially in API responses.
    * **Optimize Joins:** Ensure joins are using indexes. Prefer `INNER JOIN` over `LEFT JOIN` when possible.
    * **Subqueries vs. Joins:** Analyze if a subquery can be replaced with a join for better performance.
    * **Use `WHERE` Clauses Effectively:** Filter data as early as possible in the query to reduce the amount of data processed.
    * **Avoid `OR` in `WHERE` Clauses:**  `OR` can often prevent index usage.  Rewrite queries using `UNION ALL` if appropriate.
    * **String Comparisons:**  Avoid using `LIKE '%...%'` which can't use indexes. Consider full-text search solutions if needed.
    * **Parameterized Queries:**  Always use parameterized queries to prevent SQL injection and improve performance by allowing the database to cache execution plans. (Express.js frameworks often handle this automatically)

* **[ ] PostgreSQL Configuration:**
    * **`shared_buffers`:**  Allocate sufficient memory to PostgreSQL’s shared buffer pool. (Experiment with 25-50% of RAM).
    * **`work_mem`:** Configure `work_mem` appropriately to minimize temporary table creation.
    * **`effective_cache_size`:**  Set this to an accurate estimate of your system’s cache size.
    * **`maintenance_work_mem`:** Increase this value for maintenance tasks like VACUUM and ANALYZE.
    * **`autovacuum`:** Ensure `autovacuum` is enabled and configured to regularly clean up outdated tuples.  Monitor its performance.



**II. Express.js Application Optimization**

* **[ ] Code Efficiency:**
    * **Minimize Dependencies:** Reduce the number of dependencies to minimize the application's size and startup time.
    * **Optimize Data Transfer:** Use efficient data serialization formats (JSON is usually fine, but consider custom formats for specific needs).
    * **Avoid Memory Leaks:**  Regularly review your code for potential memory leaks.  Use profiling tools to identify memory issues.
    * **Efficient Route Handling:** Minimize the processing time within your route handlers.
