# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-07T16:34:24.558125

## Performance Optimization Checklist for Express + PostgreSQL

This checklist covers key areas for optimizing the performance of your Express.js application interacting with a PostgreSQL database. It's broken down into categories for easier tracking and prioritization.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use `pg_stat_statements` to identify the slowest queries.
    * **Analyze Data Types:** Ensure appropriate data types are used to minimize storage and improve index efficiency.
    * **Create Indexes:**  Index frequently queried columns, especially those used in `WHERE`, `JOIN`, and `ORDER BY` clauses.
    * **Composite Indexes:** Consider composite indexes for queries using multiple columns in the `WHERE` clause.
    * **Index Type:** Choose the right index type (B-tree, Hash, GIN, GiST) based on your query patterns. B-tree is generally a good starting point.
    * **Regular Index Maintenance:**  Run `VACUUM ANALYZE` regularly (especially after large data modifications) to keep statistics up-to-date and optimize index performance.
* **[ ] Query Optimization:**
    * **EXPLAIN ANALYZE:**  Use `EXPLAIN ANALYZE` to understand how PostgreSQL executes your queries and identify bottlenecks.
    * **Avoid `SELECT *`:** Only retrieve the columns you need.
    * **Optimize `WHERE` Clauses:** Use specific conditions, avoid functions in `WHERE` clauses (they can hinder index usage).
    * **Use `JOIN` Effectively:**  Ensure you're using the correct `JOIN` type and indexes are present on the `JOIN` columns.
    * **Rewrite Subqueries:** Often, subqueries can be rewritten as joins for better performance.
    * **Use `LIMIT` and `OFFSET`:**  Optimize pagination to avoid retrieving unnecessary data.  Consider using keyset pagination for better performance with large datasets.
    * **Avoid `LIKE '%...%'`:** Leading wildcards are notoriously slow.  Consider full-text search alternatives if appropriate.
* **[ ] Database Configuration:**
    * **`shared_buffers`:** Adjust based on available RAM. Generally, 25-50% of system RAM is a good starting point.
    * **`work_mem`:**  Allocate enough memory for sorting and operations within the database.
    * **`effective_cache_size`:**  Tell PostgreSQL how much memory is available for caching data.
    * **`maintenance_work_mem`:** Increase this for maintenance tasks like `VACUUM`.
    * **`wal_buffers`:** Adjust to optimize write performance.
    * **Monitor PostgreSQL Statistics:** Keep an eye on key metrics like disk I/O, CPU usage, and memory usage.


**II. Express.js Optimization**

* **[ ] Connection Pooling:**
    * **Implement Connection Pooling:** Use a library like `pg-pool` to create a connection pool instead of creating new connections for each request. This significantly reduces the overhead of establishing and closing connections.
* **[ ] Middleware Optimization:**
    * **Minimize Middleware:** Only include middleware you absolutely need.
    * **Optimize Existing Middleware:**  Ensure your middleware functions are efficient (e.g., avoid complex logic within middleware).
* **[ ] Request Parsing:**
    * **Consider `body-parser` Alternatives:**  Modern Express versions often have built-in `req.body` handling, reducing the need for `body-parser` middleware.
* **[ ] Asynchronous Operations:**
    * **Use `async/await`:** Ensure all database queries are performed asynchronously using `async/await` to prevent blocking the event loop.
* **[ ] Code Optimization:**
    * **Efficient Data
