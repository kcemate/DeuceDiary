# Write CDN and asset optimization plan.
Agent: riley
Generated: 2026-03-04T10:41:07.385118

## CDN & Asset Optimization Plan

This plan outlines a strategy for leveraging a Content Delivery Network (CDN) and optimizing your website's assets to improve performance, user experience, and SEO.

**I. Goals & Objectives:**

* **Reduce Page Load Times:** Significantly decrease the time it takes for pages to load, aiming for under 3 seconds.
* **Improve User Experience:** Provide a smoother and more responsive website experience, leading to higher engagement.
* **Boost SEO:** Faster loading times contribute to improved search engine rankings.
* **Reduce Server Load:** Offload traffic and reduce the strain on your origin server.
* **Increase Mobile Performance:** Ensure a consistently fast experience for users on mobile devices.

**II. CDN Implementation:**

* **CDN Provider Selection:**
    * **Options:** Cloudflare, Akamai, Amazon CloudFront, Google Cloud CDN, Fastly.
    * **Criteria:** Pricing, geographic coverage, features (e.g., DDoS protection, SSL/TLS support, caching rules), integration capabilities, support, and ease of use.
    * **Recommendation:** For many businesses, **Cloudflare** offers a good balance of price, features, and ease of use.
* **CDN Configuration:**
    * **Global Edge Network:** Choose a CDN with a broad global network to minimize latency for users worldwide.
    * **Caching Rules:** Implement appropriate caching rules based on asset types and expiry times.
        * **Static Assets:** Images, CSS, JavaScript, fonts (Cache for longer periods - 7 days, 30 days, or longer based on content changes)
        * **Dynamic Content:** Use caching headers judiciously, considering the variability of dynamic content. Implement techniques like cache invalidation.
    * **SSL/TLS Configuration:** Ensure all CDN traffic is encrypted with HTTPS for security and SEO benefits.
    * **Geographic Restrictions (Optional):** Limit access to certain content based on location if required.
    * **Purge Cache on Content Changes:**  Implement a system to trigger cache invalidation whenever content updates (e.g., via CMS or API).

**III. Asset Optimization:**

* **Image Optimization:**
    * **Compression:** Use lossless (e.g., WebP) or lossy compression to reduce image file sizes without significant quality loss. Tools: TinyPNG, ImageOptim, Squoosh.
    * **Resizing:** Serve images at the appropriate dimensions for their display size. Avoid serving large images that are scaled down by the browser.
    * **Format Conversion:**  Utilize modern image formats like WebP (superior compression and quality) and AVIF.
    * **Responsive Images:** Implement the `<picture>` element or `srcset` attribute in `<img>` tags to deliver different image sizes based on the user’s device and screen size.
* **CSS & JavaScript Optimization:**
    * **Minification:** Remove unnecessary characters (whitespace, comments) from CSS and JavaScript files to reduce their size. Tools: CSSNano, UglifyJS, Terser.
    * **Bundling:** Combine multiple CSS and JavaScript files into fewer files to reduce the number of HTTP requests.  Tools: Webpack, Parcel, Rollup.
    * **Code Splitting:**  Break large JavaScript files into smaller chunks that can be loaded on demand, improving initial page load time.
    * **Remove Unused Code:**  Identify and remove unused CSS and JavaScript code.  Tools: PurifyCSS, UnCSS.
* **Font Optimization:**
    * **Web Font Formats:** Use WOFF2 format for optimal compression and browser compatibility.
    * **Font Subsetting:**  Include only the characters used on your website to reduce font file size.
    * **Preloading:**  Use the `<link rel="preload">` tag to prioritize loading critical fonts
