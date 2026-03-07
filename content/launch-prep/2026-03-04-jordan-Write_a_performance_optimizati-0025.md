# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T00:25:29.277495

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas to focus on when optimizing the performance of an Express.js application connecting to a PostgreSQL database. It’s broken down into categories with suggested actions and considerations.

**I. Database Optimization (PostgreSQL Focus)**

* **[ ] Indexing:**
    * **Analyze Queries:** Use `EXPLAIN ANALYZE` to identify slow queries and the operations taking the most time.
    * **Index Strategically:** Create indexes on columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses.  Focus on composite indexes for multiple frequently used columns.
    * **Index Type:** Choose the correct index type:
        * **B-Tree:** (default) – Excellent for equality, range, and sorting.
        * **Hash:**  Optimized for equality comparisons.
        * **GIN/GIST:**  For complex data types and advanced search needs.
    * **Avoid Over-Indexing:** Too many indexes can slow down write operations. Regularly review and remove unused indexes.
* **[ ] Query Optimization:**
    * **SELECT Only Needed Columns:** Avoid `SELECT *` –  Retrieve only the data required by the application.
    * **Use `JOIN` Efficiently:**  Understand different `JOIN` types and their performance implications.
    * **Write Specific Queries:** Avoid wildcard searches (`LIKE '%something%'`) – they're very slow.  Consider full-text search for relevant text searches.
    * **Optimize `WHERE` Clauses:** Use efficient comparisons and avoid unnecessary complexity.
    * **Use `EXISTS` instead of `COUNT(*)`:**  When checking for existence, `EXISTS` is often faster.
    * **Review Subqueries:**  Optimize or rewrite subqueries – sometimes they can be replaced with `JOIN` operations.
* **[ ] PostgreSQL Configuration:**
    * **`shared_buffers`:**  Increase if PostgreSQL has sufficient RAM – typically 25-50% of RAM.
    * **`work_mem`:** Increase for operations like sorting and hashing.
    * **`maintenance_work_mem`:** Increase for maintenance tasks like `VACUUM` and `ANALYZE`.
    * **`effective_cache_size`:**  Provide a realistic estimate of your system's caching capabilities.
    * **`autovacuum`:** Ensure autovacuum is enabled and configured appropriately to prevent table bloat.
    * **Connection Pooling:**  Use a PostgreSQL connection pooler (e.g., pgpool-II, pgBouncer) to reduce the overhead of establishing new connections.
* **[ ] Data Types:**
    * **Use Appropriate Data Types:**  Choose data types that are appropriate for the data being stored to minimize storage space and improve performance.  (e.g., `SMALLINT` vs. `INTEGER` if range is limited).
* **[ ] Partitioning (Advanced):** Consider partitioning large tables to improve query performance and manageability.



**II. Express.js Optimization**

* **[ ] Connection Pooling:**  Use a connection pooling library (e.g., `pg-pool`, `node-postgres`) in Express to manage database connections efficiently.  This dramatically reduces connection overhead.
* **[ ] Asynchronous Operations:**  Always use `async/await` or Promises for database operations to avoid blocking the event loop.
* **[ ] Route Handling:**
    * **Minimize Middleware:**  Keep middleware to a minimum to reduce overhead.
    * **Cache Route Responses:**  Consider caching frequently accessed route responses (using libraries like `node-cache` or `cache-manager`).
* **[ ] Request Body Parsing:**
    * **Use `express.json()` and `express.urlencoded()`:**
