# Write retention analysis plan with D1/D7/D30 benchmarks.
Agent: morgan-jr
Generated: 2026-03-03T09:47:00.988240

Okay, here's a retention analysis plan incorporating D1 (Day 1), D7 (Day 7), and D30 (Day 30) benchmarks. This plan outlines the key steps, metrics, and considerations for tracking and improving user retention.

**Retention Analysis Plan**

**1. Goals & Objectives:**

* **Primary Goal:** Maximize user retention across key time periods.
* **Specific Objectives:**
    * Understand the reasons behind user churn.
    * Identify key drivers of retention (features, onboarding, engagement).
    * Establish baseline retention rates for comparison.
    * Implement targeted interventions to improve retention at each benchmark.

**2. Target Users:**

* **Define Your Cohorts:**  This is *critical*. You need to segment your users for accurate analysis. Examples:
    * **Signup Date:** (e.g., All users who signed up in January 2024) –  This is the most common and useful cohort.
    * **Plan Type:** (Free vs. Paid) –  Retention often varies between tiers.
    * **Source:** (e.g., Facebook Ads, Organic Search, Referral) – Understand where your best users come from.
    * **Initial Actions:** (e.g., Completed Onboarding Tutorial, Used Feature X) - See which initial behaviors are most predictive of retention.


**3. Data Collection & Tracking:**

* **Essential Metrics:**
    * **Daily Active Users (DAU):** Users active on a given day.
    * **Weekly Active Users (WAU):** Users active over a week.
    * **Monthly Active Users (MAU):** Users active over a month.
    * **Retention Rate:** Percentage of users who remain active after a specific period.
    * **Churn Rate:** Percentage of users who stop being active over a specific period.  (Churn Rate = 1 - Retention Rate)
    * **Time to Value (TTV):**  How long it takes a new user to realize the core value of your product. This is vital to track.
    * **Feature Usage:** Track which features users are (or aren’t) using.
    * **Session Length & Frequency:** How long and how often users are engaging with your product.
* **Tools:**
    * **Analytics Platform:** (Google Analytics, Mixpanel, Amplitude, Heap) – These are crucial for tracking user behavior.
    * **Database:**  (SQL, NoSQL) – For storing and querying user data.
    * **CRM:** (Salesforce, HubSpot) - For integrating user data and tracking interactions.



**4. Retention Benchmarks & Analysis Schedule:**

| Benchmark | Timeframe | Definition | Key Metrics to Track | Analysis Focus | Intervention Strategy |
|---|---|---|---|---|---|
| **D1 (Day 1)** | Within 24-48 hours of sign-up |  Did users successfully complete the initial onboarding flow?  First-time user experience. |  % Users Completing Onboarding, First Session Length, Feature Usage (Basic) | Is the onboarding process intuitive? Are users immediately understanding the value? Identify drop-off points in onboarding. | * Immediate Onboarding Support (if high drop-off)*  *A/B Test Onboarding Flow* *Simple Welcome Email Reminder* |
| **D7 (Day 7)** | 7 days after sign-up |  Early engagement & Habit Formation.  Is your product integrating into users' routines? |  DAU, WAU, Feature Usage (Core Features), Session Length,  User Feedback (Surveys – quick NPS questions) |  Are users finding value quickly?  Are there barriers to continued engagement?  Are there features they aren’t using that could boost engagement? |
