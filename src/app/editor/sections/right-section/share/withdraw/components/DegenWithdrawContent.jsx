import React, { useState, useEffect } from 'react'; 
import { NumberInputBox, InputErrorMsg } from '../../../../../common';
import { Button } from "@material-tailwind/react";
import { useAccount, useNetwork, useContractRead } from "wagmi";
import { degenAbi } from '../../../../../../../data/abi/0XSPLIT_DEGEN';
import { OXSPLIT_DEGEN } from '../../../../../../../data';
const DegenWithdrawContent = () => {
  const [amount, setAmount] = useState('');
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState(false);
  const [balance, setBalance] = useState(null); 

  const { address } = useAccount();
  const { chain } = useNetwork();

  const { data: balanceData, isError, isLoading, error: contractError } = useContractRead({
    address: OXSPLIT_DEGEN,
    abi: degenAbi,
    functionName: 'getETHBalance',
    args: [address],
  });

  useEffect(() => {
    console.log('Checking error here:', { isLoading, isError, balanceData, contractError });
    if (!isLoading && !isError && balanceData) {
      setBalance(balanceData.toString());
      console.log('Balance:', balanceData.toString());
    } else if (isError) {
      console.error('Error fetching balance:', contractError);
    }
  }, [balanceData, isError, isLoading, contractError]);

  const handleChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    setError(value <= 0);
  };

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
        <h2 className="text-lg mb-2">
          Available earning to withdraw: {balance !== null ? balance : 'Loading...'}
        </h2>
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
