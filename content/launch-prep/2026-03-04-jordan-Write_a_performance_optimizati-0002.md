# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-04T00:02:55.497155

## Performance Optimization Checklist for Express + PostgreSQL

This checklist outlines key areas to investigate and optimize for a robust and performant Express application utilizing a PostgreSQL database.  It's categorized for easier navigation and prioritization.

**I. Express Application Optimization (Frontend & Middleware)**

* **[ ] Code Splitting:** Reduce initial load by splitting your JavaScript bundle into smaller chunks based on route or feature. Tools like Webpack or Parcel can automate this.
* **[ ] Lazy Loading:**  Load non-critical resources (images, plugins) only when needed.
* **[ ] Minimize HTTP Requests:** Combine CSS and JavaScript files, use sprites for images, and utilize efficient assets.
* **[ ] Efficient Route Handling:**
    * **[ ]  Minimize Middleware Usage:** Only use middleware that's absolutely necessary.
    * **[ ]  Route Grouping:** Use `router.group` for complex route structures to share middleware and logic.
    * **[ ]  Avoid `use` at the Top Level:**  Place `use` middleware after route definitions to reduce the time spent searching for routes.
* **[ ] Session Management:**
    * **[ ]  Use Efficient Session Storage:** Consider Redis or Memcached for session storage if PostgreSQL is too slow.
    * **[ ]  Minimize Session Data:**  Only store essential data in the session.
* **[ ]  Caching (Client-Side):** Leverage browser caching for static assets. Use client-side caching strategies (e.g., Intersection Observer) for dynamic content where appropriate.
* **[ ]  Performance Monitoring:**  Implement tools like Google PageSpeed Insights, Lighthouse, or New Relic to identify bottlenecks in your Express application.
* **[ ]  Code Profiling:** Use browser developer tools to identify slow functions or code blocks within your Express application.

**II. Database (PostgreSQL) Optimization**

* **[ ]  Indexing:** **This is *crucial*.**
    * **[ ]  Identify Slow Queries:** Use PostgreSQL's logging (pg_stat_statements) or external tools (e.g., pgAdmin) to identify queries with high execution times.
    * **[ ]  Index Relevant Columns:** Add indexes on columns frequently used in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` clauses.
    * **[ ]  Composite Indexes:**  For queries with multiple conditions, consider composite indexes.
    * **[ ]  Index Types:**  Choose the appropriate index type (B-tree, GiST, GIN, BRIN) based on your query patterns.  B-tree is generally a good starting point.
    * **[ ]  Regularly Review Indexes:** Remove unused or redundant indexes to reduce write overhead.
* **[ ]  Query Optimization:**
    * **[ ]  Use `EXPLAIN`:**  Analyze query execution plans to understand how PostgreSQL is processing your queries. Identify potential bottlenecks.
    * **[ ]  Rewrite Slow Queries:** Optimize query logic – consider using more efficient joins, subqueries, or CTEs.
    * **[ ]  Avoid `SELECT *`:**  Only select the columns you actually need to reduce data transfer and memory usage.
    * **[ ]  Use Prepared Statements:** Prepare and reuse queries with placeholders for parameters to avoid repeated parsing and compilation.
    * **[ ]  Optimize `JOIN` Operations:** Use the correct join type and ensure that join columns are indexed.
    * **[ ]  Limit Result Sets:**  Use `LIMIT` clauses to restrict the number of rows returned, especially in paginated views.
* **[ ]  Database Configuration:**
    * **[ ]  Memory Allocation:**  Ensure PostgreSQL has sufficient memory allocated for caching data and indexes. Tune `shared_buffers`, `work_mem`, and `effective
