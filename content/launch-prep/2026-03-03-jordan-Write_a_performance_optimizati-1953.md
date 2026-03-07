# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T19:53:57.765124

## Performance Optimization Checklist for Express + PostgreSQL

This checklist outlines key areas for optimizing your Express.js application running against a PostgreSQL database. It's broken down into categories with recommended actions and considerations.

**I. Database Optimization (PostgreSQL Focus)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use `EXPLAIN ANALYZE` on slow queries to identify missing or ineffective indexes.
    * **Index Appropriate Columns:** Add indexes on columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses.
    * **Composite Indexes:** For multi-column queries, create composite indexes that match the query's selection criteria.
    * **Partial Indexes:**  Index only a subset of rows based on a specific condition.  Useful for frequently queried subsets.
    * **Index Types:** Consider different index types (B-tree, GiST, GIN, BRIN) based on your data types and query patterns. GiST and GIN are powerful for text search and arrays.
* **[ ] Query Optimization:**
    * **Avoid `SELECT *`:** Only select the columns you need. Reduces data transfer and memory usage.
    * **Use `LIMIT` and `OFFSET`:** Implement pagination correctly with `LIMIT` and `OFFSET` to avoid retrieving all data at once.
    * **Rewrite Complex Queries:** Break down complex queries into smaller, more manageable queries.  Consider temporary tables for intermediate results.
    * **Optimize `JOIN`s:** Use the appropriate `JOIN` type (INNER, LEFT, RIGHT) and ensure join columns are indexed.
    * **Use `EXISTS` instead of `COUNT(*)`:** When checking for the existence of rows, `EXISTS` is often faster.
    * **Use `LIKE` cautiously:** Leading wildcards (`%`) in `LIKE` queries prevent index usage.  Trailing wildcards (`%`) are generally okay.
* **[ ] PostgreSQL Configuration:**
    * **`shared_buffers`:** Adjust this parameter based on your server's RAM.  A good starting point is 25-40% of RAM.
    * **`work_mem`:**  Increase this for operations like sorting and grouping to reduce disk I/O.
    * **`effective_cache_size`:** Inform the query planner about the amount of memory available for caching.
    * **`maintenance_work_mem`:** Increase this for maintenance tasks like `VACUUM` and `ANALYZE`.
    * **`autovacuum`:** Ensure autovacuum is enabled and configured appropriately to prevent table bloat.
* **[ ] Data Types:**
    * **Choose Efficient Data Types:** Use the most appropriate data type for each column to minimize storage space and improve performance.  Avoid using `TEXT` when `VARCHAR` will suffice.
    * **Normalize Data:**  Properly normalize your database schema to reduce data redundancy and improve data integrity.


**II. Express.js Application Optimization**

* **[ ] Connection Pooling:**
    * **Use a Connection Pool:**  Express.js middleware like `pg-pool` or `sequelize` typically handle connection pooling automatically, minimizing the overhead of establishing and closing connections.
* **[ ] Asynchronous Operations:**
    * **Always Use `async/await`:** Avoid blocking the event loop with synchronous database queries.
* **[ ] Request Validation:**
    * **Validate Incoming Data:**  Use a library like `express-validator` to validate incoming data, reducing the risk of invalid data causing errors and slowing down processing.
* **[ ] Middleware Optimization:**
    * **Remove Unnecessary Middleware:**  Only use middleware that is absolutely necessary.
    * **Optimize Middleware Order:**  Place middleware that performs CPU-intensive operations later in the
