# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T18:00:43.222049

## Performance Optimization Checklist: Express + PostgreSQL

This checklist outlines key areas to optimize your Express application and PostgreSQL database for performance. It's broken down into categories with actionable steps.

**I. Frontend (Express App):**

* **[ ] Code Optimization:**
    * **Minimize JavaScript Bundle Size:** Use tools like Webpack, Parcel, or Rollup to bundle and minify your code.
    * **Lazy Loading:** Implement lazy loading for images, scripts, and other assets that aren't immediately needed.
    * **Debouncing/Throttling:** Reduce the frequency of expensive event handlers (e.g., search input) with debouncing or throttling.
    * **Efficient Data Handling:**  Only fetch the data you absolutely need. Use pagination or filtering techniques.
    * **Avoid Synchronous Operations:** Minimize use of synchronous operations within your Express routes.  Favor asynchronous methods (async/await).

* **[ ] Routing & Middleware:**
    * **Optimize Routes:** Use efficient route patterns (e.g., resource routes).
    * **Minimize Middleware Usage:** Remove unused middleware.  Combine middleware where possible.
    * **Caching Middleware:** Use caching middleware to store frequently accessed responses.
    * **Route Guards:**  Implement route guards efficiently (avoid unnecessary checks).

* **[ ] Server Configuration:**
    * **Process Management:** Use a process manager like PM2 or Forever to keep your application running reliably and handle restarts.
    * **Logging:** Configure logging strategically to avoid performance overhead – use asynchronous logging.
    * **Connection Pooling (if applicable):**  If your application uses connection pools, ensure they are properly configured and sized. (More relevant for heavier applications).


**II. Database (PostgreSQL):**

* **[ ] Indexing:** – **CRITICAL**
    * **Analyze Queries:** Use `EXPLAIN ANALYZE` to identify slow queries and missing indexes.
    * **Index Columns Used in WHERE Clauses:**  Especially on columns used in equality and range queries.
    * **Index Columns Used in JOIN Clauses:** Ensure indexes exist on both tables involved in the join.
    * **Composite Indexes:** Consider composite indexes for queries that filter on multiple columns.
    * **Partial Indexes:**  If you frequently query a subset of data based on a column value, a partial index can be very efficient.
    * **Avoid Over-Indexing:** Too many indexes can slow down write operations.

* **[ ] Query Optimization:**
    * **Use Prepared Statements/Parameterized Queries:**  Reduces parsing overhead and prevents SQL injection. (PostgreSQL does this automatically with prepared statements)
    * **Avoid `SELECT *`:**  Only select the columns you actually need.
    * **Use `LIMIT` and `OFFSET` Carefully:** For pagination, ensure you're using `LIMIT` and `OFFSET` correctly to prevent performance issues with large datasets.
    * **Optimize `JOIN` Operations:**  Ensure the `JOIN` conditions are efficient and use appropriate join types.
    * **Rewrite Complex Queries:** Simplify complex queries by breaking them down into smaller, more manageable queries or using Common Table Expressions (CTEs).
    * **Use `EXISTS` instead of `COUNT(*)`:**  When checking for the existence of data.
    * **Avoid Functions in `WHERE` Clauses:** Functions applied to columns in the `WHERE` clause can prevent index usage.

* **[ ] Schema Design:**
    * **Proper Data Types:** Use the most appropriate data types for your columns to minimize storage and improve query performance.
    * **Normalization:**  Normalize your database schema to reduce data redundancy and improve data integrity, but be mindful of the potential impact on performance.
    * **Consider Denormalization (Carefully):** In some cases, denormalizing your schema can improve
