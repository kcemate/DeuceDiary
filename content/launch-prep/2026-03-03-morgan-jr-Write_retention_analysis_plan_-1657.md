# Write retention analysis plan with D1/D7/D30 benchmarks.
Agent: morgan-jr
Generated: 2026-03-03T16:57:22.617496

## Retention Analysis Plan - D1/D7/D30 Benchmarks

This plan outlines a strategy for tracking and analyzing user retention, focusing on key benchmarks of Day 1, Day 7, and Day 30. It details the metrics we’ll track, the methods for data collection, and how we’ll interpret the results.

**I. Goals & Objectives:**

* **Understand User Churn:** Identify the primary reasons users stop using our product/service.
* **Optimize Onboarding:** Improve the initial experience to increase the likelihood of users sticking around.
* **Targeted Interventions:**  Implement strategies to re-engage at-risk users based on their behavior and cohort.
* **Measure Success:** Track the impact of changes made to our product or marketing efforts on retention rates.

**II. Key Metrics:**

* **Cohort Definition:** We'll define cohorts based on the date of acquisition (e.g., all users who signed up in January 2024). This allows us to track the retention of specific groups of users over time.
* **Retention Rate:** Percentage of users who remain active after a specific period. Calculated as: (Number of Users Active at Day X - Number of New Users Active at Day X) / Number of Users Active at Day 0 * 100
* **Active User Definition:**  Clearly define what constitutes an “active” user. This could be defined as:
    * **Frequency:** Logged-in users at least once per week/month.
    * **Engagement:**  Completion of key actions within the product (e.g., creating a project, sending a message).  *This will be tailored to our specific product.*
* **Churn Rate:** The inverse of Retention Rate (100% - Retention Rate).
* **Time to First Key Action (TTFKA):** How long it takes a new user to complete a crucial action that demonstrates value.
* **Feature Usage:** Track which features are most frequently used by retained users vs. churned users.
* **User Feedback:**  Capture qualitative data through surveys and in-app feedback to understand user sentiment and pain points.


**III. Data Collection & Tracking:**

| Metric           | Data Source             | Frequency | Tools              |
|------------------|--------------------------|-----------|--------------------|
| Active Users     | Product Database         | Daily     | Mixpanel, Amplitude, Google Analytics |
| TTFKA            | Product Database         | Daily     | Mixpanel, Amplitude, Google Analytics |
| Feature Usage     | Product Database         | Daily     | Mixpanel, Amplitude, Google Analytics |
| User Feedback      | In-App Surveys, Email    | Weekly/Monthly| SurveyMonkey, Qualtrics, CRM |
| Sign-Ups         | Product Database         | Daily     | Product Analytics |


**IV. Benchmarks & Targets:**

| Benchmark     | Time Period | Target Retention Rate | Justification                                     |
|---------------|-------------|------------------------|--------------------------------------------------|
| **D1**         | Day 1        | 30% - 40%               | High expectations – users should have a positive first impression. |
| **D7**         | Day 7        | 15% - 25%               | Critical point – users either "get it" or start to question the value. |
| **D30**        | Day 30       | 5% - 10%                | Long-term retention is the ultimate goal.  Indicates sustainable engagement.|


**V. Analysis & Reporting - Phased Approach:**

**Phase 1: Initial (D1 - D7)**

* **Focus:**  Identify immediate drop-off.  Is it a lack of
