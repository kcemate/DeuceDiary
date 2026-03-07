# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T10:15:02.245647

## Performance Optimization Checklist: Express + PostgreSQL

This checklist focuses on optimizing your Express.js application interacting with a PostgreSQL database. It's broken down into categories for easier navigation.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use `EXPLAIN ANALYZE` to identify slow-running queries.
    * **Index Columns Frequently Used in WHERE clauses:** Especially on columns used for filtering large datasets.
    * **Composite Indexes:** Consider composite indexes for queries filtering on multiple columns frequently used together.
    * **Covering Indexes:**  Create indexes that include all columns needed in a query's SELECT statement to avoid key lookups.
    * **Index Types:**  Choose the right index type (B-tree, GiST, GIN, BRIN) based on query patterns and data types.
    * **Regularly Review and Adjust Indexes:** Indexes add overhead to writes. Remove unused or redundant indexes.
* **[ ] Query Optimization:**
    * **Use `SELECT` only needed columns:** Avoid `SELECT *` - only retrieve the columns you actually need.
    * **Optimize `WHERE` clauses:** Use efficient operators (e.g., `=`, `<`, `>`, `BETWEEN`). Avoid using functions in the `WHERE` clause that prevent index usage.
    * **Avoid `LIKE` with `%` at the beginning:** This generally cannot use indexes. Consider alternative search methods.
    * **Use `EXISTS` instead of `COUNT(*)` for existence checks:** `EXISTS` is often faster as it stops searching when a match is found.
    * **Rewrite Subqueries:** Consider using `JOIN`s instead of subqueries, especially correlated subqueries.
    * **Use `WITH` Clause (Common Table Expressions - CTEs):**  Can improve readability and sometimes performance for complex queries.
    * **Use `JOIN`s Carefully:** Ensure your join keys are indexed and that you are using the appropriate join types (INNER, LEFT, RIGHT).
* **[ ] Database Configuration:**
    * **`shared_buffers`:** Adjust based on available RAM (generally 25-50% of RAM).
    * **`work_mem`:**  Increase if you have large sorts or hash joins.
    * **`effective_cache_size`:**  Help PostgreSQL estimate cache sizes more accurately.
    * **`maintenance_work_mem`:**  Increase for tasks like `VACUUM` and `ANALYZE`.
    * **`autovacuum`:**  Enable and configure `autovacuum` to automatically maintain database statistics and reclaim dead tuples.
    * **`max_connections`:** Set this based on your application's concurrency needs.
* **[ ] Data Types:** Use appropriate data types for your columns. For example, use `INTEGER` instead of `BIGINT` if your data doesn't require the larger range.
* **[ ] Data Normalization:** Maintain appropriate database normalization to reduce data redundancy and improve data integrity. (Balance normalization with potential performance tradeoffs.)

**II. Express.js Optimization**

* **[ ] Connection Pooling:**  Use a connection pool (e.g., `pg-pool`) to reduce the overhead of establishing new connections for each request.
* **[ ] Asynchronous Operations:**  Always use `async/await` or Promises to handle database interactions asynchronously.  Avoid blocking the event loop.
* **[ ] Route Optimization:**
    * **Minimize Route Complexity:** Keep routes simple and focused.
    * **Use Route Parameters:**  Utilize route parameters for dynamic URLs.
    * **Avoid unnecessary middleware:**  Remove any middleware that isn't essential.
* **[ ] Request Body Parsing:**
    * **Use `express
