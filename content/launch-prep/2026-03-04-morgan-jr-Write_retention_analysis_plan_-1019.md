# Write retention analysis plan with D1/D7/D30 benchmarks.
Agent: morgan-jr
Generated: 2026-03-04T10:19:35.753284

## Retention Analysis Plan - D1/D7/D30 Benchmarks

**Goal:** To understand and optimize user retention across three key periods: Day 1 (Immediate), Day 7 (Early Engagement), and Day 30 (Long-Term Stickiness). This plan outlines the metrics, analysis methods, and potential actions we'll take to identify drop-off points and improve retention.

**I. Data Sources & Tracking:**

* **Product Analytics Platform:** (e.g., Mixpanel, Amplitude, Heap) - Primary source for tracking user behavior.
* **CRM/Customer Database:** For demographic data and potential connection to support interactions.
* **Marketing Automation Platform:** To understand acquisition channels and their impact on early engagement.
* **User Feedback Channels:** (In-app surveys, NPS, Customer Support Logs) - To uncover qualitative reasons for churn.


**II. Key Metrics & Definitions:**

* **DAU (Daily Active Users):** Number of unique users active on a given day.
* **WAU (Weekly Active Users):** Number of unique users active during a given week.
* **MAU (Monthly Active Users):** Number of unique users active during a given month.
* **Retention Rate (D1, D7, D30):** Percentage of users who returned to the product after Day 1, Day 7, and Day 30, respectively.  *Calculation: (Number of users returning after period / Total number of users who started in that period) * 100*
* **Churn Rate (D1, D7, D30):** Percentage of users who stopped using the product after Day 1, Day 7, and Day 30. *Calculation: 100% - Retention Rate*
* **Activation Rate:** Percentage of new users who complete key onboarding steps (e.g., profile completion, first action). Impacts D1 retention.
* **Feature Usage:** Tracking which features users utilize, and their frequency.  Helps identify engagement drivers.
* **Cohort Analysis:** Grouping users based on their acquisition date to track retention trends over time for specific cohorts.


**III. Timeline & Analysis Focus – Benchmarks:**

| **Time Period** | **Focus**                     | **Metrics to Track**                               | **Analysis Questions**                                           | **Potential Actions**                                                     |
|-----------------|------------------------------|---------------------------------------------------|----------------------------------------------------------------|-------------------------------------------------------------------------|
| **D1 (Day 1)**   | Immediate First Impressions     | Activation Rate, Feature Usage (Initial), Drop-off Point | Are users completing onboarding? Which features are they using? Where are they dropping off? | Optimize onboarding flow, highlight key value props, address common roadblocks. |
| **D7 (Day 7)**   | Early Engagement & Value Perception | D7 Retention Rate, Key Feature Usage, Session Length, Time in App | Are users finding value after the initial setup? Are they engaged with core features? |  Targeted in-app messaging, personalized tutorials, proactive customer support.  |
| **D30 (Day 30)**  | Long-Term Stickiness           | D30 Retention Rate, Feature Usage (Core), Churn Reasons (Feedback Analysis), Cohort Retention | Are users continuing to engage? Why are users churning? Are there specific cohorts with lower retention? |  Introduce new features, loyalty programs, community building, targeted re-engagement campaigns. |



**IV.  Detailed Analysis Stages & Methods:**

1. **Data Extraction & Cleaning:**  Extract relevant data from our analytics platform and CRM.  Ensure data accuracy and consistency.
2. **Cohort Definition:** Segment users based on their acquisition date to create cohorts (e.g., "January 2024 Users").
