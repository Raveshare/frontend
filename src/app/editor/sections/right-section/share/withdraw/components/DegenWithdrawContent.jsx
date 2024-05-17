import React, { useState } from 'react';
import { InputBox, InputErrorMsg, NumberInputBox } from '../../../../../common';
import { Button } from "@material-tailwind/react";
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useSwitchNetwork,
  useWaitForTransaction,
} from "wagmi";
// import abi from '../../../../../../../data/abi/0XSPLIT_DEGEN';
const DegenWithdrawContent = () => {
  const [amount, setAmount] = useState('');
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState(false);
  const { address } = useAccount();
  const { chain } = useNetwork();
  const DEGEN_TOKEN_ADDRESS = '0x6301B6Bc76Dd56A26515EdeCeE203d1Ab84202DC';

  const { config, sError: isPrepareError } = usePrepareContractWrite({
    address: DEGEN_TOKEN_ADDRESS, //contract address of 0XSPLIT_DEGEN
    abi: abi,
    functionName: 'withdraw',
    args: [address,amount,[]],
  })

  // const {
  //   write,
  //   data,
  //   error: writeError,
  //   isLoading,
  //   isError: isWriteError,
  // } = useContractWrite(config);  
  
  const handleChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    setError(value <= 0);
  };

  // const {
  //   data: receipt,
  //   isLoading: isPending,
  //   isSuccess,
  // } = useWaitForTransaction({ hash: data?.hash });


  const handleFocus = () => {
    setFocused(true);
  };

  const handleWithdraw = () => {
    if (amount <= 0) {
      setError(true);
    } else {
      console.log('Withdrawing:', amount);
    }
  };

  return (
    <>
      <div className="mb-4 m-4">
        <h2 className="text-lg mb-2">Available earning to withdraw: 12 Degens</h2>
        <NumberInputBox
          label="Degen Amount"
          name="amount"
          value={amount}
          onChange={handleChange}
          onFocus={handleFocus}
        />
        {focused && error && (
          <InputErrorMsg message={"Please enter a valid amount"} />
        )}
      </div>
      <div className="mx-2 my-2 outline-none">
        <Button className="w-full outline-none" onClick={handleWithdraw}>
          Withdraw
        </Button>
      </div>
    </>
  );
};

export default DegenWithdrawContent;