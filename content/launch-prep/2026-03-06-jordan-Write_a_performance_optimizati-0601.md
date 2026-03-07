# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-06T06:01:47.224250

## Performance Optimization Checklist: Express + PostgreSQL

This checklist covers performance optimization strategies for a common Express.js application interacting with a PostgreSQL database. It's broken down into categories with varying levels of effort and impact.

**I. Database Optimization (PostgreSQL)**

* **[High Priority] Indexing:**
    * **Analyze Queries:**  Use `EXPLAIN ANALYZE` on slow queries to identify missing or ineffective indexes.
    * **Create Indexes Strategically:**
        * **WHERE Clause Columns:**  Index columns frequently used in `WHERE` clauses.
        * **JOIN Columns:** Index columns used in `JOIN` conditions.
        * **ORDER BY and GROUP BY Columns:** Index columns used for sorting and grouping.
        * **Composite Indexes:** Consider composite indexes for queries that frequently use multiple columns in a `WHERE` clause together.
    * **Avoid Over-Indexing:** Too many indexes can slow down write operations. Regularly review and remove unused indexes.
* **[High Priority] Query Optimization:**
    * **Avoid `SELECT *`:**  Only select the columns you need.
    * **Use `WHERE` Clauses Effectively:** Filter data as early as possible in the query.
    * **Optimize `JOIN`s:** Ensure the `JOIN` columns are indexed.  Consider the `JOIN` order - PostgreSQL can often optimize this automatically, but sometimes forcing a specific order can help.
    * **Avoid `LIKE '%string%'`:**  Leading wildcards in `LIKE` queries prevent index usage. Consider alternative search strategies like full-text search.
    * **Use `EXISTS` instead of `COUNT(*)`:**  `EXISTS` is often faster when you only need to know if a row exists, not the number of rows.
    * **Subqueries vs. Joins:**  Compare the performance of subqueries vs. joins.  PostgreSQL can often optimize them effectively, but performance can vary.
* **[Medium Priority] PostgreSQL Configuration:**
    * **`shared_buffers`:**  Tune this based on your server's memory.  Typically 25-50% of RAM.
    * **`work_mem`:**  Sets the amount of memory used for sort operations.  Increase if you have frequent sorting.
    * **`maintenance_work_mem`:**  Memory used for maintenance tasks like `VACUUM`.
    * **`effective_cache_size`:**  Guides the query planner in estimating available cache.
    * **`wal_buffers`:**  Affects the performance of write operations.
    * **Regularly Run `VACUUM` and `ANALYZE`:**  `VACUUM` removes dead tuples and reclaims space; `ANALYZE` updates statistics used by the query planner.
* **[Low Priority] Partitioning:** If you have very large tables, consider partitioning them based on date ranges or other relevant criteria.


**II. Express.js Application Optimization**

* **[High Priority] Efficient Routing:**
    * **Use Route Parameters:**  When possible, use route parameters instead of query parameters.
    * **Minimize Middleware:** Only include middleware necessary for a route.
    * **Optimize Route Definitions:** Avoid complex or nested route structures.
* **[Medium Priority] Data Serialization/Deserialization:**
    * **Use `JSON.stringify()` and `JSON.parse()` Efficiently:** Minimize unnecessary serialization and deserialization.
    * **Consider Alternatives:** For large data sets, explore other data formats like Protocol Buffers or MessagePack if performance is critical.
* **[Medium Priority] Connection Pooling:**
    * **Implement Connection Pooling:**  Don't establish a new connection for each request. Use a connection pool to reuse existing connections. Libraries like `pg-pool
