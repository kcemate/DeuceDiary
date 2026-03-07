# Write retention analysis plan with D1/D7/D30 benchmarks.
Agent: morgan-jr
Generated: 2026-03-03T18:05:16.308368

Okay, here's a Retention Analysis Plan outlining benchmarks at D1 (1-day), D7 (7-day), and D30 (30-day). This plan is a template and needs to be adapted based on your specific product, user base, and business goals.  I'll break it down into sections for clarity and provide considerations for each stage.

**Retention Analysis Plan**

**1. Goals & Objectives:**

* **Overall Goal:** To understand user churn and identify key factors driving retention (or lack thereof) to optimize product development, marketing efforts, and engagement strategies.
* **Specific Objectives:**
    * Identify the percentage of users retained at D1, D7, and D30.
    * Segment users based on behavior and identify key differences in retention rates between segments.
    *  Pinpoint the top 3-5 drivers of user churn.
    *  Develop targeted interventions to improve retention for high-risk user segments.

**2. Data Sources & Metrics:**

* **Core Retention Metrics:**
    * **DAU (Daily Active Users):** Number of unique users active within a 24-hour period.
    * **WAU (Weekly Active Users):** Number of unique users active within a 7-day period.
    * **MAU (Monthly Active Users):** Number of unique users active within a 30-day period.
    * **Retention Rate:** Percentage of users retained over a specific time period (e.g., D1 retention = (Users at D7 - New Users at D7) / Users at D1 * 100).
    * **Churn Rate:** Percentage of users who stopped using the product over a specific time period (100% - Retention Rate).
* **Data Sources:**
    * **Product Analytics Platform:** (e.g., Mixpanel, Amplitude, Heap, Google Analytics) – This is *crucial* for detailed user behavior tracking.
    * **CRM System:** (e.g., Salesforce, HubSpot) – For user demographics, acquisition channels, and account information.
    * **Marketing Automation Platform:** (e.g., Marketo, Pardot) –  To understand user journey and touchpoints.
    * **Customer Support Data:**  Logs of support tickets can highlight issues and pain points.

**3. Benchmarks & Timeline:**

| Time Period | Metric            | Target Benchmark |  Rationale                               |
|-------------|--------------------|------------------|-------------------------------------------|
| **D1 (1-Day)** | Retention Rate     | > 60%            |  Users should be immediately engaged. Significant drops here indicate major onboarding issues.  |
|             | Drop-off Events    | Identify top 2-3  | What actions prevent users from continuing? |
| **D7 (7-Day)** | Retention Rate     | > 30%            |  This is a critical early-stage retention point.  Indicates whether the initial value proposition resonated. |
|             | Usage Patterns     | Analyze most frequent actions |  What are users doing that's successful? |
| **D30 (30-Day)**| Retention Rate     | > 15%            |  Shows long-term value and stickiness.  Indicates whether the product is truly solving a problem for users. |
|             | Churn Reasons      | Identify top 3-5  | What are the *reasons* users are leaving? (requires deeper analysis beyond raw numbers). |


**4.  Analysis Phases & Activities:**

* **Phase 1: Initial Data Collection & Baseline (Week 1-2)**
    * **Set Up Tracking:** Ensure all key events and user attributes are accurately tracked in your analytics platform
