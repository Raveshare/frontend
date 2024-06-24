import { arbitrum } from "viem/chains";

const MULTIPLIER_ARBITRUM = 10 ** 6;
const MULTIPLIER_DEFAULT = 10 ** 18;

export const priceFormatter = (chainId, price) => {
  const { id: arbitrumId } = arbitrum || {};

  const multiplier =
    chainId === arbitrumId ? MULTIPLIER_ARBITRUM : MULTIPLIER_DEFAULT;

  return Number(price) * multiplier;
};
