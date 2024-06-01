import { useContext, useEffect, useState } from "react";
import {
  ENVIRONMENT,
  getENSDomain,
  shareOnSocials,
  uploadUserAssetToIPFS,
} from "../../../../../../../services";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Context } from "../../../../../../../providers/context/ContextProvider";
import {
  getFromLocalStorage,
  errorMessage,
  addressCrop,
  saveToLocalStorage,
  chainLogo,
} from "../../../../../../../utils";
import {
  useAppAuth,
  useLocalStorage,
  useReset,
} from "../../../../../../../hooks/app";
import {
  APP_ETH_ADDRESS,
  DEGEN_CURRENCY_ADDRESS,
  ERROR,
  FRAME_URL,
  LOCAL_STORAGE,
  TOKEN_LIST,
  URL_REGEX,
  degenChain,
} from "../../../../../../../data";
import {
  Avatar,
  Button,
  Option,
  Select,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import { EVMWallets } from "../../../../top-section/auth/wallets";
import FarcasterAuth from "./FarcasterAuth";
import FarcasterChannel from "./FarcasterChannel";
import { Switch } from "@headlessui/react";
import { ZoraDialog } from "../../zora-mint/components";
import logoFarcaster from "../../../../../../../assets/logos/logoFarcaster.jpg";
import {
  deployZoraContract,
  getFrame,
  getOrCreateWallet,
  mintToXchain,
  postFrame,
} from "../../../../../../../services/apis/BE-apis";
import { InputBox, InputErrorMsg, NumberInputBox } from "../../../../../common";
import Topup from "./Topup";
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useSwitchNetwork,
  useWaitForTransaction,
} from "wagmi";
import WithdrawFunds from "./WithdrawFunds";
import { zoraNftCreatorV1Config } from "@zoralabs/zora-721-contracts";
import { zoraURLErc721 } from "../../zora-mint/utils";
import TiDelete from "@meronex/icons/ti/TiDelete";
import BsPlus from "@meronex/icons/bs/BsPlus";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { useBalance } from "wagmi";
import { base, baseSepolia } from "viem/chains";
import { LENSPOST_721_ENALBED_CHAINS } from "../../../../../../../data/constant/enabledChain";

