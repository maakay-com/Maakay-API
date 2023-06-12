interface ITokenData {
  title: string;
  symbol: string;
  logoUrl: string;
  requiresMetadata: boolean;
  tokenInfoUrl: string;
}

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

const tokenData: ITokenData[] = [
  {
    title: "Bitcoin",
    symbol: "btc",
    logoUrl: "btc_logo.com",
    requiresMetadata: false,
    tokenInfoUrl: "https://www.blockchain.com/btc/address/",
  },
  {
    title: "Ethereum",
    symbol: "eth",
    logoUrl: "eth_logo.com",
    requiresMetadata: false,
    tokenInfoUrl: "https://etherscan.io/address/",
  },
  {
    title: "Stellar",
    symbol: "xlm",
    logoUrl: "xlm_logo.com",
    requiresMetadata: true,
    tokenInfoUrl: "https://stellar.expert/explorer/public/account/",
  },
];

export { platformData, tokenData };
