# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T14:20:14.070935

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas to focus on when optimizing the performance of an Express.js application interacting with a PostgreSQL database. It's broken down into categories with suggested actions and considerations.

**I. Database Optimization (PostgreSQL Focus)**

* **[ ] Indexing:** This is the *most* impactful area.
    * **Analyze Queries:** Use `EXPLAIN ANALYZE` to identify slow queries and missing indexes. Focus on queries with high `actual time` or `rows`.
    * **Index Relevant Columns:** Index columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
    * **Composite Indexes:** Consider composite indexes for queries using multiple columns together.
    * **Partial Indexes:**  If you frequently filter on a subset of data, a partial index can be significantly faster.
    * **Index Types:** Choose the appropriate index type (B-tree, GiST, GIN, HASH) based on your data and query patterns.
* **[ ] Query Optimization:**
    * **Avoid `SELECT *`:**  Only select the columns you need. Reduces data transfer and memory usage.
    * **Use `JOIN`s Efficiently:**  Ensure `JOIN`s are using proper indexes and that the join condition is efficient.
    * **Limit Results:**  Always use `LIMIT` when possible to avoid retrieving unnecessary data.
    * **Use `WHERE` Clauses Effectively:**  Filter data as early as possible in the query.
    * **Optimize `ORDER BY` Clauses:**  Index the columns used in `ORDER BY` to avoid sorting.
    * **Use `EXISTS` instead of `COUNT(*)`:** When you only need to know if a row exists, `EXISTS` is often faster.
    * **Subqueries vs. Joins:** Evaluate whether a subquery can be rewritten as a `JOIN` and vice versa.
    * **Common Table Expressions (CTEs):**  Can sometimes improve readability and performance for complex queries, but analyze their execution plan.
* **[ ] Database Configuration:**
    * **`shared_buffers`:** Adjust the amount of memory PostgreSQL uses for caching data. (Typically 25%-50% of RAM).
    * **`work_mem`:**  Controls the amount of memory used for internal sort operations. Increase if you see high `temp_bytes` in your query plans.
    * **`effective_cache_size`:**  Inform PostgreSQL about the size of the operating system's cache.
    * **`maintenance_work_mem`:** Memory used during maintenance operations like `VACUUM` and `ANALYZE`.
    * **`autovacuum`:**  Enable and configure autovacuum to prevent table bloat.
* **[ ] Data Types:** Use the most appropriate data types for your columns.  Avoid using string types for numeric values.
* **[ ] Vacuum and Analyze Regularly:** `VACUUM` reclaims dead tuples, and `ANALYZE` updates statistics used by the query planner.  Set up scheduled jobs for this.


**II. Express.js Application Optimization**

* **[ ] Connection Pooling:**  Use a connection pooler like `pg-pool` or `sequelize's connection pool` to reuse database connections instead of creating a new connection for each request. This significantly reduces connection overhead.
* **[ ] Asynchronous Operations:** Utilize `async/await` or Promises to handle asynchronous database operations correctly.  Avoid blocking the event loop.
* **[ ] Middleware Optimization:**
    * **Remove Unnecessary Middleware:** Only include middleware that is absolutely necessary.
    * **Optimize Logging Middleware:**  Logging can be expensive. Use asynchronous logging and limit the level
