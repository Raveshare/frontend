import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, sepolia, WagmiConfig } from "wagmi";
import {
  polygon,
  mainnet,
  zora,
  optimism,
  base,
  polygonMumbai,
  zoraTestnet,
  goerli,
  baseGoerli,
  optimismGoerli,
  baseSepolia,
  arbitrum,
} from "wagmi/chains";
import {
  coinbaseWallet,
  ledgerWallet,
  metaMaskWallet,
  phantomWallet,
  rabbyWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import {
  ALCHEMY_API_KEY,
  ENVIRONMENT,
  WALLETCONNECT_PROJECT_ID,
} from "../../services";
import { publicActions } from "viem";
import { degenChain } from "../../data";

const { chains, publicClient } = configureChains(
  ENVIRONMENT === "production"
    ? [base, mainnet, zora, optimism, arbitrum, polygon, degenChain]
    : [base, degenChain, baseSepolia, sepolia, polygonMumbai],
  [alchemyProvider({ apiKey: ALCHEMY_API_KEY }), publicProvider()]
);

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      metaMaskWallet({ projectId: WALLETCONNECT_PROJECT_ID, chains }),
      phantomWallet({ chains }),
      rabbyWallet({ chains }),
      rainbowWallet({ projectId: WALLETCONNECT_PROJECT_ID, chains }),
      walletConnectWallet({ projectId: WALLETCONNECT_PROJECT_ID, chains }),
      coinbaseWallet({ chains }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const EVMWalletProvider = ({ children }) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} coolMode={true}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default EVMWalletProvider;
