# Write a performance optimization checklist for an Express.js
Agent: jordan
Generated: 2026-03-02T21:48:58.415698

## Performance Optimization Checklist for Express.js + PostgreSQL App on Railway

This checklist covers key performance optimization strategies for your Express.js app leveraging PostgreSQL, particularly when deployed on Railway. It’s broken down into categories and prioritized for impact.

**I. Database Optimization (High Priority - 40% of Effort)**

* **[ ] Database Indexes:**
    * **Identify Slow Queries:** Use PostgreSQL's `auto_explain` extension (configure in `postgresql.conf`) or a query logging tool like `pg_stat_statements` to pinpoint slow-running queries.
    * **Index Relevant Columns:** Create indexes on columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.  Start with the most frequently used.
    * **Composite Indexes:** Consider composite indexes for queries that filter on multiple columns together.
    * **Data Types:** Ensure data types are appropriate for your queries.  Using `TEXT` for a small integer field will severely impact indexing.
    * **Index Maintenance:** Regularly analyze and vacuum your PostgreSQL database:
        * `ANALYZE` - Updates statistics used for query planning.
        * `VACUUM` - Removes dead tuples (rows marked as deleted) to reclaim space and improve performance.  Consider `VACUUM FULL` cautiously - it locks the table.
* **[ ] Query Optimization:**
    * **EXPLAIN Plans:**  Always use `EXPLAIN` (and `EXPLAIN ANALYZE`) on slow queries to understand the execution plan and identify bottlenecks.
    * **Avoid `SELECT *`:**  Only select the columns you actually need.
    * **Use `JOIN`s Efficiently:**  Ensure `JOIN` columns have appropriate indexes.  Consider `LEFT JOIN` vs. `INNER JOIN` based on your data needs.
    * **Optimize `WHERE` Clauses:**  Write `WHERE` clauses using the most selective conditions first. Avoid using functions in `WHERE` clauses that prevent index usage.
    * **Pagination:** Implement efficient pagination (e.g., using `LIMIT` and `OFFSET`) to retrieve only the data needed for a single page.  Consider "keyset pagination" (using `WHERE` clause based filters) which can be much faster.
    * **Prepared Statements:** Utilize prepared statements (especially for repeated queries) to avoid parsing the query repeatedly.
* **[ ] PostgreSQL Configuration:**
    * **Connection Pool:** Railway typically manages this, but verify its configuration (connection timeout, maximum connections) are appropriate for your app’s load.
    * **`shared_buffers`:** Increase this if you have sufficient RAM – PostgreSQL can use it to cache frequently accessed data.
    * **`effective_cache_size`:**  Set this to reflect the amount of memory available for PostgreSQL’s cache.
    * **`maintenance_work_mem`:**  Increase this if you’re performing a lot of sorting or aggregation.
    * **Monitor PostgreSQL Performance:** Use PostgreSQL's monitoring tools (pgAdmin, pg_stat_statements) to track performance metrics like CPU usage, memory usage, and slow query logs.


**II. Express.js Application Optimization (Medium Priority - 30% of Effort)**

* **[ ] Code Profiling:**  Use profiling tools (e.g., Node.js inspector, Chrome DevTools) to identify performance bottlenecks in your Express.js code.
* **[ ] Minimize Middleware:** Reduce the number of middleware you use. Each one adds overhead.
* **[ ] Efficient Data Processing:**
    * **Batch Operations:**  Instead of processing data one record at a time, batch operations (e.g., using bulk inserts or updates).
    * **Asynchronous Operations:** Leverage `async/await` for asynchronous operations to avoid blocking the
