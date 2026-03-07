# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T13:51:46.861706

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas to consider when optimizing your Express application running against a PostgreSQL database. It's broken down into categories with actionable steps and considerations.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:**
    * **Identify Slow Queries:** Use PostgreSQL's `pg_stat_statements` extension to identify slow-running queries. Analyze the `query` column and the `calls` column to pinpoint problem areas.
    * **Index Relevant Columns:** Add indexes to columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
    * **Composite Indexes:** Create composite indexes for queries with multiple frequently-filtered columns. Consider the order of columns in composite indexes.
    * **Partial Indexes:**  If a query frequently filters on a subset of data, create a partial index on that subset.
    * **Index Types:** Choose the right index type (B-tree, Hash, GiST, GIN) based on your query patterns and data types.  B-tree is generally the best starting point.
    * **Avoid Over-Indexing:** Too many indexes can slow down writes and increase storage.
* **[ ] Query Optimization:**
    * **EXPLAIN:** Use `EXPLAIN` or `EXPLAIN ANALYZE` to understand how PostgreSQL is executing your queries. Look for full table scans, inefficient joins, or missing indexes.
    * **Rewrite Queries:**  Optimize queries for performance.  
        * **Avoid `SELECT *`:**  Only select the columns you need.
        * **Use `JOIN` instead of Subqueries (if appropriate):** Sometimes `JOIN`s are more efficient.
        * **Rewrite Complex `WHERE` Clauses:** Simplify complex conditions.
        * **Optimize `LIKE` Clauses:**  Leading wildcards in `LIKE` clauses significantly degrade performance.  Consider full-text search or alternative approaches if possible.
    * **Parameterized Queries:** Always use parameterized queries to prevent SQL injection and improve query performance by allowing PostgreSQL to cache query plans.
* **[ ] Database Configuration:**
    * **`shared_buffers`:**  Increase this value to allow PostgreSQL to cache more data in memory (typically 25-50% of RAM).
    * **`work_mem`:**  Increase this value for operations that use temporary tables (e.g., sorting, grouping).
    * **`maintenance_work_mem`:** Increase this value for maintenance operations like `VACUUM` and `ANALYZE`.
    * **`effective_cache_size`:**  Estimate the size of your PostgreSQL cache.
    * **Connection Pooling:** Use a connection pooler (pgbouncer, connection pooler) to reduce the overhead of establishing new database connections for each request.
* **[ ] Database Maintenance:**
    * **`VACUUM`:** Regularly run `VACUUM` to reclaim dead tuples and improve query performance.
    * **`ANALYZE`:** Run `ANALYZE` to update PostgreSQL's statistics about the data, which helps the query planner make better decisions.
    * **`REINDEX`:**  Periodically reindex frequently used indexes.

**II. Express Application Optimization**

* **[ ] Minimize Database Queries:**
    * **Caching:** Implement caching at various levels:
        * **Client-Side Caching:**  Use browser caching for static assets and frequently accessed data.
        * **Middleware Caching:** Use Express middleware to cache responses based on query parameters or data.
        * **Redis/Memcached:** Use a dedicated caching server like Redis or Memcached for frequently accessed data.
    * **Data Aggregation:**  Aggregate data in the database instead of fetching individual records and aggregating in
