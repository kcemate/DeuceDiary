# Write a performance optimization checklist for an Express.js
Agent: jordan
Generated: 2026-03-02T18:46:32.848618

## Performance Optimization Checklist for Express.js + PostgreSQL App on Railway

This checklist covers key performance optimization areas for your Express.js application running on Railway, considering database interaction, query performance, caching, and static asset delivery.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use PostgreSQL's `pg_stat_statements` extension to identify the queries taking the longest.  Enable it if not already: `CREATE EXTENSION pg_stat_statements;`
    * **Analyze Query Execution Plans:**  Use `EXPLAIN ANALYZE` for slow queries to understand how PostgreSQL is executing them and identify missing or ineffective indexes.
    * **Index Key Columns:** Create indexes on columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
    * **Composite Indexes:** Consider composite indexes for queries using multiple columns in their `WHERE` clause.
    * **Index Type:**  Choose the appropriate index type (B-tree, GIN, GIST) based on your data and query patterns.
    * **Regular Index Maintenance:**  Run `VACUUM ANALYZE` regularly (e.g., daily or weekly) to optimize indexes and update statistics. Railway’s database management tools should handle this, but monitor its execution.
* **[ ] Query Optimization:**
    * **Avoid `SELECT *`:**  Only select the columns you actually need.
    * **Use `JOIN`s Efficiently:**  Ensure `JOIN` conditions are properly indexed. Use the appropriate `JOIN` type (e.g., `INNER JOIN`, `LEFT JOIN`) based on your requirements.
    * **Optimize `WHERE` Clauses:**  Use indexed columns in `WHERE` clauses. Avoid using functions in `WHERE` clauses that prevent index usage.
    * **Limit Results:**  Use `LIMIT` clauses to restrict the number of returned rows, especially in API endpoints.
    * **Batch Operations:**  For bulk data operations (insert, update, delete), use batch methods rather than individual queries.
    * **Parameterized Queries:** Always use parameterized queries to prevent SQL injection and improve query performance by allowing PostgreSQL to reuse execution plans.
* **[ ] Schema Design:**
    * **Normalization:**  Ensure your schema is properly normalized to reduce data redundancy and improve data integrity. However, over-normalization can sometimes lead to complex `JOIN`s, so find the right balance.
    * **Data Types:** Choose appropriate data types to minimize storage space and improve query performance. 
* **[ ] Connection Pooling:**  Railway uses connection pooling automatically.  Confirm this is enabled and appropriately sized.  Monitor pool usage to avoid bottlenecks.



**II. Express.js Application Optimization**

* **[ ] Code Efficiency:**
    * **Minimize Middleware:** Only use middleware that’s absolutely necessary.
    * **Efficient Route Handlers:** Write clean, efficient route handlers to avoid unnecessary processing.
    * **Avoid Callback Hell:** Use Promises or Async/Await to write asynchronous code in a more readable and maintainable way.
    * **Optimize Data Processing:**  Optimize any data transformations or calculations within your route handlers.
* **[ ] Error Handling:** Implement robust error handling to prevent application crashes and provide informative error messages.
* **[ ] Logging:**  Use logging to track application behavior, identify performance bottlenecks, and diagnose issues.  Don’t log sensitive information.
* **[ ] Rate Limiting:** Implement rate limiting to protect your API from abuse and denial-of-service attacks.  Railway’s built-in rate limiting is a good starting point.


**III. Caching**

* **[ ] Client-Side Caching (Browser):**
    * **HTTP Caching Headers:** Set appropriate HTTP caching
