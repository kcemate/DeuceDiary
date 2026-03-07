# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T06:28:10.800383

## Performance Optimization Checklist: Express + PostgreSQL

This checklist covers key areas for optimizing the performance of your Express.js application interacting with a PostgreSQL database. It's broken down into categories with specific actions you can take.  Remember to prioritize based on your application's specific bottlenecks and usage patterns.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Identify Slow Queries:**  Use `EXPLAIN ANALYZE` to identify queries that are performing poorly.
    * **Index Missing Columns:** Add indexes to columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses. Consider composite indexes for multi-column filtering.
    * **Index Types:** Choose the appropriate index type (B-tree, GiST, GIN, BRIN) based on your data and query patterns.
    * **Avoid Over-Indexing:** Too many indexes can slow down write operations. Regularly review and remove unused indexes.
* **[ ] Query Optimization:**
    * **Use `EXPLAIN ANALYZE` Regularly:**  This is your most valuable tool for understanding query execution plans.
    * **Rewrite Slow Queries:** Look for inefficient joins, subqueries, or full table scans.  Consider using common table expressions (CTEs) for complex logic.
    * **Optimize `WHERE` Clauses:** Ensure indexes are used effectively and avoid functions within `WHERE` clauses that prevent index usage.
    * **Avoid `SELECT *`:** Only select the columns you need.
    * **Use `LIMIT` and `OFFSET` Carefully:** For pagination, optimize using keyset pagination instead of `OFFSET` for large datasets.
* **[ ] Database Configuration:**
    * **`shared_buffers`:**  Adjust this based on your server's memory.  A good starting point is 25% of system RAM.
    * **`work_mem`:**  Controls the amount of memory used for sorting and hashing.  Increase if you have complex sorting operations.
    * **`maintenance_work_mem`:**  Memory used for maintenance tasks like vacuuming and analyzing tables.
    * **`effective_cache_size`:**  Help PostgreSQL estimate the available memory for caching.
    * **`autovacuum`:** Ensure `autovacuum` is enabled and properly configured to prevent table bloat.
    * **`wal_level`:**  Set to `replica` or `logical` for replication needs.
* **[ ] Data Types:** Use the most appropriate data type for each column to minimize storage and improve query performance.  Avoid using `TEXT` when `VARCHAR` is sufficient.
* **[ ] Partitioning (for large tables):** Consider partitioning your tables based on date ranges or other logical groupings to improve query performance and manageability.


**II. Express.js & Middleware Optimization**

* **[ ] Connection Pooling:**  Use a connection pool (e.g., `pg-pool`) to reuse database connections and avoid the overhead of creating new connections for each request.  Configure the pool size appropriately.
* **[ ] Async/Await:** Always use `async/await` for database interactions to improve readability and prevent blocking the event loop.
* **[ ] Middleware Optimization:**
    * **Minimize Middleware:** Only use middleware that's necessary.
    * **Batch Requests:**  Combine multiple database operations into a single query if possible to reduce the number of round trips to the database.
    * **Caching:** Implement caching strategies (e.g., Redis) for frequently accessed data to reduce database load.
* **[ ] Route Optimization:**
    * **Efficient Route Handlers:** Keep route handlers concise and efficient.
    * **Avoid Unnecessary Calculations:**  Defer calculations to background tasks if they are not critical to the user experience.
