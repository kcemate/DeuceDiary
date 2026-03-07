# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-07T09:19:18.945591

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas and techniques to optimize your Express application running against a PostgreSQL database. It's categorized for clarity and covers a range of strategies from basic to more advanced.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:** This is the *most crucial* area.
    * **Analyze Queries:** Use `EXPLAIN ANALYZE` to understand how PostgreSQL is executing your queries. Identify missing indexes.
    * **Create Appropriate Indexes:**
        * **B-Tree Indexes:** Standard indexes for equality and range queries on columns frequently used in `WHERE` clauses, `JOIN` conditions, and `ORDER BY` clauses.
        * **GIN Indexes:** For indexing array and JSON data types.
        * **GiST Indexes:**  For more complex data types like geographic data.
        * **Full-Text Indexes:** For efficient text searching.
    * **Composite Indexes:** Create indexes on multiple columns frequently used together. The order of columns matters!
    * **Index Maintenance:** Regularly run `VACUUM ANALYZE` to update statistics and defragment indexes.
* **[ ] Query Optimization:**
    * **Write Efficient Queries:**
        * **Avoid `SELECT *`:** Only select the columns you need.
        * **Use `WHERE` clauses effectively:** Filter data as early as possible.
        * **Use `JOIN`s efficiently:**  Ensure proper indexing on join columns.
        * **Optimize `ORDER BY` clauses:**  Index the columns used for sorting.
        * **Avoid `LIKE` with leading wildcards (`%`)**: These are very slow. Consider full-text search if appropriate.
        * **Use `LIMIT`:**  Limit the number of rows returned if you only need a subset.
    * **Query Analyzer:** Regularly review and refine your queries.
* **[ ] Database Configuration:**
    * **`shared_buffers`:** Increase this for PostgreSQL to improve caching. (Typically 25-50% of RAM)
    * **`effective_cache_size`:**  Helps PostgreSQL estimate memory available for caching.
    * **`work_mem`:**  Amount of memory used for internal sorting operations.  Increase if you have a lot of sorting.
    * **`maintenance_work_mem`:** Memory used for maintenance tasks like `VACUUM`.
    * **Connection Pooling:** Configure PostgreSQL connection pooling for efficient resource utilization.
* **[ ] Data Types:**  Choose the most appropriate data type for each column to minimize storage and improve query performance.
* **[ ] Regular Maintenance:**
    * **Vacuuming:**  Remove dead tuples and update statistics regularly.
    * **Analyze:** Update PostgreSQL's query planner statistics.


**II. Express Application Optimization**

* **[ ] Asynchronous Operations:**
    * **Use `async/await`:**  Handle database queries asynchronously to avoid blocking the event loop.
    * **Avoid Callback Hell:** Use Promises or `async/await` to manage asynchronous code cleanly.
* **[ ] Connection Pooling (Express):**
    * **Use a connection pool library:**  (e.g., `pg-pool`) to reuse database connections and minimize connection overhead.
* **[ ] Middleware Optimization:**
    * **Remove Unnecessary Middleware:**  Each middleware adds overhead.
    * **Efficient Middleware:** Use optimized middleware for tasks like logging and authentication.
* **[ ] Route Optimization:**
    * **Efficient Route Handlers:** Keep route handlers concise and perform only necessary operations.
    * **Route Grouping:** Group routes to reduce duplication and improve maintainability.
* **[ ] Code Optimization:**
    * **Minimize Dependencies:**  Use lightweight libraries.
    *
