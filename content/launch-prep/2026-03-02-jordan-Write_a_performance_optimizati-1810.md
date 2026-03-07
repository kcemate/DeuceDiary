# Write a performance optimization checklist for an Express.js
Agent: jordan
Generated: 2026-03-02T18:10:14.080926

## Performance Optimization Checklist: Express.js + PostgreSQL App on Railway

This checklist focuses on optimizing your Express.js application running on Railway, specifically targeting the database, application code, and deployment infrastructure.

**I. Database Optimization (PostgreSQL)**

* **[ ] Database Connection Pooling:** Railway automatically handles connection pooling for PostgreSQL, but verify this is enabled and configured appropriately. Consider increasing the pool size if you’re experiencing connection bottlenecks (monitor with Railway's metrics).
* **[ ] Database Indexes:** This is *critical*.
    * **[ ] Analyze Queries:** Use `EXPLAIN ANALYZE` to identify slow queries and missing indexes. Focus on frequently executed queries and those with large datasets.
    * **[ ] Index Relevant Columns:**  Index columns used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.  Be mindful of index size – too many can slow down writes.
    * **[ ] Composite Indexes:**  Consider composite indexes when querying multiple columns together frequently.
    * **[ ] Index Data Types:** Ensure you're using the correct data types for your columns (e.g., `INTEGER` instead of `TEXT` for numeric IDs).
    * **[ ] Regularly Review Indexes:**  Don't blindly add indexes.  Monitor their usage and remove unused ones.
* **[ ] Query Optimization:**
    * **[ ] Avoid `SELECT *`:** Retrieve only the columns you actually need.
    * **[ ] Use `JOIN`s Wisely:** Understand the different types of `JOIN`s and use the most efficient one.
    * **[ ] Optimize `WHERE` Clauses:** Use indexes effectively.  Avoid complex calculations or functions in `WHERE` clauses if possible.  Rewrite using indexing.
    * **[ ] Efficient `GROUP BY` and `ORDER BY`:** Ensure indexes are used and avoid unnecessary sorting.
    * **[ ] Use `LIMIT` and `OFFSET` Carefully:** For pagination, use `LIMIT` and `OFFSET` judiciously.  For large datasets, consider cursor-based pagination (more complex but often more efficient).
    * **[ ] Use `COUNT(*)` Instead of `COUNT(column)`:** When you don’t need a specific column.
* **[ ] Database Statistics:** Ensure PostgreSQL’s statistics are up-to-date. Run `ANALYZE` periodically to help the query optimizer make better decisions.
* **[ ] Partitioning (Advanced):** If you have a very large table, consider partitioning it to improve query performance and manage data more effectively.  This is a significant undertaking.

**II. Express.js Application Optimization**

* **[ ] Code Profiling:** Use tools like `console.time()`/`console.timeEnd()` and a profiler (e.g., Node.js Inspector) to identify slow functions and bottlenecks in your Express routes and middleware.
* **[ ] Asynchronous Operations:** Ensure you’re using `async/await` or Promises correctly to avoid blocking the event loop.
* **[ ] Optimize Routes:** Design your routes to be as specific as possible. Avoid overly broad routes.
* **[ ] Use Middleware Effectively:**  Don’t chain unnecessary middleware.  Consider using middleware providers for common tasks (e.g., logging, authentication).
* **[ ] Efficient Data Handling:** Minimize data copying and serialization/deserialization.
* **[ ] Code Reviews:**  Have someone else review your code for performance issues.
* **[ ] Minimize Dependencies:** Remove unused dependencies.  Evaluate the impact of each dependency on your application's size and performance.

**III. Caching**

* **[ ] In-Memory Caching (Redis):** Railway integrates well with Redis.  Use Redis for caching frequently accessed data, API responses,
