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

import { useEstimateFeesPerGas, useAccount, useSwitchChain } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { http, parseEther } from "viem";
import { toast } from "react-toastify";
import { ENVIRONMENT } from "../../../../../../../services";
import { createConfig } from "wagmi";
import { config } from "../../../../../../../providers/EVM/EVMWalletProvider";
import { useFeeData, useNetwork, useSwitchNetwork } from "wagmi";
import {
  useSendTransaction,
  usePrepareSendTransaction,
  useWaitForTransaction,
} from "wagmi";
import { base } from "viem/chains";


const Topup = ({ topUpAccount, refetchWallet, balance, sponsored }) => {
  const { farcasterStates, setFarcasterStates } = useContext(Context);
  const [extraPayForMints, setExtraPayForMints] = useState(null);
  const { chain } = useAccount();
  const {
    data: switchData,
    isLoading: switchLoading,
    isError: switchError,
    error: switchErrorData,
    switchChain,
  } = useSwitchChain();

  const {
    data: feeData,
    isError: isFeeError,
    error: feeError,
    isLoading: isFeeLoading,
  } = useEstimateFeesPerGas({
    chainId: network?.id,
    formatUnits: "ether",
  });

  const allowedMints = Number(farcasterStates.frameData?.allowedMints);
  const isSufficientBalance = farcasterStates.frameData?.isSufficientBalance;
  const isTopup = farcasterStates.frameData?.isTopup;
  const selectedNetwork = farcasterStates?.frameData?.selectedNetwork;
  const isCustomCurrMint = farcasterStates?.frameData?.isCustomCurrMint;
  const TxFeeForDeployment = 0.00009;
  const txFeeForMint = isCustomCurrMint ? 0.00001 : 0.00002;

  //   bcoz first 10 is free so we are subtracting 10 from total mints
  const numberOfExtraMints = allowedMints - sponsored;

  const payForMintsForCustomCurr = Number(TxFeeForDeployment)
    .toFixed(18)
    .toString();
  const payForMintsForSponsored = Number(
    txFeeForMint * numberOfExtraMints + TxFeeForDeployment
  )
    .toFixed(18)
    .toString();

  // const config = createConfig({
  //   chains: [network],
  //   transports: {
  //     [network.id]: http(),
  //   },
  // });

  config.transports = {
    [network.id]: http(),
  };
  const payForMints = isCustomCurrMint
    ? payForMintsForCustomCurr
    : payForMintsForSponsored;

  const { config, error: prapareError } = usePrepareSendTransaction({
    to: topUpAccount, // users wallet
    value: extraPayForMints
      ? parseEther(extraPayForMints)
      : parseEther(payForMints),
    chainId: chain?.id,
  });

  const { data, isPending, isSuccess, isError, error, sendTransaction } =
    useSendTransaction({ config });

  const {
    data: txData,
    isError: isTxError,
    error: txError,
    isLoading: isTxLoading,
    isSuccess: isTxSuccess,
  } = useWaitForTransactionReceipt({
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
        refetchWallet();
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
      console.log(error);
      toast.error(error?.message.split("\n")[0]);
    } else if (isTxError) {
      console.log(txError);
      toast.error(txError?.message.split("\n")[0]);
    }
  }, [isError, isTxError]);

  if (farcasterStates.frameData.isCreatorSponsored && chain?.id !== base?.id) {
    return (
      <Card className="my-2">
        <List>
          <ListItem
            className="flex justify-between items-center gap-2"
            onClick={() => switchNetwork && switchNetwork(base?.id)}
          >
            <Typography variant="h6" color="blue-gray">
              Click here to switch to Base chain
            </Typography>
          </ListItem>
        </List>
      </Card>
    );
  }

  if (
    farcasterStates.frameData.isCustomCurrMint &&
    chain?.id !== selectedNetwork?.id
  ) {
    return (
      <Card className="my-2">
        <List>
          <ListItem
            className="flex justify-between items-center gap-2"
            onClick={() =>
              switchChain({
                chainId: network?.id,
              })
            }
          >
            <Typography variant="h6" color="blue-gray">
              Click here to switch to {selectedNetwork?.name}
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

              {/* <div className="flex">
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
              </div> */}

              <Typography variant="h6" color="blue-gray">
                {extraPayForMints ? extraPayForMints : payForMints}{" "}
                <>
                  {chain?.name} {chain?.nativeCurrency?.symbol}
                </>
              </Typography>

              <div className="w-full flex justify-between items-center">
                {isTxLoading || isPending ? (
                  <div className="flex justify-start gap-2">
                    <Typography variant="h6" color="blue-gray">
                      {isPending
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
                    onClick={() =>
                      sendTransaction({
                        to: topUpAccount,
                        value: extraPayForMints
                          ? parseEther(extraPayForMints)
                          : parseEther(payForMints),
                      })
                    }
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
