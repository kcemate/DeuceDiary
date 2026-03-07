# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T04:12:10.362496

## Performance Optimization Checklist: Express + PostgreSQL

This checklist focuses on optimizing your Express application's performance in conjunction with your PostgreSQL database. It's broken down into categories for clarity and prioritizes the most impactful changes first.

**I. Express Application Optimization:**

* **[ ] Code Profiling & Bottleneck Identification:**
    * **Tools:**  Use tools like `console.time()`/`console.timeEnd()`, `perf_hooks` (Node.js built-in), or external profiling tools like `clinic.js` to identify performance bottlenecks in your Express routes and middleware.
    * **Focus:** Pay attention to:
        * Route execution time
        * Database query execution time
        * Memory usage
        * Synchronous vs. Asynchronous Operations
* **[ ] Async/Await Correct Usage:** Ensure you're using `async/await` correctly for asynchronous operations to avoid blocking the event loop.  Don’t `await` synchronous functions.
* **[ ] Minimize Middleware:**  Only include necessary middleware. Each piece adds overhead.  Carefully evaluate the purpose and complexity of each.
* **[ ] Efficient Route Handling:**
    * **Route Grouping:** Use Express Router groups to consolidate similar routes and avoid overhead.
    * **Route Ordering:**  Place the most frequently accessed routes first in your route definitions.
* **[ ] Connection Pooling:**  Express generally handles connection pooling automatically with PostgreSQL libraries.  Verify this is configured correctly.
* **[ ] Static File Serving:** Utilize a dedicated static file server (e.g., `express.static`) for serving static assets like images, CSS, and JavaScript. Don't serve them through your Express routes.
* **[ ] Keep Node.js Version Up-to-Date:** Newer Node.js versions often include performance improvements and bug fixes.
* **[ ]  Caching:**  Implement caching for frequently accessed data, both on the Express side (e.g., using Redis or Memcached) and potentially within PostgreSQL (e.g., materialized views).


**II. PostgreSQL Database Optimization:**

* **[ ] Indexing:**  *This is the MOST important factor.*
    * **Identify Slow Queries:** Use PostgreSQL's logging and query analysis tools to pinpoint queries that are running slowly.
    * **Index Relevant Columns:** Add indexes to columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses.
    * **Composite Indexes:** Create composite indexes on multiple columns when queries frequently filter on those combinations.
    * **Partial Indexes:**  If you frequently query based on a subset of values in a column, consider a partial index.
    * **Index Types:** Choose the appropriate index type (B-tree, GiST, GIN, etc.) based on your data and query patterns.
* **[ ] Query Optimization:**
    * **`EXPLAIN ANALYZE`:** Use this command to understand how PostgreSQL executes your queries and identify potential bottlenecks.
    * **Rewrite Slow Queries:**  Refactor queries to use more efficient joins, avoid full table scans, and leverage indexes.
    * **Avoid `SELECT *`:**  Only select the columns you need to minimize data transfer.
    * **Use `LIMIT` & `OFFSET` Carefully:**  `LIMIT` is essential, but using `OFFSET` with large values can be very slow. Consider using keyset pagination instead.
    * **Properly Written SQL:** Ensure your SQL queries are written correctly and don't contain syntax errors or performance issues.
* **[ ] Database Configuration:**
    * **`shared_buffers`:** Increase the `shared_buffers` setting to allow PostgreSQL to cache more data in RAM.  Typically 25-50% of system RAM.
    * **`work_mem`:**  Increase
