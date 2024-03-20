import React, { useContext, useEffect, useState } from "react";
import { Switch } from "@headlessui/react";
import {
  InputBox,
  InputErrorMsg,
  Networks,
  NumberInputBox,
} from "../../../../../common";
import {
  Button,
  Option,
  Select,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import { DateTimePicker } from "@atlaskit/datetime-picker";
import BsPlus from "@meronex/icons/bs/BsPlus";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { Context } from "../../../../../../../providers/context";
import { toast } from "react-toastify";
import {
  useAccount,
  useChainId,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useSwitchNetwork,
  useWaitForTransaction,
} from "wagmi";
import { useAppAuth, useLocalStorage } from "../../../../../../../hooks/app";
import {
  APP_ETH_ADDRESS,
  ERROR,
  LOCAL_STORAGE,
} from "../../../../../../../data";
import {
  ENVIRONMENT,
  getENSDomain,
  shareOnSocials,
  uploadUserAssetToIPFS,
} from "../../../../../../../services";
import { zoraNftCreatorV1Config } from "@zoralabs/zora-721-contracts";
import {
  errorMessage,
  getFromLocalStorage,
  saveToLocalStorage,
} from "../../../../../../../utils";
import ZoraDialog from "./ZoraDialog";
import { useCreateSplit } from "../../../../../../../hooks/0xsplit";
import { useMutation, useQuery } from "@tanstack/react-query";
import { EVMWallets } from "../../../../top-section/auth/wallets";
import { useChainModal } from "@rainbow-me/rainbowkit";
import {
  FarcasterAuth,
  FarcasterChannel,
} from "../../farcaster-share/components";
import { LensAuth, LensDispatcher } from "../../lens-share/components";
import {
  getFarUserDetails,
  mintToXchain,
} from "../../../../../../../services/apis/BE-apis";
import { zoraURLErc721 } from "../utils/zoraURL";
import { ZoraLogo } from "../../../../../../../assets";

const ERC721Edition = ({ isOpenAction, isFarcaster, selectedChainId }) => {
  const { address } = useAccount();
  const { isAuthenticated } = useAppAuth();
  const { isFarcasterAuth, lensAuth, dispatcher } = useLocalStorage();
  const chainId = useChainId();
  const { chains, chain } = useNetwork();
  const getEVMAuth = getFromLocalStorage(LOCAL_STORAGE.evmAuth);
  const { openChainModal } = useChainModal();
  const [recipientsEns, setRecipientsEns] = useState([]);
  const [totalPercent, setTotalPercent] = useState(0);

  // share states
  const [isShareLoading, setIsShareLoading] = useState(false);
  const [isShareSuccess, setIsShareSuccess] = useState(false);
  const [isShareError, setIsShareError] = useState(false);
  const [shareError, setShareError] = useState("");

  // farcaster data states
  const [farTxHash, setFarTxHash] = useState("");

  const {
    createSplit,
    data: createSplitData,
    error: createSplitError,
    isError: isCreateSplitError,
    isLoading: isCreateSplitLoading,
    isSuccess: isCreateSplitSuccess,
  } = useCreateSplit();

  const {
    error: errorSwitchNetwork,
    isError: isErrorSwitchNetwork,
    isLoading: isLoadingSwitchNetwork,
    isSuccess: isSuccessSwitchNetwork,
    switchNetwork,
  } = useSwitchNetwork();

  const {
    zoraErc721Enabled,
    setZoraErc721Enabled,
    zoraErc721StatesError,
    setZoraErc721StatesError,
    contextCanvasIdRef,
    postDescription,
    parentRecipientListRef,
    canvasBase64Ref,
    setFarcasterStates,
    farcasterStates, // don't remove this
    lensAuthState, // don't remove this
  } = useContext(Context);

  // upload to IPFS Mutation
  const {
    mutate,
    data: uploadData,
    isError: isUploadError,
    error: uploadError,
    isSuccess: isUploadSuccess,
    isLoading: isUploading,
  } = useMutation({
    mutationKey: "uploadToIPFS",
    mutationFn: uploadUserAssetToIPFS,
  });

  // share open action edition on LENS Mutation
  const { mutateAsync: shareOnSocialsMutation } = useMutation({
    mutationKey: "shareOnSocials",
    mutationFn: shareOnSocials,
  });

  // store zora link in DB Mutation
  const { mutateAsync: storeZoraLinkMutation } = useMutation({
    mutationKey: "storeZoraLink",
    mutationFn: mintToXchain,
  });

  // create lens open action
  const handleShare = (canvasParams, platform) => {
    setIsShareLoading(true);

    const canvasData = {
      id: contextCanvasIdRef.current,
      name: `${platform} post`,
      content: postDescription,
    };

    shareOnSocialsMutation({
      canvasData: canvasData,
      canvasParams: canvasParams,
      platform: platform,
    })
      .then((res) => {
        if (res?.txHash) {
          setFarTxHash(res?.txHash);
          setIsShareError(false);
          setIsShareLoading(false);
          setIsShareSuccess(true);
        } else {
          setShareError(res?.error || ERROR.SOMETHING_WENT_WRONG);
          setIsShareError(true);
          setIsShareLoading(false);
          setIsShareSuccess(false);
        }
      })
      .catch((error) => {
        setShareError(errorMessage(error));
        setIsShareError(true);
        setIsShareLoading(false);
        setIsShareSuccess(false);
      });
  };

  // checking unsupported chain for individual networks
  const isUnsupportedChain = () => {
    // chains[0] is the polygon network
    if (
      chainId === chains[0]?.id ||
      chain?.unsupported ||
      chain?.id != selectedChainId
    )
      return true;
  };

  // networks data for samart posts
  const networksDataSmartPosts = () => {
    const networks = ENVIRONMENT === "production" ? [8453, 7777777] : [5]; // supported chains for Lens samart posts

    // filter the chains for smart posts
    const filteredChains = isOpenAction
      ? chains.filter((chain) => {
          return networks?.includes(chain?.id);
        })
      : chains.slice(1);

    const isUnsupportedChain = () => {
      if (
        chain?.unsupported ||
        (isOpenAction && !networks?.includes(chain?.id)) ||
        chainId === chains[0]?.id
      ) {
        return true;
      }
    };

    return {
      chains: filteredChains,
      isUnsupportedChain: isUnsupportedChain(),
    };
  };

  // formate date and time in uxin timestamp
  const formatDateTimeUnix = (date, time) => {
    const dateTime = new Date(`${date} ${time}`);
    return Math.floor(dateTime.getTime() / 1000);
  };

  // Calendar Functions:
  const onCalChange = (value, key) => {
    const dateTime = new Date(value);

    // Format the date
    const dateOptions = { year: "numeric", month: "long", day: "numeric" };

    // Format the time
    const timeOptions = {
      hour: "numeric",
      minute: "numeric",
      timeZoneName: "short",
    };

    if (key.startsWith("pre")) {
      setZoraErc721Enabled({
        ...zoraErc721Enabled,
        [key]: {
          date: dateTime.toLocaleDateString(undefined, dateOptions),
          time: dateTime.toLocaleTimeString(undefined, timeOptions),
        },
      });
    } else if (key.startsWith("pub")) {
      setZoraErc721Enabled({
        ...zoraErc721Enabled,
        [key]: {
          date: dateTime.toLocaleDateString(undefined, dateOptions),
          time: dateTime.toLocaleTimeString(undefined, timeOptions),
        },
      });
    }
  };

  // funtion to add new input box for multi addresses
  const addArrlistInputBox = (key) => {
    if (key === "royaltySplitRecipients") {
      setZoraErc721Enabled({
        ...zoraErc721Enabled,
        [key]: [
          ...zoraErc721Enabled[key],
          { address: "", percentAllocation: "" },
        ],
      });
      return;
    }

    setZoraErc721Enabled({
      ...zoraErc721Enabled,
      [key]: [...zoraErc721Enabled[key], ""],
    });
  };

  // funtion to remove input box for multi addresses
  const removeArrlistInputBox = (index, key, isErrKey, errKeyMsg) => {
    setZoraErc721Enabled({
      ...zoraErc721Enabled,
      [key]: zoraErc721Enabled[key].filter((_, i) => i !== index),
    });

    if (isErrKey) {
      setZoraErc721StatesError({
        ...zoraErc721StatesError,
        [isErrKey]: false,
        [errKeyMsg]: "",
      });
    }
  };

  // funtion adding data for split revenues recipients
  const handleRecipientChange = (index, key, value) => {
    // check index 0 price should min 10
    if (key === "percentAllocation" && index === 0) {
      if (value < 10 || value > 100 || isNaN(value)) {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isRoyaltySplitError: true,
          royaltySplitErrorMessage:
            "Platform fee should be between 10% to 100%",
        });
      } else {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isRoyaltySplitError: false,
          royaltySplitErrorMessage: "",
        });
      }
    } else if (key === "percentAllocation" && index !== 0) {
      // any index price should be greater min 1 and max 100
      if (value < 1 || value > 100 || isNaN(value)) {
        setZoraErc721StatesError({
          zoraErc721StatesError,
          isRoyaltySplitError: true,
          royaltySplitErrorMessage: "Split should be between 1% to 100%",
        });
      } else {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isRoyaltySplitError: false,
          royaltySplitErrorMessage: "",
        });
      }
    }
    // check if recipient address is not provided
    if (key === "address") {
      if (!value) {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isRoyaltySplitError: true,
          royaltySplitErrorMessage: "Recipient address is required",
        });
      } else {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isRoyaltySplitError: false,
          royaltySplitErrorMessage: "",
        });
      }
    }

    const updatedRecipients = [...zoraErc721Enabled.royaltySplitRecipients];
    updatedRecipients[index][key] = value;
    setZoraErc721Enabled((prevEnabled) => ({
      ...prevEnabled,
      royaltySplitRecipients: updatedRecipients,
    }));
  };

  // restrict the input box if the recipient is in the parent list
  const restrictRecipientInput = (e, index, recipient) => {
    const isRecipient = parentRecipientListRef.current.includes(recipient);
    const isUserAddress = recipient === address;
    if (index === 0 || isRecipient) {
      if (isUserAddress) {
        handleRecipientChange(index, "address", e.target.value);
      }
    } else {
      handleRecipientChange(index, "address", e.target.value);
    }
  };

  // restrict the delete button if recipient is in the parent list
  const restrictRemoveRecipientInputBox = (index, recipient) => {
    const isRecipient = parentRecipientListRef.current.includes(recipient);
    if (index === 0 || isRecipient) {
      return true;
    }
  };

  // handle for input fields
  const handleChange = (e, index, key) => {
    const { name, value } = e.target;

    // check if collection name and symbol are provided
    if (name === "contractName") {
      if (!value) {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isContractNameError: true,
          contractNameErrorMessage: "Collection Name is required",
        });
      } else {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isContractNameError: false,
          contractNameErrorMessage: "",
        });
      }
    } else if (name === "contractSymbol") {
      if (!value) {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isContractSymbolError: true,
          contractSymbolErrorMessage: "Collection Symbol is required",
        });
      } else {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isContractSymbolError: false,
          contractSymbolErrorMessage: "",
        });
      }
    }

    // check if price is provided
    if (name === "chargeForMintPrice") {
      if (!value) {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isChargeForMintError: true,
          chargeForMintErrorMessage: "Price is required",
        });
      } else if (value < 0.001) {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isChargeForMintError: true,
          chargeForMintErrorMessage: "Price must be greater than 0.001",
        });
      } else {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isChargeForMintError: false,
          chargeForMintErrorMessage: "",
        });
      }
    }

    // check if mint limit is provided
    if (name === "mintLimitPerAddress") {
      if (!value) {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isMintLimitPerAddressError: true,
          limitedEditionErrorMessage: "Mint limit is required",
        });
      } else if (value < 1) {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isMintLimitPerAddressError: true,
          limitedEditionErrorMessage: "Mint limit must be greater than 0",
        });
      } else {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isMintLimitPerAddressError: false,
          limitedEditionErrorMessage: "",
        });
      }
    }

    // check if royalty percent is provided
    if (name === "royaltyPercent") {
      if (!value) {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isRoyaltyPercentError: true,
          royaltyPercentErrorMessage: "Royalty percent is required",
        });
      } else if (value < 1 || value > 100) {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isRoyaltyPercentError: true,
          royaltyPercentErrorMessage: "Royalty must be between 1% to 100%",
        });
      } else {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isRoyaltyPercentError: false,
          royaltyPercentErrorMessage: "",
        });
      }
    }

    // check if max supply is provided
    if (name === "maxSupply") {
      if (!value) {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isMaxSupplyError: true,
          maxSupplyErrorMessage: "Max supply is required",
        });
      } else if (value < 1) {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isMaxSupplyError: true,
          maxSupplyErrorMessage: "Max supply must be greater than 0",
        });
      } else {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isMaxSupplyError: false,
          maxSupplyErrorMessage: "",
        });
      }
    }

    // check if allowlist is provided
    if (name === "allowlistAddresses") {
      if (!value) {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isAllowlistError: true,
          allowlistErrorMessage: "Allowlist address is required",
        });
      } else {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isAllowlistError: false,
          allowlistErrorMessage: "",
        });
      }
    }

    // add data
    if (name === "allowlistAddresses") {
      setZoraErc721Enabled((prevEnabled) => ({
        ...prevEnabled,
        [name]: prevEnabled[name].map((item, i) =>
          i === index ? value : item
        ),
      }));
    } else {
      setZoraErc721Enabled((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // check if recipient address is same
  const isRecipientAddDuplicate = () => {
    const result = zoraErc721Enabled.royaltySplitRecipients.filter(
      (item, index) => {
        return (
          zoraErc721Enabled.royaltySplitRecipients.findIndex(
            (item2) => item2.address === item.address
          ) !== index
        );
      }
    );

    if (result.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  // check if recipient percentage is more than 100
  const isPercentage100 = () => {
    const result = zoraErc721Enabled.royaltySplitRecipients.reduce(
      (acc, item) => {
        return acc + item.percentAllocation;
      },
      0
    );

    setTotalPercent(result);

    if (result === 100) {
      return true;
    } else {
      return false;
    }
  };

  // split even percentage
  const splitEvenPercentage = () => {
    const result = zoraErc721Enabled.royaltySplitRecipients.map((item) => {
      return {
        address: item.address,
        percentAllocation: Math.floor(
          (100 / zoraErc721Enabled.royaltySplitRecipients.length).toFixed(2)
        ),
      };
    });

    setZoraErc721Enabled((prevEnabled) => ({
      ...prevEnabled,
      royaltySplitRecipients: result,
    }));
  };

  // split contract settings
  const handleCreateSplitSettings = () => {
    const args = {
      recipients: zoraErc721Enabled.royaltySplitRecipients,
      distributorFeePercent: 0.0,
      controller: APP_ETH_ADDRESS,
      // controller is the owner of the split contract that will make it mutable contract
    };
    return args;
  };

  // mint settings
  const handleMintSettings = () => {
    const createReferral = APP_ETH_ADDRESS;
    const defaultAdmin = address;

    let contractName = "My Lenspost Collection";
    let symbol = "MLC";
    let description = "This is my Lenspost Collection";
    let allowList = [];
    let editionSize = "0xfffffffffff"; // default open edition
    let royaltyBps = "0"; // 1% = 100 bps
    let animationUri = "0x0";
    let imageUri = "0x0";
    let fundsRecipient = address;
    // max value for maxSalePurchasePerAddress, results in no mint limit
    let maxSalePurchasePerAddress = "4294967295";
    let publicSalePrice = "0";
    let presaleStart = "0";
    let presaleEnd = "0";
    let publicSaleStart = "0";
    // max value for end date, results in no end date for mint
    let publicSaleEnd = "18446744073709551615";

    if (zoraErc721Enabled.contractName !== "") {
      contractName = zoraErc721Enabled.contractName;
    }

    if (zoraErc721Enabled.contractSymbol !== "") {
      symbol = zoraErc721Enabled.contractSymbol;
    }

    if (postDescription !== "") {
      description = postDescription;
    }

    if (uploadData?.message) {
      imageUri = `ipfs://${uploadData?.message}`;
    }

    if (createSplitData?.splitAddress) {
      fundsRecipient = createSplitData?.splitAddress;
    }

    if (zoraErc721Enabled.isChargeForMint) {
      publicSalePrice = (
        Number(zoraErc721Enabled.chargeForMintPrice) * 1e18
      ).toString();
    }

    if (zoraErc721Enabled.isMintLimitPerAddress) {
      maxSalePurchasePerAddress = zoraErc721Enabled.mintLimitPerAddress;
    }

    if (zoraErc721Enabled.isRoyaltyPercent) {
      royaltyBps = (Number(zoraErc721Enabled.royaltyPercent) * 100).toString();
    }

    if (zoraErc721Enabled.isMaxSupply) {
      editionSize = zoraErc721Enabled.maxSupply;
    }

    if (zoraErc721Enabled.isAllowlist) {
      allowList = zoraErc721Enabled.allowlistAddresses;
    }

    if (zoraErc721Enabled.isPreSaleSchedule) {
      presaleStart = formatDateTimeUnix(
        zoraErc721Enabled.preSaleStartTimeStamp.date,
        zoraErc721Enabled.preSaleStartTimeStamp.time
      );
      presaleEnd = formatDateTimeUnix(
        zoraErc721Enabled.preSaleEndTimeStamp.date,
        zoraErc721Enabled.preSaleEndTimeStamp.time
      );
    }

    if (zoraErc721Enabled.isPublicSaleSchedule) {
      publicSaleStart = formatDateTimeUnix(
        zoraErc721Enabled.publicSaleStartTimeStamp.date,
        zoraErc721Enabled.publicSaleStartTimeStamp.time
      );
      publicSaleEnd = formatDateTimeUnix(
        zoraErc721Enabled.publicSaleEndTimeStamp.date,
        zoraErc721Enabled.publicSaleEndTimeStamp.time
      );
    }

    const arr = [
      contractName,
      symbol,
      editionSize,
      royaltyBps,
      fundsRecipient,
      defaultAdmin,
      {
        publicSalePrice,
        maxSalePurchasePerAddress,
        publicSaleStart,
        publicSaleEnd,
        presaleStart,
        presaleEnd,
        presaleMerkleRoot:
          "0x0000000000000000000000000000000000000000000000000000000000000000",
      },
      description,
      animationUri,
      imageUri,
      createReferral,
    ];

    return { args: arr };
  };

  // create edition configs
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    abi: zoraNftCreatorV1Config.abi,
    address:
      chain?.id == 8453
        ? "0x58C3ccB2dcb9384E5AB9111CD1a5DEA916B0f33c"
        : zoraNftCreatorV1Config.address[chainId],
    functionName: "createEditionWithReferral",
    args: handleMintSettings().args,
  });
  const { write, data, error, isLoading, isError } = useContractWrite(config);
  const {
    data: receipt,
    isLoading: isPending,
    isSuccess,
  } = useWaitForTransaction({ hash: data?.hash });

  // mint on Zora
  const handleSubmit = () => {
    // check if canvasId is provided
    if (contextCanvasIdRef.current === null) {
      toast.error("Please select a design");
      return;
    }

    // check if description is provided
    if (!postDescription) {
      toast.error("Please provide a description");
      return;
    }

    // check if collection name is provided
    if (!zoraErc721Enabled.contractName) {
      setZoraErc721StatesError({
        ...zoraErc721StatesError,
        isContractNameError: true,
        contractNameErrorMessage: "Collection Name is required",
      });
      return;
    }

    // check if collection symbol is provided
    if (!zoraErc721Enabled.contractSymbol) {
      setZoraErc721StatesError({
        ...zoraErc721StatesError,
        isContractSymbolError: true,
        contractSymbolErrorMessage: "Collection Symbol is required",
      });
      return;
    }

    // check if price is provided
    if (zoraErc721Enabled.isChargeForMint) {
      if (!zoraErc721Enabled.chargeForMintPrice) {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isChargeForMintError: true,
          chargeForMintErrorMessage: "Price is required",
        });
        return;
      } else if (zoraErc721StatesError.isChargeForMintError) return;
    }

    // check if mint limit is provided
    if (zoraErc721Enabled.isMintLimitPerAddress) {
      if (zoraErc721StatesError.isMintLimitPerAddressError) return;
    }

    // check if royalty percent is provided
    if (zoraErc721Enabled.isRoyaltyPercent) {
      if (zoraErc721StatesError.isRoyaltyPercentError) {
        return;
      } else if (!zoraErc721Enabled.royaltyPercent) {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isRoyaltyPercentError: true,
          royaltyPercentErrorMessage: "Royalty percent is required",
        });
        return;
      }
    }

    // check if max supply is provided
    if (zoraErc721Enabled.isMaxSupply) {
      if (zoraErc721StatesError.isMaxSupplyError) return;
    }

    // check if allowlist is provided
    if (zoraErc721Enabled.isAllowlist) {
      if (zoraErc721StatesError.isAllowlistError) return;
    }

    // check if pre sale schedule is provided
    if (zoraErc721Enabled.isPreSaleSchedule) {
      if (zoraErc721StatesError.isPreSaleScheduleError) return;
    }

    // check if public sale schedule is provided
    if (zoraErc721Enabled.isPublicSaleSchedule) {
      if (zoraErc721StatesError.isPublicSaleScheduleError) return;
    }

    // check if split revenue is provided
    if (zoraErc721Enabled.isRoyaltySplits) {
      if (zoraErc721StatesError.isRoyaltySplitError) return;
    }

    // check if mint limit is provided
    if (zoraErc721Enabled.isMintLimitPerAddress) {
      if (zoraErc721StatesError.isMintLimitPerAddressError) return;
    }

    // check if recipient address is same
    if (isRecipientAddDuplicate()) {
      setZoraErc721StatesError({
        ...zoraErc721StatesError,
        isRoyaltySplitError: true,
        royaltySplitErrorMessage: "Recipient address is duplicate",
      });
      return;
    } else if (!isPercentage100()) {
      setZoraErc721StatesError({
        ...zoraErc721StatesError,
        isRoyaltySplitError: true,
        royaltySplitErrorMessage: "Recipient percentage should be 100%",
      });
      return;
    } else {
      setZoraErc721StatesError({
        ...zoraErc721StatesError,
        isRoyaltySplitError: false,
        royaltySplitErrorMessage: "",
      });
    }

    // upload to IPFS
    mutate(canvasBase64Ref.current[0]);
  };

  const storeZoraLink = () => {
    let paramsData = {
      canvasId: contextCanvasIdRef.current,
      mintLink: zoraURLErc721(receipt?.logs[0]?.address, chain?.id),
      chain: chain?.name,
      contractType: 721,
      chainId: chain?.id,
      hash: receipt?.logs[0]?.address,
    };

    storeZoraLinkMutation(paramsData)
      .then((res) => {
        console.log("StoreZoraLink", res?.slug);
      })
      .catch((error) => {
        console.log("StoreZoraLinkErr", errorMessage(error));
      });
  };

  // add recipient to the split list
  useEffect(() => {
    if (isAuthenticated) {
      const updatedRecipients = parentRecipientListRef.current.map((item) => ({
        address: item,
        percentAllocation: 1.0,
      }));

      setZoraErc721Enabled((prevEnabled) => ({
        ...prevEnabled,
        royaltySplitRecipients: [
          {
            address: APP_ETH_ADDRESS,
            percentAllocation: 10.0,
          },
          ...updatedRecipients,
        ],
      }));

      const recipients = updatedRecipients.map((item) => {
        return item.address;
      });

      const addresses = [APP_ETH_ADDRESS, ...recipients];

      // getting ENS domain
      (async () => {
        const domains = await getENSDomain(addresses);
        setRecipientsEns(domains);
      })();
    }
  }, [isAuthenticated]);

  // create split contract
  useEffect(() => {
    if (uploadData?.message) {
      createSplit(handleCreateSplitSettings());
    }
  }, [isUploadSuccess]);

  // mint on Zora
  useEffect(() => {
    if (createSplitData?.splitAddress) {
      console.log("createSplitData", createSplitData);
      setTimeout(() => {
        write?.();
      }, 1000);
    }
  }, [isCreateSplitSuccess, write]);

  // create open adition on LENS
  useEffect(() => {
    if (isOpenAction && receipt?.logs[0]?.address) {
      const canvasParams = {
        openAction: "mintToZora",
        zoraMintAddress: receipt?.logs[0]?.address,
      };

      handleShare(canvasParams, "lens");
    }
  }, [isSuccess]);

  // share on farcater
  useEffect(() => {
    if (isFarcaster && receipt?.logs[0]?.address) {
      const canvasParams = {
        zoraMintLink: zoraURLErc721(receipt?.logs[0]?.address, chain?.id),
        channelId: farcasterStates.channel?.id || "",
      };

      handleShare(canvasParams, "farcaster");
    }
  }, [isSuccess]);

  // store the zora link in DB
  useEffect(() => {
    if (isSuccess && receipt?.logs[0]?.address) {
      storeZoraLink();
    }
  }, [isSuccess]);

  // error handling for mint
  useEffect(() => {
    if (isError) {
      console.log("mint error", error);
      toast.error(error.message.split("\n")[0]);
    }

    if (isPrepareError) {
      console.log("prepare error", prepareError);
      // toast.error(prepareError.message);
    }
  }, [isError, isPrepareError]);

  // error handling for create split
  useEffect(() => {
    if (isCreateSplitError) {
      console.log("create split error", createSplitError);
      toast.error(createSplitError.message.split("\n")[0]);
    }
  }, [isCreateSplitError]);

  // error handling for upload to IPFS
  useEffect(() => {
    if (isUploadError) {
      toast.error(errorMessage(uploadError));
    }
  }, [isUploadError]);

  // error handling for open action
  useEffect(() => {
    if (isShareError) {
      toast.error(errorMessage(shareError));
    }
  }, [isShareError]);

  // error/success handling for network switch
  useEffect(() => {
    if (isErrorSwitchNetwork) {
      toast.error(errorSwitchNetwork?.message.split("\n")[0]);
    }

    if (isSuccessSwitchNetwork) {
      toast.success(`Network switched to ${chain?.name}`);
    }
  }, [isErrorSwitchNetwork, isSuccessSwitchNetwork]);

  return (
    <>
      <ZoraDialog
        title=" Zora ERC721 Edition"
        icon={ZoraLogo}
        isError={isUploadError || isCreateSplitError || isError || isShareError}
        isLoading={isLoading}
        isCreatingSplit={isCreateSplitLoading}
        isUploadingToIPFS={isUploading}
        isPending={isPending}
        isShareLoading={isShareLoading}
        isShareSuccess={isShareSuccess}
        isOpenAction={isOpenAction}
        isFarcaster={isFarcaster}
        data={receipt}
        farTxHash={farTxHash}
        isSuccess={isSuccess}
      />
      {/* Switch Number 1 Start */}
      <div className="mb-4 m-4">
        <div className="flex justify-between">
          <h2 className="text-lg mb-2"> Collection Details </h2>
        </div>
        <div className="w-4/5 opacity-75">
          {" "}
          Set a Name and Symbol for the collection{" "}
        </div>
      </div>

      <div className={` ml-4 mr-4`}>
        <div className="flex flex-col w-full py-2">
          <InputBox
            label="Collection Name"
            name="contractName"
            onChange={(e) => handleChange(e)}
            onFocus={(e) => handleChange(e)}
            value={zoraErc721Enabled.contractName}
          />
          {zoraErc721StatesError.isContractNameError && (
            <InputErrorMsg
              message={zoraErc721StatesError.contractNameErrorMessage}
            />
          )}
          <div className="mt-2">
            <InputBox
              label="Collection Symbol"
              name="contractSymbol"
              onChange={(e) => handleChange(e)}
              // onFocus={(e) => handleChange(e)}
              value={zoraErc721Enabled.contractSymbol}
            />
          </div>
          {zoraErc721StatesError.isContractSymbolError && (
            <InputErrorMsg
              message={zoraErc721StatesError.contractSymbolErrorMessage}
            />
          )}
        </div>
      </div>

      <div className="mb-4 m-4">
        <div className="flex justify-between">
          <h2 className="text-lg mb-2"> Mint Price</h2>
          <Switch
            checked={zoraErc721Enabled.isChargeForMint}
            onChange={() =>
              setZoraErc721Enabled({
                ...zoraErc721Enabled,
                isChargeForMint: !zoraErc721Enabled.isChargeForMint,
              })
            }
            className={`${
              zoraErc721Enabled.isChargeForMint ? "bg-[#e1f16b]" : "bg-gray-200"
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#e1f16b] focus:ring-offset-2`}
          >
            <span
              className={`${
                zoraErc721Enabled.isChargeForMint
                  ? "translate-x-6"
                  : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />{" "}
          </Switch>
        </div>
        <div className="w-4/5 opacity-75">
          {" "}
          Set an amount to be charged for minting{" "}
        </div>
      </div>

      <div className={`${!zoraErc721Enabled.isChargeForMint && "hidden"} mx-4`}>
        <div className="flex">
          <div className="flex flex-col py-2">
            <NumberInputBox
              min={"0.001"}
              step={"0.01"}
              label="Price"
              name="chargeForMintPrice"
              onChange={(e) => handleChange(e)}
              onFocus={(e) => handleChange(e)}
              value={zoraErc721Enabled.chargeForMintPrice}
            />
          </div>

          <div className="flex flex-col py-2 mx-2">
            {/* <label htmlFor="price"></label> */}
            <Select
              animate={{
                mount: { y: 0 },
                unmount: { y: 25 },
              }}
              label="Currency"
              name="chargeForMintCurrency"
              id="chargeForMintCurrency"
              value={zoraErc721Enabled.chargeForMintCurrency}
            >
              {["ETH"].map((currency) => (
                <Option
                  key={currency}
                  onClick={() => {
                    setZoraErc721Enabled({
                      ...zoraErc721Enabled,
                      chargeForMintCurrency: currency,
                    });
                  }}
                >
                  {currency.toUpperCase()}
                </Option>
              ))}
            </Select>
          </div>
        </div>

        {zoraErc721StatesError.isChargeForMintError && (
          <InputErrorMsg
            message={zoraErc721StatesError.chargeForMintErrorMessage}
          />
        )}
      </div>

      {/* Switch Number 1 End */}

      {/* Splits Switch Start */}

      <div className="mb-4 m-4">
        <div className="flex justify-between">
          <h2 className="text-lg mb-2"> Split Pecipients </h2>
        </div>
        <div className="w-4/5 opacity-75">
          {" "}
          Split revenue between multiple recipients{" "}
        </div>
      </div>

      <div className={`${!zoraErc721Enabled.isRoyaltySplits && "hidden"}`}>
        <div className="mx-4">
          {zoraErc721Enabled.royaltySplitRecipients.map((recipient, index) => {
            return (
              <div
                key={index}
                className="flex justify-between gap-2 items-center w-full py-2"
              >
                <div className="flex-1">
                  <InputBox
                    label="Wallet Address"
                    value={recipientsEns[index] || recipient.address}
                    onFocus={(e) =>
                      restrictRecipientInput(e, index, recipient.address)
                    }
                    onChange={(e) =>
                      restrictRecipientInput(e, index, recipient.address)
                    }
                  />
                </div>
                <div className="">
                  <NumberInputBox
                    min={0}
                    max={100}
                    step={1}
                    label="%"
                    value={recipient.percentAllocation}
                    onFocus={(e) => {
                      handleRecipientChange(
                        index,
                        "percentAllocation",
                        Number(parseFloat(e.target.value).toFixed(4))
                      );
                    }}
                    onChange={(e) => {
                      handleRecipientChange(
                        index,
                        "percentAllocation",
                        Number(parseFloat(e.target.value).toFixed(4))
                      );
                    }}
                  />
                </div>
                {!restrictRemoveRecipientInputBox(index, recipient.address) && (
                  <span>
                    <XCircleIcon
                      className="h-6 w-6 cursor-pointer"
                      color="red"
                      onClick={() =>
                        removeArrlistInputBox(
                          index,
                          "royaltySplitRecipients",
                          "isRoyaltySplitError",
                          "royaltySplitErrorMessage"
                        )
                      }
                    />
                  </span>
                )}
              </div>
            );
          })}

          <div className="flex justify-between items-center">
            {zoraErc721StatesError.isRoyaltySplitError && (
              <>
                <InputErrorMsg
                  message={zoraErc721StatesError.royaltySplitErrorMessage}
                />
                <Typography variant="h6" color="blue-gray">
                  {totalPercent} %
                </Typography>
              </>
            )}
          </div>

          <div className="flex justify-between">
            <Button
              // color="yellow"
              size="sm"
              variant="filled"
              className="flex items-center gap-3 mt-2 ml-0 outline-none bg-[#e1f16b] text-black"
              onClick={() => addArrlistInputBox("royaltySplitRecipients")}
            >
              <BsPlus />
              Add Recipient
            </Button>
            <Button
              // color="yellow"
              size="sm"
              variant="filled"
              className="flex items-center gap-3 mt-2 ml-0 outline-none bg-[#e1f16b] text-black"
              onClick={splitEvenPercentage}
            >
              Split Even
            </Button>
          </div>
        </div>
      </div>
      {/* Splits Switch End */}

      {/* Switch Number 5 Start */}
      <>
        <div className="mb-4 m-4">
          <div className="flex justify-between">
            <h2 className="text-lg mb-2"> Royalty </h2>
          </div>
          <div className="w-4/5 opacity-75">
            {" "}
            Set Royalty percentage for minting{" "}
          </div>
        </div>

        <div
          className={`${!zoraErc721Enabled.isRoyaltyPercent && "hidden"} mx-4`}
        >
          {/* <div className="flex"> */}
          <div className="flex flex-col py-2">
            <NumberInputBox
              min={"1"}
              step={"1"}
              label="Royalty % "
              name="royaltyPercent"
              onChange={(e) => handleChange(e)}
              onFocus={(e) => handleChange(e)}
              value={zoraErc721Enabled.royaltyPercent}
            />
          </div>
          {/* </div> */}

          {zoraErc721StatesError.isRoyaltyPercentError && (
            <InputErrorMsg
              message={zoraErc721StatesError.royaltyPercentErrorMessage}
            />
          )}
        </div>
      </>
      {/* Switch Number 5 End */}

      {/* Switch Number 3 Start */}
      <div className="mb-4 m-4">
        <div className="flex justify-between">
          <h2 className="text-lg mb-2"> Limit mints per address </h2>
          <Switch
            checked={zoraErc721Enabled.isMintLimitPerAddress}
            onChange={() =>
              setZoraErc721Enabled({
                ...zoraErc721Enabled,
                isMintLimitPerAddress: !zoraErc721Enabled.isMintLimitPerAddress,
              })
            }
            className={`${
              zoraErc721Enabled.isMintLimitPerAddress
                ? "bg-[#e1f16b]"
                : "bg-gray-200"
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#e1f16b] focus:ring-offset-2`}
          >
            <span
              className={`${
                zoraErc721Enabled.isMintLimitPerAddress
                  ? "translate-x-6"
                  : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />{" "}
          </Switch>
        </div>
        <div className="w-4/5 opacity-75">
          {" "}
          Limit the number of mints per address{" "}
        </div>
      </div>

      <div
        className={`${
          !zoraErc721Enabled.isMintLimitPerAddress && "hidden"
        } ml-4 mr-4`}
      >
        <div className="flex flex-col w-full py-2">
          <NumberInputBox
            min={"1"}
            step={"1"}
            label="Mint limit"
            name="mintLimitPerAddress"
            onChange={(e) => handleChange(e)}
            onFocus={(e) => handleChange(e)}
            value={zoraErc721Enabled.mintLimitPerAddress}
          />
          {zoraErc721StatesError.isMintLimitPerAddressError && (
            <InputErrorMsg
              message={zoraErc721StatesError.limitedEditionErrorMessage}
            />
          )}
        </div>
      </div>
      {/* Switch Number 3 End */}

      {/* Switch Number 6 Start */}
      <>
        <div className="mb-4 m-4">
          <div className="flex justify-between">
            <h2 className="text-lg mb-2"> Supply </h2>
            <Switch
              checked={zoraErc721Enabled.isMaxSupply}
              onChange={() =>
                setZoraErc721Enabled({
                  ...zoraErc721Enabled,
                  isMaxSupply: !zoraErc721Enabled.isMaxSupply,
                })
              }
              className={`${
                zoraErc721Enabled.isMaxSupply ? "bg-[#e1f16b]" : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#e1f16b] focus:ring-offset-2`}
            >
              <span
                className={`${
                  zoraErc721Enabled.isMaxSupply
                    ? "translate-x-6"
                    : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />{" "}
            </Switch>
          </div>
          <div className="w-4/5 opacity-75">
            {" "}
            Set the maximum supply limit for the mint{" "}
          </div>
        </div>

        <div className={`${!zoraErc721Enabled.isMaxSupply && "hidden"} mx-4`}>
          {/* <div className="flex"> */}
          <div className="flex flex-col py-2">
            <NumberInputBox
              min={"1"}
              step={"1"}
              // className={"W-3/4"}
              label="Max Supply "
              name="maxSupply"
              onChange={(e) => handleChange(e)}
              onFocus={(e) => handleChange(e)}
              value={zoraErc721Enabled.maxSupply}
            />
          </div>
          {/* </div> */}

          {zoraErc721StatesError.isMaxSupplyError && (
            <InputErrorMsg
              message={zoraErc721StatesError.maxSupplyErrorMessage}
            />
          )}
        </div>
      </>
      {/* Switch Number 6 End */}

      {/* Switch Number 4 Start */}
      <div className="mb-4 m-4">
        <div className="flex justify-between">
          <h2 className="text-lg mb-2"> Allowlist </h2>
          <Switch
            checked={zoraErc721Enabled.isAllowlist}
            onChange={() =>
              setZoraErc721Enabled({
                ...zoraErc721Enabled,
                isAllowlist: !zoraErc721Enabled.isAllowlist,
              })
            }
            className={`${
              zoraErc721Enabled.isAllowlist ? "bg-[#e1f16b]" : "bg-gray-200"
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#e1f16b] focus:ring-offset-2`}
          >
            <span
              className={`${
                zoraErc721Enabled.isAllowlist
                  ? "translate-x-6"
                  : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />{" "}
          </Switch>
        </div>
        <div className="w-4/5 opacity-75">
          {" "}
          Allow specific wallet addresses to mint{" "}
        </div>
      </div>

      <div
        className={`ml-4 mr-4 ${!zoraErc721Enabled.isAllowlist && "hidden"} `}
      >
        {zoraErc721Enabled.allowlistAddresses.map((recipient, index) => {
          return (
            <>
              <div
                key={index}
                className="flex justify-between gap-2 items-center w-full py-2"
              >
                <InputBox
                  label="Wallet Address"
                  name="allowlistAddresses"
                  value={recipient}
                  onChange={(e) => handleChange(e, index)}
                  onFocus={(e) => handleChange(e, index)}
                />

                <div className="flex justify-between items-center">
                  {index != 0 && (
                    <XCircleIcon
                      className="h-6 w-6 cursor-pointer"
                      color="red"
                      onClick={() =>
                        removeArrlistInputBox(index, "allowlistAddresses")
                      }
                    />
                  )}
                </div>
              </div>
            </>
          );
        })}
        {zoraErc721StatesError.isAllowlistError && (
          <InputErrorMsg
            message={zoraErc721StatesError.allowlistErrorMessage}
          />
        )}
        <Button
          // color="yellow"
          size="sm"
          variant="filled"
          className="flex items-center gap-3 mt-2 ml-0 mr-4 bg-[#e1f16b] text-black"
          onClick={() => addArrlistInputBox("allowlistAddresses")}
        >
          <BsPlus />
          Add Recipient
        </Button>

        <div className="text-center mt-2"> OR </div>

        <Button
          disabled={true}
          // color="yellow"
          className="mt-2 bg-[#e1f16b] text-black"
          size="sm"
          variant="outlined"
          fullWidth
        >
          {" "}
          Upload CSV{" "}
        </Button>
      </div>
      {/* Switch Number 4 End */}

      {/* Switch Number 7 Start */}
      <>
        <div className="mb-4 m-4">
          <div className="flex justify-between">
            <h2 className="text-lg mb-2"> Pre - Sale Schedule </h2>
            <Switch
              checked={zoraErc721Enabled.isPreSaleSchedule}
              onChange={() =>
                setZoraErc721Enabled({
                  ...zoraErc721Enabled,
                  isPreSaleSchedule: !zoraErc721Enabled.isPreSaleSchedule,
                })
              }
              className={`${
                zoraErc721Enabled.isPreSaleSchedule
                  ? "bg-[#e1f16b]"
                  : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#e1f16b] focus:ring-offset-2`}
            >
              <span
                className={`${
                  zoraErc721Enabled.isPreSaleSchedule
                    ? "translate-x-6"
                    : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />{" "}
            </Switch>
          </div>
          <div className="w-4/5 opacity-75">
            {" "}
            Set a start and end date for your Presale schedule of the mint{" "}
          </div>
        </div>

        <div
          className={`flex flex-col ${
            !zoraErc721Enabled.isPreSaleSchedule && "hidden"
          } `}
        >
          <div className="ml-4 mr-4 flex justify-between text-center align-middle">
            <div>Start</div>{" "}
            <DateTimePicker
              onChange={(e) => onCalChange(e, "preSaleStartTimeStamp")}
            />
          </div>
          <div className="m-4 flex justify-between text-center align-middle">
            <div>End</div>{" "}
            <DateTimePicker
              onChange={(e) => onCalChange(e, "preSaleEndTimeStamp")}
            />
          </div>

          {zoraErc721StatesError.isPreSaleScheduleError && (
            <InputErrorMsg
              message={zoraErc721StatesError.presaleScheduleErrorMessage}
            />
          )}
        </div>
      </>
      {/* Switch Number 7 End */}

      {/* Switch Number 8 Start */}
      <>
        <div className="mb-4 m-4">
          <div className="flex justify-between">
            <h2 className="text-lg mb-2"> Public - Sale Schedule </h2>
            <Switch
              checked={zoraErc721Enabled.isPublicSaleSchedule}
              onChange={() =>
                setZoraErc721Enabled({
                  ...zoraErc721Enabled,
                  isPublicSaleSchedule: !zoraErc721Enabled.isPublicSaleSchedule,
                })
              }
              className={`${
                zoraErc721Enabled.isPublicSaleSchedule
                  ? "bg-[#e1f16b]"
                  : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#e1f16b] focus:ring-offset-2`}
            >
              <span
                className={`${
                  zoraErc721Enabled.isPublicSaleSchedule
                    ? "translate-x-6"
                    : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />{" "}
            </Switch>
          </div>
          <div className="w-4/5 opacity-75">
            {" "}
            Set a start and end date for your Public sale schedule of the mint{" "}
          </div>
        </div>

        <div
          className={`flex flex-col ${
            !zoraErc721Enabled.isPublicSaleSchedule && "hidden"
          } `}
        >
          <div className="ml-4 mr-4 flex justify-between text-center align-middle">
            <div>Start</div>{" "}
            <DateTimePicker
              onChange={(e) => onCalChange(e, "publicSaleStartTimeStamp")}
            />
          </div>
          <div className="m-4 flex justify-between text-center align-middle">
            <div>End</div>{" "}
            <DateTimePicker
              onChange={(e) => onCalChange(e, "publicSaleEndTimeStamp")}
            />
          </div>

          {zoraErc721StatesError.isPublicSaleScheduleError && (
            <InputErrorMsg
              message={zoraErc721StatesError.publicsaleScheduleErrorMessage}
            />
          )}
        </div>

        {isFarcaster && (
          <>
            <div className="mb-4 m-4">
              <div className="flex justify-between">
                <h2 className="text-lg mb-2"> Channel </h2>
                <Switch
                  checked={farcasterStates.isChannel}
                  onChange={() =>
                    setFarcasterStates({
                      ...farcasterStates,
                      isChannel: !farcasterStates.isChannel,
                    })
                  }
                  className={`${
                    farcasterStates.isChannel ? "bg-[#e1f16b]" : "bg-gray-200"
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#e1f16b] focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      farcasterStates.isChannel
                        ? "translate-x-6"
                        : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />{" "}
                </Switch>
              </div>
              <div className="w-4/5 opacity-75">
                {" "}
                Share your post in the Farcaster channel.{" "}
              </div>
            </div>
            <div className={`m-4 ${!farcasterStates.isChannel && "hidden"}`}>
              <FarcasterChannel />
            </div>
          </>
        )}
      </>
      {/* Switch Number 8 End */}

      {/* network */}
      {getEVMAuth && (isFarcaster || isOpenAction) ? (
        <>
          <h2 className="text-lg mx-2"> Switch Networks </h2>
          <Networks
            className="mx-2 w-[95%] outline-none mb-2"
            chains={networksDataSmartPosts()?.chains}
            isUnsupportedChain={networksDataSmartPosts()?.isUnsupportedChain}
          />
        </>
      ) : null}

      {!getEVMAuth ? (
        <EVMWallets title="Login with EVM" className="mx-2 w-[97%]" />
      ) : isFarcaster && !isFarcasterAuth ? (
        <FarcasterAuth />
      ) : isOpenAction && !lensAuth?.profileHandle ? (
        <LensAuth
          title="Login with Lens"
          className="mx-2 w-[95%] outline-none"
        />
      ) : isOpenAction && !dispatcher ? (
        <LensDispatcher
          title="Enable signless transactions"
          className="mx-2 w-[95%] outline-none"
        />
      ) : !isFarcaster && !isOpenAction && isUnsupportedChain() ? (
        <div className="mx-2 outline-none">
          <Button
            className="w-full outline-none flex justify-center items-center gap-2"
            disabled={isLoadingSwitchNetwork}
            onClick={() => switchNetwork(selectedChainId)}
            color="red"
          >
            {isLoadingSwitchNetwork ? "Switching" : "Switch"} to{" "}
            {chains.find((i) => i.id === selectedChainId)?.name
              ? chains.find((i) => i.id === selectedChainId)?.name
              : "a suported"}{" "}
            Network {isLoadingSwitchNetwork && <Spinner />}
          </Button>
        </div>
      ) : (
        <div className="mx-2">
          <Button
            disabled={!write || networksDataSmartPosts()?.isUnsupportedChain}
            fullWidth
            // color="yellow"
            onClick={handleSubmit}
          >
            {" "}
            Create Edition{" "}
          </Button>
        </div>
      )}
    </>
  );
};

export default ERC721Edition;
