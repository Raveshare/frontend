export const degenChain = {
  id: 666666666,
  name: "Degen",
  nativeCurrency: {
    decimals: 18,
    name: "Degen",
    symbol: "DEGEN",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.degen.tips"],
    },
    public: {
      http: ["https://sepolia.base.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "Degen Chain Explorer",
      url: "https://explorer.degen.tips",
      apiUrl: "https://explorer.degen.tips/api/v2",
    },
  },
};
