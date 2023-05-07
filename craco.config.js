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
          crypto: require.resolve("crypto-browserify"),
          stream: require.resolve("stream-browserify"),
          buffer: require.resolve("buffer/"),
          fs: false,
        },
      },
    },
  },
};
