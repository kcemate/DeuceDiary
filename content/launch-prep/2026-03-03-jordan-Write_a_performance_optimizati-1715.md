# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T17:15:22.281869

## Performance Optimization Checklist: Express + PostgreSQL

This checklist provides a comprehensive guide to optimizing your Express app with a PostgreSQL database. It's broken down into categories and prioritizes key areas.

**I. Database Optimization (PostgreSQL)**

* **[ ] Indexing:** This is arguably the *most* important step.
    * **Analyze Queries:** Use `EXPLAIN ANALYZE` on slow queries to identify missing or ineffective indexes.
    * **Index Strategically:**  Index columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses. 
    * **Composite Indexes:** Consider composite indexes for multi-column searches.
    * **Partial Indexes:**  If you frequently query a specific subset of data based on a column, a partial index can be very efficient.
    * **Regular Index Maintenance:**  Run `VACUUM ANALYZE` regularly to keep statistics up-to-date and reclaim space. (Consider automated scheduled jobs)
* **[ ] Query Optimization:**
    * **Avoid `SELECT *`:**  Only retrieve the columns you need.
    * **Use `JOIN` Wisely:**  Understand the different `JOIN` types and choose the most appropriate one.
    * **Rewrite Complex Queries:**  Break down complex queries into smaller, more manageable queries.  Consider temporary tables if necessary.
    * **Use Prepared Statements:**  Minimize parsing overhead by using prepared statements for frequently executed queries.
    * **Optimize `ORDER BY` and `LIMIT`:**  Ensure indexes are used for sorting and filtering.  Use `LIMIT` to reduce the amount of data returned.
    * **Subqueries:** Use `EXISTS` or `IN` instead of correlated subqueries where possible.
* **[ ] Database Configuration:**
    * **`shared_buffers`:**  Adjust this based on your RAM and workload. (Typically 25-40% of RAM)
    * **`work_mem`:**  Increase this for operations like sorting and hashing if memory is available.
    * **`effective_cache_size`:**  Provide PostgreSQL with a realistic estimate of available RAM for caching.
    * **Connection Pooling:** Use a connection pooler (e.g., PgBouncer, connection poolers built into your ORM) to reduce connection overhead.
    * **Hardware:** Ensure adequate CPU, RAM, and SSD storage.
* **[ ] Data Types:**  Choose the most appropriate data types for your columns to minimize storage and improve performance.



**II. Express.js Application Optimization**

* **[ ] Asynchronous Operations:**
    * **`async/await`:** Utilize `async/await` for cleaner and more readable asynchronous code.
    * **Non-Blocking I/O:**  Ensure all database operations are performed asynchronously to avoid blocking the event loop.
* **[ ] Connection Pooling (Express):**
    * **`pg-pool` or similar:** Use a dedicated connection pooler like `pg-pool` to manage database connections efficiently.  Avoid creating new connections for every request.
* **[ ] Middleware Optimization:**
    * **Minimal Middleware:**  Remove any unnecessary middleware.
    * **Caching Middleware:**  Use caching middleware (e.g., `express-cache-control`) for static content or frequently accessed data.
* **[ ] Request Parsing:**
    * **`body-parser` (Deprecated, Use `express.json()` and `express.urlencoded()`):**  Express’s built-in `express.json()` and `express.urlencoded()` middleware are the recommended way to parse request bodies.
* **[ ] Templating Engine (if applicable):**  Use a lightweight templating engine and optimize your templates.  Avoid excessive template rendering.
* **[ ] Code Optimization:**
