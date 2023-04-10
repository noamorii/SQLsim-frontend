const path = require("path");

module.exports = {
  webpack: {
    configure: {
      // See https://github.com/webpack/webpack/issues/6725
      module: {
        rules: [
          {
            test: /\.wasm$/,
            type: "javascript/auto",
          },
        ],
      },
      resolve: {
        fallback: {
          path: require.resolve("path-browserify"),
          fs: false,
        },
      },
    },
  },
};
