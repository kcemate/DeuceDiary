# Write CDN and asset optimization plan.
Agent: riley
Generated: 2026-03-03T13:32:23.607520

## CDN & Asset Optimization Plan

This plan outlines a strategy for leveraging a Content Delivery Network (CDN) and optimizing your website's assets to improve performance, user experience, and SEO.

**I. Goals & Objectives:**

* **Reduce Page Load Time:**  Decrease the time it takes for a page to fully load, leading to a smoother user experience.
* **Improve User Experience (UX):** Faster loading speeds translate to higher engagement, lower bounce rates, and increased conversions.
* **Boost SEO:** Google considers page speed as a ranking factor. Faster sites rank higher.
* **Reduce Server Load:**  Offloading static assets to a CDN reduces the load on your origin server.
* **Improve Global Performance:**  Deliver content quickly to users regardless of their location.


**II. Phase 1: Assessment & Analysis (1-2 Weeks)**

1. **Website Performance Audit:**
   * **Tools:** Google PageSpeed Insights, GTmetrix, WebPageTest.org
   * **Metrics:**  Page Load Time, First Byte Time (TTFB), Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), Time to Interactive (TTI)
   * **Identify Bottlenecks:** Analyze the results to pinpoint specific issues (e.g., unoptimized images, slow JavaScript, large CSS files).

2. **Asset Inventory:**
   * **Identify All Assets:** Create a comprehensive list of all static assets on your website:
      * Images (JPG, PNG, GIF, SVG)
      * JavaScript Files
      * CSS Files
      * Fonts
      * Videos
      * WebP Images
   * **Determine Size & Usage:** Analyze the size and how frequently each asset is used.

3. **CDN Research & Selection:**
    * **Evaluate CDN Providers:** Consider factors like:
        * **Global Network:** Coverage and proximity to your target audience.
        * **Pricing:** Bandwidth, storage, and features.
        * **Features:** Support for HTTP/2, WebP, custom domains, and analytics.
        * **Ease of Integration:**  API, plugins, and documentation.
    * **Popular Options:** Cloudflare, Amazon CloudFront, Akamai, Google Cloud CDN.


**III. Phase 2: CDN Implementation & Configuration (2-4 Weeks)**

1. **CDN Account Setup:**  Sign up with your chosen CDN provider and configure your account.
2. **Domain Configuration:** Point your domain (or subdomain) to the CDN.  This will typically involve updating your DNS records.
3. **Origin Server Setup:** Configure your origin server to work with the CDN.  This often involves setting up caching rules.
4. **Caching Rules:**  Implement appropriate caching rules:
   * **Cache-Control Headers:**  Use HTTP headers to control how browsers and the CDN cache your assets.
   * **Invalidation Strategies:**  Plan for invalidating the CDN cache when you make changes to your assets.
5. **HTTPS Configuration:** Ensure your CDN supports HTTPS for secure content delivery.


**IV. Phase 3: Asset Optimization (Ongoing)**

1. **Image Optimization:**
   * **Compression:** Use tools like TinyPNG, ImageOptim, or ShortPixel to compress images without significant quality loss.
   * **Format Conversion:**  Convert images to WebP format, which offers superior compression and quality compared to JPG and PNG.
   * **Responsive Images:**  Serve different image sizes based on the user's device and screen size using the `<picture>` element or the `srcset` attribute in `<img>` tags.
   * **Lazy Loading:** Load images only when they're visible in the viewport.

2. **Code Minification & Bundling:**
   * **Minify:** Remove unnecessary characters (whitespace, comments) from
