# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T07:05:06.569956

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas to optimize your Express.js application when using PostgreSQL as your database. It’s broken down into categories and ranges from quick wins to more involved considerations.

**I. Database Optimization (PostgreSQL)**

* **[Priority: High] Indexing:**
    * **Identify Slow Queries:** Use `EXPLAIN ANALYZE` to identify queries with high cost or scans.
    * **Create Appropriate Indexes:** Add indexes on columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
    * **Index Types:** Choose the right index type (B-tree, GiST, GIN, BRIN) based on your query patterns.  B-tree is typically best for equality and range queries.
    * **Composite Indexes:** Consider composite indexes for queries using multiple columns in a single clause.
    * **Avoid Over-Indexing:** Too many indexes can slow down write operations. Regularly review and remove unused indexes.
* **[Priority: High] Query Optimization:**
    * **Write Efficient SQL:**
        * **Avoid `SELECT *`:** Only select the columns you need.
        * **Use `JOIN` Correctly:**  Ensure join conditions are properly indexed and using the appropriate join type (inner, left, right, etc.).
        * **Minimize Subqueries:**  Often, subqueries can be rewritten as joins for better performance.
        * **Use `LIMIT` and `OFFSET` Carefully:**  For pagination, `LIMIT` and `OFFSET` can be inefficient.  Consider using keyset pagination (seek pagination) for large datasets.
        * **Prepared Statements:** Use prepared statements to reduce parsing overhead.
    * **Analyze Queries Regularly:** Use `ANALYZE` to update PostgreSQL's statistics about the data distribution, allowing the query planner to make better decisions.
* **[Priority: Medium] Database Configuration:**
    * **`shared_buffers`:** Increase this value to allow PostgreSQL to cache more data in RAM. (Typically 25-50% of system RAM)
    * **`work_mem`:** Increase this value to allow PostgreSQL to perform more operations in memory.
    * **`effective_cache_size`:**  Set this to the amount of memory available to PostgreSQL for caching.
    * **Connection Pool Size:** Configure an appropriate connection pool size in PostgreSQL to avoid connection overhead.
    * **Logging:**  Adjust logging levels to balance detailed information with performance impact.
* **[Priority: Low] Data Types:**
    * **Choose Appropriate Data Types:**  Use the most efficient data types for your data.  For example, use `INTEGER` instead of `BIGINT` if the range of values is smaller.


**II. Express.js Optimization**

* **[Priority: High] Connection Pooling:**
    * **Use a Connection Pool:**  Don't create a new database connection for each request. Utilize a connection pool to reuse existing connections. (Libraries like `pg-pool` or `sequelize` often handle this automatically).
* **[Priority: High] Middleware Optimization:**
    * **Keep Middleware Minimal:**  Remove unnecessary middleware. Each piece adds overhead.
    * **Order Matters:** Arrange middleware in the most efficient order – prioritize those with the least impact.
    * **Asynchronous Operations:** Ensure all middleware uses asynchronous operations (using `async/await` or callbacks) to avoid blocking the event loop.
* **[Priority: Medium] Request Handling:**
    * **Minimize Request Size:** Reduce the amount of data transferred in each request.  Consider using compression (e.g., Gzip) on the server and client.
    * **Caching:** Implement caching (e.g., Redis) for frequently accessed data
