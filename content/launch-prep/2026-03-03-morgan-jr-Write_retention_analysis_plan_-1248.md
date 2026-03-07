# Write retention analysis plan with D1/D7/D30 benchmarks.
Agent: morgan-jr
Generated: 2026-03-03T12:48:22.022520

Okay, here's a retention analysis plan outlining benchmarks at D1 (1 day), D7 (7 days), and D30 (30 days). This plan is designed to be a starting point, and you’ll need to adapt it based on your specific business, product, and user base.

**Retention Analysis Plan**

**1. Goals & Objectives:**

* **Overall Goal:** To understand why users are staying or leaving your product/service and identify key areas for improvement to increase long-term retention.
* **Specific Objectives:**
    * Determine the overall 30-day retention rate.
    * Analyze churn drivers (why users leave) at D1, D7, and D30.
    * Identify user segments with the highest and lowest retention rates.
    *  Pinpoint key features or actions contributing to (or detracting from) retention.
    *  Establish baseline retention metrics to track progress over time.

**2. Data Requirements:**

* **User Identification:**  A unique identifier for each user (e.g., email address, account ID).
* **Registration Date:**  The date each user first registered or started using your product/service.
* **Activity Data:**  Crucial for understanding user behavior:
    * **Login/Activation:**  Track when users first logged in or activated their account.
    * **Key Feature Usage:** Record usage of core features relevant to your product/service (e.g., number of uploads, messages sent, transactions completed, content created, etc.).
    * **Session Duration:**  How long users are actively engaged in your product/service during each session.
    * **Engagement Metrics:** Track metrics like page views, clicks, downloads, etc., depending on your product.
* **User Attributes (Segmentation):**
    * **Demographics:** (Optional, but can be helpful - age, location, industry, etc.)
    * **Acquisition Channel:** How the user found your product/service (e.g., paid advertising, organic search, referral, social media).
    * **Subscription Tier:** (If applicable)  The user's subscription plan.
    * **Onboarding Completion:** Whether the user completed your onboarding flow.

**3. Metrics & Calculations:**

* **Retention Rate:**  The percentage of users who are still active after a specific period.  Calculated as:
   * `(Number of Users Active at Day D - Number of New Users Acquired at Day D) / Number of Users Active at Day D * 100`
* **Cohort Analysis:** Grouping users based on their acquisition date (cohort) to track retention trends over time. This is *essential* for this type of analysis.
* **Churn Rate:** The inverse of retention rate.  (100 - Retention Rate)
* **D1 Retention:** Percentage of users who were active on Day 1 who were also active on Day 7.
* **D7 Retention:** Percentage of users who were active on Day 7 who were also active on Day 30.
* **D30 Retention:** Percentage of users who were active on Day 30 who are still active.

**4. Benchmarks & Timeline:**

| **Timeframe** | **Metric**             | **Target/Benchmark** | **Analysis Focus**                                       |
|---------------|-----------------------|----------------------|---------------------------------------------------------|
| **D1**         | D1 Retention          | > 40% (Adjust based on industry/product) | Immediate user experience - activation, first-time value.  Quick wins? |
|               | Drop-off Reasons      | Identify Top 3          |  Was the signup process too complicated? Did they not immediately understand the value?  Was there
