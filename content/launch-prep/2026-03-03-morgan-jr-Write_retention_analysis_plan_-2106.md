# Write retention analysis plan with D1/D7/D30 benchmarks.
Agent: morgan-jr
Generated: 2026-03-03T21:06:15.442845

Okay, here's a retention analysis plan structured around D1 (Day 1), D7 (Day 7), and D30 (Day 30) benchmarks. This plan outlines the key activities, metrics to track, and considerations for a robust retention analysis, especially for a product or service.  It’s designed to be adaptable – you'll need to tailor it to your specific context.

**Retention Analysis Plan**

**I. Goals & Objectives**

* **Overall Goal:** Understand user behavior and identify key factors driving churn or contributing to long-term engagement.
* **Specific Objectives:**
    * Define and track retention cohorts based on user actions (e.g., first login, key feature use, purchase).
    * Identify the primary reasons for churn at D1, D7, and D30.
    * Determine which user segments have the highest or lowest retention rates.
    * Develop actionable insights to improve retention at all timeframes.

**II. Data Requirements & Tracking**

* **User Identification:** Unique user ID for each user.
* **Event Tracking:** Implement robust event tracking to capture key user actions:
    * **First Login:** Timestamp of initial user access.
    * **Feature Usage:** Track usage of core features.
    * **Content Consumption:** Track views, downloads, or other consumption events.
    * **Purchase/Subscription Activity:** Track revenue-generating events.
    * **Support Interactions:** Track tickets opened, chat sessions, or calls.
    * **Engagement Metrics:** Daily/Weekly Active Users (DAU/WAU) – useful for understanding overall activity.
* **User Attributes:** Capture demographic and behavioral data to segment users:
    * **Signup Source:** (e.g., Organic, Paid Ad, Referral)
    * **Plan Type/Subscription Tier:** (if applicable)
    * **Device Type:** (iOS, Android, Web)
    * **Location:** (Region/Country)
    * **Age Range/Demographics:** (if ethically and legally permissible to collect)
* **Data Source:** Analytics platform (Google Analytics, Mixpanel, Amplitude, etc.) or a custom database.

**III. Retention Metrics & Benchmarks**

| Metric             | Definition                               | D1  | D7  | D30 |  Interpretation                                          |
|--------------------|-------------------------------------------|-----|-----|-----|----------------------------------------------------------|
| **DAU/MAU (Daily/Monthly Active Users)** | % of users active within a period           | 10-20% | 5-10% | 2-5% |  Indicates overall engagement; lower % suggests issue       |
| **Retention Rate (D1)** | % of users who return after 1 day           | 10-20% |     |     |  Initial excitement/value realization is crucial here.    |
| **Retention Rate (D7)** | % of users who return after 7 days          | 5-10% | 2-5% | 1-3% |  Shows whether initial value translates to habitual use. |
| **Retention Rate (D30)** | % of users who return after 30 days         | 2-5% | 0.5-2% | 0.3-1% |  Indicates long-term stickiness and sustainability.       |
| **Churn Rate (D1/D7/D30)** | 1 - Retention Rate                           |  -   |  -   |  -   | The inverse of retention – vital for understanding loss. |
| **Cohort Analysis** | Retention rates broken down by signup source/segment | Ongoing | Ongoing | Ongoing | Highlights differences in behavior across
