# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-07T01:30:35.859169

## Performance Optimization Checklist: Express + PostgreSQL

This checklist provides a structured approach to optimizing the performance of your Express.js application interacting with a PostgreSQL database. It’s broken down into categories with increasing levels of complexity.

**I. Initial Assessment & Monitoring (Low Hanging Fruit)**

* **[ ] Logging:** Implement comprehensive logging throughout your application.  Log slow queries, errors, and request durations to identify bottlenecks.  Use a structured logging library (e.g., Winston, Bunyan) for easier analysis.
* **[ ] Database Monitoring:**  Set up PostgreSQL monitoring. Tools like pgAdmin, Prometheus + Grafana, or database-specific monitoring solutions can provide insights into:
    * **Query Performance:** Top slow queries, query execution times.
    * **Resource Usage:** CPU, memory, disk I/O.
    * **Connection Pool Usage:** Ensure your connection pool isn't exhausted.
* **[ ]  Application Performance Monitoring (APM):**  Consider using an APM tool like New Relic, Datadog, or Dynatrace. These tools provide deeper insights into the entire request lifecycle, including database interactions.
* **[ ]  Basic Traffic Analysis:** Understand your user load patterns. Are there peak times? This helps anticipate scaling needs.

**II. PostgreSQL Optimization**

* **[ ] Indexing:** This is the *most critical* optimization.
    * **Identify Slow Queries:** Use `EXPLAIN ANALYZE` to understand how PostgreSQL executes your slow queries.  Look for missing or inefficient indexes.
    * **Analyze Index Usage:** Regularly run `ANALYZE` on your tables to update PostgreSQL’s statistics, which are used for query planning.
    * **Appropriate Index Types:** Choose the right index type:
        * **B-Tree:** For equality and range queries. (Default & Most Common)
        * **Hash:** For equality queries (often less efficient than B-Tree)
        * **GiST/GIN:** For more complex data types (e.g., geographic data, full-text search).
    * **Composite Indexes:** Create indexes on multiple columns used together in WHERE clauses.
    * **Partial Indexes:**  Index a subset of a table based on a specific condition.
* **[ ] Query Optimization:**
    * **Avoid `SELECT *`:**  Only select the columns you need.
    * **Use `WHERE` Clauses Effectively:**  Filter data as early as possible in the query.
    * **Optimize `JOIN`s:**  Use appropriate `JOIN` types (INNER, LEFT, RIGHT) and ensure join columns are indexed.
    * **Avoid `LIKE '%string%'`:**  Leading wildcards in `LIKE` clauses prevent index usage.  Consider full-text search or alternative approaches.
    * **Use `EXISTS` instead of `COUNT(*)`:**  When checking for the existence of rows.
    * **Simplify Complex Queries:**  Break down complex queries into smaller, more manageable ones.
* **[ ]  Configuration Tuning:**
    * **`shared_buffers`:** Adjust based on your server's memory.  A good starting point is 25-40% of RAM.
    * **`work_mem`:**  Controls the amount of memory used for sorting and hashing operations.
    * **`effective_cache_size`:**  Tells PostgreSQL how much memory is available for caching data.
    * **Connection Pool Size:**  Configure your connection pool in Express to match expected load and PostgreSQL’s capacity.
    * **`max_connections`:** Set a reasonable maximum number of concurrent connections.

**III. Express.js Optimization**

* **[ ] Connection Pooling:** Ensure your Express app is utilizing a connection pool properly. This dramatically reduces connection overhead
