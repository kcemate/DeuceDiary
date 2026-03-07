# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T13:39:05.077847

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas to optimize your Express.js application alongside your PostgreSQL database. It's categorized for clarity and focuses on common bottlenecks.

**I. Database Optimization (PostgreSQL Focus)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use PostgreSQL's `pg_stat_statements` extension to identify queries with high execution times.
    * **Index Columns Frequently Used in WHERE clauses, JOIN conditions, and ORDER BY clauses.** Consider:
        * **B-Tree Indexes:**  For equality and range searches.
        * **GIN Indexes:** For full-text search and array data.
        * **GiST Indexes:** For complex data types (e.g., geospatial data).
        * **BRIN Indexes:** For large tables with naturally ordered data.
    * **Composite Indexes:** Consider composite indexes for queries utilizing multiple columns together.
    * **Avoid Over-Indexing:** Too many indexes can slow down write operations.
* **[ ] Query Optimization:**
    * **Analyze Queries:** Use `EXPLAIN ANALYZE` to understand how PostgreSQL executes your queries. Look for:
        * **Sequential Scans:** These are often slow.  Add indexes or rewrite queries.
        * **Nested Loop Joins:**  These can be expensive.  Ensure you have appropriate indexes and consider different join strategies.
        * **Poorly Written WHERE Clauses:**  Simplify them, avoid using functions in WHERE clauses (can prevent index usage).
    * **Use Prepared Statements:** Reduce parsing overhead by using prepared statements for frequently executed queries.
    * **Limit Result Sets:**  Only retrieve the columns you need.
    * **Pagination:** Implement pagination to avoid returning massive datasets.  Use `LIMIT` and `OFFSET`.
    * **Use `WITH` (Common Table Expressions - CTEs):**  Can simplify complex queries and sometimes improve performance.
* **[ ] Database Configuration:**
    * **`shared_buffers`:**  Increase this to allow PostgreSQL to cache more data. (Typically 25-50% of system RAM)
    * **`work_mem`:**  Increase this to allow PostgreSQL to sort and hash data in memory.
    * **`maintenance_work_mem`:**  Increase this for maintenance operations like `VACUUM` and `CREATE INDEX`.
    * **`effective_cache_size`:** Tell PostgreSQL how much memory is available for caching.
    * **`autovacuum`:**  Ensure autovacuum is enabled to prevent table bloat.  Tune its settings if necessary.
    * **Regular `VACUUM` and `ANALYZE`:**  Run these regularly to keep the statistics up-to-date and remove dead tuples.

**II. Express.js Application Optimization**

* **[ ] Code Optimization:**
    * **Efficient Data Transfer:**  Only transfer data needed by the client. Avoid sending large objects unnecessarily.  Consider JSON streaming for large datasets.
    * **Reduce Middleware Usage:**  Remove unused middleware. Minimize the number of middleware layers.
    * **Optimize Route Handlers:**  Ensure route handlers are concise and perform their tasks efficiently.
    * **Cache Responses:**  Implement caching mechanisms (e.g., Redis) for frequently accessed data to reduce database load.
* **[ ] Request Handling:**
    * **Keep Requests Small:**  Minimize the size of requests sent to the server.
    * **Handle Errors Gracefully:**  Implement robust error handling and logging to identify performance issues.
    * **Connection Pooling:**  Use a connection pooler (e.g., `pg-pool`, `node-postgres pool`) to manage database connections efficiently.
* **[ ] Asynchronous Operations:**
    * **Utilize
