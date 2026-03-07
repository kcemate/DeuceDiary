# Write a performance optimization checklist for an Express.js
Agent: jordan
Generated: 2026-03-02T22:26:00.130363

## Performance Optimization Checklist: Express.js + PostgreSQL App on Railway

This checklist focuses on optimizing your Express.js application running on Railway, specifically with a PostgreSQL database. It breaks down optimization strategies into key areas with actionable steps.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use PostgreSQL's `pg_stat_statements` extension to identify queries with high execution times and a large number of calls.
    * **Analyze Data Types:** Ensure appropriate data types are used. Narrower types (e.g., `SMALLINT` instead of `BIGINT`) can significantly impact performance.
    * **Index Relevant Columns:** Index columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses.
    * **Composite Indexes:**  For complex queries with multiple conditions, consider creating composite indexes that cover all the used columns.
    * **Index Types:** Experiment with different index types (B-tree, Hash, GiST, GIN) depending on your query patterns. B-tree is usually a good starting point.
    * **Regular Index Maintenance:**  Run `VACUUM ANALYZE` regularly to update statistics and rebuild indexes. Railway generally handles some of this, but verify.
* **[ ] Query Optimization:**
    * **Avoid `SELECT *`:** Only select the necessary columns.
    * **Use `EXPLAIN`:** Analyze query execution plans using `EXPLAIN` to identify bottlenecks.
    * **Optimize `JOIN`s:** Use appropriate `JOIN` types (INNER, LEFT, RIGHT) and ensure indexes are in the correct order for `JOIN`s.
    * **Rewrite Complex Queries:** Break down complex queries into smaller, more manageable queries.
    * **Use Prepared Statements:**  Prepared statements are more efficient for repeated queries as the query plan is cached. Express.js's `pg-pool` handles this well.
    * **Limit Data Returned:** Use `LIMIT` clauses to restrict the amount of data returned, especially in list views or pagination.
    * **Use `WHERE` Effectively:**  Filter data as early as possible in the query.
* **[ ] Database Configuration (Railway Specific):**
    * **PostgreSQL Version:** Ensure you’re using a recent, stable PostgreSQL version supported by Railway.
    * **Connection Pooling:** Railway's PostgreSQL service handles connection pooling automatically, but monitor its performance and adjust settings if needed.
    * **Memory Allocation:**  Railway manages memory.  However, monitor resource usage to ensure PostgreSQL isn’t being limited.

**II. Application Optimization (Express.js)**

* **[ ] Code Efficiency:**
    * **Minimize Middleware Usage:**  Only use middleware that is absolutely necessary.
    * **Efficient Routing:** Use efficient route handlers and avoid complex logic within routes.
    * **Asynchronous Operations:** Utilize `async/await` or Promises for all asynchronous operations to prevent blocking the event loop.
    * **Code Profiling:** Use tools like `node:inspector` or `clinic.js` to identify performance bottlenecks in your code.
* **[ ] Express.js Configuration:**
    * **Use a Connection Pool:** `pg-pool` is a popular and efficient choice for managing database connections in Express.js.
    * **Keep Express.js Updated:** Use the latest stable version of Express.js.
    * **Optimize Request Handling:**  Use `express.json()` and `express.urlencoded()` middleware correctly.
* **[ ] Logging:**
    * **Use Minimal Logging:**  Excessive logging can significantly impact performance.  Only log important events and errors.
    * **Asynchronous Logging:**  Use asynchronous logging libraries to avoid blocking the event loop.


**III. Caching**

* **
