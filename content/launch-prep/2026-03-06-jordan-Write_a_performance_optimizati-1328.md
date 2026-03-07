# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-06T13:28:58.577717

## Performance Optimization Checklist: Express + PostgreSQL

This checklist covers key areas for optimizing performance when using Express (Node.js framework) with a PostgreSQL database. It's categorized for clarity and provides actionable steps, ranging from simple to more complex.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Analyze Queries:** Use `EXPLAIN ANALYZE` on slow queries to identify missing or ineffective indexes.
    * **Index Appropriate Columns:**  Index columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
    * **Composite Indexes:** Create composite indexes for queries using multiple columns together.
    * **Partial Indexes:** Consider partial indexes for queries that filter on a specific subset of data.
    * **Index Types:**  Choose the right index type (B-tree, Hash, GiST, GIN) based on your data and query patterns. B-tree is generally a good starting point.
* **[ ] Query Optimization:**
    * **Avoid `SELECT *`:** Only select the columns you need.
    * **Use `JOIN` Effectively:** Understand different `JOIN` types (INNER, LEFT, RIGHT) and choose the most efficient one.
    * **Rewrite Complex Queries:** Break down complex queries into smaller, more manageable parts.  Subqueries can often be rewritten using `JOIN`s.
    * **Optimize `WHERE` Clauses:** Use indexes effectively and avoid using functions or expressions in `WHERE` clauses that prevent index usage.
    * **Use `LIMIT` and `OFFSET` Carefully:** These can be slow for large datasets. Consider alternatives like cursor-based pagination.
    * **Use `EXPLAIN` to Understand Query Plans:** Regularly review the query execution plan to identify bottlenecks.
* **[ ] Schema Design:**
    * **Normalization:**  Normalize your database to reduce redundancy and improve data integrity (but don't over-normalize).
    * **Data Types:**  Use the smallest appropriate data type for each column to minimize storage and improve performance.
    * **Consider Denormalization (Carefully):**  In certain situations, denormalization can improve read performance, but it can complicate data updates.
* **[ ] PostgreSQL Configuration:**
    * **`shared_buffers`:** Adjust based on available RAM. (Usually 25% - 50% of system RAM)
    * **`work_mem`:**  Increase to allow more in-memory sorting and hashing.
    * **`maintenance_work_mem`:** Increase for maintenance operations like `VACUUM` and `ANALYZE`.
    * **`effective_cache_size`:** Tell the query planner about the available cache size.
    * **Regularly Run `VACUUM` and `ANALYZE`:** These operations reclaim space and update statistics used by the query planner.  Consider autovacuum settings.
* **[ ] Connection Pooling:** Use a PostgreSQL connection pooler (e.g., `pg-pool`, `node-postgres`) to reduce the overhead of creating and destroying database connections.


**II. Express.js Optimization**

* **[ ] Asynchronous Operations:**  *Always* use `async/await` or Promises for database operations. Blocking synchronous code will freeze your application.
* **[ ] Middleware Optimization:**
    * **Remove Unused Middleware:** Regularly review your middleware stack and remove any that are not essential.
    * **Order Middleware Matters:**  Place heavier middleware (like authentication) earlier in the stack.
* **[ ] Route Optimization:**
    * **Use Route Parameters Effectively:**  When possible, use route parameters to efficiently pass data to your handlers.
    * **Avoid Complex Route Logic:** Keep your route handlers concise and focused.
*
