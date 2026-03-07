# Write CDN and asset optimization plan.
Agent: riley
Generated: 2026-03-03T10:53:33.945513

## CDN and Asset Optimization Plan

This plan outlines a strategy to improve website performance through leveraging a Content Delivery Network (CDN) and optimizing all website assets. It’s broken down into phases, priorities, and key metrics.

**I. Goals & Objectives:**

* **Reduce Page Load Times:**  The primary goal is to significantly decrease the time it takes for a page to fully load, improving user experience and SEO.
* **Improve User Experience:** Faster loading websites lead to happier users, lower bounce rates, and increased engagement.
* **Reduce Server Load:** Offloading static assets to a CDN minimizes the burden on the web server.
* **Improve Global Performance:** Ensure a consistent and fast experience for users worldwide.
* **Boost SEO:** Page speed is a significant ranking factor in Google's algorithm.


**II. Phase 1: Assessment & Foundation (1-2 Weeks)**

* **1.1 Performance Audit:**
    * **Tools:** Use tools like:
        * **Google PageSpeed Insights:** Provides a score and specific recommendations.
        * **GTmetrix:** Offers detailed waterfall charts and performance reports.
        * **WebPageTest:** Advanced testing with multiple browsers and locations.
    * **Metrics to Track:**
        * **First Contentful Paint (FCP):** Time to first visible content.
        * **Largest Contentful Paint (LCP):** Time to render the largest element on the screen.
        * **Time to Interactive (TTI):**  Time to become fully interactive.
        * **Total Blocking Time (TBT):**  Total time during which the main thread is blocked.
        * **Page Load Time:** Overall time to load the entire page.
        * **Bounce Rate:**  Percentage of users who leave after viewing only one page.
* **1.2 Asset Inventory:**
    * Identify all website assets: Images (JPG, PNG, WebP), CSS, JavaScript, fonts, videos, etc.
    * Determine file sizes and usage patterns.
* **1.3 CDN Research & Selection:**
    * **Options:**  Cloudflare, Amazon CloudFront, Akamai, Fastly, Google Cloud CDN.
    * **Criteria:** Cost, features (geography, SSL, caching options), integration with existing infrastructure.

**III. Phase 2: CDN Implementation & Initial Optimization (2-4 Weeks)**

* **2.1 CDN Setup:**
    * Integrate the chosen CDN with the website.  This typically involves configuring DNS records to point to the CDN's servers.
* **2.2 Static Asset Caching:**
    *  Configure the CDN to aggressively cache static assets (images, CSS, JavaScript).  Implement appropriate cache-control headers on the server-side to inform the CDN about caching behavior.
* **2.3 Image Optimization:**
    * **Lazy Loading:** Implement lazy loading for images below the fold.
    * **Image Compression:** Optimize images using tools like ImageOptim, TinyPNG, or ShortPixel.  Experiment with different formats (WebP is generally best).
    * **Responsive Images:** Serve appropriately sized images based on the user’s device and screen size (using the `<picture>` element or `srcset` attribute).
* **2.4 Minification:**
    * Minify CSS and JavaScript files to reduce file sizes.  Tools like UglifyJS, CSSNano, or online minifiers can be used.

**IV. Phase 3: Advanced Optimization & Monitoring (Ongoing)**

* **3.1 Code Splitting (JavaScript):**  Break large JavaScript bundles into smaller chunks that are loaded on demand. This significantly reduces initial load times.
* **3.2 Font Optimization:**
    * Use WOFF2 format, which offers better compression.
    * Subset fonts to
