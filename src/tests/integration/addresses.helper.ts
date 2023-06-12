import Address from "../../addresses/addresses.model";

const seedUserAddress = async (userId: string) => {
  const addresses = [
    {
      accountNumber: "0x123456789123456789123456789",
      token: {
        symbol: "eth",
        title: "Ethereum",
        logoUrl: "https://eth.io/logo.png",
        requiresMetadata: false,
        tokenInfoUrl: "https://eth.io",
      },
      metadata: "",
      user: userId,
    },
    {
      accountNumber: "3ExEQtSxPTQuzpRfqSGEsBJM8FxuswmqLU",
      token: {
        symbol: "btc",
        title: "Bitcoin",
        logoUrl: "https://btc.io/logo.png",
        requiresMetadata: false,
        tokenInfoUrl: "https://btc.io",
      },
      metadata: "",
      user: userId,
    },
  ];

  const newAddresses = await Address.insertMany(addresses);
  return newAddresses;
};

export { seedUserAddress };
