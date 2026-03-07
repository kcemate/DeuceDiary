# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T17:38:05.996359

## Performance Optimization Checklist: Express + PostgreSQL

This checklist focuses on optimizing your Express.js application running against a PostgreSQL database. It’s broken down into categories with suggested actions and considerations.

**I. Application Level (Express & Middleware)**

* [ ] **Code Reviews:** Regularly review code for inefficiencies, unnecessary computations, and proper error handling.
* [ ] **Minimize Middleware:** Only use essential middleware. Each middleware adds overhead.
* [ ] **Efficient Route Handlers:**  Keep route handlers lean and focused. Avoid complex logic within routes.
* [ ] **Caching:**
    * [ ] **HTTP Caching:** Implement `Cache-Control` headers to leverage browser caching for static assets and potentially frequently accessed responses.
    * [ ] **Server-Side Caching (Redis/Memcached):** Cache frequently accessed data in a faster in-memory store like Redis or Memcached.
    * [ ] **In-Memory Caching (Node.js):** For smaller datasets, consider in-memory caching within your Express app.
* [ ] **Session Management:**
    * [ ] **Choose the Right Session Storage:**  Avoid using the file-based session storage for high-traffic applications.  Redis or MongoDB are better choices.
    * [ ] **Optimize Session Size:**  Minimize the data stored in sessions.
* [ ] **Asynchronous Operations:** Always use `async/await` or Promises for asynchronous operations to avoid blocking the event loop.
* [ ] **Error Handling:** Implement robust error handling and logging. Unhandled errors can lead to performance bottlenecks.
* [ ] **Keep Dependencies Updated:**  Regularly update your Express, PostgreSQL, and other dependencies to benefit from performance improvements and security patches.
* [ ] **Profiling Tools:** Utilize Node.js profiling tools (like `node --inspect`) to identify performance bottlenecks in your code.


**II. Database Optimization (PostgreSQL)**

* **A. Query Optimization:** (This is *the* most important area!)
    * [ ] **Slow Query Log:** Enable the PostgreSQL slow query log to identify queries that are taking a long time to execute.
    * [ ] **`EXPLAIN ANALYZE`:**  Use `EXPLAIN ANALYZE` on slow queries to understand the query execution plan and identify areas for improvement. This will show you *where* the bottlenecks are.
    * [ ] **Index Optimization:**
        * [ ] **Analyze Existing Indexes:**  Run `ANALYZE` regularly to update PostgreSQL's statistics about your tables, which are used to optimize query plans.
        * [ ] **Identify Missing Indexes:**  Based on query execution plans and slow queries, add indexes to columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses.
        * [ ] **Composite Indexes:** Use composite indexes (multiple columns) when queries frequently use multiple columns in their `WHERE` clauses.  Order matters - put the most selective columns first.
        * [ ] **Avoid Over-Indexing:** Too many indexes can slow down write operations. Regularly review and drop unused indexes.
    * [ ] **Rewrite Queries:**
        * [ ] **Avoid `SELECT *`:** Only select the columns you actually need.
        * [ ] **Optimize `JOIN`s:** Use the most efficient `JOIN` type for your data (e.g., `INNER JOIN`, `LEFT JOIN`).  Ensure columns used in `JOIN` conditions have proper indexes.
        * [ ] **Use `WHERE` Clauses Effectively:** Filter data as early as possible in the query.
        * [ ] **Avoid `LIKE '%...'`:** Leading wildcards in `LIKE` clauses prevent index usage. Consider alternative search methods if possible.
        * [ ] **Subqueries vs. Joins:**  Sometimes, rewriting subqueries as joins can
