# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T07:36:14.413108

## Performance Optimization Checklist for Express + PostgreSQL

This checklist outlines strategies for optimizing the performance of your Express.js application utilizing a PostgreSQL database. It's broken down into categories for easier organization.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use PostgreSQL's `pg_stat_statements` extension to pinpoint the queries with the highest execution times.
    * **Create Indexes:** Based on identified query patterns (WHERE clauses, JOIN conditions, ORDER BY), create appropriate indexes on relevant columns.  Consider:
        * **B-Tree Indexes:** Standard indexes for most use cases.
        * **GIN/GIST Indexes:**  For full-text search, geospatial data, or complex data types.
        * **BRIN Indexes:** For large tables with naturally correlated data (e.g., time-series data).
    * **Avoid Over-Indexing:** Too many indexes can slow down write operations. Regularly review and remove unused indexes.
* **[ ] Query Optimization:**
    * **Analyze Queries:** Use `EXPLAIN ANALYZE` to understand how PostgreSQL is executing your queries. Look for:
        * **Sequential Scans:** These are slow for large tables.  Indexing is often the solution.
        * **Nested Loops:** These can be inefficient for large tables. Consider using JOINs.
        * **Using Temporary Tables:**  Can be slow. Try to optimize the query or use materialization strategies.
    * **Rewrite Slow Queries:** Optimize query structure - can you simplify joins, use subqueries instead of CTEs (sometimes)?
    * **Use Prepared Statements:** Reduce query parsing overhead.
    * **Limit Result Sets:** Only retrieve the data you actually need.  Use `LIMIT` and `OFFSET` appropriately.
    * **Use `WHERE` Clauses Effectively:**  Filter data as early as possible in the query.
    * **Avoid `SELECT *`:**  Retrieve only the necessary columns.
* **[ ] PostgreSQL Configuration:**
    * **`shared_buffers`:**  Adjust based on available RAM - typically 25-50%.
    * **`work_mem`:**  Increase for complex queries that require sorting or hashing.
    * **`effective_cache_size`:**  Helps the query planner estimate available memory.
    * **`maintenance_work_mem`:** Increase for maintenance tasks like `VACUUM` and `ANALYZE`.
    * **`autovacuum`:**  Ensure autovacuum is enabled and properly configured to prevent table bloat.
* **[ ] Database Schema Design:**
    * **Normalization:**  Follow normalization principles to reduce data redundancy, but consider denormalization strategically for read-heavy scenarios.
    * **Data Types:** Choose the appropriate data types for each column to optimize storage and performance.
    * **Partitioning:** For very large tables, consider partitioning by range, list, or hash to improve query performance.


**II. Express.js Optimization**

* **[ ] Middleware:**
    * **Remove Unnecessary Middleware:**  Each middleware adds overhead.  Only use what's truly needed.
    * **Optimize Middleware Performance:**  Ensure your middleware functions are efficient. Avoid complex logic within middleware.
* **[ ] Request Handling:**
    * **Asynchronous Operations:**  Use `async/await` or Promises to handle asynchronous operations (database calls, file system operations) efficiently.  Avoid callback hell.
    * **Connection Pooling:**  Use a connection pooler like `pg-pool` to efficiently manage database connections.  Avoid creating a new connection for each request.
    * **Response Compression:**  Enable gzip compression for text-based responses (JSON, HTML) to reduce bandwidth usage.
    *
