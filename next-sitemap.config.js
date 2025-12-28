/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://arshianbaft.com",
  generateRobotsTxt: true,
  sitemapSize: 7000, // Split large sitemaps
  generateIndexSitemap: false, // Disable index sitemap (enable for large sites)
  exclude: ["/dashboard"],
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/dashboard", "/payment"] },
    ],
    additionalSitemaps: [
      "https://arshianbaft.com/product-sitemap.xml", // If you have additional sitemaps
    ],
  },
};
