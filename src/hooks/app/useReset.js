import { useContext } from "react";
import { Context } from "../../providers/context";
import { useStore } from "../polotno";
import { waterMark } from "../../utils";

const useReset = () => {
  const store = useStore();
  const {
    setIsLoading,
    setText,
    contextCanvasIdRef,
    canvasBase64Ref,

    // for twitter auth
    setQueryParams,

    // for open different menu in share
    setMenu,

    // for lens monetization
    setEnabled,
    setPostName,
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

    // For Profile Panel
    setIsProfileOpen,
    setOpenedProfileModal,
    setDialogOpen,
    setExplorerLink,
    setUserProfileDetails,

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

    // for zora mint tab
    setZoraTab,

    // lens tab
    setLensTab,

    // farcaster tab
    setFarcasterTab,

    // for zora erc721 edition tab
    setZoraErc721Enabled,

    // for zora mint error
    setZoraErc721StatesError,

    // farcaster states
    farcasterStates,
    setFarcasterStates,

    // solana tabs
    setSolanaTab,
  } = useContext(Context);

  const resetState = () => {
    // clear the page
    store.clear({ keepHistory: true });
    store.addPage();

    store.setSize(1080, 1080);

    // reset all the states
    setIsLoading(false);
    setText("");
    contextCanvasIdRef.current = null;
    canvasBase64Ref.current = null;
    setQueryParams({
      oauth_token: "",
      oauth_verifier: "",
    });

    // tabs
    setMenu("share");
    setZoraTab("ERC721");
    setLensTab("normalPost");
    setFarcasterTab("normalPost");

    // reset all the states for lens monetization
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
    setPostName("");
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

    // solana tabs
    setSolanaTab("cnft");

    // reset all the states for solana mint
    setSolanaEnabled({
      isChargeForMint: true,
      chargeForMintPrice: "",
      chargeForMintCurrency: "SOL",

      // Array of List of Contract Addresses / Input Boxes
      isOnChainSplits: true,
      onChainSplitRecipients: [
        {
          address: "",
          share: null,
        },
      ],

      isSellerFeeBasisPoints: true,
      sellerFeeBasisPoints: "",

      isLimitedEdition: true,
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

    // reset all the states for solana mint error
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

    // reset all the states for zora mint
    setZoraErc721Enabled({
      isContractDetails: false,
      contractName: "",
      contractSymbol: "",

      isChargeForMint: false,
      chargeForMintPrice: "",
      chargeForMintCurrency: "ETH",

      isMintLimitPerAddress: false,
      mintLimitPerAddress: "",

      isRoyaltySplits: true,
      royaltySplitRecipients: [
        {
          address: "",
          percentAllocation: null,
        },
      ],

      isRoyaltyPercent: true,
      royaltyPercent: "",

      isMaxSupply: false,
      maxSupply: "",

      isAllowlist: false,
      allowlistAddresses: [""],

      isPreSaleSchedule: false,
      preSaleStartTimeStamp: {
        date: "",
        time: "",
      },
      preSaleEndTimeStamp: {
        date: "",
        time: "",
      },

      isPublicSaleSchedule: false,
      publicSaleStartTimeStamp: {
        date: "",
        time: "",
      },

      publicSaleEndTimeStamp: {
        date: "",
        time: "",
      },

      // split contract address
      fundRecipientAddress: "",
    });

    // reset all the states for zora mint error
    setZoraErc721StatesError({
      isContractNameError: false,
      contractNameErrorMessage: "",

      isContractSymbolError: false,
      contractSymbolErrorMessage: "",

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

      isAllowlistError: false,
      allowlistErrorMessage: "",

      isPresaleScheduleError: false,
      presaleScheduleErrorMessage: "",

      isPublicsaleScheduleError: false,
      publicsaleScheduleErrorMessage: "",
    });

    // reset all the states for farcaster
    setFarcasterStates({
      isFarcasterAuth: false,

      isChannel: false,
      channel: "",

      frameData: {
        isFrame: false,

        isGateWith: false,
        isLike: false,
        isRecast: false,
        isFollow: false,

        allowedMints: "",
        allowedMintsIsError: false,
        allowedMintsError: "",

        isCreatorSponsored: false,

        isTopup: false,
        isSufficientBalance: false,

        isExternalLink: false,
        externalLink: "",

        isExternalLinkError: false,
        externalLinkError: "",

        isCustomCurrMint: false,

        customCurrAmount: 1,

        isCustomCurrAmountError: false,
        customCurrAmountError: "",

        customCurrSymbol: "",
        customCurrAddress: "",

        fcSplitRevenueRecipients: [
          {
            address: "",
            percentAllocation: null,
          },
        ],

        // split recipient error
        isFcSplitError: false,
        fcSplitErrorMsg: "",

        selectedNetwork: {
          id: "",
          name: "",
        },
      },
    });
  };

  return { resetState };
};

export default useReset;
