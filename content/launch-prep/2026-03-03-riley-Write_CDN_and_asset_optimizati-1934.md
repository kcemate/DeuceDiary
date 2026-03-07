# Write CDN and asset optimization plan.
Agent: riley
Generated: 2026-03-03T19:34:37.936175

## CDN & Asset Optimization Plan

This plan outlines a comprehensive strategy for implementing a Content Delivery Network (CDN) and optimizing your website’s assets to improve performance, user experience, and SEO.

**I. Goals & Objectives**

* **Reduce Page Load Times:** Primary goal – aim for under 3 seconds for key pages.
* **Improve User Experience:** Faster loading = happier users, lower bounce rates, and increased engagement.
* **Increase SEO Rankings:** Google considers page speed a ranking factor.
* **Reduce Server Load:** Offload static assets to the CDN, freeing up server resources.
* **Global Reach:** Deliver content quickly to users worldwide.

**II. CDN Implementation**

* **CDN Provider Selection:**
    * **Popular Options:** Cloudflare, Akamai, Amazon CloudFront, Google Cloud CDN, Fastly.
    * **Selection Criteria:**
        * **Pricing:** Understand the different tiers and potential costs.
        * **Global Network:** Coverage – does the CDN have points of presence (PoPs) in key regions?
        * **Features:** SSL/TLS support, caching rules, analytics, integration with your existing infrastructure.
        * **Support:** Level of technical support offered.
* **CDN Configuration:**
    * **Origin Server:** Identify your primary web server hosting your website.
    * **Cache Settings:**
        * **Cache TTL (Time To Live):** Determine how long assets should be cached. Dynamic content may require shorter TTLs than static assets.
        * **Cache Busting:** Implement mechanisms to force browsers to re-download assets when changes are made to them (e.g., query string parameters, file name versioning).
    * **Geo-Filtering (Optional):** Restrict access to certain content based on geographical location.
* **DNS Configuration:** Update your DNS records to point to the CDN’s nameservers. The CDN provider will guide you through this.


**III. Asset Optimization**

This section focuses on optimizing the files that your website serves.

* **1. Image Optimization:**
    * **Compression:** Use lossless or lossy compression techniques (e.g., WebP, JPEG 2000, JPEG) to reduce file sizes.  WebP is highly recommended for superior compression.
    * **Resizing:** Serve images at the appropriate size for the display. Avoid delivering large, full-resolution images that are scaled down by the browser.
    * **Responsive Images:**  Utilize the `<picture>` element or the `srcset` attribute in `<img>` tags to serve different image sizes based on the user’s device and screen size.
    * **Lazy Loading:** Load images only when they are visible in the viewport. This significantly reduces initial page load time.
* **2. CSS & JavaScript Optimization:**
    * **Minification:** Remove unnecessary characters (whitespace, comments) from CSS and JavaScript files.
    * **Concatenation:** Combine multiple CSS and JavaScript files into fewer files to reduce the number of HTTP requests. (However, HTTP/2 makes this less critical.)
    * **Code Splitting:** Divide your JavaScript code into smaller chunks that can be loaded on demand (especially useful for large applications).
    * **Remove Unused Code:**  Identify and remove unused CSS and JavaScript files. Tools like PurifyCSS and UnCSS can help with this.
* **3. Font Optimization:**
    * **Use Web Fonts Sparingly:** Web fonts can significantly increase page load times.
    * **Subset Fonts:** Create smaller font files that contain only the characters you actually use.
    * **Font Format:** Use WOFF2 format, as it offers the best compression and browser support.
* **4. Leverage Browser Caching:** Configure your web server to set appropriate `Cache-Control` headers to enable
