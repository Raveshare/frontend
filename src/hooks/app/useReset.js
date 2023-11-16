import { useContext } from "react";
import { Context } from "../../providers/context";
import { useStore } from "../polotno";

const useReset = () => {
  const store = useStore();
  const {
    setIsLoading,
    setText,
    contextCanvasIdRef,

    // for twitter auth
    setQueryParams,

    // for open different menu in share
    setMenu,

    // for lens monetization
    setEnabled,
    setPostDescription,
    setOpen,

    // for calendar
    setStFormattedDate,
    setStFormattedTime,
    setStCalendarClicked,

    // for preview
    setFastPreview,

    // Right Sidebar
    setIsShareOpen,

    // user public templates states
    referredFromRef,

    // elementId and handle data for lens collect nft
    lensCollectNftRecipientDataRef,

    // elementId and handle data for assets nft
    assetsRecipientDataRef,

    // elementId and handle data for solana nfts nft
    nftRecipientDataRef,

    // elementId and handle data for BG remover nft
    bgRemoverRecipientDataRef,

    // elementId and handle data getting from BE
    preStoredRecipientDataRef,

    // It has all the DataRefs data
    parentRecipientDataRef,

    // It hass all the recipients list (kind of final recipient list but some address/)
    parentRecipientListRef,

    // for lens monetization price error
    setPriceError,

    // for lens monetization split error
    setSplitError,

    // for lens monetization edition error
    setEditionError,

    // for lens monetization referral error
    setReferralError,

    // for solana mint
    setSolanaEnabled,

    // for solana mint error
    setSolanaStatesError,
  } = useContext(Context);

  const resetState = () => {
    // clear the page
    store.clear({ keepHistory: true });
    store.addPage();

    // reset all the states
    setIsLoading(false);
    setText("");
    contextCanvasIdRef.current = null;
    setQueryParams({
      oauth_token: "",
      oauth_verifier: "",
    });
    setMenu("share");
    setEnabled({
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
    setPostDescription("");
    setOpen(false);
    setStFormattedDate("");
    setStFormattedTime("");
    setStCalendarClicked(false);
    setFastPreview(false);
    setIsShareOpen(false);
    referredFromRef.current = [];
    lensCollectNftRecipientDataRef.current = [];
    assetsRecipientDataRef.current = [];
    nftRecipientDataRef.current = [];
    bgRemoverRecipientDataRef.current = [];
    preStoredRecipientDataRef.current = [];
    parentRecipientDataRef.current = [];
    parentRecipientListRef.current = [];
    setPriceError({
      isError: false,
      message: "",
    });
    setSplitError({
      isError: false,
      message: "",
    });
    setEditionError({
      isError: false,
      message: "",
    });
    setReferralError({
      isError: false,
      message: "",
    });
    setSolanaEnabled({
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
    setSolanaStatesError({
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
  };

  return { resetState };
};

export default useReset;
