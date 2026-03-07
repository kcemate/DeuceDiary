# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T03:04:12.130077

## Performance Optimization Checklist: Express + PostgreSQL

This checklist focuses on optimizing the performance of a typical Express.js application interacting with a PostgreSQL database. It's broken down into categories with actionable steps.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use `EXPLAIN ANALYZE` to pinpoint queries with high costs or slow execution plans.
    * **Create Indexes Strategically:** Add indexes on columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses.
    * **Composite Indexes:** Consider composite indexes for queries joining multiple columns.
    * **Index Types:** Choose the appropriate index type (B-tree, GiST, GIN, HASH) based on your query patterns. B-tree is generally a good starting point.
    * **Partial Indexes:** Index only a subset of rows based on a specific condition.
    * **Avoid Over-Indexing:** Too many indexes can slow down write operations (inserts, updates, deletes). Regularly review and drop unused indexes.
* **[ ] Query Optimization:**
    * **Write Efficient SQL:** Avoid using `SELECT *` – specify only the columns you need.
    * **Use `JOIN`s Wisely:** Analyze `JOIN` types and ensure you're using the most efficient one for your data.
    * **Optimize `WHERE` Clauses:** Use indexed columns and avoid functions in `WHERE` clauses that prevent index usage.
    * **Avoid `LIKE '%...%'`:**  Leading wildcards prevent index usage.  Consider full-text search if needed.
    * **Use `LIMIT` and `OFFSET` Carefully:** For pagination, utilize `LIMIT` and `OFFSET` in the database query, not just in the application.
    * **Use Prepared Statements:**  Prepare queries once and reuse them to avoid parsing overhead and improve security.
    * **Analyze Queries Regularly:**  Run `ANALYZE` periodically to update statistics used by the query optimizer.
* **[ ] Database Configuration:**
    * **`shared_buffers`:**  Adjust this to the amount of RAM you can afford for PostgreSQL's buffer cache.
    * **`work_mem`:**  Increase this for operations like sorting and hash joins.
    * **`maintenance_work_mem`:**  Increase this for tasks like `VACUUM` and `ANALYZE`.
    * **Connection Pool:**  Utilize a connection pool in your application (e.g., `pg-pool` for Node.js) to reuse database connections instead of constantly creating and destroying them.
    * **Logging Levels:** Adjust logging levels for debugging, but keep them to a minimum in production.
* **[ ] Data Types:**  Use the most appropriate data type for each column to minimize storage space and improve query performance.

**II. Express.js Application Optimization**

* **[ ] Connection Pooling (Already covered in PostgreSQL, but crucial):**  Implement a robust connection pool.
* **[ ] Route Handling:**
    * **Minimize Route Complexity:** Keep routes concise and focused.
    * **Use Route Parameters Effectively:** Use route parameters for dynamic data instead of constructing queries in the route handler.
* **[ ] Middleware Optimization:**
    * **Reduce Middleware Stack:** Minimize the number of middleware added to your requests.
    * **Cache Middleware:** Cache frequently executed middleware to avoid redundant processing.
* **[ ] Asynchronous Operations:**
    * **Use `async/await`:**  Use `async/await` for all database operations to prevent blocking the event loop.
    * **Handle Errors Properly:** Implement proper error handling to prevent application crashes and provide informative error messages.
* **[ ] Data Serialization:**
    * **Use JSON.stringify/parse
