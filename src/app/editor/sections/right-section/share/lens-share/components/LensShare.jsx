import { useContext, useState, useEffect } from "react";
import {
  useAccount,
  useChainId,
  useSignMessage,
  useSwitchChain,
  useConfig,
} from "wagmi";
import TiDelete from "@meronex/icons/ti/TiDelete";
import BsArrowLeft from "@meronex/icons/bs/BsArrowLeft";
import { Switch } from "@headlessui/react";

import animationData from "../../../../../../../assets/lottie/alertAnimation2.json";

// Working Yet - change from headlessui/react to blueprintjs/core
// import { Switch } from "@blueprintjs/core";

import {
  checkDispatcher,
  lensAuthenticate,
  getBroadcastData,
  shareOnSocials,
  lensChallenge,
  signSetDispatcherTypedData,
  ENVIRONMENT,
  setBroadcastOnChainTx,
  getSocialDetails,
  getTop5SocialDetails,
} from "../../../../../../../services";
import { toast } from "react-toastify";
import { DateTimePicker } from "@atlaskit/datetime-picker";
import BsLink45Deg from "@meronex/icons/bs/BsLink45Deg";
import AiOutlinePlus from "@meronex/icons/ai/AiOutlinePlus";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Context } from "../../../../../../../providers/context/ContextProvider";
import {
  getFromLocalStorage,
  saveToLocalStorage,
  errorMessage,
  isEthAddress,
  isLensHandle,
} from "../../../../../../../utils";
import testnetTokenAddress from "../../../../../../../data/json/testnet-token-list.json";
import mainnetTokenAddress from "../../../../../../../data/json/mainnet-token-list.json";
import {
  CustomPopover,
  InputBox,
  InputErrorMsg,
  NumberInputBox,
} from "../../../../../common";
import { useStore } from "../../../../../../../hooks/polotno";
// import SplitPolicyCard from "../../../../../../data/constant/SplitPolicyCard";
import BsX from "@meronex/icons/bs/BsX";
import { LensAuth, LensDispatcher, SplitPolicyCard } from ".";
import { useAppAuth, useReset } from "../../../../../../../hooks/app";
import {
  APP_ETH_ADDRESS,
  APP_LENS_HANDLE,
  LOCAL_STORAGE,
} from "../../../../../../../data";
import {
  Button,
  Select,
  Option,
  Tabs,
  Tab,
  TabsHeader,
  Alert,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import { EVMWallets } from "../../../../top-section/auth/wallets";
import { SharePanelHeaders } from "../../components";
import BsPlus from "@meronex/icons/bs/BsPlus";

const LensShare = () => {
  const [recipientsLensHandle, setRecipientsLensHandle] = useState([]);
  const store = useStore();
  const { address, isConnected } = useAccount();
  const { resetState } = useReset();
  const getDispatcherStatus = getFromLocalStorage(LOCAL_STORAGE.dispatcher);
  const getEVMAuth = getFromLocalStorage(LOCAL_STORAGE.evmAuth);
  const getLensAuth = getFromLocalStorage(LOCAL_STORAGE.lensAuth);
  const [totalPercentage, setTotalPercentage] = useState(0);
  const { isAuthenticated } = useAppAuth();
  const chainId = useChainId();
  const { chain } = useAccount();
  const { chains } = useConfig();
  const {
    error: errorSwitchNetwork,
    isError: isErrorSwitchNetwork,
    isPending: isLoadingSwitchNetwork,
    isSuccess: isSuccessSwitchNetwork,
    switchChain,
  } = useSwitchChain();

  const {
    setIsLoading,
    setText,
    setMenu,
    postDescription,
    enabled,
    setEnabled,
    stFormattedTime,
    stFormattedDate,
    contextCanvasIdRef,
    isShareOpen,
    setIsShareOpen,
    priceError,
    setPriceError,
    splitError,
    setSplitError,
    editionError,
    setEditionError,
    referralError,
    setReferralError,
    parentRecipientListRef,

    lensAuthState, // don't remove this
  } = useContext(Context);

  const [sharing, setSharing] = useState(false);
  const [currentTab, setCurrentTab] = useState("smartPost");

  const isUnsupportedChain = () => {
    if (chain?.id != chains[0]?.id) return true; 
    return false;
  };

  const { mutateAsync: shareOnLens } = useMutation({
    mutationKey: "shareOnLens",
    mutationFn: shareOnSocials,
  });

  // Calendar Functions:
  const onCalChange = (value) => {
    const dateTime = new Date(value);

    // Format the date
    const dateOptions = { year: "numeric", month: "long", day: "numeric" };

    // Format the time
    const timeOptions = {
      hour: "numeric",
      minute: "numeric",
      timeZoneName: "short",
    };

    setEnabled({
      ...enabled,
      endTimestamp: {
        date: dateTime.toLocaleDateString(undefined, dateOptions),
        time: dateTime.toLocaleTimeString(undefined, timeOptions),
      },
    });
  };

  // get the list of tokens from json file
  const tokenList = () => {
    if (ENVIRONMENT === "production") {
      return mainnetTokenAddress.tokens;
    } else {
      return testnetTokenAddress.tokens;
    }
  };

  // get contract address acoording to currency
  const tokenAddress = (currency) => {
    const tokenListArr = tokenList();
    for (let i = 0; i < tokenListArr.length; i++) {
      if (tokenListArr[i].symbol === currency) {
        return tokenListArr[i].address;
      }
    }
  };

  // formate date and time in ISO 8601 format for monatizationn settings
  const formatDateTimeISO8601 = (date, time) => {
    if (!date || !time || date === "Invalid Date" || time === "Invalid Date")
      return;
    const dateTime = new Date(`${date} ${time}`);
    return dateTime?.toISOString();
  };

  // format date and time in unix format for schedule post
  const formatDateTimeUnix = (date, time) => {
    if (!date || !time) return;
    const dateTime = new Date(`${date} ${time}`);
    return dateTime.getTime();
  };

  // monetization settings
  const monetizationSettings = () => {
    if (
      !enabled.chargeForCollect &&
      !enabled.limitedEdition &&
      !enabled.timeLimit &&
      !enabled.whoCanCollect
    ) {
      return false;
    }

    let canvasParams = {
      followerOnly: enabled.whoCanCollect,
    };

    if (enabled.chargeForCollect) {
      canvasParams = {
        ...canvasParams,
        charge: {
          currency: tokenAddress(enabled.chargeForCollectCurrency),
          value: enabled.chargeForCollectPrice,
        },
      };
    }

    if (enabled.chargeForCollect) {
      canvasParams = {
        ...canvasParams,
        recipients: enabled.splitRevenueRecipients,
      };
    }

    if (enabled.mirrorReferralReward) {
      canvasParams = {
        ...canvasParams,
        referralFee: enabled.mirrorReferralRewardFee,
      };
    }

    if (enabled.limitedEdition) {
      canvasParams = {
        ...canvasParams,
        collectLimit: enabled.limitedEditionNumber,
      };
    }

    if (enabled.timeLimit) {
      canvasParams = {
        ...canvasParams,
        endTimestamp: formatDateTimeISO8601(
          enabled.endTimestamp.date,
          enabled.endTimestamp.time
        ),
      };
    }

    return canvasParams;
  };

  // funtions to handle split revenue
  const addRecipientInputBox = () => {
    if (enabled.splitRevenueRecipients.length < 5) {
      setEnabled({
        ...enabled,
        splitRevenueRecipients: [
          ...enabled.splitRevenueRecipients,
          { recipient: "", split: 1.0 },
        ],
      });
    }
  };

  const removeRecipientInputBox = (index) => {
    const updatedRecipients = enabled.splitRevenueRecipients.filter(
      (_, i) => i !== index
    );
    setEnabled({
      ...enabled,
      splitRevenueRecipients: updatedRecipients,
    });
    setSplitError({
      isError: false,
      message: "",
    });
  };

  // check if recipient address is same
  const isAddressDuplicate = () => {
    const arr = enabled.splitRevenueRecipients;
    let isError = false;
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length; j++) {
        if (i !== j && arr[i].recipient === arr[j].recipient) {
          isError = true;
          break;
        }
      }
    }

    return isError;
  };

  // check if recipient percentage is more than 100
  const isPercentage100 = () => {
    const arr = enabled.splitRevenueRecipients;
    let totalPercentage = 0;
    for (let i = 0; i < arr.length; i++) {
      totalPercentage += arr[i].split;
    }

    setTotalPercentage(totalPercentage);
    if (totalPercentage == 100) {
      return true;
    } else {
      return false;
    }
  };

  // split even percentage (decimal included)
  const splitEvenPercentage = () => {
    const result = enabled.splitRevenueRecipients.map((item) => {
      return {
        recipient: item.recipient,
        split: Math.floor(
          (100 / enabled.splitRevenueRecipients.length).toFixed(2)
        ),
      };
    });

    setEnabled({
      ...enabled,
      splitRevenueRecipients: result,
    });
  };

  // function to handle recipient field change
  const handleRecipientChange = (index, field, value) => {
    // check index 0 price should min 10
    if (field === "split" && index === 0) {
      if (value < 10 || value > 100 || isNaN(value)) {
        setSplitError({
          isError: true,
          message: "Platform fee should be between 10% to 100%",
        });
      } else {
        setSplitError({
          isError: false,
          message: "",
        });
      }
    }

    // any index price should be greater min 1 and max 100
    if (field === "split" && index !== 0) {
      if (value < 1 || value > 100 || isNaN(value)) {
        setSplitError({
          isError: true,
          message: "Split should be between 1% to 100%",
        });
      } else {
        setSplitError({
          isError: false,
          message: "",
        });
      }
    }

    // check if the address is not same
    if (field === "recipient") {
      // check if the address is valid
      if (value.startsWith("0x") && !isEthAddress(value)) {
        setSplitError({
          isError: true,
          message: "Invalid recipient address",
        });
        // check if the handle is valid
      } else if (value.startsWith("@") && !isLensHandle(value)) {
        setSplitError({
          isError: true,
          message: "Invalid recipient handle",
        });
        // check if  its a random text
      } else if (!value.startsWith("0x") && !value.startsWith("@")) {
        setSplitError({
          isError: true,
          message: "Invalid recipient value",
        });
      } else {
        setSplitError({
          isError: false,
          message: "",
        });
      }
    }

    const updatedRecipients = [...enabled.splitRevenueRecipients];
    updatedRecipients[index][field] = value;
    setEnabled({
      ...enabled,
      splitRevenueRecipients: updatedRecipients,
    });
  };

  // share post on lens
  const sharePost = async (platform) => {
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

    if (enabled.chargeForCollect) {
      if (priceError.isError) return;

      if (referralError.isError) return;

      if (splitError.isError) return;

      if (isAddressDuplicate()) {
        setSplitError({
          isError: true,
          message: "Duplicate address or handle found",
        });
        return;
      } else if (!isPercentage100()) {
        setSplitError({
          isError: true,
          message: "Total split should be 100%",
        });
        return;
      } else {
        setSplitError({
          isError: false,
          message: "",
        });
      }
    }

    if (enabled.limitedEdition) {
      if (editionError.isError) return;
    }

    setSharing(true);

    const canvasData = {
      id: contextCanvasIdRef.current,
      name: "post",
      content: postDescription,
    };

    const id = toast.loading(`Sharing on ${platform}...`);
    shareOnLens({
      canvasData: canvasData,
      canvasParams: monetizationSettings(),
      platform: platform,
      timeStamp: formatDateTimeUnix(stFormattedDate, stFormattedTime),
    })
      .then((res) => {
        if (res?.txHash) {
          const jsConfetti = new JSConfetti();
          jsConfetti.addConfetti({
            emojis: ["🌈", "⚡️", "💥", "✨", "💫", "🌸"],
            confettiNumber: 100,
          });

          toast.update(id, {
            render: `Successfully shared on ${platform}`,
            type: "success",
            isLoading: false,
            autoClose: 3000,
            closeButton: true,
          });

          // clear all the variables
          resetState();
        } else if (res?.error || res?.reason === "REJECTED") {
          toast.update(id, {
            render: res?.error || "Request rejected",
            type: "error",
            isLoading: false,
            autoClose: 3000,
            closeButton: true,
          });
          setSharing(false);
        }
      })
      .catch((err) => {
        toast.update(id, {
          render: errorMessage(err),
          type: "error",
          isLoading: false,
          autoClose: 3000,
          closeButton: true,
        });
        setSharing(false);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "chargeForCollectPrice") {
      if (value < 0.1) {
        setPriceError({
          isError: true,
          message: "Price should be minimum 0.1",
        });
      } else {
        setPriceError({
          isError: false,
          message: "",
        });
      }
    } else if (name === "limitedEditionNumber") {
      if (value < 1) {
        setEditionError({
          isError: true,
          message: "Collect limit should be minimum 1",
        });
      } else {
        setEditionError({
          isError: false,
          message: "",
        });
      }
    } else if (name === "mirrorReferralRewardFee") {
      if (value < 1) {
        setReferralError({
          isError: true,
          message: "Referral fee should be between 1% to 100%",
        });
      } else {
        setReferralError({
          isError: false,
          message: "",
        });
      }
    }

    if (name === "mirrorReferralRewardFee") {
      setEnabled((prevEnabled) => ({
        ...prevEnabled,
        [name]: Number(parseFloat(value).toFixed(2)),
      }));
    } else {
      setEnabled((prevEnabled) => ({ ...prevEnabled, [name]: value }));
    }
  };

  const restrictRecipientInput = (e, index, recipient) => {
    const isRecipient = parentRecipientListRef.current.includes(
      recipient.recipient
    );
    const isUserAddress = recipient.recipient === address;
    if (index === 0 || isRecipient) {
      if (isUserAddress) {
        handleRecipientChange(index, "recipient", e.target.value);
      }
    } else {
      handleRecipientChange(index, "recipient", e.target.value);
    }
  };

  const restrictRemoveRecipientInputBox = (index, recipient) => {
    const isRecipient = parentRecipientListRef.current.includes(
      recipient.recipient
    );
    if (index === 0 || isRecipient) {
      return true;
    }
  };

  // add recipient to the split list
  useEffect(() => {
    if (isAuthenticated) {
      const updatedRecipients = parentRecipientListRef.current
        .slice(0, 4)
        .map((item) => ({
          recipient: item,
          split: 1.0,
        }));

      setEnabled((prevEnabled) => ({
        ...prevEnabled,
        splitRevenueRecipients: [
          {
            recipient: APP_ETH_ADDRESS,
            split: enabled.splitRevenueRecipients[0]?.split || 10.0,
          },
          ...updatedRecipients,
        ],
      }));

      const recipients = updatedRecipients.map((item) => {
        return item?.recipient;
      });

      const addresses = [APP_ETH_ADDRESS, ...recipients];

      // getting lens handles
      (async () => {
        const lensHandles = await getSocialDetails(addresses, "lens");
        setRecipientsLensHandle(lensHandles);
      })();
    }
  }, [isAuthenticated]);

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
      <div className="flex flex-col bg-white shadow-2xl rounded-lg rounded-r-none ">
        <div className="relative px-4 mt-1 pt-2 pb-4 sm:px-6 ">
          <div className="">
            <div className="flex flex-col justify-between">
              <Switch.Group>
                <div className="mb-4">
                  <h2 className="text-lg mb-2">Charge for collecting</h2>
                  <div className="flex justify-between">
                    <Switch.Label className="w-4/5 opacity-50">
                      Get paid when someone collects your post
                    </Switch.Label>
                    <Switch
                      checked={enabled.chargeForCollect}
                      onChange={() => {
                        setEnabled({
                          ...enabled,
                          chargeForCollect: !enabled.chargeForCollect,
                        });
                      }}
                      className={`${
                        enabled.chargeForCollect
                          ? "bg-[#e1f16b]"
                          : "bg-gray-200"
                      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#e1f16b] focus:ring-offset-2`}
                    >
                      <span
                        className={`${
                          enabled.chargeForCollect
                            ? "translate-x-6"
                            : "translate-x-1"
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </Switch>
                  </div>
                  <div className={` ${!enabled.chargeForCollect && "hidden"}`}>
                    <div className="flex gap-5">
                      <div className="flex flex-col py-2">
                        {/* <label htmlFor="price">Price</label> */}
                        <NumberInputBox
                          min={"1"}
                          step={"0.01"}
                          label="Price"
                          // placeholder="1"
                          name="chargeForCollectPrice"
                          onChange={(e) => handleChange(e)}
                          value={enabled.chargeForCollectPrice}
                        />
                      </div>
                      <div className="flex flex-col py-2">
                        {/* <label htmlFor="price">Currency</label> */}
                        <Select
                          name="chargeForCollectCurrency"
                          id="chargeForCollectCurrency"
                          label="Currency"
                          value={enabled.chargeForCollectCurrency}
                        >
                          {tokenList().map((token, index) => {
                            return (
                              <Option
                                key={index}
                                onClick={() => {
                                  setEnabled({
                                    ...enabled,
                                    chargeForCollectCurrency: token.symbol,
                                  });
                                }}
                              >
                                {token.symbol}
                              </Option>
                            );
                          })}
                        </Select>
                      </div>
                    </div>
                    {priceError.isError && (
                      <InputErrorMsg message={priceError.message} />
                    )}
                  </div>
                </div>

                <div
                  className={`mb-4 ${!enabled.chargeForCollect && "hidden"}`}
                >
                  <h2 className="text-lg mb-2">Mirror referral award</h2>
                  <div className="flex justify-between">
                    <Switch.Label className="w-4/5 opacity-60">
                      Share your fee with people who amplify your content
                    </Switch.Label>
                    <Switch
                      checked={enabled.mirrorReferralReward}
                      onChange={() =>
                        setEnabled({
                          ...enabled,
                          mirrorReferralReward: !enabled.mirrorReferralReward,
                        })
                      }
                      className={`${
                        enabled.mirrorReferralReward
                          ? "bg-[#e1f16b]"
                          : "bg-gray-200"
                      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#e1f16b] focus:ring-offset-2`}
                    >
                      <span
                        className={`${
                          enabled.mirrorReferralReward
                            ? "translate-x-6"
                            : "translate-x-1"
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </Switch>
                  </div>
                  <div
                    className={`flex ${
                      !enabled.mirrorReferralReward && "hidden"
                    }`}
                  >
                    <div className="flex flex-col w-full py-2">
                      {/* <label htmlFor="price">Referral fee(%)</label> */}
                      <NumberInputBox
                        min={0.0}
                        max={100.0}
                        step={0.01}
                        name="mirrorReferralRewardFee"
                        label="Referral fee (%)"
                        // placeholder="1%"
                        onChange={(e) => handleChange(e)}
                        value={enabled.mirrorReferralRewardFee}
                      />
                      {referralError.isError && (
                        <InputErrorMsg message={referralError.message} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Split policy Card  start */}

                {enabled.chargeForCollect && <SplitPolicyCard />}

                {/* Split policy Card  end */}

                <div
                  className={`mb-4 ${!enabled.chargeForCollect && "hidden"}`}
                >
                  <h2 className="text-lg mb-2">Split Pecipients</h2>
                  <div className="flex justify-between">
                    <Switch.Label className="w-4/5 opacity-60">
                      Split revenue between multiple recipients
                    </Switch.Label>
                  </div>
                  <div className="relative">
                    {enabled.splitRevenueRecipients.map((recipient, index) => {
                      return (
                        <>
                          <div
                            key={index}
                            className="flex justify-between gap-2 items-center w-full py-2"
                          >
                            <InputBox
                              label={"ERC20 Address / Lens handle"}
                              // placeholder="erc20 address or @xyz.lens"
                              value={
                                recipientsLensHandle[index] ||
                                recipient.recipient
                              }
                              onChange={(e) =>
                                restrictRecipientInput(e, index, recipient)
                              }
                            />
                            <div className="flex justify-between items-center w-1/3">
                              <NumberInputBox
                                min={0}
                                max={100}
                                step={1}
                                label={"%"}
                                // placeholder="0.0%"
                                value={recipient.split}
                                onChange={(e) => {
                                  handleRecipientChange(
                                    index,
                                    "split",
                                    Number(
                                      parseFloat(e.target.value).toFixed(2)
                                    )
                                  );
                                }}
                              />
                              {!restrictRemoveRecipientInputBox(
                                index,
                                recipient
                              ) && (
                                <TiDelete
                                  className="h-6 w-6 cursor-pointer"
                                  color="red"
                                  onClick={() => removeRecipientInputBox(index)}
                                />
                              )}
                            </div>
                          </div>
                          {index == 0 && (
                            <div className="flex flex-row align-middle  text-center justify-start mt-1">
                              <span className="italic mt-2 opacity-80">
                                Small fee to support our team!
                              </span>

                              {/* This is the custom popover that appears on the sidebar*/}
                              <CustomPopover
                                icon=""
                                animationData={animationData}
                              />
                            </div>
                          )}
                        </>
                      );
                    })}
                    {splitError.isError && (
                      <>
                        <InputErrorMsg message={splitError.message} />
                        <Typography variant="h6" color="blue-gray">
                          {totalPercentage} %
                        </Typography>
                      </>
                    )}

                    <div className="flex justify-between">
                      {enabled.splitRevenueRecipients.length < 5 && (
                        <Button
                          color="yellow"
                          size="sm"
                          variant="filled"
                          className="flex items-center gap-3 mt-2 ml-0 outline-none"
                          onClick={addRecipientInputBox}
                        >
                          <BsPlus />
                          Add Recipient
                        </Button>
                      )}
                      <Button
                        color="yellow"
                        size="sm"
                        variant="filled"
                        className="flex items-center gap-3 mt-2 ml-0 outline-none"
                        onClick={splitEvenPercentage}
                      >
                        Split Even
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h2 className="text-lg mb-2">Limited Edition</h2>
                  <div className="flex justify-between">
                    <Switch.Label className="w-4/5 opacity-60">
                      Make the collects exclusive
                    </Switch.Label>
                    <Switch
                      checked={enabled.limitedEdition}
                      onChange={() =>
                        setEnabled({
                          ...enabled,
                          limitedEdition: !enabled.limitedEdition,
                        })
                      }
                      className={`${
                        enabled.limitedEdition ? "bg-[#e1f16b]" : "bg-gray-200"
                      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#e1f16b] focus:ring-offset-2`}
                    >
                      <span
                        className={`${
                          enabled.limitedEdition
                            ? "translate-x-6"
                            : "translate-x-1"
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </Switch>
                  </div>
                  <div
                    className={`flex ${!enabled.limitedEdition && "hidden"}`}
                  >
                    <div className="flex flex-col w-full py-2 opacity-60">
                      {/* <label htmlFor="price">Collect limit</label> */}
                      <NumberInputBox
                        min={"1"}
                        step={"1"}
                        label={"Collect limit"}
                        // placeholder="1"
                        name="limitedEditionNumber"
                        onChange={(e) => handleChange(e)}
                        value={enabled.limitedEditionNumber}
                      />
                      {editionError.isError && (
                        <InputErrorMsg message={editionError.message} />
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h2 className="text-lg mb-2">Time Limit</h2>
                  <div className="flex justify-between">
                    <Switch.Label className="w-4/5 opacity-60">
                      Collect duration
                    </Switch.Label>
                    <Switch
                      checked={enabled.timeLimit}
                      onChange={() =>
                        setEnabled({
                          ...enabled,
                          timeLimit: !enabled.timeLimit,
                        })
                      }
                      className={`${
                        enabled.timeLimit ? "bg-[#e1f16b]" : "bg-gray-200"
                      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#e1f16b] focus:ring-offset-2`}
                    >
                      <span
                        className={`${
                          enabled.timeLimit ? "translate-x-6" : "translate-x-1"
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </Switch>
                  </div>
                  {/* Calender For Schedule - 18Jun2023 */}
                  <div className={`${!enabled.timeLimit && "hidden"} my-3`}>
                    <div
                      className={`
                      flex flex-col w-full`}
                    >
                      {/* <div className="m-1">Choose schedule time and date</div> */}
                      <DateTimePicker className="m-4" onChange={onCalChange} />
                    </div>

                    <div className={`flex flex-col my-2`}>
                      <div className="mt-1 mb-3">Schedule</div>
                      <div className="flex flex-row border-l-8 border-l-[#e1f16b] p-4 rounded-md">
                        <div className="flex flex-col">
                          <div className="text-4xl text-[#E699D9]">
                            {enabled.endTimestamp.date.slice(0, 2)}
                          </div>
                          <div className="text-lg text-[#2D346C]">
                            {enabled.endTimestamp.date.slice(2)}
                          </div>
                        </div>

                        <div className="flex flex-col ml-4">
                          <div className="ml-2 mt-10">
                            {enabled.endTimestamp.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h2 className="text-lg mb-2">Who can collect</h2>
                  <div className="flex justify-between">
                    <Switch.Label className="w-4/5 opacity-60">
                      Only followers can collect
                    </Switch.Label>
                    <Switch
                      checked={enabled.whoCanCollect}
                      onChange={() =>
                        setEnabled({
                          ...enabled,
                          whoCanCollect: !enabled.whoCanCollect,
                        })
                      }
                      className={`${
                        enabled.whoCanCollect ? "bg-[#e1f16b]" : "bg-gray-200"
                      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#e1f16b] focus:ring-offset-2`}
                    >
                      <span
                        className={`${
                          enabled.whoCanCollect
                            ? "translate-x-6"
                            : "translate-x-1"
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </Switch>
                  </div>
                </div>
              </Switch.Group>
            </div>
          </div>
        </div>

        {!getEVMAuth ? (
          <EVMWallets title="Login with EVM" className="mx-2" />
        ) : isUnsupportedChain() ? (
          <div className="mx-2 outline-none">
            <Button
              className="w-full outline-none flex justify-center items-center gap-2"
              disabled={isLoadingSwitchNetwork}
              onClick={() => switchChain({ chainId: chains[0]?.id })}
              color="red"
            >
              {isLoadingSwitchNetwork ? "Switching" : "Switch"} to{" "}
              {chains[0]?.name} Network {isLoadingSwitchNetwork && <Spinner />}
            </Button>
          </div>
        ) : !getLensAuth?.profileHandle ? (
          <LensAuth
            title="Login with Lens"
            className="mx-2 w-[95%] outline-none"
          />
        ) : !getDispatcherStatus ? (
          <LensDispatcher
            title="Enable signless transactions"
            className="mx-2 w-[95%] outline-none"
          />
        ) : (
          <div className="mx-2 outline-none">
            <Button
              className="w-full outline-none"
              disabled={sharing}
              onClick={() => sharePost("lens")}
              // color="yellow"
            >
              Share Now
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default LensShare;

// TODO - add netwotk check before share