const FarcasterNormalPost = () => {
  const { resetState } = useReset();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { userLOA } = useLocalStorage();
  const getEVMAuth = getFromLocalStorage(LOCAL_STORAGE.evmAuth);
  const { switchNetwork, isLoading: isLoadingSwitchNetwork } =
    useSwitchNetwork();

  // farcaster states
  const [isShareLoading, setIsShareLoading] = useState(false);
  const [isShareSuccess, setIsShareSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [farTxHash, setFarTxHash] = useState("");

  // FC Split recipients
  const [recipientsLensHandle, setRecipientsLensHandle] = useState([]);
  const [totalPercentage, setTotalPercentage] = useState(0);

  // zora contract deploy states
  // const [isDeployingZoraContract, setIsDeployingZoraContract] = useState(false);
  const [isDeployingZoraContractError, setIsDeployingZoraContractError] =
    useState(false);
  const [isDeployingZoraContractSuccess, setIsDeployingZoraContractSuccess] =
    useState(false);
  const [respContractAddress, setRespContractAddress] = useState(null);

  // frame POST states
  const [isPostingFrame, setIsPostingFrame] = useState(false);
  const [isPostingFrameError, setIsPostingFrameError] = useState(false);
  const [isPostingFrameSuccess, setIsPostingFrameSuccess] = useState(false);
  const [isStoringFrameData, setIsStoringFrameData] = useState(false);
  const [isDeployingZoraContract, setIsDeployingZoraContract] = useState(false);
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);
  const [frameId, setFrameId] = useState(null);
  const [recipientsEns, setRecipientsEns] = useState([]);
  const [totalPercent, setTotalPercent] = useState(0);
  const [slug, setSlug] = useState("");
  const { isAuthenticated } = useAppAuth();

  const {
    postName,
    postDescription,
    contextCanvasIdRef,
    canvasBase64Ref,
    setFarcasterStates,
    splitError,
    setSplitError,
    parentRecipientListRef,
    farcasterStates, // don't remove this
    lensAuthState, // don't remove this
  } = useContext(Context);

  const { isFarcasterAuth } = useLocalStorage();

  const {
    data: walletData,
    isError: isWalletError,
    isLoading: isWalletLoading,
    error: walletError,
    isSuccess: isWalletSuccess,
    refetch: refetchWallet,
    isRefetching: isWalletRefetching,
  } = useQuery({
    queryKey: ["getOrCreateWallet"],
    queryFn: () => getOrCreateWallet(chain?.id),
    refetchOnWindowFocus: false,
  });

  const {
    data: currencyData,
    isError: isCurrencyError,
    isLoading: isCurrencyLoading,
    error: currencyError,
    isSuccess: isCurrencySuccess,
    refetch: refetchCurrency,
    isRefetching: isCurrencyRefetching,
  } = useBalance({
    address: "0x62b14E5D09BC0C340116B5BC87d787377C07A820",
    chainId: degenChain?.id,
  });

  const { mutateAsync: deployZoraContractMutation } = useMutation({
    mutationKey: "deployZoraContract",
    mutationFn: deployZoraContract,
  });

  const { mutateAsync: postFrameData } = useMutation({
    mutationKey: "postFrameData",
    mutationFn: postFrame,
  });

  const { mutateAsync: shareOnFarcaster } = useMutation({
    mutationKey: "shareOnFarcaster",
    mutationFn: shareOnSocials,
  });

  // store zora link in DB Mutation
  const { mutateAsync: storeZoraLinkMutation } = useMutation({
    mutationKey: "storeZoraLink",
    mutationFn: mintToXchain,
  });

  // upload to IPFS Mutation
  const {
    mutate,
    data: uploadData,
    isError: isUploadError,
    error: uploadError,
    isLoading: isUploading,
  } = useMutation({
    mutationKey: "uploadToIPFS",
    mutationFn: uploadUserAssetToIPFS,
    onSuccess: () => {
      setIsUploadSuccess(true);
    },
  });

  const chainId = ENVIRONMENT === "production" ? base?.id : baseSepolia?.id;
  const isCreatorSponsored = farcasterStates?.frameData?.isCreatorSponsored;
  const LOA = walletData?.publicAddress ? walletData?.publicAddress : userLOA;
  const allowedMints = farcasterStates?.frameData?.allowedMints;

  const argsArr = [
    postName,
    postName?.split(" ")[0].toUpperCase(),
    allowedMints,
    "500",
    address,
    isCreatorSponsored ? LOA : address,
    {
      publicSalePrice: "0",
      maxSalePurchasePerAddress: "4294967295",
      publicSaleStart: "0",
      publicSaleEnd: "18446744073709551615",
      presaleStart: "0",
      presaleEnd: "18446744073709551615",
      presaleMerkleRoot:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
    },
    postDescription || "This is My frame",
    "0x0",
    `ipfs://${uploadData?.message}`,
    APP_ETH_ADDRESS,
  ];

  // check if recipient address is same
  const isRecipientAddDuplicate = () => {
    const result = farcasterStates?.frameData?.fcSplitRevenueRecipients.filter(
      (item, index) => {
        return (
          farcasterStates?.frameData?.fcSplitRevenueRecipients.findIndex(
            (item2) => item2.address === item.address
          ) !== index
        );
      }
    );

    if (result.length > 0) {
      setFarcasterStates((prevState) => ({
        ...prevState,
        frameData: {
          ...prevState.frameData,
          isFcSplitError: true,
          fcSplitError: "Recipient address should be unique",
        },
      }));
      return true;
    } else {
      return false;
    }
  };

  // check if recipient percentage is more than 100
  const isPercentage100 = () => {
    const result = farcasterStates?.frameData?.fcSplitRevenueRecipients.reduce(
      (acc, item) => acc + item.percentAllocation,
      0
    );

    setTotalPercent(result);

    if (result === 100) {
      return true;
    } else {
      setFarcasterStates((prevState) => ({
        ...prevState,
        frameData: {
          ...prevState.frameData,
          isFcSplitError: true,
          fcSplitError: "Total percentage should be 100",
        },
      }));
      return false;
    }
  };

  const checkCustomCurrAmt = () => {
    if (farcasterStates?.frameData?.customCurrAmount <= 0.0001) {
      setFarcasterStates((prevState) => ({
        ...prevState,
        frameData: {
          ...prevState.frameData,
          isCustomCurrAmountError: true,
          customCurrAmountError: "Minimum price is 0.0001",
        },
      }));
      return false;
    } else {
      return true;
    }
  };

  // Sort the recipients by address in ascending order
  const sortRecipientsByAddress = (recipients) => {
    return recipients.sort((a, b) =>
      a.address
        .toLowerCase()
        .localeCompare(b.address.toLowerCase(), undefined, {
          sensitivity: "base",
        })
    );
  };

  // function to remove duplicate recipients and aggregate percentAllocations
  // usecase : some xyz address and ens handle address being same
  const removeAndAggregateDuplicates = (recipients) => {
    const addressMap = new Map();

    // Aggregate percent allocations by address
    recipients.forEach((recipient) => {
      const address = recipient.address.toLowerCase();
      if (addressMap.has(address)) {
        addressMap.set(
          address,
          addressMap.get(address) + recipient.percentAllocation
        );
      } else {
        addressMap.set(address, recipient.percentAllocation);
      }
    });

    // Convert the map back to an array
    return Array.from(addressMap.entries()).map(
      ([address, percentAllocation]) => ({
        address,
        percentAllocation,
      })
    );
  };

  const handleChange = (e, key) => {
    const { name, value } = e.target;

    setFarcasterStates((prevState) => {
      // Create a new state based on the previous state
      const newState = {
        ...prevState,
        frameData: {
          ...prevState.frameData,
          [key]: value,
        },
      };

      // Check if the name is "allowedMints" and perform validation
      if (name === "allowedMints") {
        if (!value || value <= 0) {
          newState.frameData.allowedMintsIsError = true;
          newState.frameData.allowedMintsError =
            "Please enter a valid number of mints";
        } else {
          newState.frameData.allowedMintsIsError = false;
          newState.frameData.allowedMintsError = "";
        }
      }

      // check if external link is a valid URL
      if (name === "externalLink") {
        if (value && !value.match(URL_REGEX)) {
          newState.frameData.isExternalLinkError = true;
          newState.frameData.isExternalLinkError = "Please enter a valid URL";
        } else {
          newState.frameData.isExternalLinkError = false;
          newState.frameData.isExternalLinkError = "";
        }
      }

      // check if custom currency amount is a valid number
      if (name === "customCurrAmount") {
        if (!value || value <= 0.0001) {
          newState.frameData.isCustomCurrAmountError = true;
          newState.frameData.customCurrAmountError =
            "Price should not be less than 0.0001";
        } else {
          newState.frameData.isCustomCurrAmountError = false;
          newState.frameData.customCurrAmountError = "";
        }
      }
      // Return the new state
      return newState;
    });
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
    args: argsArr,
  });

  const {
    write,
    data,
    error: writeError,
    isLoading,
    isError: isWriteError,
  } = useContractWrite(config);
  const {
    data: receipt,
    isLoading: isPending,
    isSuccess,
  } = useWaitForTransaction({ hash: data?.hash });

  // deploy zora contract
  const deployZoraContractFn = async (deployArgs) => {
    setIsDeployingZoraContract(true);

    deployZoraContractMutation(deployArgs)
      .then((res) => {
        setRespContractAddress(res?.contract_address || res?.contract);
        setIsDeployingZoraContractSuccess(true);
        setIsDeployingZoraContract(false);
        if (farcasterStates?.frameData?.isCustomCurrMint) {
          setSlug(res?.slug);
        }
      })
      .catch((err) => {
        setIsDeployingZoraContractError(true);
        setIsDeployingZoraContract(false);
        toast.error(errorMessage(err));
      });
  };

  const postFrameDataFn = async () => {
    setIsStoringFrameData(true);

    const params = {
      canvasId: contextCanvasIdRef.current,
      owner: address,
      isTopUp: farcasterStates.frameData?.isTopup,
      allowedMints: Number(farcasterStates.frameData?.allowedMints),
      metadata: {
        name: postName,
        description: postDescription,
      },
      isLike: farcasterStates.frameData?.isLike,
      isRecast: farcasterStates.frameData?.isRecast,
      isFollow: farcasterStates.frameData?.isFollow,
      redirectLink: farcasterStates.frameData?.externalLink,
      contractAddress: respContractAddress,
      chainId: farcasterStates?.frameData?.isCustomCurrMint
        ? farcasterStates?.frameData?.selectedNetwork?.id
        : base?.id,
      creatorSponsored: farcasterStates.frameData?.isCreatorSponsored,
    };
    postFrameData(params)
      .then((res) => {
        if (res?.status === "success") {
          setIsStoringFrameData(false);
          setFrameId(res?.frameId);
          setIsPostingFrameSuccess(true);
        } else if (res?.error) {
          setIsStoringFrameData(false);
          setIsPostingFrameError(true);
          toast.error(res?.error);
        }
      })
      .catch((err) => {
        setIsStoringFrameData(false);
        setIsPostingFrameError(true);
        toast.error(errorMessage(err));
      });
  };

  const monetizationSettings = () => {
    let canvasParams = {};

    if (farcasterStates.isChannel) {
      canvasParams = {
        ...canvasParams,
        zoraMintLink: "",
        channelId: farcasterStates.channel?.id,
      };
    }

    if (farcasterStates.frameData?.isFrame) {
      canvasParams = {
        ...canvasParams,
        frameLink: FRAME_URL + "/frame/" + frameId,
      };
    }

    return canvasParams;
  };

  // share post on lens
  const sharePost = async (platform) => {
    setIsShareLoading(true);

    const canvasData = {
      id: contextCanvasIdRef.current,
      name: "Farcaster post",
      content: postDescription,
    };

    shareOnFarcaster({
      canvasData: canvasData,
      canvasParams: monetizationSettings(),
      platform: platform,
    })
      .then((res) => {
        if (res?.txHash) {
          setIsShareLoading(false);
          setFarTxHash(res?.txHash);
          setIsShareSuccess(true);

          // open the dialog
        } else if (res?.error || res?.reason === "REJECTED") {
          setIsError(true);
          setIsShareLoading(false);
          toast.error(res?.error);
        }
      })
      .catch((err) => {
        setIsError(true);
        setIsShareLoading(false);
        toast.error(errorMessage(err));
      });
  };

  const handleSubmit = () => {
    // check if canvasId is provided
    if (contextCanvasIdRef.current === null) {
      toast.error("Please select a design");
      return;
    }

    // check if name is provided
    if (!postName) {
      toast.error("Please provide a name");
      return;
    }

    // check if description is provided
    if (!postDescription) {
      toast.error("Please provide a description");
      return;
    }

    // if price is valid
    if (farcasterStates.frameData?.isCustomCurrAmountError) {
      return;
    }

    // check if allowed mint is provided
    if (
      farcasterStates.frameData?.isFrame &&
      (farcasterStates.frameData?.allowedMintsIsError ||
        !farcasterStates.frameData?.allowedMints)
    ) {
      toast.error("Please enter allowed mints");
      return;
    }

    // sufficient balance check
    if (
      farcasterStates.frameData?.isFrame &&
      farcasterStates.frameData?.isCreatorSponsored &&
      farcasterStates.frameData?.allowedMints > walletData?.sponsored &&
      !farcasterStates.frameData?.isSufficientBalance
    ) {
      toast.error(`Insufficient balance. Please topup your account to mint`);
      return;
    }

    // check if external link is a valid URL
    if (
      farcasterStates.frameData?.isFrame &&
      farcasterStates.frameData?.isExternalLinkError
    ) {
      toast.error("Please enter a valid URL");
      return;
    }

    // check if recipient address is same
    if (
      farcasterStates.frameData?.isFrame &&
      farcasterStates.frameData?.fcSplitRevenueRecipients?.length > 0
    ) {
      if (isRecipientAddDuplicate()) {
        toast.error("Please enter unique addresses");
        return;
      }
    }

    // check if percentage is 100
    if (
      farcasterStates.frameData?.isFrame &&
      farcasterStates?.frameData?.isCustomCurrMint &&
      !isPercentage100()
    ) {
      toast.error("Total percentage should be 100");
      return;
    }

    if (
      farcasterStates.frameData?.isFrame &&
      farcasterStates.frameData?.isCustomCurrMint &&
      !checkCustomCurrAmt()
    ) {
      // toast.error("Please enter a valid price for the token");
      return;
    }

    if (farcasterStates.frameData?.isFrame) {
      setIsPostingFrame(true);
      // deploy zora contract
      mutate(canvasBase64Ref.current[0]);
    } else {
      sharePost("farcaster");
    }
  };

  const storeZoraLink = () => {
    let paramsData = {
      canvasId: contextCanvasIdRef.current,
      mintLink: receipt?.logs[0]?.address,
      chain: chain?.name,
      contractType: 721,
      chainId: chain?.id,
      hash: receipt?.logs[0]?.address,
    };

    storeZoraLinkMutation(paramsData)
      .then((res) => {
        console.log("StoreZoraLink", res?.slug);
        setSlug(res?.slug);
      })
      .catch((error) => {
        console.log("StoreZoraLinkErr", errorMessage(error));
      });
  };

  // funtion adding data for split revenues recipients
  const handleRecipientChange = (index, key, value) => {
    setFarcasterStates((prevState) => {
      // Create a new state based on the previous state
      const newState = {
        ...prevState,
        frameData: {
          ...prevState.frameData,
          [key]: value,
        },
      };

      // Check index 0 price should be min 10
      if (key === "percentAllocation" && index === 0) {
        if (value < 10 || value > 100 || isNaN(value)) {
          newState.frameData.isFcSplitError = true;
          newState.frameData.fcSplitErrorMsg =
            "Platform fee should be between 10% to 100%";
        } else {
          newState.frameData.isFcSplitError = false;
          newState.frameData.fcSplitErrorMsg = "";
        }
      } else if (key === "percentAllocation" && index !== 0) {
        // Any index price should be greater min 1 and max 100
        if (value < 1 || value > 100 || isNaN(value)) {
          newState.frameData.isFcSplitError = true;
          newState.frameData.fcSplitErrorMsg =
            "Split should be between 1% to 100%";
        } else {
          newState.frameData.isFcSplitError = false;
          newState.frameData.fcSplitErrorMsg = "";
        }
      }

      // Check if recipient address is not provided
      if (key === "address") {
        if (!value) {
          newState.frameData.isFcSplitError = true;
          newState.frameData.fcSplitErrorMsg = "Recipient address is required";
        } else {
          newState.frameData.isFcSplitError = false;
          newState.frameData.fcSplitErrorMsg = "";
        }
      }

      // Update the recipients array
      const updatedRecipients = [
        ...newState.frameData.fcSplitRevenueRecipients,
      ];
      updatedRecipients[index][key] = value;
      newState.frameData.fcSplitRevenueRecipients = updatedRecipients;

      // Return the new state
      return newState;
    });
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

  // funtion to remove input box for multi addresses
  const removeArrlistInputBox = (index, key, isErrKey, errKeyMsg) => {
    setFarcasterStates((prevState) => {
      const updatedFrameData = {
        ...prevState.frameData,
        [key]: prevState.frameData[key].filter((_, i) => i !== index),
      };

      if (isErrKey) {
        updatedFrameData[isErrKey] = false;
        updatedFrameData[errKeyMsg] = "";
      }

      return {
        ...prevState,
        frameData: updatedFrameData,
      };
    });
  };

  // split even percentage
  const splitEvenPercentage = () => {
    const result = farcasterStates?.frameData?.fcSplitRevenueRecipients.map(
      (item) => {
        return {
          address: item.address,
          percentAllocation: Math.floor(
            (
              100 / farcasterStates?.frameData?.fcSplitRevenueRecipients.length
            ).toFixed(2)
          ),
        };
      }
    );

    setFarcasterStates({
      ...farcasterStates,
      frameData: {
        ...farcasterStates?.frameData,
        fcSplitRevenueRecipients: result,
      },
    });
  };

  // funtion to add new input box for multi addresses
  const addArrlistInputBox = (key) => {
    if (key === "fcSplitRevenueRecipients") {
      setFarcasterStates({
        ...farcasterStates,
        frameData: {
          ...farcasterStates?.frameData,
          [key]: [
            ...farcasterStates?.frameData[key],
            { address: "", percentAllocation: "" },
          ],
        },
      });
      return;
    }

    setFarcasterStates({
      ...farcasterStates,
      frameData: {
        ...farcasterStates?.frameData,
        [key]: [...farcasterStates?.frameData[key], ""],
      },
    });
  };

  // add recipient to the split list
  useEffect(() => {
    if (isAuthenticated) {
      const updatedRecipients = parentRecipientListRef.current.map((item) => ({
        address: item,
        percentAllocation: 1.0,
      }));

      setFarcasterStates((prevEnabled) => ({
        ...prevEnabled,
        frameData: {
          ...prevEnabled?.frameData,
          fcSplitRevenueRecipients: [
            {
              address: APP_ETH_ADDRESS,
              percentAllocation: 10.0,
            },
            ...updatedRecipients,
          ],
        },
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

  useEffect(() => {
    if (isUploadSuccess && farcasterStates.frameData?.isCreatorSponsored) {
      setIsPostingFrame(false);

      const deployArgs = {
        contract_type: "721",
        canvasId: contextCanvasIdRef.current,
        chainId: base?.id,
        args: argsArr,
      };
      deployZoraContractFn(deployArgs);
    } else if (isUploadSuccess && farcasterStates.frameData?.isCustomCurrMint) {
      setIsPostingFrame(false);

      // Deploy custom currency arguments
      const deployArgs = {
        contract_type: 721,
        chainId: farcasterStates?.frameData?.selectedNetwork?.id,
        canvasId: contextCanvasIdRef.current,
        currency: farcasterStates?.frameData?.customCurrAddress,
        pricePerToken:
          Number(farcasterStates?.frameData?.customCurrAmount) * 10 ** 18,
        maxSupply: farcasterStates?.frameData?.allowedMints,
        args: [postName, postName?.split(" ")[0].toUpperCase(), 500],
        recipients: sortRecipientsByAddress(
          farcasterStates?.frameData?.fcSplitRevenueRecipients.map((item) => ({
            address: item.address,
            percentAllocation: item.percentAllocation,
          }))
        ),
      };
      deployZoraContractFn(deployArgs);
    }
  }, [isUploadSuccess]);

  useEffect(() => {
    if (
      isUploadSuccess &&
      !farcasterStates.frameData?.isCreatorSponsored &&
      !farcasterStates.frameData?.isCustomCurrMint
    ) {
      setIsPostingFrame(false);
      write?.();
    }
  }, [isUploadSuccess, write]);

  useEffect(() => {
    if (isSuccess) {
      setIsDeployingZoraContractSuccess(true);
      setRespContractAddress(receipt?.logs[0]?.address);

      storeZoraLink();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isDeployingZoraContractSuccess) {
      postFrameDataFn();
    }
  }, [isDeployingZoraContractSuccess]);

  useEffect(() => {
    if (isPostingFrameSuccess) {
      sharePost("farcaster");
    }
  }, [isPostingFrameSuccess]);

  useEffect(() => {
    if (isWalletSuccess) {
      saveToLocalStorage(LOCAL_STORAGE.userLOA, walletData?.publicAddress);
    }
  }, [isWalletSuccess]);

  // error handling for mint
  useEffect(() => {
    if (isWriteError) {
      console.log("mint error", isWriteError);
      console.log("mint error", writeError);
      toast.error(writeError?.message.split("\n")[0]);
    }

    if (isPrepareError) {
      console.log("prepare error", prepareError);
      // toast.error(prepareError.message);
    }

    if (isUploadError) {
      toast.error(uploadError?.message);
    }

    setIsUploadSuccess(false);
    setIsError(false);
    setIsPostingFrameError(false);
    setIsDeployingZoraContractError(false);
  }, [
    isWriteError,
    isPrepareError,
    isError,
    isPostingFrameError,
    isDeployingZoraContractError,
    isUploadError,
  ]);

  useEffect(() => {
    setTimeout(() => {
      refetchWallet();
    }, 1000);
  }, [farcasterStates?.frameData?.selectedNetwork?.name]);

  console.log("Topup balance", walletData?.balance);

  return (
    <>
      <ZoraDialog
        title="Share on Farcaster"
        icon={logoFarcaster}
        isError={
          isError ||
          isPostingFrameError ||
          isDeployingZoraContractError ||
          isWriteError ||
          (farcasterStates?.frameData?.isCreatorSponsored && prepareError) ||
          isUploadError
        }
        isLoading={isLoading}
        isCreatingSplit={null}
        isUploadingToIPFS={isPostingFrame}
        isPending={isPending}
        isShareLoading={isShareLoading}
        isShareSuccess={isShareSuccess}
        isOpenAction={false}
        isFarcaster={true}
        data={null}
        farTxHash={farTxHash}
        isSuccess={false}
        isFrame={farcasterStates.frameData?.isFrame}
        frameId={frameId}
        isStoringFrameData={isStoringFrameData}
        isDeployingZoraContract={isDeployingZoraContract}
        slug={slug}
      />
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
                farcasterStates.isChannel ? "translate-x-6" : "translate-x-1"
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

      <div className="mb-4 m-4">
        <div className="flex justify-between">
          <h2 className="text-lg mb-2"> Share as Frame </h2>
          <Switch
            checked={farcasterStates.frameData?.isFrame}
            onChange={() =>
              setFarcasterStates({
                ...farcasterStates,
                frameData: {
                  ...farcasterStates.frameData,
                  isFrame: !farcasterStates.frameData?.isFrame,
                },
              })
            }
            className={`${
              farcasterStates.frameData?.isFrame
                ? "bg-[#e1f16b]"
                : "bg-gray-200"
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#e1f16b] focus:ring-offset-2`}
          >
            <span
              className={`${
                farcasterStates.frameData?.isFrame
                  ? "translate-x-6"
                  : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />{" "}
          </Switch>
        </div>
        <div className="w-4/5 opacity-75">
          {" "}
          Share as Mintable Frame on Farcaster.{" "}
        </div>
      </div>

      <div
        className={`${!farcasterStates.frameData?.isFrame && "hidden"} mx-4`}
      >
        <div className="mb-4">
          <div className="flex justify-between">
            <h2 className="text-lg mb-2"> Gate with </h2>
            <Switch
              checked={farcasterStates.frameData?.isGateWith}
              onChange={() =>
                setFarcasterStates({
                  ...farcasterStates,
                  frameData: {
                    ...farcasterStates.frameData,
                    isGateWith: !farcasterStates.frameData?.isGateWith,
                  },
                })
              }
              className={`${
                farcasterStates.frameData?.isGateWith
                  ? "bg-[#e1f16b]"
                  : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#e1f16b] focus:ring-offset-2`}
            >
              <span
                className={`${
                  farcasterStates.frameData?.isGateWith
                    ? "translate-x-6"
                    : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />{" "}
            </Switch>
          </div>
          <div className="w-4/5 opacity-75">
            {" "}
            Control content access based on engagement.{" "}
          </div>

          <div
            className={`${!farcasterStates.frameData?.isGateWith && "hidden"}`}
          >
            <div className="flex justify-between py-2">
              <h2 className="text-lg mb-2"> Like </h2>
              <Switch
                checked={farcasterStates.frameData?.isLike}
                onChange={() =>
                  setFarcasterStates({
                    ...farcasterStates,
                    frameData: {
                      ...farcasterStates.frameData,
                      isLike: !farcasterStates.frameData?.isLike,
                    },
                  })
                }
                className={`${
                  farcasterStates.frameData?.isLike
                    ? "bg-[#e1f16b]"
                    : "bg-gray-200"
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#e1f16b] focus:ring-offset-2`}
              >
                <span
                  className={`${
                    farcasterStates.frameData?.isLike
                      ? "translate-x-6"
                      : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />{" "}
              </Switch>
            </div>

            <div className="flex justify-between py-2">
              <h2 className="text-lg mb-2"> Recast </h2>
              <Switch
                checked={farcasterStates.frameData?.isRecast}
                onChange={() =>
                  setFarcasterStates({
                    ...farcasterStates,
                    frameData: {
                      ...farcasterStates.frameData,
                      isRecast: !farcasterStates.frameData?.isRecast,
                    },
                  })
                }
                className={`${
                  farcasterStates.frameData?.isRecast
                    ? "bg-[#e1f16b]"
                    : "bg-gray-200"
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#e1f16b] focus:ring-offset-2`}
              >
                <span
                  className={`${
                    farcasterStates.frameData?.isRecast
                      ? "translate-x-6"
                      : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />{" "}
              </Switch>
            </div>

            <div className="flex justify-between py-2">
              <h2 className="text-lg mb-2"> Follow </h2>
              <Switch
                checked={farcasterStates.frameData?.isFollow}
                onChange={() =>
                  setFarcasterStates({
                    ...farcasterStates,
                    frameData: {
                      ...farcasterStates.frameData,
                      isFollow: !farcasterStates.frameData?.isFollow,
                    },
                  })
                }
                className={`${
                  farcasterStates.frameData?.isFollow
                    ? "bg-[#e1f16b]"
                    : "bg-gray-200"
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#e1f16b] focus:ring-offset-2`}
              >
                <span
                  className={`${
                    farcasterStates.frameData?.isFollow
                      ? "translate-x-6"
                      : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />{" "}
              </Switch>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <div className="flex justify-between">
            <h2 className="text-lg mb-2"> External Link </h2>
            <Switch
              checked={farcasterStates.frameData?.isExternalLink}
              onChange={() =>
                setFarcasterStates({
                  ...farcasterStates,
                  frameData: {
                    ...farcasterStates.frameData,
                    isExternalLink: !farcasterStates.frameData?.isExternalLink,
                  },
                })
              }
              className={`${
                farcasterStates.frameData?.isExternalLink
                  ? "bg-[#e1f16b]"
                  : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#e1f16b] focus:ring-offset-2`}
            >
              <span
                className={`${
                  farcasterStates.frameData?.isExternalLink
                    ? "translate-x-6"
                    : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />{" "}
            </Switch>
          </div>
          <div className="w-4/5 opacity-75">
            {" "}
            Let user know more about your frame.{" "}
          </div>

          <div
            className={`${
              !farcasterStates.frameData?.isExternalLink && "hidden"
            } mt-2`}
          >
            <InputBox
              label="External Link"
              name="externalLink"
              onChange={(e) => handleChange(e, "externalLink")}
              onFocus={(e) => handleChange(e, "externalLink")}
            />
          </div>

          {farcasterStates.frameData?.isExternalLinkError && (
            <InputErrorMsg
              message={farcasterStates.frameData?.isExternalLinkError}
            />
          )}
        </div>
        {/* Start  */}
        {/* Start Degen-L3 Mint */}
        <div className="mb-4">
          <div className="flex justify-between">
            <h2 className="text-lg mb-2"> Custom currency Mint </h2>
            <Switch
              checked={farcasterStates.frameData?.isCustomCurrMint}
              onChange={() =>
                setFarcasterStates({
                  ...farcasterStates,
                  frameData: {
                    ...farcasterStates.frameData,
                    isCustomCurrMint:
                      !farcasterStates.frameData?.isCustomCurrMint,
                    isCreatorSponsored: false,
                  },
                })
              }
              className={`${
                farcasterStates.frameData?.isCustomCurrMint
                  ? "bg-[#e1f16b]"
                  : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#e1f16b] focus:ring-offset-2`}
            >
              <span
                className={`${
                  farcasterStates.frameData?.isCustomCurrMint
                    ? "translate-x-6"
                    : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />{" "}
            </Switch>
          </div>
          <div className="w-4/5 opacity-75">
            {" "}
            Mint NFTs with custom currencies like $DEGEN{" "}
          </div>
        </div>
        <div
          className={`${
            !farcasterStates.frameData?.isCustomCurrMint && "hidden"
          } mt-2`}
        >
          {chain?.id === 8453 ? (
            <>
              <p className="text-end mt-4">
                <span>Topup account:</span>
                {isWalletLoading || isWalletRefetching ? (
                  <span className="text-blue-500"> Loading address... </span>
                ) : (
                  <span
                    className="text-blue-500 cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(walletData?.publicAddress);
                      toast.success("Copied topup account address");
                    }}
                  >
                    {" "}
                    {addressCrop(walletData?.publicAddress)}
                  </span>
                )}
              </p>
              <p className="text-end">
                <span>Topup balance:</span>
                {isWalletLoading || isWalletRefetching ? (
                  <span className="text-blue-500"> Loading balance... </span>
                ) : (
                  <span>
                    {" "}
                    {walletData?.balance} {chain?.nativeCurrency?.symbol}{" "}
                  </span>
                )}
              </p>
            </>
          ) : null}
          <div className="flex flex-col py-4">
            <Select
              animate={{
                mount: { y: 0 },
                unmount: { y: 25 },
              }}
              label="Network"
              name="Network"
              id="Network"
              value={farcasterStates?.frameData?.selectedNetwork?.name}
            >
              {LENSPOST_721_ENALBED_CHAINS?.map((network) => (
                <Option
                  key={network?.id}
                  onClick={() => {
                    switchNetwork(network?.id);
                    setFarcasterStates({
                      ...farcasterStates,
                      frameData: {
                        ...farcasterStates.frameData,
                        selectedNetwork: {
                          id: network?.id,
                          name: network?.name,
                        },
                        customCurrSymbol: "",
                        customCurrAddress: "",
                      },
                    });
                  }}
                >
                  {network?.name}
                </Option>
              ))}
            </Select>
          </div>
          <div className="my-2">
            <div
              className={`${
                !farcasterStates.frameData?.isCustomCurrMint && "hidden"
              } `}
            >
              {farcasterStates?.frameData?.selectedNetwork?.name && (
                <>
                  <div className="flex flex-row justify-between">
                    <div className="flex flex-col py-4">
                      <NumberInputBox
                        min={"1"}
                        step={"1"}
                        label="Price"
                        name="customCurrAmount"
                        onChange={(e) => handleChange(e, "customCurrAmount")}
                        onFocus={(e) => handleChange(e, "customCurrAmount")}
                        value={farcasterStates?.frameData?.customCurrAmount}
                      />
                    </div>

                    <div className="flex flex-col py-4 mx-2">
                      {/* <label htmlFor="price"></label> */}
                      <Select
                        animate={{
                          mount: { y: 0 },
                          unmount: { y: 25 },
                        }}
                        label="Currency"
                        name="customCurrSymbol"
                        id="customCurrSymbol"
                        value={farcasterStates?.frameData?.customCurrSymbol}
                      >
                        {TOKEN_LIST[
                          farcasterStates?.frameData?.selectedNetwork?.name
                        ]?.map((currency) => (
                          <Option
                            key={currency?.id}
                            onClick={() => {
                              setFarcasterStates({
                                ...farcasterStates,
                                frameData: {
                                  ...farcasterStates.frameData,
                                  customCurrSymbol: currency?.symbol,
                                  customCurrAddress: currency?.address,
                                },
                              });
                            }}
                          >
                            {currency?.symbol}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  </div>

                  {farcasterStates?.frameData?.isCustomCurrAmountError && (
                    <InputErrorMsg
                      message={farcasterStates?.frameData.customCurrAmountError}
                    />
                  )}
                </>
              )}
            </div>

            <div
              className={`flex flex-col w-full py-2 ${
                !farcasterStates.frameData?.isCustomCurrMint && "hidden"
              }`}
            >
              <NumberInputBox
                min={1}
                step={1}
                label="Allowed Mints"
                name="allowedMints"
                onChange={(e) => handleChange(e, "allowedMints")}
                onFocus={(e) => handleChange(e, "allowedMints")}
                value={farcasterStates.frameData.allowedMints}
              />
            </div>

            {farcasterStates.frameData?.allowedMintsIsError && (
              <InputErrorMsg
                message={farcasterStates.frameData?.allowedMintsError}
              />
            )}

            {farcasterStates.frameData?.isCustomCurrMint &&
              farcasterStates.frameData?.allowedMints > walletData?.sponsored &&
              chain?.id !== degenChain?.id && (
                <Topup
                  topUpAccount={walletData?.publicAddress}
                  balance={walletData?.balance}
                  refetch={refetchWallet}
                  sponsored={walletData?.sponsored}
                />
              )}
          </div>
        </div>
        {/* End */}
        <div
          className={`mb-4 ${
            !farcasterStates.frameData?.isCustomCurrMint && "hidden"
          }`}
        >
          <h2 className="text-lg mb-2">Split Recipients</h2>
          <div className="flex justify-between">
            <Switch.Group>
              <Switch.Label className="w-4/5 opacity-60">
                Split revenue between multiple recipients
              </Switch.Label>
            </Switch.Group>
          </div>
          <div className="relative">
            {farcasterStates &&
              farcasterStates?.frameData?.fcSplitRevenueRecipients?.map(
                (recipient, index) => {
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
                      {!restrictRemoveRecipientInputBox(
                        index,
                        recipient.address
                      ) && (
                        <span>
                          <XCircleIcon
                            className="h-6 w-6 cursor-pointer"
                            color="red"
                            onClick={() =>
                              removeArrlistInputBox(
                                index,
                                "fcSplitRevenueRecipients",
                                "isFcSplitError",
                                "fcSplitErrorMsg"
                              )
                            }
                          />
                        </span>
                      )}
                    </div>
                  );
                }
              )}

            <div className="flex justify-between items-center">
              {farcasterStates?.frameData?.isFcSplitError && (
                <>
                  <InputErrorMsg
                    message={farcasterStates?.frameData?.fcSplitErrorMsg}
                  />
                </>
              )}
            </div>

            <div className="flex justify-between">
              <Button
                // color="yellow"
                size="sm"
                variant="filled"
                className="flex items-center gap-3 mt-2 ml-0 outline-none bg-[#e1f16b] text-black"
                onClick={() => addArrlistInputBox("fcSplitRevenueRecipients")}
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
        {/* End Degen-L3 Mint */}
        {/* {!farcasterStates.frameData?.isCustomCurrMint && ( */}
        <>
          <div className="mb-4">
            <div className="flex justify-between">
              <h2 className="text-lg mb-2"> Sponsor Mints </h2>
              <Switch
                checked={farcasterStates.frameData?.isCreatorSponsored}
                onChange={() =>
                  setFarcasterStates({
                    ...farcasterStates,
                    frameData: {
                      ...farcasterStates.frameData,
                      isCreatorSponsored:
                        !farcasterStates.frameData?.isCreatorSponsored,
                      isCustomCurrMint: false,
                    },
                  })
                }
                className={`${
                  farcasterStates.frameData?.isCreatorSponsored
                    ? "bg-[#e1f16b]"
                    : "bg-gray-200"
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#e1f16b] focus:ring-offset-2`}
              >
                <span
                  className={`${
                    farcasterStates.frameData?.isCreatorSponsored
                      ? "translate-x-6"
                      : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />{" "}
              </Switch>
            </div>
            <div className="w-4/5 opacity-75">
              {" "}
              Let your audience mint your frame for free.{" "}
            </div>
          </div>

          <div
            className={`${
              !farcasterStates.frameData?.isCreatorSponsored && "hidden"
            } mt-2`}
          >
            <div className="my-2">
              <p className="text-sm">
                {" "}
                {walletData?.sponsored > 0
                  ? `${
                      walletData?.sponsored
                    } mints are free. Topup with Base ETH if you want
              to drop more than ${walletData?.sponsored} mints ${" "}`
                  : "You don't have any free mint. please Topup with Base ETH to mint"}{" "}
              </p>
              <p className="text-end mt-4">
                <span>Topup account:</span>
                {isWalletLoading || isWalletRefetching ? (
                  <span className="text-blue-500"> Loading address... </span>
                ) : (
                  <span
                    className="text-blue-500 cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(walletData?.publicAddress);
                      toast.success("Copied topup account address");
                    }}
                  >
                    {" "}
                    {addressCrop(walletData?.publicAddress)}
                  </span>
                )}
              </p>
              <p className="text-end">
                <span>Topup balance:</span>
                {isWalletLoading || isWalletRefetching ? (
                  <span className="text-blue-500"> Loading balance... </span>
                ) : (
                  <span> {walletData?.balance} Base ETH</span>
                )}
              </p>
              <div className="flex flex-col w-full py-2">
                <NumberInputBox
                  min={1}
                  step={1}
                  label="Allowed Mints"
                  name="allowedMints"
                  onChange={(e) => handleChange(e, "allowedMints")}
                  onFocus={(e) => handleChange(e, "allowedMints")}
                  value={farcasterStates.frameData.allowedMints}
                />
              </div>

              {farcasterStates.frameData?.allowedMintsIsError && (
                <InputErrorMsg
                  message={farcasterStates.frameData?.allowedMintsError}
                />
              )}

              {farcasterStates.frameData?.isCreatorSponsored &&
                farcasterStates.frameData?.allowedMints >
                  walletData?.sponsored && (
                  <Topup
                    topUpAccount={walletData?.publicAddress}
                    balance={walletData?.balance}
                    refetch={refetchWallet}
                    sponsored={walletData?.sponsored}
                  />
                )}
            </div>
          </div>

          <div
            className={`${
              (farcasterStates.frameData?.isCreatorSponsored ||
                farcasterStates?.frameData?.isCustomCurrMint) &&
              "hidden"
            } mt-2`}
          >
            <div className="flex flex-col w-full py-2">
              <NumberInputBox
                min={1}
                step={1}
                label="Allowed Mints"
                name="allowedMints"
                onChange={(e) => handleChange(e, "allowedMints")}
                onFocus={(e) => handleChange(e, "allowedMints")}
                value={farcasterStates.frameData.allowedMints}
              />
            </div>

            {farcasterStates.frameData?.allowedMintsIsError && (
              <InputErrorMsg
                message={farcasterStates.frameData?.allowedMintsError}
              />
            )}
          </div>
        </>
        {/* // )} */}
        {walletData?.balance > 0 && (
          <WithdrawFunds refetchWallet={refetchWallet} />
        )}
      </div>

      <div className="flex flex-col bg-white shadow-2xl rounded-lg rounded-r-none">
        {!getEVMAuth ? (
          <EVMWallets title="Login with EVM" className="mx-2" />
        ) : !isFarcasterAuth ? (
          <FarcasterAuth />
        ) : farcasterStates?.frameData?.isFrame &&
          !farcasterStates?.frameData?.isCustomCurrMint &&
          !farcasterStates?.frameData?.isCreatorSponsored &&
          chain?.id != chainId ? (
          <div className="mx-2 outline-none">
            <Button
              className="w-full outline-none flex justify-center items-center gap-2"
              disabled={isLoadingSwitchNetwork}
              onClick={() => switchNetwork && switchNetwork(chainId)}
              color="red"
            >
              {isLoadingSwitchNetwork ? "Switching" : "Switch"} to
              {chain?.id != chainId ? " base" : "a suported"} Network{" "}
              {isLoadingSwitchNetwork && <Spinner />}
            </Button>
          </div>
        ) : (
          <div className="mx-2 my-2 outline-none">
            <Button
              className="w-full outline-none"
              onClick={handleSubmit}
              // color="yellow"
            >
              Share
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default FarcasterNormalPost;
