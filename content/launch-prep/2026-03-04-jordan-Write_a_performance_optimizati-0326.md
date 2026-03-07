# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T03:26:50.632956

## Performance Optimization Checklist: Express + PostgreSQL

This checklist covers common optimization techniques for applications built with Express.js and PostgreSQL. It's broken down into categories for easier navigation and prioritization.

**I. Database Optimization (PostgreSQL Focused)**

* **[ ] Indexing:**
    * **Analyze Queries:**  Use `EXPLAIN ANALYZE` to identify slow queries and missing indexes. Focus on queries with high cardinality columns.
    * **Composite Indexes:** Create indexes on columns frequently used together in `WHERE` clauses or `JOIN` conditions.
    * **Partial Indexes:** Consider partial indexes for specific subsets of data based on a `WHERE` clause.
    * **Index Type:**  Evaluate the appropriate index type: B-tree (default), Hash, GIN, GIST, BRIN.  For example, GIN indexes are great for arrays and JSON data.
    * **Regularly Review Indexes:** Indexes consume space and can slow down write operations.  Remove unused or redundant indexes.
* **[ ] Query Optimization:**
    * **Avoid `SELECT *`:**  Only select the columns you need.
    * **Use `JOIN` Carefully:** Understand the different join types (`INNER JOIN`, `LEFT JOIN`, etc.) and their performance implications.
    * **Optimize `WHERE` Clauses:** Use efficient comparison operators (e.g., `=` instead of `LIKE` when possible).  Utilize index lookups effectively.
    * **Limit Results:**  Use `LIMIT` clauses to prevent retrieving unnecessary data.
    * **Subqueries:**  Avoid nested subqueries where possible. Consider using `JOIN` instead.
    * **Rewrite Complex Queries:**  Break down complex queries into smaller, more manageable parts.
* **[ ] PostgreSQL Configuration:**
    * **`shared_buffers`:** Adjust the `shared_buffers` setting based on your system's RAM (generally 25-50% of RAM).
    * **`work_mem`:**  Increase this value if you're using operations like `GROUP BY` or `DISTINCT` that require sorting large amounts of data in memory.
    * **`maintenance_work_mem`:**  Increase this value for maintenance tasks like `VACUUM` and `ANALYZE`.
    * **`effective_cache_size`:**  Inform PostgreSQL about the amount of memory available for caching.
    * **`autovacuum`:**  Ensure `autovacuum` is enabled and properly configured to prevent table bloat.
    * **Connection Pooling:** PostgreSQL's `pg_stat_statements` extension can help identify slow queries and potential performance bottlenecks.  Consider using a connection pooler like `pgbouncer` or `Connection Pool` to reduce connection overhead.

**II. Express.js Optimization**

* **[ ] Asynchronous Operations:**
    * **`async/await`:** Use `async/await` for cleaner and more readable asynchronous code.
    * **Proper Error Handling:**  Use `try...catch` blocks to handle errors gracefully and prevent application crashes.
    * **Avoid Blocking Operations:** Don’t perform long-running synchronous tasks directly in the Express request handler. Offload these to background jobs.
* **[ ] Route Optimization:**
    * **Minimize Middleware:**  Only include necessary middleware in your routes.
    * **Route Grouping:**  Use route grouping in Express to organize related routes and simplify middleware management.
    * **Efficient Route Definitions:** Keep route definitions concise and well-structured.
* **[ ] Request Parsing & Validation:**
    * **`body-parser` (or similar):** Use a middleware like `body-parser` or `express.json()` to parse request bodies efficiently.  However, consider using streams directly for large uploads.
