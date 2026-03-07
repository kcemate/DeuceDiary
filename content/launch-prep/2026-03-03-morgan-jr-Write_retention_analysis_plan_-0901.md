# Write retention analysis plan with D1/D7/D30 benchmarks.
Agent: morgan-jr
Generated: 2026-03-03T09:01:54.958137

## Retention Analysis Plan

**Project Goal:** To understand user behavior and identify key factors impacting user retention across different time horizons (D1, D7, D30) to inform targeted retention strategies.

**I. Data & Metrics**

* **Definition of Retention:** For this plan, retention will be defined as a user remaining active within the application after a specific timeframe.  We’ll define “active” as [**Clearly define your definition of "active" here. Example: logging in, completing a core task, using a key feature a certain number of times.**]  Be precise and measurable.
* **Data Sources:**
    * **Analytics Platform:** (e.g., Google Analytics, Mixpanel, Amplitude) - Primary source for tracking user activity, demographics, and events.
    * **Database:**  For deeper analysis and cohort segmentation.
    * **Customer Support Tickets:** (If relevant) – Understanding reasons for churn can provide qualitative insights.
* **Key Metrics:**
    * **Daily Active Users (DAU):** Number of unique users active on a given day.
    * **Weekly Active Users (WAU):** Number of unique users active on a given week.
    * **Monthly Active Users (MAU):** Number of unique users active on a given month.
    * **Retention Rate (D1, D7, D30):** Percentage of users who remained active after 1 day, 7 days, and 30 days, respectively.  Calculated as: (Number of users retained) / (Number of users who started on day 0) * 100
    * **Churn Rate (D1, D7, D30):** Percentage of users who stopped being active after 1 day, 7 days, and 30 days. Calculated as: 100% - Retention Rate
    * **Cohort Analysis:** Grouping users based on their acquisition date (e.g., all users who signed up in January) to track retention over time for each cohort.
    * **Feature Usage:** Tracking which features users are utilizing to identify potential engagement drivers or areas for improvement.
    * **User Segments:**  Define key user segments based on demographics, behavior, or acquisition source (e.g., iOS vs. Android users, organic vs. paid acquisition).



**II. Timeline & Benchmarks**

| **Timeframe** | **Metric**              | **Benchmark Goal** | **Analysis Focus**                            | **Deliverables**             |
|----------------|------------------------|--------------------|-----------------------------------------------|-----------------------------|
| **Day 1 (D1)**  | Retention Rate         | 40%                 |  Initial onboarding experience effectiveness.  Immediate engagement. | D1 Retention Report (cohort breakdown) |
|                | Feature Usage          | Top 3 Features Used | Which features are most immediately engaging? | List of most popular features  |
|                | User Segments          | Segment Breakdown    | Identify immediately dropping segments         | Segment by acquisition source  |
| **Day 7 (D7)**  | Retention Rate         | 20%                 |  Usability of core features, initial value realization.  | D7 Retention Report (cohort breakdown) |
|                | Feature Usage          | Top 3 Features Used |  Are users engaging with the *right* features? | List of most popular features |
|                | Churn Reasons (Qualitative) | Identify Key Issues | Understanding immediate drop-off reasons.      | List of common churn reasons  |
| **Day 30 (D30)**| Retention Rate         | 10%                 | Long-term value realization, sticking point.      | D30 Retention Report (cohort breakdown) |
|                | Feature Usage
