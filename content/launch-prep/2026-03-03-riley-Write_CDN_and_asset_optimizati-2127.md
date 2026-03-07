# Write CDN and asset optimization plan.
Agent: riley
Generated: 2026-03-03T21:27:48.780472

## CDN & Asset Optimization Plan

This plan outlines a strategy for optimizing website performance through the use of a Content Delivery Network (CDN) and aggressive asset optimization. It’s a phased approach, starting with assessment and moving towards continuous improvement.

**I. Phase 1: Assessment & Baseline (1-2 Weeks)**

* **Goal:** Understand current performance, identify key bottlenecks, and establish a baseline.
* **Activities:**
    * **Website Speed Testing:**
        * **Tools:** Google PageSpeed Insights, GTmetrix, WebPageTest.org, Pingdom Website Speed Test
        * **Metrics:**  First Contentful Paint (FCP), Largest Contentful Paint (LCP), Time to Interactive (TTI), Total Blocking Time (TBT), Page Load Time (PLT), Mobile Speed Scores
    * **CDN Analysis:**
        * **Current CDN (if any):** Evaluate current CDN provider (Cloudflare, Akamai, Amazon CloudFront, etc.) - features, pricing, performance.
        * **Origin Server Performance:** Assess the speed and stability of your origin server. This is crucial – a slow origin will negate CDN benefits.
    * **Asset Audit:**
        * **File Types:** Analyze the types of assets (images, JavaScript, CSS, fonts) – their sizes, formats, and usage.
        * **Unoptimized Assets:** Identify any images, CSS, or JavaScript files that are not optimized (e.g., large images, unminified CSS/JS, unused resources).
    * **User Geography:** Analyze the geographic distribution of your website's audience. This informs CDN selection and targeting.
* **Deliverables:**
    * Detailed performance report with key metrics and identified bottlenecks.
    * CDN assessment report.
    * Asset inventory and analysis document.


**II. Phase 2: CDN Implementation & Initial Optimization (2-4 Weeks)**

* **Goal:** Deploy a CDN and implement initial optimizations to address the most critical bottlenecks.
* **Activities:**
    * **CDN Selection & Setup:** Choose a CDN provider based on your needs and budget. Setup the CDN to point to your origin server.
    * **Caching Rules:** Configure caching rules within the CDN – browser caching, edge caching, cache invalidation strategies.
    * **Image Optimization:**
        * **Format Conversion:** Convert images to WebP and AVIF formats (if browser support is sufficient – a progressive approach).
        * **Responsive Images:** Implement responsive images using the `<picture>` element or `srcset` attribute to serve appropriately sized images based on screen size.
        * **Image Compression:** Utilize image compression techniques (lossy and lossless) to reduce file sizes.
    * **JavaScript & CSS Optimization:**
        * **Minification:** Minify JavaScript and CSS files to reduce their size.
        * **Bundling:** Bundle multiple JavaScript files into fewer bundles to reduce HTTP requests.
    * **GZIP Compression:** Enable GZIP compression for text-based assets (CSS, JavaScript, HTML).
* **Monitoring:** Continuously monitor CDN performance and key website metrics using the tools from Phase 1.

**III. Phase 3: Advanced Optimization & Continuous Improvement (Ongoing)**

* **Goal:** Refine optimization strategies and proactively address new performance challenges.
* **Activities:**
    * **Lazy Loading:** Implement lazy loading for images and other resources that are below the fold.
    * **Code Splitting (JavaScript):**  Split your JavaScript code into smaller chunks that can be loaded on demand, improving initial load times.
    * **Font Optimization:**  Use WOFF2 format for fonts, preload critical fonts, and consider font subsetting.
    * **HTTP/2 & HTTP/3:** Ensure your server and CDN support HTTP/2 or HTTP/3 (the latest versions of the
