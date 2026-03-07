# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T14:37:01.040686

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines common performance optimizations for a typical Express.js application using a PostgreSQL database. It’s broken down into categories for easier focus.  Remember to **measure before and after** any optimization to ensure it's actually effective.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use PostgreSQL's `pg_stat_statements` extension or logging to find slow-running queries.
    * **Index Columns Frequently Used in `WHERE`, `JOIN`, and `ORDER BY` clauses:**  Consider composite indexes for queries with multiple criteria.
    * **Analyze Index Usage:** Use `EXPLAIN` to understand how PostgreSQL is executing queries and identify if indexes are being utilized effectively.  Look for "Sequential Scan" – this is a strong indicator of missing indexes.
    * **Index Data Types:**  Ensure index data types match column data types. Mismatches can prevent index usage.
* **[ ] Query Optimization:**
    * **Use `EXISTS` instead of `COUNT(*)` for Existence Checks:** `EXISTS` is generally faster as it stops searching when a match is found.
    * **Avoid `SELECT *`:** Only select the columns you need. This reduces data transfer and memory usage.
    * **Optimize `JOIN` Clauses:** Ensure `JOIN` columns are indexed and have compatible data types. Consider the `JOIN` order.
    * **Use `LIMIT` and `OFFSET` wisely:** For pagination, use `LIMIT` and `OFFSET` efficiently. For large datasets, consider keyset pagination (using the `WHERE` clause to filter).
    * **Use Prepared Statements (Parameterized Queries):**  This prevents SQL injection and allows PostgreSQL to cache query plans.
    * **Rewrite Complex Queries:** Break down complex queries into smaller, more manageable queries.  Consider stored procedures for complex logic.
    * **Use Window Functions:** For complex aggregations and calculations, window functions can be more efficient than subqueries.
* **[ ] Database Configuration:**
    * **`shared_buffers`:**  Adjust this based on your server's RAM. A common starting point is 25-50% of RAM.
    * **`work_mem`:**  Controls the memory used by internal sorts and hash tables. Increase if you see excessive disk usage.
    * **`effective_cache_size`:** Tells PostgreSQL how much memory is available for caching.
    * **`maintenance_work_mem`:** Memory used for maintenance tasks like `VACUUM` and `ANALYZE`.
    * **`autovacuum`:** Ensure `autovacuum` is enabled and configured appropriately to prevent table bloat and performance degradation.
    * **`max_connections`:**  Increase this if your application requires concurrent connections.
* **[ ] Data Type Optimization:**
    * **Use Appropriate Data Types:** Choose the smallest appropriate data type for each column. Avoid `TEXT` when `VARCHAR` can suffice.
    * **Use `ENUM` types for fixed sets of values:**  `ENUM` types can be more efficient than `VARCHAR` for representing categorical data.


**II. Express.js Optimization**

* **[ ] Middleware Management:**
    * **Minimize Middleware:**  Remove unused or overly complex middleware.
    * **Order Matters:**  Place performance-critical middleware (e.g., authentication, logging) later in the chain.
* **[ ] Routing Optimization:**
    * **Use `params()` for Parameter Extraction:**  This is more efficient than manually parsing query parameters.
    * **Route Specificity:** Use specific routes where possible (e.g., `/users/:id`) for better performance and easier debugging.
* **[
