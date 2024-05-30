import {
  BaseLogo,
  EthLogo,
  ZoraLogo,
  OpMainnetLogo,
  arbitrumLogo,
  degenLogo,
} from "../assets";

const chainLogos = {
  1: EthLogo, // Ethereum
  5: EthLogo, // Goerli
  11155111: EthLogo, // Sepolia
  8453: BaseLogo, // Base
  84532: BaseLogo, // Base Sepolia
  7777777: ZoraLogo, // Zora
  10: OpMainnetLogo, // Optimism
  42161: arbitrumLogo, // Arbitrum
  666666666: degenLogo, // Degen
};

export const chainLogo = (chainId) => {
  return chainLogos[chainId] || null;
};
