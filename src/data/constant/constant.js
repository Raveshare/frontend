import { ENVIRONMENT } from "../../services";
import { FRAME_URLS } from "./frameUrls";
import { MINT_URLS } from "./mintUrls";

// Sign messages
export const EVM_MESSAGE = "This message is to login you into lenspost dapp.";

export const SOLANA_MESSAGE =
  "Clicking Sign or Approve only means you have proved this wallet is owned by you. This request will not trigger any blockchain transaction or cost any gas fee.";

// App constants
export const APP_NAME = "Poster";
export const APP_DESCRIPTION = `${APP_NAME} is a fun onchain 'canva' that turns NFT holders into content creators with one click drag-drop-remix! Make NFTs do more for you as you churn out DOPE memes, gifs, social content & more! The most fun way to permissionlessly collaborate, monetize & even split revenues across chains. We're NFT INFRA at the back, RAVE party in the front - powering co-creation, revenue share & social distribution with BIG MEME ENERGY!`;
export const APP_URL = "https://app.poster.fun";

export const APP_LENS_HANDLE = "@lenspost";
export const APP_SOLANA_ADDRESS =
  "2PsV6hNEUc3rSMGqKcHTnRBemaWBQX3dYgUqVtEFxkwa";
export const APP_ETH_ADDRESS = "0x77fAD8D0FcfD481dAf98D0D156970A281e66761b";

export const FREE_MINTS = 10;
export const FRAME_URL = FRAME_URLS[ENVIRONMENT];
export const MINT_URL = MINT_URLS[ENVIRONMENT];

// this is wrap degen
export const ETH_CURRENCY_ADDRESS =
  "0x0000000000000000000000000000000000000000";
export const WDEGEN_CURRENCY_ADDRESS =
  "0xeb54dacb4c2ccb64f8074eceea33b5ebb38e5387";
export const DEGEN_CURRENCY_ADDRESS =
  "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed";

export const isSponsoredChain = [8453, 42161];
