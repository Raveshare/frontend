import { defineChain } from "viem";

export const og = defineChain({
  id: 16600,
  name: "Og",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: [" https://rpc-testnet.0g.ai/"],
    },
    public: {
      http: [" https://rpc-testnet.0g.ai/"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://chainscan-newton.0g.ai" },
  },
  contracts: {},
});
