# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-06T20:05:20.882311

## Performance Optimization Checklist: Express + PostgreSQL

This checklist covers optimization strategies for a typical Express.js application using a PostgreSQL database. It’s broken down into categories with varying levels of effort and impact.

**I. Database Optimization (PostgreSQL Focus - 70% of Effort)**

* **[High] Indexing:**
    * **Analyze Query Patterns:** Identify slow queries and the columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses.
    * **Create Appropriate Indexes:**  Use `CREATE INDEX` for columns heavily used in queries. Consider different index types:
        * **B-Tree:**  Standard for equality and range queries.
        * **Hash:**  Efficient for equality lookups (less common).
        * **GIN/GIST:** For more complex data types and full-text searches.
    * **Composite Indexes:** Create indexes on multiple columns when queries frequently filter on those columns together.
    * **Index Cardinality:** Ensure indexes have sufficient cardinality (distinct values) to be effective.  Over-indexed columns can actually *slow* queries.
* **[Medium] Query Optimization:**
    * **EXPLAIN Analyze:**  Use `EXPLAIN ANALYZE` on slow queries to understand the execution plan and identify bottlenecks (e.g., full table scans, inefficient joins).
    * **Rewrite Queries:** Optimize query logic - avoid `SELECT *`, use specific columns, simplify `WHERE` clauses, and optimize `JOIN` conditions.
    * **Use `JOIN` Strategies:** Understand different `JOIN` types (INNER, LEFT, RIGHT) and use the most efficient one for your data and query needs.
    * **Subqueries vs. Joins:**  Evaluate if subqueries can be replaced with more efficient `JOIN` operations.
    * **Limit Returned Data:** Use `LIMIT` in queries to retrieve only the necessary data, especially in API responses.
* **[Medium] PostgreSQL Configuration:**
    * **`shared_buffers`:**  Increase if you have sufficient RAM and PostgreSQL is the primary application server.
    * **`work_mem`:** Increase for complex queries that require sorting or hashing.
    * **`effective_cache_size`:**  Accurately estimate available memory for PostgreSQL's cache.
    * **`maintenance_work_mem`:** Increase for maintenance operations like `VACUUM` and `ANALYZE`.
    * **Connection Pooling:**  Configure and use a connection pooler (e.g., PgBouncer, Connection Pooling within your Express app) to reduce the overhead of establishing new connections for each request.
* **[Low] Database Maintenance:**
    * **`VACUUM`:**  Regularly run `VACUUM` to reclaim dead tuples and optimize table space. Consider `VACUUM FULL` (with caution – locks tables).
    * **`ANALYZE`:** Run `ANALYZE` to update PostgreSQL’s statistics used for query planning.  This is crucial for optimal query execution.
    * **Regular Backups:** Implement a robust backup strategy for data recovery.


**II. Express.js Application Optimization (30% of Effort)**

* **[High] Request Handling & Middleware:**
    * **Minimize Middleware:**  Remove unnecessary middleware.  Each middleware adds overhead.
    * **Order Middleware Carefully:** Place performance-critical middleware earlier in the chain.
    * **Asynchronous Operations:** Ensure you’re using `async/await` for all I/O operations (database queries, file reads, etc.) to avoid blocking the event loop.
* **[Medium] Routing & Logic:**
    * **Route Definitions:** Optimize route definitions – avoid overly complex or nested routes.
    * **Controller Logic:**  Keep controller logic concise and efficient
