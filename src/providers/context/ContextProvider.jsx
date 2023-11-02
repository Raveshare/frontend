import React, { createContext, useRef, useState } from "react";
import posthog from "posthog-js";

posthog.init("phc_CvXLACFkyLdhJjiGLxlix6ihbGjumRvGjUFSinPWJYD", {
  api_host: "https://eu.posthog.com",
});

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");
  const contextCanvasIdRef = useRef(null);

  // for twitter auth
  const [queryParams, setQueryParams] = useState({
    oauth_token: "",
    oauth_verifier: "",
  });

  // for open different menu in share
  const [menu, setMenu] = useState("share");

  // for lens monetization
  const [enabled, setEnabled] = useState({
    chargeForCollect: false,
    chargeForCollectPrice: "1",
    chargeForCollectCurrency: "WMATIC",

    mirrorReferralReward: false,
    mirrorReferralRewardFee: 25.0,

    splitRevenueRecipients: [
      {
        recipient: "",
        split: 0.0,
      },
    ],

    limitedEdition: false,
    limitedEditionNumber: "1",

    timeLimit: false,
    endTimestamp: {
      date: "",
      time: "",
    },

    whoCanCollect: false,
  });

  const [solanaEnabled, setSolanaEnabled] = useState({
    isChargeForMint: false,
    chargeForMintPrice: "",
    chargeForMintCurrency: "",

    // Array of List of Contract Addresses / Input Boxes
    isOnChainSplits: true,
    onChainSplitRecipients: [
      {
        address: "",
        share: null,
      },
    ],

    isSellerFeeBasisPoints: false,
    sellerFeeBasisPoints: "",

    isLimitedEdition: false,
    limitedEditionNumber: "",

    isTimeLimit: false,
    startTimeStamp: {
      date: "",
      time: "",
    },
    endTimestamp: {
      date: "",
      time: "",
    },

    isAllowlist: false,
    allowlistAddresses: [""],

    isNftBurnable: false,
    nftBurnableContractAddresses: [""],

    isNftGate: false,
    nftGateContractAddresses: [""],

    isTokenGate: false,
    tokenGateContractAddresses: [""],
  });

  const [solanaStatesError, setSolanaStatesError] = useState({
    isChargeForMintError: false,
    chargeForMintErrorMessage: "",

    isSplitError: false,
    splitErrorMessage: "",

    isSellerFeeError: false,
    sellerFeeErrorMessage: "",

    isLimitedEditionError: false,
    limitedEditionErrorMessage: "",

    isTimeLimitError: false,
    timeLimitErrorMessage: "",

    isAllowlistError: false,
    allowlistErrorMessage: "",

    isNftBurnableError: false,
    nftBurnableErrorMessage: "",

    isNftGateError: false,
    nftGateErrorMessage: "",

    isTokenGateError: false,
    tokenGateErrorMessage: "",
  });

  const [zoraEnabled, setZoraEnabled] = useState({
    isChargeForMint: false,
    chargeForMintPrice: "",
    chargeForMintCurrency: "",

    isLimitedEdition: false,
    limitedEditionNumber: "",

    isMintLimitPerAddress: false,
    mintLimitPerAddress: "",

    isScheduleMint: false,
    scheduleMintTimeStamp: {
      date: "",
      time: "",
    },

    isRoyaltySplits: true,
    royaltySplitRecipients: [
      {
        address: "",
        share: null,
      },
    ],

    isRoyaltyPercent: false,
    royaltyPercent: "",

    isMaxSupply: false,
    maxSupply: "",

    isPresaleSchedule: false,
    presaleStartTimeStamp: {
      date: "",
      time: "",
    },
    presaleEndTimeStamp: {
      date: "",
      time: "",
    },

    isPublicsaleSchedule: false,
    publicsaleStartTimeStamp: {
      date: "",
      time: "",
    },

    publicsaleEndTimeStamp: {
      date: "",
      time: "",
    },

    isContractDetails: false,
    contractName: "",
    contractSymbol: "",
  });

  const [zoraStatesError, setZoraStatesError] = useState({
    isChargeForMintError: false,
    chargeForMintErrorMessage: "",

    isLimitedEditionError: false,
    limitedEditionErrorMessage: "",

    isMintLimitPerAddressError: false,
    mintLimitPerAddressMessage: "",

    isScheduleMintError: false,
    scheduleMintErrorMessage: "",

    isRoyaltySplitError: false,
    royaltySplitErrorMessage: "",

    isRoyaltyPercentError: false,
    royaltyPercentErrorMessage: "",

    isMaxSupplyError: false,
    maxSupplyErrorMessage: "",

    isPresaleScheduleError: false,
    presaleScheduleErrorMessage: "",

    isPublicsaleScheduleError: false,
    publicsaleScheduleErrorMessage: "",
  });

  const [postDescription, setPostDescription] = useState("");
  const [open, setOpen] = useState(false);

  // for calendar
  const [stFormattedDate, setStFormattedDate] = useState("");
  const [stFormattedTime, setStFormattedTime] = useState("");
  const [stCalendarClicked, setStCalendarClicked] = useState(false);

  // for preview
  const [fastPreview, setFastPreview] = useState([]);

  // for split revenue eligible address/recipient
  const referredFromRef = useRef([]);

  // owner address of canvas
  const canvasOwnerAddressRef = useRef("");

  // NOTE: dataRefs has elementId and handle data {elementId: "elementId", handle: "handle"}

  // elementId and handle data for lens collect nft
  const lensCollectNftRecipientDataRef = useRef([]);

  // elementId and handle data for assets nft
  const assetsRecipientDataRef = useRef([]);

  // elementId and handle data for solana nfts nft
  const solanaNftRecipientDataRef = useRef([]);

  // elementId and handle data for BG remover nft
  const bgRemoverRecipientDataRef = useRef([]);

  // elementId and handle data getting from BE
  const preStoredRecipientDataRef = useRef([]);

  // It has all the DataRefs data
  const parentRecipientDataRef = useRef([]);

  // solana NFT recipients list
  const solanaNftRecipientListRef = useRef([]);

  // It hass all the recipients list (kind of final recipient list but some address/)
  const parentRecipientListRef = useRef([]);

  // It has all the recipients list for Zora Royalty (kind of final recipient list but some address/)
  const parentZoraRoyaltyListRef = useRef([]);

  // Right Sidebar
  const [isShareOpen, setIsShareOpen] = useState(false);

  // for lens monetization price error
  const [priceError, setPriceError] = useState({
    isError: false,
    message: "",
  });

  // for lens monetization split error
  const [splitError, setSplitError] = useState({
    isError: false,
    message: "",
  });

  // for lens monetization edition error
  const [editionError, setEditionError] = useState({
    isError: false,
    message: "",
  });

  // for lens monetization referral error
  const [referralError, setReferralError] = useState({
    isError: false,
    message: "",
  });

  // for explore dilog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [explorerLink, setExplorerLink] = useState("");

  const handleOpen = () => setDialogOpen((cur) => !cur);

  // console.log("ContextProvider", solanaEnabled.onChainSplitRecipients);

  return (
    <Context.Provider
      value={{
        isLoading,
        setIsLoading,
        text,
        setText,
        contextCanvasIdRef,

        // for twitter auth
        queryParams,
        setQueryParams,

        // for open different menu in share
        menu,
        setMenu,

        // for lens monetization
        enabled,
        setEnabled,
        postDescription,
        setPostDescription,
        open,
        setOpen,

        // for calendar
        stFormattedDate,
        setStFormattedDate,
        stFormattedTime,
        setStFormattedTime,
        stCalendarClicked,
        setStCalendarClicked,

        // for preview
        fastPreview,
        setFastPreview,

        // Right Sidebar
        isShareOpen,
        setIsShareOpen,

        // user public templates states
        referredFromRef,

        // elementId and handle data for lens collect nft
        lensCollectNftRecipientDataRef,

        // elementId and handle data for assets nft
        assetsRecipientDataRef,

        // elementId and handle data for solana nfts nft
        solanaNftRecipientDataRef,

        // elementId and handle data for BG remover nft
        bgRemoverRecipientDataRef,

        // elementId and handle data getting from BE
        preStoredRecipientDataRef,

        // It has all the DataRefs data
        parentRecipientDataRef,

        // solana NFT recipients list
        solanaNftRecipientListRef,

        // It hass all the recipients list (kind of final recipient list but some address/)
        parentRecipientListRef,

        // It hass all the recipients list (kind of final recipient list but some address/)
        parentZoraRoyaltyListRef,

        // for lens monetization price error
        priceError,
        setPriceError,

        // for lens monetization split error
        splitError,
        setSplitError,

        // for lens monetization edition error
        editionError,
        setEditionError,

        // for lens monetization referral error
        referralError,
        setReferralError,

        // posthog analytics
        posthog,

        // for solana mint
        solanaEnabled,
        setSolanaEnabled,

        // for solana mint error
        solanaStatesError,
        setSolanaStatesError,

        // for explorer dilog
        dialogOpen,
        setDialogOpen,
        explorerLink,
        setExplorerLink,
        handleOpen,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
