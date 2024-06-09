import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
import { ENVIRONMENT, WALLETCONNECT_PROJECT_ID } from "../../services";
import { http } from "wagmi";

import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider, createConfig } from "@privy-io/wagmi";

// Replace this with your Privy config
export const privyConfig = {
  embeddedWallets: {
    createOnLogin: "users-without-wallets",
    requireUserPasswordOnCreate: true,
    noPromptOnSignature: false,
  },
  appearance: {
    loginMessage: "Login to Poster.fun",
  },
  loginMethods: ["wallet", "email", "sms", "farcaster"],
  appearance: {
    showWalletLoginFirst: true,
  },
};

export const config = createConfig({
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
    <PrivyProvider appId="clvysua9y0a63qk92kex0ulud" config={privyConfig}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
};

export default EVMWalletProvider;
