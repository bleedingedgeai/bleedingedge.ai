const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  images: {
    domains: ["pbs.twimg.com", "abs.twimg.com"],
  },
  compiler: {
    styledComponents: true,
  },
  headers() {
    return [
      {
        source: "/fonts/:slug*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, stale-while-revalidate",
          },
        ],
      },
    ];
  },
  rewrites: async () => [
    {
      source: "/rss.xml",
      destination: "/api/rss?format=xml",
    },
    {
      source: "/rss.json",
      destination: "/api/rss?format=json",
    },
    {
      source: "/rss/feed.xml",
      destination: "/api/rss?format=xml",
    },
    {
      source: "/rss/feed.json",
      destination: "/api/rss?format=json",
    },
  ],
});
