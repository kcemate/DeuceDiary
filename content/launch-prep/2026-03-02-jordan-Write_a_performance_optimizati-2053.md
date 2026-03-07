# Write a performance optimization checklist for an Express.js
Agent: jordan
Generated: 2026-03-02T20:53:32.703166

## Performance Optimization Checklist: Express.js + PostgreSQL App on Railway

This checklist focuses on optimizing a Railway-deployed Express.js application leveraging PostgreSQL. It covers key areas like database performance, query optimization, caching, CDN usage, and compression.

**I. Database (PostgreSQL) - 60% of Optimization Effort**

* **[ ] Indexing Strategy:**
    * **Identify Slow Queries:** Use PostgreSQL's `pg_stat_statements` extension to pinpoint slow-running queries. Analyze execution plans (using `EXPLAIN ANALYZE`).
    * **Index Relevant Columns:** Add indexes to columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses. 
    * **Composite Indexes:** Consider composite indexes for queries using multiple columns in filtering or sorting.
    * **Index Data Types:** Ensure indexes are using the appropriate data types for the columns they cover.
    * **Regularly Review Indexes:** Downtime to revisit indexes - query patterns can change over time.
* **[ ] Query Optimization:**
    * **Avoid `SELECT *`:** Only select the columns you actually need.  `SELECT *` can lead to unnecessary data transfer and processing.
    * **Use `JOIN`s Efficiently:** Ensure `JOIN`s are using appropriate indexes and that the `ON` clauses are clearly defined.
    * **Optimize `WHERE` Clauses:**
        * **Use `LIKE` sparingly:** Leading wildcards (`%`) in `LIKE` clauses are notoriously slow. Consider full-text search if appropriate.
        * **Use Appropriate Operators:** Use the most efficient operator for the data type (e.g., `=` for exact matches, `>` for range comparisons).
    * **Subqueries:**  Avoid nested subqueries if possible.  Rewrite them as `JOIN`s for improved performance.
    * **Limit Results:** Use `LIMIT` clauses to restrict the number of rows returned when only a subset is needed.
    * **Use `EXISTS` instead of `COUNT(*)`:** When checking for existence, `EXISTS` is generally faster than `COUNT(*)`.
* **[ ] PostgreSQL Configuration:**
    * **Connection Pooling:** Railway automatically handles connection pooling.  Verify this configuration in your deployment.
    * **Shared Buffers:**  Review PostgreSQL's shared buffers configuration for optimal memory allocation based on your workload.
    * **Work Mem:**  Adjust `work_mem` according to the size of your data and query operations.
    * **Maintenance:** Ensure regular maintenance tasks (vacuuming, analyzing) are running (Railway may handle this, verify).


**II. Express.js Application - 20% of Optimization Effort**

* **[ ] Efficient Routing:**
    * **Use Route Groups:** Group related routes for better organization and potential middleware application.
    * **Minimize Middleware Usage:** Only use middleware that’s truly necessary.
    * **Route Parameters:**  Use the correct route parameter types to prevent type casting issues.
* **[ ] Efficient Data Handling:**
    * **Streams:** Use streams to process large file uploads/downloads without loading the entire file into memory.
    * **Avoid Unnecessary Calculations:** Optimize calculations within controllers to minimize processing time.
* **[ ] Code Quality:**
    * **Code Reviews:** Implement code reviews to identify and address performance bottlenecks.
    * **Profiling:** Use profiling tools to identify slow sections of your code.


**III. Caching - 10% of Optimization Effort**

* **[ ] Application-Level Caching:**
    * **Cache Frequently Accessed Data:** Use in-memory caching (e.g., Redis, or the Node.js `node-cache`) to store the results of expensive computations or frequently accessed data.
    * **Cache Layers:**
