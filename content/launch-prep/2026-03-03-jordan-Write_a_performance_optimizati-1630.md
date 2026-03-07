# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T16:30:14.532229

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas to consider when optimizing the performance of an Express.js application using PostgreSQL. It's categorized for clarity and includes actionable steps.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Analyze Queries:** Use `EXPLAIN` on slow queries to identify missing or inefficient indexes.
    * **Create Appropriate Indexes:**  Index columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses. Consider composite indexes for multiple correlated columns.
    * **Index Types:** Choose the correct index type (B-tree, Hash, GiST, GIN) based on your query patterns. B-tree is generally a good starting point.
    * **Index Maintenance:** Regularly run `VACUUM ANALYZE` to keep statistics up-to-date and optimize index performance.  Consider `REINDEX` if indexes become fragmented.
* **[ ] Query Optimization:**
    * **Use `EXISTS` instead of `COUNT(*)`:**  `EXISTS` can be faster when checking for the existence of rows without needing the count.
    * **Avoid `SELECT *`:** Only select the columns you actually need to reduce data transfer.
    * **Use `JOIN`s Wisely:** Choose the appropriate `JOIN` type (`INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN`) based on your requirements.
    * **Optimize `WHERE` Clauses:** Ensure your `WHERE` clauses are using indexes effectively. Avoid functions within `WHERE` clauses that prevent index usage.
    * **Rewrite Complex Queries:** Break down complex queries into smaller, more manageable queries if possible. Consider using temporary tables or common table expressions (CTEs) for intermediate results.
    * **Utilize `LIMIT` and `OFFSET`:** For pagination, use `LIMIT` and `OFFSET` efficiently. Consider using keyset pagination for performance with large datasets.
* **[ ] Database Configuration:**
    * **`shared_buffers`:** Adjust the `shared_buffers` setting based on your server's memory and workload.  A good starting point is 25% of system memory.
    * **`work_mem`:**  Increase `work_mem` to allow PostgreSQL to perform more operations in memory, reducing disk I/O.
    * **`effective_cache_size`:**  Set this value to reflect the amount of memory available for PostgreSQL's query cache.
    * **`maintenance_work_mem`:**  Increase this value for maintenance operations like `VACUUM` and `ANALYZE`.
    * **Connection Pooling:** Utilize a connection pooling mechanism (e.g., PgBouncer, connection pooler in your Express app) to reduce the overhead of establishing new database connections.
* **[ ] Data Types:**
    * **Choose Efficient Types:** Use the smallest suitable data type for each column to minimize storage space and improve performance.
    * **Avoid `TEXT` for short strings:** Use `VARCHAR` or `CHAR` instead.


**II. Express.js Application Optimization**

* **[ ] Connection Pooling:** (Already mentioned above, but reiterate)  Utilize a connection pooling library (e.g., `pg-pool`) within your Express app.  This avoids the overhead of repeatedly establishing and closing database connections.
* **[ ] Middleware Optimization:**
    * **Remove Unnecessary Middleware:**  Review and remove any middleware that isn’t essential.
    * **Optimize Middleware Order:**  Order middleware based on execution frequency and potential impact on performance.  Put frequently used middleware earlier in the chain.
* **[ ] Route Optimization:**
    * **Efficient Route Handlers:**  Keep route handlers as short and focused as possible.
    * **Async/
