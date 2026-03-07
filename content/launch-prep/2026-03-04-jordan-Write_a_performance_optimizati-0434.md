# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T04:34:53.144208

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas to consider when optimizing the performance of your Express.js application running against a PostgreSQL database. It's broken down into categories with suggested actions and tools to use.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use PostgreSQL's `pg_stat_statements` extension to identify frequently executed, slow queries.
    * **Index Key Columns:** Add indexes to columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses. Prioritize columns used in equality comparisons (`=`).
    * **Composite Indexes:** Create composite indexes for queries with multiple columns in `WHERE` clauses.
    * **Partial Indexes:**  Consider partial indexes for queries that filter on a specific subset of data.
    * **Index Types:**  Choose the appropriate index type (B-tree, GiST, GIN, BRIN) based on your query patterns.  B-tree is generally good for most cases.
    * **Review Existing Indexes:** Regularly review existing indexes – are they still being used and effective? Remove unused indexes to reduce maintenance overhead.
* **[ ] Query Optimization:**
    * **Analyze Queries:** Use `EXPLAIN ANALYZE` to understand query execution plans and identify bottlenecks (e.g., full table scans).
    * **Rewrite Slow Queries:** Refactor complex queries for better performance. Consider breaking down large queries into smaller, more manageable chunks.
    * **Use `JOIN` Carefully:** Optimize `JOIN` operations. Understand the join types and ensure you’re using the most efficient one.
    * **Avoid `SELECT *`:**  Only select the columns you need. This reduces data transfer and memory usage.
    * **Use `LIMIT`:**  When appropriate, use `LIMIT` to restrict the number of rows returned.
    * **Use `WHERE` Clauses Effectively:** Filter data as early as possible in the query.
    * **Utilize PostgreSQL Features:** Leverage PostgreSQL’s specific features:
        * **Materialized Views:** For frequently accessed, complex aggregations.
        * **Window Functions:** For analytical queries.
        * **Common Table Expressions (CTEs):**  For complex queries, can improve readability and sometimes performance.
* **[ ] Database Configuration:**
    * **`shared_buffers`:** Increase the `shared_buffers` setting to allow PostgreSQL to cache more data in memory. (Typically 25-50% of system RAM)
    * **`work_mem`:**  Increase `work_mem` to allow PostgreSQL to perform sorting and hashing operations in memory. (Start with a reasonable value based on your workload)
    * **`effective_cache_size`:**  Configure this to accurately represent the amount of memory available to the database for caching.
    * **Connection Pooling:**  Use a connection pooling solution (e.g., PgPool-II) to reduce the overhead of establishing new connections.
    * **Vacuuming & Analyze:**  Regularly run `VACUUM` to reclaim dead tuples and `ANALYZE` to update statistics used by the query planner.  Consider autovacuum settings.


**II. Express.js Optimization**

* **[ ] Middleware Usage:**
    * **Minimize Middleware:** Use only essential middleware.
    * **Order of Middleware Matters:** Arrange middleware in the correct order for optimal performance.  Consider placing logging and error handling middleware last.
* **[ ] Route Handling:**
    * **Route Efficiency:** Keep routes concise and focused.
    * **Route Parameters:** Optimize route parameter handling.
    * **Route Validation:** Implement validation efficiently (consider middleware for this).
* **[ ] Request Handling:**
    * **Asynchronous
