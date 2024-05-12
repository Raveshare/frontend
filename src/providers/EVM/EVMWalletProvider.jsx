import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import {
  polygon,
  mainnet,
  zora,
  optimism,
  base,
  polygonMumbai,
  baseSepolia,
  arbitrum,
} from "wagmi/chains";
import {
  ALCHEMY_API_KEY,
  ENVIRONMENT,
  WALLETCONNECT_PROJECT_ID,
} from "../../services"; 
import { WagmiProvider, http  } from "wagmi";

// const { chains, publicClient } = configureChains(
//   ENVIRONMENT === "production"
//     ? [polygon, mainnet, base, zora, optimism, arbitrum]
//     : [polygonMumbai, baseSepolia],
//   [alchemyProvider({ apiKey: ALCHEMY_API_KEY }), publicProvider()]
// );

// const connectors = connectorsForWallets([
//   {
//     groupName: "Recommended",
//     wallets: [
//       metaMaskWallet({ projectId: WALLETCONNECT_PROJECT_ID, chains }),
//       phantomWallet({ chains }),
//       rabbyWallet({ chains }),
//       rainbowWallet({ projectId: WALLETCONNECT_PROJECT_ID, chains }),
//       walletConnectWallet({ projectId: WALLETCONNECT_PROJECT_ID, chains }),
//       coinbaseWallet({ chains }),
//     ],
//   },
// ]);

const config = getDefaultConfig({
  appName: "Poster.fun",
  projectId: WALLETCONNECT_PROJECT_ID,
  chains:
    ENVIRONMENT === "production"
      ? [polygon, mainnet, base, zora, optimism, arbitrum]
      : [polygonMumbai, baseSepolia],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [zora.id]: http(),
    [optimism.id]: http(),
    [base.id]: http(),
    [polygonMumbai.id]: http(),
    [baseSepolia.id]: http(),
    [arbitrum.id]: http(),
  },
});

const queryClient = new QueryClient();

const EVMWalletProvider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider coolMode={true}>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default EVMWalletProvider;
