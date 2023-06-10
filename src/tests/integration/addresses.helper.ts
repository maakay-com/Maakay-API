import Address from "../../addresses/addresses.model";

const seedUserAddress = async (userId: string) => {
  const addresses = [
    {
      accountNumber: "0x123456789123456789123456789",
      token: {
        symbol: "ETH",
        title: "Ethereum",
        logoUrl: "https://eth.io/logo.png",
        requiresMetadata: false,
        tokenInfoUrl: "https://eth.io",
      },
      metadata: "",
      user: userId,
    },
    {
      accountNumber: "0x987654321123456789123456789",
      token: {
        symbol: "BTC",
        title: "Bitcoin",
        logoUrl: "https://btc.io/logo.png",
        requiresMetadata: false,
        tokenInfoUrl: "https://btc.io",
      },
      metadata: "",
      user: userId,
    },
  ];

  await Address.insertMany(addresses);
};

export { seedUserAddress };
