# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-07T00:02:38.686487

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas to focus on when optimizing your Express.js application running against a PostgreSQL database. It’s broken down into categories with actionable steps.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use PostgreSQL's `pg_stat_statements` extension to pinpoint the slowest queries.
    * **Analyze Data Types:** Ensure your column data types are optimal for the queries being run.
    * **Create Appropriate Indexes:**  Index columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses.  Consider:
        * **B-Tree Indexes:** Standard indexes for equality and range queries.
        * **GIN Indexes:** For full-text search and arrays.
        * **GiST Indexes:**  For complex data types like geometric data.
        * **BRIN Indexes:**  For large tables with naturally correlated data (e.g., timestamps).
    * **Avoid Over-Indexing:** Too many indexes can slow down writes. Regularly review and remove unused indexes.
* **[ ] Query Optimization:**
    * **Use `EXPLAIN`:**  Always analyze query execution plans using `EXPLAIN` to identify bottlenecks (e.g., full table scans, inefficient joins).
    * **Rewrite Slow Queries:** Refactor complex queries for efficiency. Consider:
        * **Avoid `SELECT *`:** Only select the necessary columns.
        * **Use `JOIN`s Efficiently:** Understand different join types and choose the most appropriate one.
        * **Filter Early:**  Apply `WHERE` clauses as early as possible in the query.
        * **Optimize `LIKE` clauses:**  Using leading wildcards (`%`) in `LIKE` clauses is generally very slow. Consider alternatives if possible.
        * **Use `WITH` clauses (Common Table Expressions - CTEs):**  For complex, repeated queries.
    * **Use Prepared Statements:**  Prepared statements can significantly improve performance for frequently executed queries by caching the execution plan.
* **[ ] Database Configuration:**
    * **`shared_buffers`:**  Adjust this based on your system's memory and workload.  Generally, 25-50% of RAM is a good starting point.
    * **`work_mem`:**  Controls the amount of memory used by internal sort operations. Increase if you see many "temporary files" in `EXPLAIN` output.
    * **`maintenance_work_mem`:**  Controls the memory used for maintenance operations (e.g., `VACUUM`).
    * **`effective_cache_size`:**  Estimate the amount of memory available to PostgreSQL for caching data.
    * **`wal_buffers`:**  Adjust this based on the size of your transactions.
    * **`random_page_cost`:**  Adjust to reflect the actual cost of accessing random pages in your disk.
    * **Regular Maintenance:**  Run `VACUUM ANALYZE` regularly to optimize table statistics and reclaim dead tuples.
* **[ ] Connection Pooling:**  Use a connection pooler (e.g., `pgb`, `node-postgres`) to avoid the overhead of establishing new connections for each request.


**II. Express.js Application Optimization**

* **[ ] Request Handling:**
    * **Minimize Middleware:**  Reduce the number of middleware layers to avoid performance overhead.
    * **Optimize Routing:**  Use efficient route handlers. Avoid complex route logic.
    * **Asynchronous Operations:**  Utilize `async/await` for asynchronous operations to prevent blocking the event loop.
* **[ ] Data Serialization/Deserialization:**
    * **Choose Efficient Serialization Libraries:** Use libraries like `JSON.
