import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../../../../../../providers/context";
import {
  Button,
  Card,
  List,
  ListItem,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import { useFeeData, useAccount, useSwitchChain } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import {
  useSendTransaction,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther } from "viem";
import { toast } from "react-toastify";
import { ENVIRONMENT } from "../../../../../../../services";

const network = ENVIRONMENT === "production" ? base : baseSepolia;

const Topup = ({ topUpAccount, refetch, balance, sponsored }) => {
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
  } = useFeeData({
    chainId: network?.id,
    formatUnits: "ether",
  });

  const allowedMints = Number(farcasterStates.frameData?.allowedMints);
  const isSufficientBalance = farcasterStates.frameData?.isSufficientBalance;
  const isTopup = farcasterStates.frameData?.isTopup;
  const TxFeeForDeployment = 0.00009;
  const txFeeForMint = 0.00002;

  //   bcoz first 10 is free so we are subtracting 10 from total mints
  const numberOfExtraMints = allowedMints - sponsored;

  const payForMints = Number(
    txFeeForMint * numberOfExtraMints + TxFeeForDeployment
  )
    .toFixed(18)
    .toString();

  const { config } = useWriteContract({
    to: topUpAccount, // users wallet
    value: extraPayForMints
      ? parseEther(extraPayForMints)
      : parseEther(payForMints),
    chainId: network?.id,
  });

  const { data, isLoading, isSuccess, isError, error, sendTransaction } =
    useSendTransaction(config);

  const {
    data: txData,
    isError: isTxError,
    error: txError,
    isLoading: isTxLoading,
    isSuccess: isTxSuccess,
  } = useWaitForTransactionReceipt({
    hash: data?.hash,
  });

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

  if (chain?.id !== network?.id) {
    return (
      <Card className="my-2">
        <List>
          <ListItem
            className="flex justify-between items-center gap-2"
            onClick={() => switchChain(network?.id)}
          >
            <Typography variant="h6" color="blue-gray">
              Please switch to {network?.name} network
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
              <Typography variant="h6" color="blue-gray">
                {extraPayForMints ? extraPayForMints : payForMints}{" "}
                {network?.name} {network?.nativeCurrency?.symbol}
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
