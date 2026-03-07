# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T11:12:56.111827

## Performance Optimization Checklist: Express + PostgreSQL

This checklist covers optimization strategies for Express.js applications interacting with a PostgreSQL database. It's broken down into categories for easier navigation.

**I. Express.js Application Level Optimization**

* **[ ] Minimize Middleware Usage:** Each middleware adds overhead.  Carefully evaluate and remove unnecessary middleware.
* **[ ] Efficient Routing:**
    * **[ ] Route Definitions:** Utilize precise route patterns (e.g., `/:id` vs `/:userId`) to reduce overhead.
    * **[ ] Avoid Nested Routes:** Complex nested routes can impact performance. Consider flattening where possible.
    * **[ ] Route Grouping:** Utilize route grouping for efficient common operations.
* **[ ] Use `async/await` Effectively:** Ensure you’re truly awaiting promises and not just using `then()` chains. `async/await` generally improves readability and can allow for better resource management.
* **[ ] Code Splitting (for larger apps):**  Break up your code into smaller chunks that are loaded on demand. This can significantly reduce initial load times. Tools like Webpack or Parcel can help.
* **[ ] Connection Pooling (Express):**  Establish a connection pool for your PostgreSQL connection.  Express's built-in pooling can be sufficient, but consider more robust solutions like `pg-pool` if you're experiencing connection issues.
* **[ ] Caching:**
    * **[ ] HTTP Caching:** Implement appropriate HTTP caching headers (e.g., `Cache-Control`, `ETag`) to leverage browser caching.
    * **[ ] Server-Side Caching:** Utilize in-memory caching (e.g., Redis, Memcached) for frequently accessed data.
* **[ ] Logging Optimization:**  Don't log everything in production.  Focus on essential error and debugging logs. Use asynchronous logging libraries.
* **[ ] Use a Static File Server:**  Serve static assets (images, CSS, JS) through a dedicated static file server (e.g., Express's `express.static` middleware) to avoid parsing them.

**II. PostgreSQL Database Optimization**

* **[ ] Indexing:** This is *crucial*.
    * **[ ] Analyze Queries:** Use `EXPLAIN ANALYZE` to identify slow queries and understand how PostgreSQL is executing them.
    * **[ ] Index Columns Frequently Used in WHERE Clauses:**  Especially for equality comparisons (`=`), range queries (`>`, `<`, `BETWEEN`), and `LIKE` clauses (with leading wildcards).
    * **[ ] Index Columns Frequently Used in JOINs:** Index columns used in `JOIN` conditions.
    * **[ ] Composite Indexes:** Create composite indexes for queries that filter on multiple columns.
    * **[ ] Avoid Over-Indexing:** Too many indexes can slow down write operations.
* **[ ] Query Optimization:**
    * **[ ] Use `SELECT` only the Columns You Need:** Avoid `SELECT *`.
    * **[ ] Optimize `JOIN` Order:** PostgreSQL can sometimes optimize joins, but try to order them logically, starting with the smallest tables.
    * **[ ] Avoid `LIKE '%string%'`:** This is notoriously slow.  If possible, use `LIKE 'string%'` (prefix matching) or consider full-text search.
    * **[ ] Use `LIMIT` and `OFFSET` Carefully:**  Large `OFFSET` values can cause performance issues.  Consider alternative pagination strategies (e.g., keyset pagination).
    * **[ ] Use `WITH` Clause (Common Table Expressions - CTEs):**  Can sometimes improve query readability and performance, but always test.
    * **[ ]  Rewrite Complex Queries:** Break down complex queries into smaller, more manageable queries if possible.
