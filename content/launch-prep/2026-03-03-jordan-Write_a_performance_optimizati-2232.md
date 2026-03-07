# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T22:32:36.528789

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas for performance optimization when building an application using Express.js and PostgreSQL. It's broken down into categories for easier focus and includes suggestions ranging from simple to more complex.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use PostgreSQL's `EXPLAIN ANALYZE` command to identify slow queries and the operations causing bottlenecks.
    * **Create Indexes:**  Add indexes to columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses.  Consider composite indexes for multiple columns.
    * **Index Types:** Choose the right index type: B-tree (default), Hash, GiST, GIN.  B-tree is usually the best starting point.
    * **Index Size & Maintenance:**  Avoid overly broad indexes that can slow down write operations. Regularly analyze and rebuild indexes (`ANALYZE` and `VACUUM`).
* **[ ] Query Optimization:**
    * **Avoid `SELECT *`:** Retrieve only the columns you actually need.
    * **Use `WHERE` Clauses Effectively:**  Filter data as early as possible in the query.
    * **Optimize `JOIN` Clauses:** Ensure indexes exist on join columns.  Use the correct join type (INNER, LEFT, RIGHT) for your needs.
    * **Avoid `LIKE '%...'`:** Leading wildcards in `LIKE` queries are notoriously slow. If possible, use full-text search or alternative approaches.
    * **Use `LIMIT` & `OFFSET` Carefully:** Large offsets can be slow. Consider "seek-based pagination" instead.
    * **Review Complex Queries:**  Break down complex queries into smaller, more manageable steps.
    * **Use Prepared Statements:** Use parameterized queries to prevent SQL injection and improve query plan caching.
* **[ ] Data Types:**
    * **Choose Appropriate Data Types:** Use the smallest data type that can accommodate your data. Smaller data types consume less storage and can improve query performance.
    * **Use `ENUM`s:** If appropriate, consider using PostgreSQL’s `ENUM` data type for fixed sets of values.
* **[ ] Database Configuration:**
    * **`shared_buffers`:**  Allocate sufficient shared buffers for PostgreSQL's memory.  Typically 25-50% of system RAM.
    * **`work_mem`:** Allocate enough memory for sorting and hashing operations.
    * **`maintenance_work_mem`:**  Increase this for tasks like `VACUUM` and index creation.
    * **Connection Pooling:** Use a robust connection pooler like `pgbouncer` or `pgpool-II` to reduce the overhead of establishing new connections.

**II. Express.js Optimization**

* **[ ] Connection Pooling:**  Use a connection pooler (e.g., `pg-pool`) in your Express.js application to manage database connections efficiently. Avoid creating a new connection for every request.
* **[ ] Middleware Optimization:**
    * **Remove Unused Middleware:** Regularly review and remove any middleware that is no longer needed.
    * **Optimize Middleware Order:**  Place middleware that performs heavy operations (e.g., authentication) early in the chain.
* **[ ] Request Handling:**
    * **Asynchronous Operations:**  Always use asynchronous functions (Promises or `async/await`) for database operations and I/O operations to avoid blocking the event loop.
    * **Minify Assets:**  Minify JavaScript and CSS files to reduce their size and improve loading times.
* **[ ] Routing Optimization:**
    * **Use Route Parameters Wisely:** Design your routes to be as specific as possible.
    * **Route Groups & Middleware:**
