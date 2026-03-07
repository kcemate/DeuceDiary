# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T06:50:52.524001

## Performance Optimization Checklist for Express + PostgreSQL

This checklist outlines steps to optimize your Express.js application's performance when interacting with a PostgreSQL database. It's broken down into categories for easier management.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use PostgreSQL's `pg_stat_statements` extension to identify frequently executed and slow queries.
    * **Index Relevant Columns:**  Add indexes on columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
    * **Consider Composite Indexes:** For queries filtering on multiple columns, create composite indexes.
    * **Index Types:** Choose the appropriate index type for your data (B-tree, GiST, GIN, BRIN) based on your query patterns.  B-tree is generally a good starting point.
    * **Regularly Review and Adjust:** Indexes can become fragmented over time.  Rebuild or vacuum them periodically.
* **[ ] Query Optimization:**
    * **EXPLAIN ANALYZE:** Use `EXPLAIN ANALYZE` to understand query execution plans and identify bottlenecks.
    * **Rewrite Slow Queries:** Refactor queries to use efficient joins, minimize full table scans, and leverage indexes.
    * **Avoid `SELECT *`:**  Retrieve only the columns you need to reduce network traffic and memory usage.
    * **Use `LIMIT` and `OFFSET` Properly:**  Optimize pagination for large datasets. Consider using keyset pagination for better performance.
    * **Utilize Prepared Statements:**  Prepare queries once and reuse them with different parameter values for improved performance and security.
    * **Avoid Functions in `WHERE` Clauses:**  Functions can prevent the database from using indexes effectively.  If possible, move functions to the application layer.
* **[ ] Database Configuration:**
    * **`shared_buffers`:**  Adjust this setting to allow PostgreSQL to cache more data in memory.  Generally, 25-50% of RAM is a good starting point.
    * **`work_mem`:**  Control the amount of memory PostgreSQL can use for sorting and hashing operations.
    * **`effective_cache_size`:**  Tell PostgreSQL how much memory is available for caching.
    * **Connection Pooling:** Implement a robust connection pooling strategy (e.g., pgPool, Omnivore) to reduce the overhead of establishing new connections.
    * **Vacuuming:** Regularly run `VACUUM` to reclaim dead tuples and update statistics.
    * **Analyze:** Regularly run `ANALYZE` to update table statistics, which helps the query planner make better decisions.

**II. Express.js Application Optimization**

* **[ ] Connection Pooling:**  Use a library like `pg-pool` to maintain a pool of connections to PostgreSQL.  This avoids the overhead of creating new connections for each request.
* **[ ] Asynchronous Operations:**  Ensure you’re using `async/await` or Promises to handle database interactions non-blocking.
* **[ ] Request Validation:** Implement robust request validation to prevent invalid data from reaching the database, which can cause errors and performance issues.
* **[ ] Minimize Payload Size:**
    * **JSON Serialization:** Optimize JSON serialization/deserialization. Consider using a library like `fast-json-stringify` for stringifying large JSON objects.
    * **Compression:** Enable GZIP compression for responses.
* **[ ] Caching:**
    * **HTTP Caching:** Utilize HTTP caching headers (e.g., `Cache-Control`, `ETag`) to reduce server load.
    * **Application-Level Caching:**  Cache frequently accessed data in memory (e.g., using Redis or a local in-memory cache
