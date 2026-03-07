# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T12:53:49.450388

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas and strategies for optimizing performance in an Express.js application utilizing a PostgreSQL database. It's broken down into categories and prioritized for impact.

**I. Database Optimization (PostgreSQL)**

* **[HIGH] Indexing:**
    * **Identify Slow Queries:** Use `EXPLAIN ANALYZE` on slow queries to identify missing or inefficient indexes.
    * **Index Relevant Columns:**  Index columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses.
    * **Composite Indexes:**  Consider composite indexes for queries with multiple filtering conditions on related columns.
    * **Partial Indexes:** Index only a subset of rows that frequently satisfy a specific query pattern.
    * **Index Type:** Choose the appropriate index type (B-tree, GiST, GIN, BRIN) based on your query patterns and data types.
* **[HIGH] Query Optimization:**
    * **Avoid `SELECT *`:**  Only select the columns needed for your application.
    * **Use `WHERE` Clauses Effectively:** Filter data as early as possible in the query.
    * **Optimize `JOIN` Clauses:** Ensure proper indexes are used and consider the join order.
    * **Use `EXISTS` Instead of `COUNT(*)`:** When checking for the existence of data, `EXISTS` is generally faster.
    * **Use `LIMIT` Clause:**  Apply limits to your queries, especially when retrieving large datasets.
    * **Subqueries:**  Optimize subqueries or consider rewriting them as joins for performance.
    * **Raw SQL vs. ORM:**  Sometimes, raw SQL can be more efficient than relying heavily on the ORM, especially for complex queries.
* **[MEDIUM] Database Configuration:**
    * **`shared_buffers`:** Increase the `shared_buffers` setting based on your available RAM.
    * **`work_mem`:** Adjust `work_mem` to improve memory efficiency for sorting and hashing.
    * **`maintenance_work_mem`:** Increase this value for maintenance operations like `VACUUM` and `ANALYZE`.
    * **`effective_cache_size`:**  Set this based on your system's caching capabilities.
    * **`autovacuum`:**  Ensure `autovacuum` is enabled and configured correctly to prevent table bloat.
* **[LOW] Data Types:**
    * **Choose Appropriate Data Types:** Use the most efficient data type for each column to minimize storage and improve performance.
    * **Avoid Large Text/BLOB Columns:** Use appropriate limitations and consider alternative strategies for storing large data.


**II. Express.js Application Optimization**

* **[HIGH] Connection Pooling:**
    * **Implement a Connection Pool:** Use a library like `pg-pool` or `node-postgres` to establish a connection pool. This avoids the overhead of creating new connections for each request.
* **[HIGH] Asynchronous Operations:**
    * **Use `async/await` or Promises:**  Always use asynchronous operations for database interactions to prevent blocking the event loop.
* **[MEDIUM] Code Optimization:**
    * **Minimize Code Execution:**  Optimize your code to reduce redundant calculations and operations.
    * **Caching:** Implement caching strategies to store frequently accessed data and reduce database load (e.g., Redis, Memcached).
    * **Reduce Payload Size:** Optimize data transmitted between the server and client to reduce network overhead.  Use compression (gzip) on the server and client side.
* **[MEDIUM] Middleware Optimization:**
    * **Efficient Middleware:**  Optimize your middleware to avoid unnecessary processing.  Remove unused middleware.
    * **Limit Middleware Chain Length:**  Long middleware chains
