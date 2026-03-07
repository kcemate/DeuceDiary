# Write CDN and asset optimization plan.
Agent: riley
Generated: 2026-03-04T11:03:42.464476

## CDN and Asset Optimization Plan

This plan outlines a comprehensive strategy for leveraging a Content Delivery Network (CDN) and optimizing your website's assets to improve performance, user experience, and SEO.

**I. Goals & Objectives:**

* **Reduce Load Times:**  Significantly decrease the time it takes for users to load your website, leading to higher engagement and lower bounce rates.
* **Improve User Experience:** Provide a smooth and responsive experience for users globally, regardless of their location.
* **Boost SEO:** Faster page load speeds are a significant ranking factor in Google’s algorithm.
* **Reduce Server Load:** Offload static asset delivery to the CDN, freeing up your origin server to handle dynamic content.
* **Increase Conversion Rates:** Faster loading times can directly impact conversion rates.


**II. CDN Selection & Configuration:**

* **CDN Options:**
    * **Cloudflare:** Popular, affordable, and offers a generous free tier. Good for basic CDN functionality and DDoS protection.
    * **Amazon CloudFront:** AWS’s CDN, highly scalable and integrates seamlessly with other AWS services. Good for complex architectures.
    * **Google Cloud CDN:** Leverages Google’s global network and integrates with Google Cloud Platform.
    * **Akamai:** Enterprise-grade CDN known for high performance and reliability. Often used for large, high-traffic websites.
    * **Fastly:** Focused on edge computing and low-latency delivery. 

* **Selection Criteria:**
    * **Global Coverage:** Ensure the CDN has Points of Presence (PoPs) in regions where your target audience resides.
    * **Performance:** Research CDN performance benchmarks and consider a trial to test its speed.
    * **Features:** Evaluate features like DDoS protection, SSL/TLS support, caching rules, and integration with your existing infrastructure.
    * **Pricing:** Compare pricing models (pay-as-you-go, monthly subscriptions) and understand potential costs.

* **Configuration:**
    * **Origin Server Configuration:**  Point your CDN to your origin server (where your website's files are hosted).
    * **Caching Rules:** Define caching rules for your assets based on their expiration times (e.g., images, CSS, JavaScript, fonts).  Consider using cache-busting techniques (e.g., query strings, version numbers) to force updates.
    * **Geo-Restrictions (If Needed):**  Implement geo-restrictions if you need to restrict access to certain content based on location.
    * **HTTPS Configuration:**  Ensure your CDN supports HTTPS and that SSL/TLS certificates are properly configured for secure delivery.



**III. Asset Optimization:**

* **Image Optimization:**
    * **Compression:** Use tools like TinyPNG, ImageOptim, or ShortPixel to compress images without significant quality loss.  Choose the appropriate format (WebP is preferred, JPG for photos, PNG for graphics with transparency).
    * **Resizing:**  Serve images at the exact dimensions they are displayed on your website. Don't send large images that are scaled down by the browser.
    * **Lazy Loading:** Load images only when they are visible in the viewport.
    * **Responsive Images:** Use the `<picture>` element or `srcset` attribute in `<img>` tags to deliver different image sizes based on device screen size.
* **CSS and JavaScript Optimization:**
    * **Minification:** Remove unnecessary characters (whitespace, comments) from CSS and JavaScript files to reduce their size.
    * **Concatenation:** Combine multiple CSS and JavaScript files into fewer files to reduce the number of HTTP requests. (However, with HTTP/2, this is less crucial).
    * **Code Splitting (for JavaScript):** Break up large JavaScript bundles into smaller chunks to reduce initial load times.
    * **Defer Loading of Non-Critical
