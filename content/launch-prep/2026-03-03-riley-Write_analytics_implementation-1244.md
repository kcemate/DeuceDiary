# Write analytics implementation plan with events to track.
Agent: riley
Generated: 2026-03-03T12:44:13.661918

## Analytics Implementation Plan

This plan outlines the strategy for implementing analytics tracking within our [Platform/Application Name]. It focuses on capturing key events to understand user behavior, optimize product development, and ultimately drive growth.

**I. Goals & Objectives:**

* **Understand User Behavior:** Identify how users interact with our [Platform/Application Name], including feature usage, user flows, and points of friction.
* **Measure Key Performance Indicators (KPIs):** Track metrics directly tied to our business goals, such as user engagement, conversion rates, and retention.
* **Data-Driven Decision Making:**  Provide actionable insights for product development, marketing campaigns, and user support.
* **Personalization & Optimization:**  Leverage data to tailor user experiences and improve product effectiveness.


**II. Technology Stack:**

* **Analytics Platform:** [Choose one - Google Analytics 4 (GA4), Adobe Analytics, Mixpanel, Amplitude, Heap, etc.] – *Rationale: [Briefly explain why you chose this platform]*.
* **Event Tracking Library:** [Choose one – Segment, Segment AnyData, Snowplow, Custom Javascript/SDK] – *Rationale: [Briefly explain why you chose this platform]*.
* **Data Warehouse (Optional):** [Choose one – BigQuery, Snowflake, Redshift] – *Rationale: [Briefly explain why you chose this platform - for long-term data storage and complex analysis]*
* **Reporting & Visualization Tools:** [Choose one – Tableau, Power BI, Google Data Studio, Looker] – *Rationale: [Briefly explain why you chose this platform]*


**III. Event Tracking Categories & Specific Events:**

We will categorize events to ensure a structured approach to tracking.  This list is a starting point and should be tailored to your specific business needs.

**1. User Acquisition Events:**

* **Sign-up/Registration:**  `user_signed_up` (Includes source/medium - e.g., "organic", "paid_search")
* **Download:** `app_downloaded` (Platform, Version)
* **Lead Generation:** `form_submitted` (Form Name, Lead Source)
* **Referral:** `user_referred` (Referring User ID)

**2. User Engagement Events:**

* **Page View:** `page_view` (Page URL, Category, Section)
* **Feature Usage:** `feature_used` (Feature Name, Feature Category, User ID) – *Example: `video_watched`, `chart_created`, `filter_applied`*
* **Content Consumption:** `article_read`, `video_played`, `document_opened` (Content Type, Title, Duration)
* **Interaction Events:** `button_clicked`, `link_clicked`, `comment_posted`, `like_posted`, `share_posted` (Button/Link Text, Post ID)
* **Search:** `search_performed` (Search Term, Search Result Count)
* **Time Spent on Page/Feature:** `time_spent` (Page URL/Feature Name, Duration)

**3. User Actions & Conversions:**

* **Add to Cart:** `item_added_to_cart` (Product ID, Quantity, Variation)
* **Checkout Started:** `checkout_started` (Payment Method, Shipping Address)
* **Purchase:** `purchase_completed` (Order ID, Total Amount, Payment Method, Shipping Address)
* **Upgrade/Subscription:** `subscription_created` (Subscription Plan, Price)
* **Trial Started:** `trial_started` (Trial Length, Product/Feature)
* **Lead Nurturing Event (Marketing):**  `email_opened`, `email_clicked`, `downloaded_resource` (Email Subject, Link, Resource Name)

**4
