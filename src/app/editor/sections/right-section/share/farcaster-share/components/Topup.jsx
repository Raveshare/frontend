import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../../../../../../providers/context";
import {
  Button,
  Card,
  List,
  ListItem,
  Option,
  Select,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import { useFeeData, useNetwork, useSwitchNetwork } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import {
  useSendTransaction,
  usePrepareSendTransaction,
  useWaitForTransaction,
} from "wagmi";
import { parseEther } from "viem";
import { toast } from "react-toastify";
import { ENVIRONMENT } from "../../../../../../../services";
import { NumberInputBox } from "../../../../../common";

const network = ENVIRONMENT === "production" ? base : baseSepolia;
const degenNetwork = {
  id: 666666666,
  name: "Degen",
  network: "degen",
  nativeCurrency: {
    name: "Degen",
    symbol: "DEGEN",
    decimals: 18,
  },
  rpcUrls: {
    default: "https://rpc.degen.tips",
  },
  blockExplorers: {
    default: {
      name: "Degen",
      url: "https://explorer.degen.tips",
    },
  },
};

const Topup = ({ topUpAccount, refetch, balance, sponsored }) => {
  const { farcasterStates, setFarcasterStates } = useContext(Context);
  const [extraPayForMints, setExtraPayForMints] = useState(null);
  const { chain } = useNetwork();
  const {
    data: switchData,
    isLoading: switchLoading,
    isError: switchError,
    error: switchErrorData,
    switchNetwork,
  } = useSwitchNetwork();

  const {
    data: feeData,
    isError: isFeeError,
    error: feeError,
    isLoading: isFeeLoading,
  } = useFeeData({
    chainId: network?.id,
    formatUnits: "ether",
  });

  const allowedMints = Number(farcasterStates.frameData?.allowedMints);
  const isSufficientBalance = farcasterStates.frameData?.isSufficientBalance;
  const isTopup = farcasterStates.frameData?.isTopup;
  const TxFeeForDeployment = 0.00009;
  const txFeeForMint = 0.00002;

  console.log({
    allowedMints,
    isSufficientBalance,
    isTopup,
    TxFeeForDeployment,
    txFeeForMint,
  });

  console.log(
    "Custom currency",
    farcasterStates?.frameData?.customCurrName,
    farcasterStates?.frameData?.customCurrAmount
  );

  console.log("Chain Id", chain?.id);

  //   bcoz first 10 is free so we are subtracting 10 from total mints
  const numberOfExtraMints = allowedMints - sponsored;

  const payForMints = Number(
    txFeeForMint * numberOfExtraMints + TxFeeForDeployment
  )
    .toFixed(18)
    .toString();

  const { config } = usePrepareSendTransaction({
    to: topUpAccount, // users wallet
    value: extraPayForMints
      ? parseEther(extraPayForMints)
      : parseEther(payForMints),
    // chainId: network?.id,
    chainId: farcasterStates?.frameData?.isCustomCurrMint ? degenNetwork?.id : network?.id,
  });

  const { data, isLoading, isSuccess, isError, error, sendTransaction } =
    useSendTransaction(config);

  const {
    data: txData,
    isError: isTxError,
    error: txError,
    isLoading: isTxLoading,
    isSuccess: isTxSuccess,
  } = useWaitForTransaction({
    hash: data?.hash,
  });

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
      return newState;
    });
  };
  // change the frameData isTopup to true if transaction is success
  useEffect(() => {
    if (isTxSuccess) {
      setFarcasterStates({
        ...farcasterStates,
        frameData: {
          ...farcasterStates.frameData,
          isTopup: true,
        },
      });

      setTimeout(() => {
        refetch();
      }, 2000);
    }
  }, [isTxSuccess]);

  // check if the user has enough balance to pay for mints
  useEffect(() => {
    setFarcasterStates((prevState) => {
      const newState = { ...prevState };

      if (balance >= payForMints) {
        // balance is sufficient
        newState.frameData.isSufficientBalance = true;
      } else {
        // balance is not sufficient

        if (payForMints - balance > 0) {
          setExtraPayForMints((payForMints - balance).toFixed(18).toString());
          newState.frameData.isSufficientBalance = false;
        } else {
          newState.frameData.isSufficientBalance = true;
        }
      }

      return newState;
    });
  }, [farcasterStates.frameData.allowedMints, balance, isTopup]);

  // get the error message
  useEffect(() => {
    if (isError) {
      toast.error(error?.message.split("\n")[0]);
    } else if (isTxError) {
      toast.error(txError?.message.split("\n")[0]);
    }
  }, [isError, isTxError]);

  if (
    chain?.id !== network?.id &&
    !farcasterStates.frameData.isCustomCurrMint
  ) {
    return (
      <Card className="my-2">
        <List>
          <ListItem
            className="flex justify-between items-center gap-2"
            onClick={() => switchNetwork && switchNetwork(network?.id)}
          >
            <Typography variant="h6" color="blue-gray">
              Click here to switch to {network?.name} network
            </Typography>
          </ListItem>
        </List>
      </Card>
    );
  }

  if (
    chain?.id !== degenNetwork?.id &&
    farcasterStates.frameData.isCustomCurrMint
  ) {
    return (
      <Card className="my-2">
        <List>
          <ListItem
            className="flex justify-between items-center gap-2"
            onClick={() => switchNetwork && switchNetwork(666666666)}
          >
            <Typography variant="h6" color="blue-gray">
              Click here to switch to {degenNetwork?.name} network
            </Typography>
          </ListItem>
        </List>
      </Card>
    );
  }

  if (isFeeLoading) {
    return (
      <Card className="my-2">
        <List>
          <ListItem className="flex justify-between items-center gap-2">
            <Spinner color="green" />
          </ListItem>
        </List>
      </Card>
    );
  }

  if (isFeeError) {
    return (
      <Card className="my-2">
        <List>
          <ListItem className="flex justify-between items-center gap-2">
            <Typography variant="h6" color="blue-gray">
              Error fetching gas price
            </Typography>
          </ListItem>
        </List>
      </Card>
    );
  }

  return (
    <Card className="my-2">
      <List>
        <ListItem className="flex-col items-end gap-2">
          {isSufficientBalance ? (
            <Typography variant="h6" color="green">
              Sufficient balance to pay for mints
            </Typography>
          ) : (
            <>
              <Typography variant="h6" color="red">
                Insufficient balance please topup
              </Typography>

              <div className="flex">
                <div className="flex flex-col py-2 mx-2">
                  <Select
                    animate={{
                      mount: { y: 0 },
                      unmount: { y: 25 },
                    }}
                    label="Custom Currency"
                    name="Custom Currency"
                    id="idCustomCurrency"
                    value={farcasterStates?.frameData?.customCurrName}
                    onChange={(e) => handleChange(e, "customCurrName")}
                  >
                    {["DEGEN"].map((currency) => (
                      <Option
                        key={currency}
                        onClick={() => {
                          setFarcasterStates({
                            ...farcasterStates,
                            frameData: {
                              ...farcasterStates.frameData,
                              customCurrName: currency,
                            },
                          });
                        }}
                      >
                        {currency.toUpperCase()}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>


              <Typography variant="h6" color="blue-gray">
                {extraPayForMints ? extraPayForMints : payForMints}{" "}
                {farcasterStates.frameData.isCustomCurrMint ? (
                  <>
                    {degenNetwork?.name} {degenNetwork?.nativeCurrency?.symbol}
                  </>
                ) : (
                  <>
                    {network?.name} {network?.nativeCurrency?.symbol}
                  </>
                )}
              </Typography>

              <div className="w-full flex justify-between items-center">
                {isTxLoading || isLoading ? (
                  <div className="flex justify-start gap-2">
                    <Typography variant="h6" color="blue-gray">
                      {isLoading
                        ? "Confirm transaction"
                        : isTxLoading
                        ? "Confirming"
                        : ""}
                    </Typography>
                    <Spinner color="green" />
                  </div>
                ) : (
                  <div></div>
                )}

                {isTxSuccess ? (
                  <Button color="green" size="sm" className="flex justify-end">
                    Paid
                  </Button>
                ) : (
                  <Button
                    onClick={() => sendTransaction?.()}
                    color="green"
                    size="sm"
                    className="flex justify-end"
                  >
                    Pay
                  </Button>
                )}
              </div>
            </>
          )}
        </ListItem>
      </List>
    </Card>
  );
};

export default Topup;
