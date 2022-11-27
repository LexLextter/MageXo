module.exports = {
  client: {
    service: {
      name: "Mage-Xo",
      // URL to the GraphQL API
      url: "https://venia.magento.com/graphql",
    },
    // Files processed by the extension
    includes: ["src/**/*.vue", "src/**/*.ts"],
  },
};
