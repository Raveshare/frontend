import React, { useState, useEffect } from 'react'; 
import { InputBox, InputErrorMsg, NumberInputBox } from '../../../../../common';
import { Button } from "@material-tailwind/react";
import {
  useAccount,
  useNetwork, 
  useReadContract,
} from "wagmi";
import {degenAbi} from '../../../../../../../data/abi/0XSPLIT_DEGEN';
const DegenWithdrawContent = () => {
  const [amount, setAmount] = useState('');
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState(false);
  const [balance, setBalance] = useState(null); 

  const { address } = useAccount();
  const { chain } = useNetwork();
  const OXSPLIT_DEGEN = "0x6301B6Bc76Dd56A26515EdeCeE203d1Ab84202DC";

  const { data: balanceData, isError, isLoading } = useReadContract({
    address: OXSPLIT_DEGEN, 
    abi: degenAbi,
    functionName: 'getERC20Balance',
    args: [address],
  });

  useEffect(() => {
    if (!isLoading && !isError && balanceData) {
      setBalance(balanceData.toString());
    }
  }, [balanceData, isError, isLoading]);

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
          Available earning to withdraw: {balance ? balance : '  '} Degens
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