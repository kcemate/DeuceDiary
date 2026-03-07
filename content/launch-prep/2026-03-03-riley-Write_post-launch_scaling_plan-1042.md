# Write post-launch scaling plan with thresholds.
Agent: riley
Generated: 2026-03-03T10:42:31.890783

Okay, here’s a post-launch scaling plan, incorporating thresholds and a phased approach. This is a template – you'll need to tailor it specifically to your product, user base, and technical infrastructure.

**Product:** [Insert Product Name Here]
**Launch Date:** [Insert Launch Date Here]
**Goal:** Successfully scale user growth while maintaining a high-quality user experience.

**I. Phase 1: Initial Stabilization (0-30 Days Post-Launch)**

* **Focus:**  Verify key functionality, address immediate bugs, and establish basic monitoring.
* **Metrics:**
    * **Daily Active Users (DAU):**  Threshold: 500 – 1,000  (This will vary *significantly* based on product type - a gaming app will have a different baseline than SaaS).
    * **Monthly Active Users (MAU):** Threshold: 2,000 – 5,000
    * **Conversion Rate (Trial to Paid):** Threshold: 5% – 10% (For applicable products)
    * **Error Rate (500 Errors):** Threshold: < 1% -  Anything above this needs immediate investigation.
    * **Average Session Duration:** Threshold: 10 - 20 minutes (Again, this depends on the product)
    * **Server Response Time:** Threshold: < 200ms (For critical API calls)
* **Scaling Actions:**
    * **Monitor, Monitor, Monitor:**  Implement robust monitoring using tools like New Relic, Datadog, Prometheus, or similar.
    * **Bug Fixes:** Prioritize and rapidly address all reported bugs and critical issues.
    * **Basic Infrastructure Scaling:**  Scale up server instances (e.g., AWS EC2, Google Compute Engine) based on observed load.  This might be a small step-up initially.
    * **Basic User Support:** Implement a basic FAQ, knowledge base, and email support.


**II. Phase 2: Growth Acceleration (30-90 Days Post-Launch)**

* **Focus:**  Drive user acquisition, optimize onboarding, and prepare for increased demand.
* **Metrics:**
    * **DAU:** Threshold: 2,000 – 5,000 (Increase by 50-100% compared to Phase 1)
    * **MAU:** Threshold: 8,000 – 20,000
    * **Conversion Rate (Trial to Paid):** Threshold: 8% – 15%
    * **Error Rate (500 Errors):** Threshold: < 0.5%
    * **User Churn Rate:** Threshold: < 5% per month (This is *critical* – monitor closely)
    * **Customer Support Ticket Volume:**  Start tracking and analyzing ticket trends.
* **Scaling Actions:**
    * **Increased Server Capacity:** Implement auto-scaling for servers based on traffic patterns.
    * **Marketing & Growth Initiatives:** Execute planned marketing campaigns (SEO, social media, paid advertising).
    * **Onboarding Optimization:** Analyze onboarding flow, identify drop-off points, and implement improvements.
    * **A/B Testing:** Begin A/B testing key features and UI elements.
    * **Expand Support Channels:**  Consider adding live chat support or a more robust help desk system.



**III. Phase 3: Sustainable Scaling (90+ Days Post-Launch)**

* **Focus:**  Maintain growth momentum, optimize for long-term performance, and prepare for significant expansion.
* **Metrics:**
    * **DAU:** Threshold: 5,000+ (Establish a sustainable growth rate –
