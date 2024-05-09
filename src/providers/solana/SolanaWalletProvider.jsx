import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  AlphaWalletAdapter,
  BitKeepWalletAdapter,
  // CensoWalletAdapter,
  AvanaWalletAdapter,
  CloverWalletAdapter,
  CoinbaseWalletAdapter,
} from "@solana/wallet-adapter-wallets";

import { clusterApiUrl } from "@solana/web3.js";
import { createContext, useCallback, useMemo, useState } from "react";
import { ENVIRONMENT, TIPLINK_API_KEY } from "../../services";

import { TipLinkWalletAdapter } from "@tiplink/wallet-adapter";

export const SolanaWalletErrorContext = createContext();

const SolanaWalletProvider = ({ children }) => {
  const [solanaWalletError, setSolanaWalletError] = useState({
    isError: false,
    name: "",
    message: "",
  });

  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network =
    ENVIRONMENT === "production"
      ? WalletAdapterNetwork.Mainnet
      : WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = useMemo(
    () => [
      new LedgerWalletAdapter(),
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
      new AlphaWalletAdapter(),
      new BitKeepWalletAdapter(),
      // new CensoWalletAdapter(),
      new AvanaWalletAdapter(),
      new CloverWalletAdapter(),
      new CoinbaseWalletAdapter(),

      new TipLinkWalletAdapter({
        title: "Poster.fun",
        clientId: TIPLINK_API_KEY,
        theme: "system",
      }),
    ],
    [network]
  );

  const onError = useCallback((error) => {
    console.log({
      message: error.message ? `${error.name}: ${error.message}` : error.name,
    });
    if (error.message) {
      setSolanaWalletError({
        isError: true,
        name: error.name,
        message: error.message,
      });
    } else {
      setSolanaWalletError({
        isError: false,
        name: "",
        message: "",
      });
    }
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect>
        <SolanaWalletErrorContext.Provider
          value={{
            solanaWalletError,
            setSolanaWalletError,
          }}
        >
          {children}
        </SolanaWalletErrorContext.Provider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default SolanaWalletProvider;
