# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T08:57:25.181196

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas to consider when optimizing the performance of an Express.js application using PostgreSQL. It's broken down into categories and prioritizes actions based on potential impact.

**I. Database Optimization (PostgreSQL Focus - 70% Impact)**

* **[High Priority] Indexing:**
    * **Analyze Queries:** Use `EXPLAIN ANALYZE` on slow queries to identify missing indexes or inefficient query plans.
    * **Index Relevant Columns:** Index columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
    * **Composite Indexes:**  Consider composite indexes for queries that filter on multiple columns together.
    * **Partial Indexes:** Create indexes on a subset of rows based on specific criteria for targeted queries.
    * **Regular Index Maintenance:**  `VACUUM ANALYZE` your tables regularly to keep statistics up-to-date and optimize index performance. (Run weekly or more frequently for high-traffic applications).
* **[High Priority] Query Optimization:**
    * **Use Prepared Statements:** Reduce parsing and compilation overhead by reusing prepared statements.
    * **Avoid `SELECT *`:** Only select the columns you need. `SELECT *` increases data transfer and can hurt performance.
    * **Optimize `JOIN`s:** Ensure proper indexing and use the most efficient join type (e.g., inner join vs. outer join).
    * **Subqueries vs. Joins:**  Evaluate if subqueries can be rewritten as joins, often more performant.
    * **Limit Results:** Use `LIMIT` clauses to retrieve only the required number of rows, especially in API endpoints.
    * **Use `WITH` (Common Table Expressions - CTEs):** Can simplify complex queries and sometimes improve performance.
* **[Medium Priority] Schema Design:**
    * **Data Types:**  Choose the most appropriate and efficient data types for each column. Avoid using `TEXT` for large strings where `VARCHAR` would suffice.
    * **Normalization:** Ensure your schema is properly normalized to reduce data redundancy and improve data integrity.  (Consider denormalization selectively for performance-critical scenarios).
    * **Column Order:**  Consider the order of columns in your tables, especially in `JOIN`s.
* **[Low Priority] PostgreSQL Configuration:**
    * **Tune PostgreSQL Parameters:** Experiment with parameters like `shared_buffers`, `work_mem`, `effective_cache_size`, and `max_connections` based on your hardware and workload. Monitoring is key.
    * **Connection Pooling:** Utilize a connection pooler (e.g., PgBouncer) to reduce connection overhead.
    * **pg_stat_statements:** Enable `pg_stat_statements` to track query performance and identify slow queries.


**II. Express.js & Middleware Optimization (30% Impact)**

* **[High Priority] Route Handlers:**
    * **Minimize Code Execution:** Keep route handlers concise and perform as much logic as possible within the database.
    * **Caching:** Implement caching (e.g., Redis, Memcached) for frequently accessed data to reduce database load. Consider different caching strategies (TTL, invalidation).
    * **Asynchronous Operations:** Use `async/await` or Promises to handle asynchronous database operations without blocking the event loop.
* **[Medium Priority] Middleware:**
    * **Optimize Middleware:**  Minimize the number of middleware and optimize their performance.
    * **Logging:**  Use a logging library efficiently; avoid excessive logging in production.
* **[Low Priority] Express.js Configuration:**
    * **Process Manager:** Utilize a process manager (e.g., PM2) to ensure consistent uptime and automatically restart your application.
    *
