import { useContext, useEffect, useState } from "react";
import {
  ENVIRONMENT,
  claimReward,
  shareOnSocials,
  uploadUserAssetToIPFS,
} from "../../../../../../../services";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Context } from "../../../../../../../providers/context/ContextProvider";
import {
  getFromLocalStorage,
  errorMessage,
  jsConfettiFn,
  addressCrop,
  saveToLocalStorage,
} from "../../../../../../../utils";
import { useLocalStorage, useReset } from "../../../../../../../hooks/app";
import {
  APP_ETH_ADDRESS,
  ERROR,
  FRAME_URL,
  LOCAL_STORAGE,
  URL_REGEX,
} from "../../../../../../../data";
import { Button, Spinner } from "@material-tailwind/react";
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

  // zora contract deploy states
  // const [isDeployingZoraContract, setIsDeployingZoraContract] = useState(false);
  const [isDeployingZoraContractError, setIsDeployingZoraContractError] =
    useState(false);
  const [isDeployingZoraContractSuccess, setIsDeployingZoraContractSuccess] =
    useState(false);
  const [zoraContractAddress, setZoraContractAddress] = useState(null);

  // frame POST states
  const [isPostingFrame, setIsPostingFrame] = useState(false);
  const [isPostingFrameError, setIsPostingFrameError] = useState(false);
  const [isPostingFrameSuccess, setIsPostingFrameSuccess] = useState(false);
  const [isStoringFrameData, setIsStoringFrameData] = useState(false);
  const [isDeployingZoraContract, setIsDeployingZoraContract] = useState(false);
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);
  const [frameId, setFrameId] = useState(null);

  const {
    postName,
    postDescription,
    contextCanvasIdRef,
    canvasBase64Ref,
    setFarcasterStates,
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
    queryFn: () => getOrCreateWallet(),
    refetchOnWindowFocus: false,
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

  const chainId = ENVIRONMENT === "production" ? 8453 : 999999999; // 999999999 - zora sepolia
  const isCreatorSponsored = farcasterStates?.frameData?.isCreatorSponsored;
  const LOA = walletData?.publicAddress ? walletData?.publicAddress : userLOA;
  const allowedMints = farcasterStates?.frameData?.allowedMints;

  const argsArr = [
    postName || "My Frame",
    postName?.split(" ")[0].toUpperCase() || "MYFRAME",
    allowedMints || "10",
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
  const deployZoraContractFn = async () => {
    setIsDeployingZoraContract(true);

    deployZoraContractMutation({
      contract_type: "721",
      canvasId: contextCanvasIdRef.current,
      chainId: chainId,
      args: argsArr,
    })
      .then((res) => {
        setZoraContractAddress(res?.contract_address);
        setIsDeployingZoraContractSuccess(true);
        setIsDeployingZoraContract(false);
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
      contractAddress: zoraContractAddress,
      chainId: chainId,
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

          claimReward({
            taskId: 2,
          });   
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

    // check if allowed mint is provided
    if (
      farcasterStates.frameData?.isFrame &&
      (farcasterStates.frameData?.allowedMintsIsError ||
        !farcasterStates.frameData?.allowedMints)
    ) {
      toast.error("Please enter number of mints");
      return;
    }

    if (
      farcasterStates.frameData?.isFrame &&
      farcasterStates.frameData?.isCreatorSponsored &&
      farcasterStates.frameData?.allowedMints > walletData?.sponsored &&
      !farcasterStates.frameData?.isSufficientBalance
    ) {
      toast.error(`Insufficient balance. Please topup your account to mint`);
      return;
    }

    if (
      farcasterStates.frameData?.isFrame &&
      farcasterStates.frameData?.isExternalLinkError
    ) {
      toast.error("Please enter a valid URL");
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

  useEffect(() => {
    if (isUploadSuccess && farcasterStates.frameData?.isCreatorSponsored) {
      setIsPostingFrame(false);
      deployZoraContractFn();
    }
  }, [isUploadSuccess]);

  useEffect(() => {
    if (isUploadSuccess && !farcasterStates.frameData?.isCreatorSponsored) {
      setIsPostingFrame(false);
      write?.();
    }
  }, [isUploadSuccess, write]);

  useEffect(() => {
    if (isSuccess) {
      setIsDeployingZoraContractSuccess(true);
      setZoraContractAddress(receipt?.logs[0]?.address);

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
                <span>{walletData?.balance} Base ETH</span>
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
            farcasterStates.frameData?.isCreatorSponsored && "hidden"
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
          !farcasterStates?.frameData?.isCreatorSponsored &&
          chain?.id != chainId ? (
          <div className="mx-2 outline-none">
            <Button
              className="w-full outline-none flex justify-center items-center gap-2"
              disabled={isLoadingSwitchNetwork}
              onClick={() => switchNetwork(chainId)}
              color="red"
            >
              {isLoadingSwitchNetwork ? "Switching" : "Switch"} to{" "}
              {chain?.id != chainId ? "base" : "a suported"} Network{" "}
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
