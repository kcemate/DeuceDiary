# Write retention analysis plan with D1/D7/D30 benchmarks.
Agent: morgan-jr
Generated: 2026-03-04T02:23:30.009308

Okay, here's a Retention Analysis Plan, outlining key milestones and benchmarks for tracking user retention, specifically focusing on D1 (Day 1), D7 (Day 7), and D30 (Day 30) retention. This plan is a template and should be adapted to your specific product, user base, and goals.

**Retention Analysis Plan**

**1. Goals & Objectives:**

* **Overall Goal:** Understand user behavior immediately following onboarding and identify key factors impacting long-term engagement and retention.
* **Specific Objectives:**
    * Define “Retention” (e.g., returning user, active user - define criteria based on feature usage, time spent in app, etc.)
    * Identify drop-off points within the initial onboarding flow.
    * Discover which features drive early engagement and retention.
    *  Benchmark retention rates against industry standards (if possible) to set realistic targets.

**2. Metrics & Definitions:**

* **Retention Rate:** The percentage of users who are still active after a specific period. Calculated as:  `((Number of Users at Day X) - (Number of New Users at Day X)) / (Number of Users at Day 1)` * 100%
* **Cohort:** A group of users who started using the product within the same time period (e.g., all users who signed up in January).  Analyzing cohorts is crucial for spotting trends over time.
* **Active User:** Define what constitutes an “active user.”  This depends heavily on your product. Examples:
    * **App:**  Launched the app, used a core feature within the last 7 days.
    * **SaaS:** Logged in, performed a key action (e.g., created a project, sent an email).
* **Churn Rate:**  The opposite of retention – the percentage of users who stopped being active during a given period.  (Calculated as 1 - Retention Rate)

**3. Data Collection & Tracking:**

* **Analytics Platform:**  Google Analytics, Mixpanel, Amplitude, Firebase Analytics – Choose the one that best fits your product and budget.
* **Event Tracking:** Implement robust event tracking to capture user actions:
    * **Onboarding Events:** Sign-up, account creation, tutorial completion, initial feature usage.
    * **Core Feature Usage:**  Track frequency, duration, and depth of use for key features.
    * **Engagement Events:**  Notifications received, profile updates, content creation, community interactions.
* **Data Segmentation:**  Segment users by key attributes (e.g., acquisition channel, user type, demographics) to identify variations in retention.
* **User Surveys:**  Short, targeted surveys (e.g., Net Promoter Score - NPS, 1-question exit surveys) can provide qualitative data and uncover reasons for churn.

**4. Benchmarks & Milestones:**

| Milestone      | Timeframe | Target Retention Rate (%) | Key Questions to Investigate | Potential Actions                               |
|----------------|-----------|---------------------------|-----------------------------|-------------------------------------------------|
| **D1 Retention** | Day 1      | 40-60%                      | Did users successfully complete onboarding?  Was the initial experience intuitive? Were there immediate technical issues? | Optimize onboarding flow, address user support questions immediately, simple welcome tutorial. |
| **D7 Retention** | Day 7      | 20-30%                      | Did users find value within the first week? Did they overcome initial learning curve? Are there bugs or usability issues impacting continued use? | Targeted email reminders, onboarding tutorial refresh, address bug reports, offer a small incentive to return |
| **D30 Retention** | Day 30     | 5-10%                      | Are users continuing to find value in
