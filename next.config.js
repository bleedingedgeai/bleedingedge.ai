module.exports = {
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
};
