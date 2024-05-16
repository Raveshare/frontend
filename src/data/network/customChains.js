// const degenNetwork = {
//     id: 666666666,
//     name: "Degen",
//     network: "degen",
//     nativeCurrency: {
//       name: "Degen",
//       symbol: "DEGEN",
//       decimals: 18,
//     },
//     rpcUrls: {
//       default: "https://rpc.degen.tips",
//     },
//     blockExplorers: {
//       default: {
//         name: "Degen",
//         url: "https://explorer.degen.tips",
//       },
//     },
//   };

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
      webSocket: ["wss://rpc.degen.tips"],
    },
  },
  blockExplorers: {
    default: {
      name: "Degen Chain Explorer",
      url: "https://explorer.degen.tips",
      apiUrl: "https://explorer.degen.tips/api/v2",
    },
  },
  // contracts: {
  //   multicall3: {
  //     address: "",
  //     blockCreated: 0,
  //   },
  // },
};
