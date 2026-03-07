# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T22:09:57.723866

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas to consider when optimizing the performance of an Express.js application connected to a PostgreSQL database. It's broken down into categories for clarity and includes recommendations ranging from simple to more advanced.

**I. Database Optimization (PostgreSQL Focus)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use `EXPLAIN ANALYZE` on slow queries to pinpoint bottlenecks.
    * **Index Columns Used in WHERE, JOIN, ORDER BY, and GROUP BY Clauses:** Create indexes on columns frequently used in these clauses.
    * **Composite Indexes:** Consider composite indexes for queries filtering on multiple columns.
    * **Partial Indexes:**  Index only a subset of rows that frequently match specific criteria.
    * **Index Types:** Choose the appropriate index type (B-tree, GiST, GIN, BRIN) based on the data and query patterns.  B-tree is usually a good starting point.
    * **Regularly Review and Rebuild Indexes:**  Fragmentation can degrade index performance. Use `REINDEX` periodically.
* **[ ] Query Optimization:**
    * **Avoid SELECT *:**  Only select the columns you need.
    * **Use `WHERE` Clauses Effectively:**  Filter data as early as possible in the query.
    * **Optimize JOINs:**  Ensure JOIN columns are indexed and properly sized. Use `INNER JOIN` over `LEFT JOIN` if possible.
    * **Limit Results with `LIMIT`:**  Only retrieve the necessary number of rows, especially in pagination.
    * **Use `EXISTS` Instead of `COUNT(*)`:**  `EXISTS` can be faster when checking for the presence of rows.
    * **Review `LIKE` Clause Usage:**  Leading wildcards (`%`) in `LIKE` clauses are notoriously slow. Try to avoid them if possible.
    * **Use Prepared Statements/Parameterized Queries:** This avoids SQL injection and allows the database to reuse execution plans.  Express frameworks often provide this functionality.
* **[ ] Database Configuration:**
    * **`shared_buffers`:**  Increase this to allow PostgreSQL to cache frequently accessed data.  Typically 25% of system RAM is a good starting point.
    * **`work_mem`:**  Controls the amount of memory used for sorting and other operations.  Increase if you see a lot of temporary files being created.
    * **`effective_cache_size`:**  Tells the query planner how much memory is available for caching.
    * **`maintenance_work_mem`:**  Controls memory used during maintenance operations (e.g., `VACUUM`).
    * **`autovacuum`:** Ensure `autovacuum` is enabled and configured appropriately to prevent table bloat.
    * **Monitor Database Performance:** Use tools like `pg_stat_statements` and `pg_top` to identify slow queries and resource bottlenecks.
* **[ ] Data Types:**
    * **Choose Appropriate Data Types:** Using the most efficient data type for each column minimizes storage and improves query performance.


**II. Express.js Application Optimization**

* **[ ] Efficient Routing:**
    * **Route Only What's Necessary:**  Avoid over-routing.
    * **Use Route Groups:**  Simplify route configuration and apply middleware consistently.
* **[ ] Middleware Management:**
    * **Minimize Middleware Usage:**  Each middleware adds overhead.  Remove unnecessary ones.
    * **Order Middleware Carefully:**  Place performance-critical middleware early in the chain.
* **[ ] Connection Pooling:**
    * **Implement Connection Pooling:**  Avoid creating a new database connection for each request – use a connection pool. Express.js middleware like `pg-pool` can help
