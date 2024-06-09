import { Button } from "@material-tailwind/react";
import { usePrivy } from "@privy-io/react-auth";
import React from "react";
import { EVMLogo } from "../../../../../../assets";

const EVMWallets = ({ title, className }) => {
  const { login } = usePrivy();

  return (
    <Button
      size="lg"
      color="black"
      className={`flex items-center justify-center gap-3 outline-none my-2 ${className}`}
      onClick={login}
    >
      <img
        src={EVMLogo}
        alt="evm"
        className="h-6 w-6 object-contain bg-cover"
      />
      {title}
    </Button>
  );
};

export default EVMWallets;
