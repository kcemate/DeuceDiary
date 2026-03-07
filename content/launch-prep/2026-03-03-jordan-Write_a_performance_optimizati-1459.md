# Write a performance optimization checklist for Express + Pos
Agent: jordan
Generated: 2026-03-03T14:59:45.943743

## Performance Optimization Checklist: Express + PostgreSQL

This checklist covers common performance bottlenecks when building applications with Express.js (Node.js) and PostgreSQL. It's broken down into categories for easier prioritization.

**I. PostgreSQL Optimization:**

**1. Database Schema Design:**
   * [ ] **Normalization:**  Ensure appropriate normalization to reduce redundancy and improve data integrity.  Over-normalization can be just as harmful as under-normalization.
   * [ ] **Data Types:** Use the *smallest* appropriate data types for each column (e.g., `SMALLINT` instead of `BIGINT` if the range allows).
   * [ ] **Indexes:**
      * [ ] **Identify Slow Queries:** Use PostgreSQL's `auto_explain` extension to identify queries without indexes.
      * [ ] **Index Key Columns:** Index columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses.
      * [ ] **Composite Indexes:** Create composite indexes for queries involving multiple columns in a `WHERE` clause.
      * [ ] **Index Types:** Choose the correct index type (e.g., B-tree, GiST, GIN) based on query patterns. (Consider GiST for array types, GIN for full-text search)
      * [ ] **Avoid Over-Indexing:** Too many indexes can slow down write operations. Regularly review and remove unused indexes.
      * [ ] **Partial Indexes:**  Index only a subset of rows that frequently match a filter condition.
   * [ ] **Data Validation:** Enforce data validation at the database level to ensure data quality and reduce the need for application-side validation.

**2. Query Optimization:**
   * [ ] **EXPLAIN Analyze:**  Use `EXPLAIN ANALYZE` before deploying any changes. This shows the query execution plan and identifies potential bottlenecks.
   * [ ] **Avoid `SELECT *`:**  Only select the columns you actually need.
   * [ ] **Use `LIMIT`:** Limit the number of rows returned in queries, especially in initial pagination.
   * [ ] **Optimize `JOIN`s:** Ensure you're using the correct `JOIN` type (`INNER`, `LEFT`, `RIGHT`) and that the `JOIN` columns are properly indexed.
   * [ ] **Rewrite Complex Queries:**  Break down complex queries into simpler ones using temporary tables or Common Table Expressions (CTEs).
   * [ ] **Use Prepared Statements:**  Prepared statements can improve performance by reusing the query plan.
   * [ ] **Avoid Functions in `WHERE` Clauses:**  Function calls in `WHERE` clauses can prevent index usage.  Try to rewrite the query to avoid them.
   * [ ] **Use `WITH` Clause (Common Table Expressions - CTEs):**  CTEs can improve readability and sometimes performance by breaking down complex logic.

**3. PostgreSQL Configuration:**
   * [ ] **`shared_buffers`:**  Increase the `shared_buffers` setting to allow PostgreSQL to cache data in RAM. (Typically 25-50% of system RAM).
   * [ ] **`work_mem`:**  Increase the `work_mem` setting to allow PostgreSQL to sort and hash data in memory.
   * [ ] **`maintenance_work_mem`:**  Increase this for maintenance tasks like `VACUUM` and `ANALYZE`.
   * [ ] **`effective_cache_size`:**  Provide a realistic estimate of the available cache size.
   * [ ] **`autovacuum`:** Ensure `autovacuum` is enabled and configured properly to keep the database statistics up-to-date.
   * [ ] **Connection Pooling:**  Use a connection pooler like PgBouncer or DuoQueue to reduce the overhead
