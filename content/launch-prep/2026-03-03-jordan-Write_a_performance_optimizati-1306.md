# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T13:06:30.674381

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas to optimize your Express.js application when combined with a PostgreSQL database. It's broken down into categories for easier navigation and prioritisation.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use PostgreSQL's `EXPLAIN ANALYZE` command to identify queries with the highest execution cost.
    * **Add Appropriate Indexes:** Create indexes on columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses.  Consider:
        * **B-Tree Indexes:** Standard indexes for equality and range comparisons.
        * **GIN Indexes:** For full-text search and array data.
        * **GiST Indexes:** For geometric data types and specialized data types.
        * **BRIN Indexes:**  Smaller tables where data is physically ordered by the indexed column.
    * **Composite Indexes:** Create composite indexes (indexes on multiple columns) for queries that filter on multiple columns frequently.
    * **Avoid Over-Indexing:**  Too many indexes can slow down write operations (inserts, updates, deletes). Regularly review and remove unused indexes.
* **[ ] Query Optimization:**
    * **Write Efficient SQL:**
        * **Use `EXISTS` instead of `COUNT(*)` for existence checks.**
        * **Avoid `SELECT *` - Specify only the necessary columns.**
        * **Use `JOIN` instead of subqueries whenever possible.**
        * **Avoid `OR` in `WHERE` clauses if possible; consider `UNION` or rewriting the query.**
        * **Optimize `ORDER BY` clauses - index the sorted column or consider alternative sorting methods.**
    * **Utilize PostgreSQL's Query Analyzer:**  Review query plans and identify potential bottlenecks.
* **[ ] Database Configuration:**
    * **`shared_buffers`:**  Adjust this parameter to match your server's memory - typically 25-50% of RAM.
    * **`work_mem`:**  Affects the amount of memory used for sorts and operations - increase if you see lots of "temp" tables being created.
    * **`maintenance_work_mem`:**  Memory used for maintenance tasks (e.g., `VACUUM`, `ANALYZE`).
    * **`effective_cache_size`:**  Helps PostgreSQL estimate the amount of memory available to the query planner.
    * **`wal_buffers`:**  Buffer for Write-Ahead Logging (WAL) - affects transaction performance.
    * **Regularly run `VACUUM ANALYZE`:** This updates statistics and cleans up dead tuples, improving query performance.
* **[ ] Connection Pooling:**
    * **Use a connection pooler (e.g., pg-pool, bluebird):** Avoid repeatedly creating and destroying database connections, which is resource-intensive.

**II. Express.js Application Optimization**

* **[ ] Middleware Optimization:**
    * **Remove Unnecessary Middleware:**  Only include middleware that is actually needed.
    * **Optimize Middleware Order:** Place performance-critical middleware (e.g., authentication) closer to the beginning of the chain.
    * **Use Efficient Middleware:** Select middleware libraries that are optimized for performance.
* **[ ] Request Handling:**
    * **Use Asynchronous Operations:**  Utilize `async/await` or Promises to avoid blocking the event loop.
    * **Minimize Request Processing Time:**  Reduce the amount of processing done within each request handler.
* **[ ] Data Serialization/Deserialization:**
    * **Use Efficient JSON Libraries:**  Choose libraries optimized for JSON parsing and serialization.
    * **Minimize Data Transferred:** Only send the necessary data in responses.
