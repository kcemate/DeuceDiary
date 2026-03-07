# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T06:42:39.743534

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas to investigate and optimize when dealing with an Express.js application interacting with a PostgreSQL database. It's broken down into categories with prioritized recommendations.

**I. General Application & Architecture:**

* [ ] **Minimize Request Size:** Reduce the amount of data transferred between the client and server. Utilize techniques like:
    * **Field Selection:** Only retrieve necessary fields (e.g., `SELECT id, username, email FROM users`).
    * **Pagination:** Implement pagination for large datasets to limit the number of records returned per page.
    * **Compression:** Consider gzip compression for responses.
* [ ] **Connection Pooling:**  Crucial for both Express and PostgreSQL.  Use a robust connection pooler (e.g., `pg-pool` for Express, `pgpool` for PostgreSQL) to reuse connections and avoid the overhead of establishing new connections for each request.
* [ ] **Middleware Optimization:**  Review and optimize your Express middleware.
    * **Remove Unnecessary Middleware:**  Eliminate middleware that isn't actively used.
    * **Order Matters:**  Ensure middleware is ordered effectively, prioritizing faster-executing ones.
* [ ] **Caching (Client-Side & Server-Side):**
    * **Client-Side Caching:** Implement browser caching for static assets and potentially cached data.
    * **Server-Side Caching:** Consider Redis or Memcached for caching frequently accessed data or computationally expensive results.
* [ ] **Stateless Design:**  Favor a stateless design whenever possible, reducing reliance on server-side sessions.

**II. PostgreSQL Database Optimization:**

* **[Priority: High] Indexing:**
    * **Identify Slow Queries:** Use PostgreSQL's logging and query profiling tools (e.g., `auto_explain`) to identify slow queries.
    * **Index Relevant Columns:**  Add indexes to columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
    * **Composite Indexes:** Utilize composite indexes for queries involving multiple columns frequently used together.
    * **Index Types:** Choose appropriate index types (B-tree, Hash, GIN, GiST) based on your data and query patterns. B-tree is the default and generally suitable.
* **[Priority: High] Query Optimization:**
    * **EXPLAIN ANALYZE:** Use `EXPLAIN ANALYZE` to understand how PostgreSQL executes your queries and identify bottlenecks.
    * **Rewrite Slow Queries:**  Optimize query structure for efficiency.
        * **Avoid `SELECT *`:**  Specify only the necessary columns.
        * **Use `JOIN` Wisely:** Use `INNER JOIN` when appropriate, and ensure proper join order.
        * **Avoid `LIKE '%string%'`:**  Leading wildcard searches are generally slow. Consider full-text search if applicable.
        * **Use `LIMIT` and `OFFSET`:**  Efficiently implement pagination.
        * **Subqueries:**  Carefully review subqueries - they can often be rewritten as joins for performance improvements.
* **[Priority: Medium] Database Configuration:**
    * **`shared_buffers`:** Increase the `shared_buffers` setting in PostgreSQL to allow more data to be cached in memory.
    * **`work_mem`:** Increase the `work_mem` setting for operations like sorting and hashing.
    * **`effective_cache_size`:**  Provide an accurate estimate of your server's available cache size.
    * **`maintenance_work_mem`:** Increase this for operations like `VACUUM` and `CREATE INDEX`.
    * **Regular Vacuuming:** Run `VACUUM ANALYZE` regularly to reclaim dead tuples and update statistics.
*
