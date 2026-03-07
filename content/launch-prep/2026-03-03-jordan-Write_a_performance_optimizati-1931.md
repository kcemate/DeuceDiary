# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T19:31:20.304166

## Performance Optimization Checklist: Express + PostgreSQL

This checklist focuses on optimizing performance for a typical Express.js application using PostgreSQL. It's broken down into categories and prioritized for impact.

**I. Database Optimization (PostgreSQL)**

**High Priority (Impact: Huge)**

* **Indexing:**
    * **Analyze Table Usage:** Identify frequently queried columns and create indexes on them. Use `EXPLAIN ANALYZE` to understand query plans and identify missing indexes.
    * **Composite Indexes:**  Consider composite indexes for queries that filter on multiple columns frequently.
    * **Partial Indexes:**  Use partial indexes for queries that filter on a specific subset of data based on a column's value.
    * **Index Types:** Choose the appropriate index type (B-tree, GiST, GIN, BRIN) based on your data and query patterns.
* **Query Optimization:**
    * **`EXPLAIN ANALYZE` Regularly:** Use this command on all critical queries to understand their execution plans and identify bottlenecks.
    * **Avoid `SELECT *`:**  Only retrieve the columns you actually need. Reduces data transfer and memory usage.
    * **Use `WHERE` Clauses Effectively:** Filter data as early as possible in the query.
    * **Optimize JOINs:**
        * **Ensure Foreign Keys are Indexed:** PostgreSQL automatically uses foreign keys for JOINs, but verify they're indexed.
        * **Use Appropriate JOIN Types:**  Understand the differences between `INNER JOIN`, `LEFT JOIN`, etc., and choose the most efficient one for your needs.
        * **Minimize JOINs:**  If possible, restructure your schema to reduce the need for JOINs.
    * **Use Specific Indexes:** Ensure queries are utilizing your indexes correctly.
    * **Write Efficient SQL:**  Avoid complex subqueries, functions in `WHERE` clauses (they can hinder index usage), and unnecessary calculations.
* **Database Configuration:**
    * **`shared_buffers`:**  Increase this value (typically 25-50% of system RAM) to allow PostgreSQL to cache data.
    * **`work_mem`:**  Increase this value to allow PostgreSQL to buffer data during sorts and operations.
    * **`effective_cache_size`:**  Let PostgreSQL know how much memory is available for caching data.
    * **`maintenance_work_mem`:**  Increase this value for maintenance tasks like `VACUUM` and `ANALYZE`.
    * **Regular `VACUUM` and `ANALYZE`:**  `VACUUM` reclaims dead tuples, and `ANALYZE` updates statistics used by the query planner.
* **Data Types:**  Use the most appropriate data types for your columns to minimize storage and improve performance.

**Medium Priority (Impact: Moderate)**

* **Connection Pooling:**  Use a connection pooler like `pg-pool` or `node-postgres`'s built-in pooling. Reduces the overhead of establishing new connections.
* **Data Partitioning:** Consider partitioning large tables based on ranges or categories for faster queries.
* **Database Server Hardware:** Ensure your PostgreSQL server has sufficient CPU, RAM, and disk I/O.  SSD storage is highly recommended.
* **Read Replicas:**  Offload read traffic to read replicas to reduce load on the primary database.



**II. Express.js Optimization**

**High Priority (Impact: Significant)**

* **Middleware Selection:**  Use only the necessary middleware.  Avoid putting heavy middleware (like logging or authentication) before critical routes.
* **Route Handling:**
    * **Use `async/await`:** This improves code readability and allows for efficient asynchronous operation without callback hell.
    * **Minimize Route Logic:** Keep route handlers concise and focused.
