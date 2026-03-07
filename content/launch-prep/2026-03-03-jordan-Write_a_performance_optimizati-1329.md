# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T13:29:04.535235

## Performance Optimization Checklist: Express + PostgreSQL

This checklist covers key areas for optimizing your Express.js application running against a PostgreSQL database. It's broken down into categories for easier navigation and prioritization.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Analyze Queries:**  Use `EXPLAIN ANALYZE` to identify slow queries and pinpoint missing indexes.  Focus on columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses.
    * **Composite Indexes:**  Create composite indexes for queries with multiple conditions on the same columns.
    * **Index Types:**  Choose the correct index type: `B-Tree` is most common, but consider `GIN` (for full-text search) or `HSTORE` (for key-value) if appropriate.
    * **Covering Indexes:**  Include all columns required in a query's `SELECT` clause within the index to avoid costly lookups.
* **[ ] Query Optimization:**
    * **Avoid `SELECT *`:**  Only select the columns you need.
    * **Optimize `JOIN`s:** Ensure `JOIN`s are using indexes and are efficiently written. Consider using `INNER JOIN` when appropriate.
    * **Use `WHERE` clauses effectively:**  Filter data as early as possible in the query.
    * **Avoid `LIKE '%string%'`:**  Leading wildcards make index usage impossible. Consider full-text search if relevant.
    * **Limit Results with `LIMIT`:**  Especially in API endpoints, limit the number of results returned.
    * **Subqueries:**  Be cautious with nested subqueries – often, they can be rewritten as joins for better performance.
* **[ ] Database Configuration:**
    * **`shared_buffers`:**  Set appropriately for your server's RAM (typically 25-50%).
    * **`work_mem`:**  Increase this if you're performing significant sorting or hashing operations.
    * **`effective_cache_size`:**  Tell PostgreSQL about the amount of RAM available for caching data.
    * **`maintenance_work_mem`:**  Increase for tasks like `VACUUM` and `ANALYZE`.
    * **`autovacuum`:**  Ensure autovacuum is enabled and configured appropriately to prevent table bloat.
    * **`vacuum`:**  Regularly run `VACUUM` to reclaim dead tuples and optimize table storage.
* **[ ] Data Types:**
    * **Choose appropriate data types:** Use the smallest data type that can accommodate your data. `TEXT` vs. `VARCHAR` impacts storage.
* **[ ] Normalization:**
    * Ensure your schema is properly normalized to avoid redundancy and improve data integrity.  However, be aware of the potential performance impact of excessive joins.



**II. Express.js Application Optimization**

* **[ ] Connection Pooling:**
    * **Utilize a Connection Pool:**  Use a library like `pg-pool` or `sequelize`’s connection pooling to efficiently manage database connections.  This reduces the overhead of establishing new connections for each request.
* **[ ] Middleware Optimization:**
    * **Minimize Middleware:**  Only include middleware that's absolutely necessary.  Each piece adds overhead.
    * **Cache Middleware Responses:**  Implement caching for frequently accessed data to reduce database load.
* **[ ] Request Handling:**
    * **Handle Requests Asynchronously:**  Use `async/await` or Promises to avoid blocking the event loop.
    * **Limit Request Size:**  Implement limits on request body size to prevent excessive memory consumption.
* **[ ] Code Optimization:**
    * **Efficient Data Structures:**  Use appropriate data structures in your
