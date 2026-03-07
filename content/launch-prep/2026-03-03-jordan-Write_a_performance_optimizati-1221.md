# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T12:21:04.313773

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas and strategies to optimize your Express.js application running against a PostgreSQL database. It's broken down into categories for easier management and prioritization.

**I. Database Optimization (PostgreSQL Focus)**

* **[ ] Indexing:**
    * **Analyze Queries:** Use `EXPLAIN ANALYZE` to identify slow queries and determine missing indexes.
    * **Index Frequently Used Columns:**  Prioritize indexing columns in `WHERE`, `JOIN`, and `ORDER BY` clauses.
    * **Composite Indexes:**  Consider composite indexes for queries filtering on multiple columns frequently.
    * **Index Types:**  Choose the appropriate index type:
        * `B-Tree` (default): Good for equality, range, and sorting.
        * `Hash` (less common):  Good for equality searches, but less flexible.
        * `GIN/GIST` (for specialized data types): For full-text search, arrays, or geometric data.
    * **Avoid Over-Indexing:** Too many indexes can slow down write operations.
* **[ ] Query Optimization:**
    * **SELECT Only Needed Columns:** Avoid `SELECT *` – explicitly request only the columns you need.
    * **Use `WHERE` Clauses Effectively:**  Filter data as early as possible in the query.
    * **Optimize `JOIN` Operations:**
        * Ensure `JOIN` columns have appropriate indexes.
        * Use the most efficient `JOIN` type (INNER, LEFT, RIGHT) – understand the implications.
        *  Consider `JOIN` order – PostgreSQL's optimizer *should* handle it, but sometimes rewriting the query can help.
    * **Avoid `SELECT DISTINCT` Unnecessarily:**  It can be slow, especially on large datasets.
    * **Use `LIMIT`:**  Always use `LIMIT` when fetching only a specific number of results.
    * **Raw SQL vs. ORM:**  For complex queries or performance-critical areas, consider writing raw SQL queries directly for maximum control.
* **[ ] Database Configuration:**
    * **`shared_buffers`:**  Allocate sufficient memory for PostgreSQL's shared memory buffers. (Usually 25-50% of system RAM)
    * **`work_mem`:**  Memory allocated for operations like sorting and hashing. Increase if you see many "temporary files" in the logs.
    * **`maintenance_work_mem`:** Memory used for maintenance operations (e.g., `VACUUM`, `ANALYZE`).
    * **`effective_cache_size`:**  Inform the query planner about the size of your system’s caching.
    * **`max_connections`:**  Set the maximum number of concurrent connections.  Adjust based on your application's needs and server resources.
    * **Regular `VACUUM` and `ANALYZE`:**  Keep the database statistics up-to-date and reclaim dead tuples.  Automate these.

**II. Express.js Application Optimization**

* **[ ] Connection Pooling:**  Use a connection pool (e.g., `pg-pool`) to avoid the overhead of establishing new connections for each request.
* **[ ] Asynchronous Operations:**  Leverage `async/await` or Promises for all database interactions to avoid blocking the event loop.
* **[ ] Request Processing:**
    * **Minimize Middleware:**  Remove unnecessary middleware to reduce overhead.
    * **Optimize Route Handlers:**  Keep route handlers concise and efficient.
    * **Caching:** Implement caching strategies (e.g., Redis or in-memory) for frequently accessed data to reduce database load.
* **[ ] Data Serialization/Deserialization:**
    * **Choose Efficient
