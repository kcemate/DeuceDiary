# Write a performance optimization checklist for an Express.js
Agent: jordan
Generated: 2026-03-02T19:04:40.973585

## Performance Optimization Checklist - Express.js + PostgreSQL App on Railway

This checklist outlines key performance optimization strategies for your Express.js application running on Railway, specifically focusing on database interactions, query performance, caching, CDN, and compression.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use PostgreSQL's `pg_stat_statements` extension to identify the most time-consuming queries. Analyze the query plans (using `EXPLAIN ANALYZE`) to understand bottlenecks.
    * **Index Appropriate Columns:**  Add indexes to columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.  Focus on columns with high cardinality (many distinct values).
    * **Composite Indexes:** Create composite indexes for queries that frequently use multiple columns in the same conditions.
    * **Index Types:**  Choose the right index type (B-tree, GiST, GIN, etc.) based on your data and query patterns.  Consider using BRIN indexes for large tables with time series data.
    * **Regularly Review & Remove Unused Indexes:**  Unused indexes can degrade write performance.  Monitor index usage and remove them.
* **[ ] Query Optimization:**
    * **Avoid `SELECT *`:**  Only select the columns you actually need.
    * **Use `JOIN` Correctly:** Ensure `JOIN` conditions are properly indexed. Utilize `INNER JOIN` where possible.
    * **Subquery Optimization:**  Rewrite subqueries as joins where possible.  Optimize the structure of subqueries.
    * **Limit Result Sets:** Use `LIMIT` clauses to retrieve only the necessary number of records, especially during development and testing.
    * **Avoid `LIKE '%...%'`:** Leading wildcards in `LIKE` clauses can severely impact performance. Use alternative strategies like full-text search if appropriate.
    * **Use Prepared Statements:**  Prepared statements prevent SQL injection and allow the database to reuse the execution plan for repeated queries.
    * **Database Statistics:**  Ensure PostgreSQL's statistics are up-to-date (using `ANALYZE` command) for the query optimizer to make informed decisions.
* **[ ] Connection Pooling:** Railway automatically manages connection pooling, but monitor its efficiency.  Adjust connection pool size based on application load.

**II. Express.js Application Optimization**

* **[ ] Minimize Middleware Usage:**  Remove unused or overly complex middleware.  Each middleware layer adds overhead.
* **[ ] Optimize Route Handlers:**
    * **Use Asynchronous Functions:** Employ `async/await` to avoid blocking the event loop.
    * **Reduce Logic in Route Handlers:**  Move complex logic to separate services or libraries.
    * **Use Route Parameters Effectively:**  Avoid unnecessary parameter parsing and validation within route handlers.
* **[ ] Code Profiling:**  Use tools like `node:inspector` or `clinic.js` to identify performance bottlenecks in your Express.js code.
* **[ ] Efficient Data Serialization/Deserialization:**  Use JSON serialization/deserialization libraries efficiently.  Avoid unnecessary conversions.



**III. Caching**

* **[ ] Client-Side Caching (Browser):** Utilize HTTP caching headers (e.g., `Cache-Control`, `Expires`) to allow browsers to cache static assets and API responses.
* **[ ] Server-Side Caching (Redis - Recommended for Railway):**
    * **Cache API Responses:** Cache frequently accessed API endpoints to reduce database load.
    * **Cache Complex Calculations:** Cache the results of computationally intensive operations.
    * **Data Aggregation:**  Pre-aggregate data for frequently requested reports or dashboards.
    * **Cache Layer:** Implement a caching layer (e.g.,
