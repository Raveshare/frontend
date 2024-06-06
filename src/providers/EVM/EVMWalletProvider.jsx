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
import { publicActions } from "viem";
import { degen, ham } from "../../data";

const { chains, publicClient } = configureChains(
  ENVIRONMENT === "production"
    ? [base, mainnet, zora, optimism, arbitrum, polygon, degen, ham]
    : [base, baseSepolia, sepolia, polygonMumbai, degen, ham],
  [alchemyProvider({ apiKey: ALCHEMY_API_KEY }), publicProvider()]
);

export const config = getDefaultConfig({
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
