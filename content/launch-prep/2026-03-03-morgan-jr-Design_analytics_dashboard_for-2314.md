# Design analytics dashboard for Deuce Diary launch metrics.
Agent: morgan-jr
Generated: 2026-03-03T23:14:02.556730

Okay, let's design an analytics dashboard for the Deuce Diary launch metrics. This dashboard will focus on key performance indicators (KPIs) to track the success of the launch and identify areas for optimization.

**I. Overall Goals of the Dashboard:**

* **Monitor Launch Momentum:** Provide a real-time or near-real-time view of how the launch is performing.
* **Identify Top-Performing Channels:** Determine which marketing channels are driving the most traffic and sign-ups.
* **Understand User Behavior:**  Analyze how users are interacting with the app – onboarding, content consumption, etc.
* **Measure Acquisition & Retention:** Track the cost of acquiring users and their ability to stick around.
* **Support Data-Driven Decisions:** Provide insights to inform marketing and product decisions.

**II. Dashboard Sections & Key Metrics:**

We’ll break the dashboard into several sections, each focusing on a specific area of measurement.

**1. Acquisition - Top Row (Most Critical - Real-Time Focus)**

* **Metric:** **Total Installs (Daily/Weekly)** – Number of times the app was downloaded. (Trend Line Chart – High Importance)
    * **Visualization:** Line Chart – Color-coded (e.g., green for positive trend, red for decline).
    * **Data Source:** App Store Connect, Google Play Console
* **Metric:** **Cost Per Install (CPI)** – Cost of acquiring each new user via marketing campaigns. (Number & Trend – High Importance)
    * **Visualization:** Number display with trend indicator (increasing/decreasing).
    * **Data Source:** Marketing Campaign Tracking (Google Ads, Facebook Ads, etc.)
* **Metric:** **Install Source Breakdown** –  Percentage of installs coming from each marketing channel (e.g., Facebook, Google Search, Referral, Paid Advertising, Organic). (Pie Chart/Donut Chart – High Importance)
    * **Visualization:** Pie Chart – Clear labeling of segments.
    * **Data Source:** Marketing Campaign Tracking & App Store/Play Store Attribution.


**2. Engagement - Second Row (Understanding User Activity)**

* **Metric:** **Daily Active Users (DAU)** – Number of unique users who opened the app each day. (Trend Line Chart – High Importance)
    * **Visualization:** Line Chart –  Show DAU over time (Daily, Weekly, Monthly).
    * **Data Source:**  Firebase, Amplitude, Mixpanel (Choose your analytics platform).
* **Metric:** **Weekly Active Users (WAU)** & **Monthly Active Users (MAU)** –  Similar to DAU, but on a weekly and monthly basis. (Trend Line Charts – Important)
    * **Visualization:** Line Charts.
    * **Data Source:** Analytics Platform
* **Metric:** **Session Duration (Average)** –  Average time users spend in the app per session. (Number & Trend – Medium Importance)
    * **Visualization:** Number display with trend indicator.
    * **Data Source:** Analytics Platform
* **Metric:** **Session Frequency (Average)** – Number of sessions per user per day/week/month (Number & Trend – Medium Importance)
    * **Visualization:** Number display with trend indicator.
    * **Data Source:** Analytics Platform



**3. Content Consumption - Third Row (Measuring Diary Usage)**

* **Metric:** **Diaries Created Per Day/Week/Month** – Number of new diaries started. (Trend Line Chart – Medium Importance)
    * **Visualization:** Line Chart – Track the growth of diary creation.
    * **Data Source:**  Analytics Platform
* **Metric:** **Diaries Completed Per Day/Week/Month** – Number of diaries fully completed. (Trend Line Chart – Medium Importance)
    * **Visualization:** Line Chart – Complementary to 'Diaries Created
