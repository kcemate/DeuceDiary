# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T11:00:25.518389

## Performance Optimization Checklist: Express + PostgreSQL

This checklist covers key areas for optimizing the performance of your Express.js application interacting with a PostgreSQL database. It's categorized for clarity and includes actionable steps.

**I. Database Optimization (PostgreSQL Focused)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use `EXPLAIN ANALYZE` to pinpoint queries with high `cost` or long execution times.
    * **Index the WHERE Clause:** Add indexes to columns frequently used in `WHERE` clauses.
    * **Index JOIN Columns:** Index columns used in `JOIN` clauses to speed up relational queries.
    * **Consider Composite Indexes:** For complex queries with multiple `WHERE` clause conditions on related columns, a composite index can be beneficial.
    * **Review Index Usage:** Regularly monitor index usage with `pg_stat_statements` (an extension) to ensure indexes are being utilized effectively. Remove unused or redundant indexes.
* **[ ] Query Optimization:**
    * **Avoid `SELECT *`:** Only select the columns you actually need.
    * **Use `WHERE` Clauses Effectively:** Filter data early in the query to reduce the amount of data processed.
    * **Optimize `JOIN` Order:**  Experiment with different `JOIN` orders. Generally, join smaller tables to larger ones.
    * **Avoid `LIKE` with Leading Wildcards (`%`)**: Leading wildcards (e.g., `LIKE '%something'`) are notoriously slow.
    * **Use `EXISTS` instead of `COUNT(*)`:** When checking for the existence of a record, `EXISTS` is usually faster than `COUNT(*) > 0`.
    * **Utilize PostgreSQL’s Query Optimizer:**  Ensure PostgreSQL’s query optimizer is functioning correctly. Check `postgresql.conf` settings like `effective_cache_size` and `shared_buffers`.
* **[ ] Database Configuration:**
    * **`shared_buffers`:** Allocate sufficient memory to PostgreSQL's shared buffers. This can significantly improve caching.
    * **`effective_cache_size`:**  Tell the query optimizer about the amount of memory available for caching data.
    * **`work_mem`:** Controls the memory allocated to individual queries. Increase if you see excessive disk I/O during sorting or aggregation.
    * **`maintenance_work_mem`:**  Sets the memory used for maintenance tasks like `VACUUM` and `ANALYZE`.
    * **`autovacuum`:** Ensure `autovacuum` is enabled to automatically maintain table statistics and reclaim dead tuples.
    * **`max_connections`:** Adjust the maximum number of concurrent connections based on your application's needs.
* **[ ] Data Types:**  Use the most appropriate data types for your columns to minimize storage and improve performance.


**II. Express.js Application Optimization**

* **[ ] Connection Pooling:**
    * **Always use a connection pool:** Don't establish a new connection for each request. A connection pool reuses existing connections, drastically reducing overhead.  Libraries like `pg-pool` or `sequelize` provide connection pooling.
* **[ ] Middleware Optimization:**
    * **Remove Unnecessary Middleware:** Evaluate and remove any middleware that isn’t essential.
    * **Optimize Middleware:**  Ensure your middleware is efficient.  Avoid heavy computations or database queries within middleware.
* **[ ] Request Handling:**
    * **Asynchronous Operations:** Utilize `async/await` or Promises to handle asynchronous database queries efficiently, preventing blocking the event loop.
    * **Limit Request Size:**  Implement limits on the size of incoming data (request body size) to prevent excessive memory usage.
    * **Request Validation:**  Validate incoming data to prevent unexpected errors and security
