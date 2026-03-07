# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T16:52:52.655177

## Performance Optimization Checklist: Express + PostgreSQL

This checklist covers key areas for optimizing the performance of an Express.js application running against a PostgreSQL database. It's broken down into categories and prioritized roughly by impact.

**I. Database Optimization (PostgreSQL Focus)**

* **[High Priority] Indexing:**
    * **Analyze Queries:** Use `EXPLAIN ANALYZE` to understand how your queries are executed and identify missing indexes.
    * **Index Key Columns:** Index columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
    * **Composite Indexes:** Consider composite indexes for queries that filter on multiple columns simultaneously.
    * **Partial Indexes:** If you frequently filter on a specific subset of a table, a partial index can significantly improve performance.
    * **Index Types:** Choose the appropriate index type (B-tree, Hash, GiST, GIN) based on your data and query patterns. B-trees are generally a good starting point.
* **[High Priority] Query Optimization:**
    * **Write Efficient SQL:**  Avoid `SELECT *`.  Only select the columns you need.
    * **Use `JOIN`s Correctly:** Understand the types of `JOIN`s and use the most efficient one for your data relationships. (e.g.,  `INNER JOIN` vs. `LEFT JOIN`)
    * **Avoid `LIKE '%...%'`:** Leading wildcards in `LIKE` queries are extremely slow. Consider full-text search solutions if you need flexible pattern matching.
    * **Use `LIMIT` and `OFFSET` Effectively:**  Especially when paging through large datasets.
    * **Optimize `WHERE` Clauses:**  Filter as early as possible in the query.
    * **Use `EXISTS` instead of `COUNT(*)`:** When checking for the existence of data, `EXISTS` is often faster.
* **[Medium Priority] Database Configuration:**
    * **`shared_buffers`:**  Adjust based on available RAM - usually 25-50% of system RAM.
    * **`work_mem`:** Increase if you see a lot of spills to disk during sorting or aggregation.
    * **`maintenance_work_mem`:**  Increase for maintenance operations (like `VACUUM` and `ANALYZE`).
    * **`effective_cache_size`:**  Let PostgreSQL know how much RAM is available for caching.
    * **`autovacuum`:**  Ensure autovacuum is enabled and properly configured to prevent table bloat.
    * **Connection Pooling:** Utilize a robust connection pooler like pgpool-II or a library that handles connection pooling within Express (e.g., `pg-pool`).
* **[Low Priority] Data Types:**
    * **Choose Appropriate Data Types:**  Using `TEXT` for everything is often inefficient. Use smaller data types like `VARCHAR` or `INTEGER` where possible.

**II. Express.js Application Optimization**

* **[High Priority] Minimize Database Calls:**
    * **Caching:** Implement caching at various levels:
        * **In-Memory Cache:** Use a library like `node-cache` or `lru-cache` for frequently accessed data.
        * **Redis/Memcached:** Use a dedicated caching server for scalability.
    * **Batch Operations:**  Combine multiple database operations into a single transaction or batch insert/update.
    * **Reduce Round Trips:**  Optimize your API endpoints to minimize the number of database requests.
* **[Medium Priority] Express.js Configuration:**
    * **Use a Production-Ready Logger:**  Avoid excessive logging in production. Use a robust logging library.
    * **Static File Serving:** Serve static assets (images, CSS
