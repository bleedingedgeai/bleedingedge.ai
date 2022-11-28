const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  images: {
    domains: ["pbs.twimg.com"],
  },
  compiler: {
    styledComponents: true,
  },
});
