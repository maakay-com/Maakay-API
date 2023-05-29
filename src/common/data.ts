const platformData = [
  {
    title: "Facebook",
    logoUrl: "logo_facebook.com",
    baseUrl: "https://www.facebook.com/",
  },
  {
    title: "Twitter",
    logoUrl: "logo_twitter.com",
    baseUrl: "https://twitter.com/",
  },
  {
    title: "Instagram",
    logoUrl: "logo_instagram.com",
    baseUrl: "https://www.instagram.com/",
  },
];

const tokenData = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    logoUrl: "btc_logo.com",
    requiresMetadata: false,
    tokenInfoUrl: "https://www.blockchain.com/btc/address/",
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    logoUrl: "eth_logo.com",
    requiresMetadata: false,
    tokenInfoUrl: "https://etherscan.io/address/",
  },
];

module.exports = {
  platformData,
  tokenData,
};
