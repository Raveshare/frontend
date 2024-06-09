import React from "react";
import NormieDP from "../../assets/svgs/Normie/NormieDP.svg";
import Coin from "../../assets/pngs/coin.png";
import { useAccount } from "wagmi";
import BiCopy from "@meronex/icons/bi/BiCopy";
import { toast } from "react-toastify";
import { addressCrop } from "../../../../../../../utils";
import { useUser } from "../../../../../../../hooks/user";
import iconLens from "../../assets/svgs/LogoLens.svg";
import iconFarcaster from "../../assets/svgs/LogoFarcaster.svg";
import LogoutBtn from "../LogoutBtn";
import { useSolanaWallet } from "../../../../../../../hooks/solana";

const UserCard = ({ username, profilePic, lensHandle, farcasterHandle }) => {
  const { address } = useAccount();
  const { solanaAddress } = useSolanaWallet();
  const { points } = useUser();

  const handleCopy = (address) => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied");
  };

  const fnOpenSite = (platformUsername) => {
    if (platformUsername === "") return;
    if (platformUsername === lensHandle) {
      window.open(`https://hey.xyz/u/${platformUsername}`);
    }
    if (platformUsername === farcasterHandle) {
      window.open(`https://hey.xyz/u/${platformUsername}`);
    }
  };

  return (
    <>
      {" "}
      <div className="flex justify-center align-middle mt-4">
        <img className="h-16" src={profilePic ? profilePic : NormieDP} alt="" />
        <div className="flex flex-col">
          <div className="ml-4 mt-2">@{username ? username : "username"}</div>
          <div className="flex ml-2 mt-1">
            <div
              className=" cursor-pointer"
              onClick={(e) => fnOpenSite(e.target.name)}
            >
              {" "}
              <img
                name={lensHandle ? lensHandle : ""}
                className="h-8"
                src={iconLens}
                alt=""
              />
            </div>
            <div className=" cursor-pointer ">
              {" "}
              <img className="h-8" src={iconFarcaster} alt="" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center m-4">
        <div className="mt-3">
          {address && (
            <div
              onClick={() => handleCopy(address)}
              className="flex mr-4 bg-blue-gray-50 p-1 pl-2 pr-2 rounded-full cursor-pointer w-fit mb-2"
            >
              {addressCrop(address)}
              <BiCopy className="ml-1 mt-0.5 " />
            </div>
          )}
          {solanaAddress && (
            <div
              onClick={() => handleCopy(solanaAddress)}
              className="flex mr-4 bg-blue-gray-50 p-1 pl-2 pr-2 rounded-full cursor-pointer w-fit"
            >
              {addressCrop(solanaAddress)}
              <BiCopy className="ml-1 mt-0.5 " />
            </div>
          )}
          <LogoutBtn />
        </div>

        <div className="flex flex-col justify-center align-middle">
          <div className="text-base font-medium">Points to Spend</div>

          <div className="flex align-middle justify-between bg-gray-100 rounded-full w-26 mt-2">
            <div className="m-1">
              <img className="h-6" src={Coin} alt="Coin" />
            </div>
            <div className="m-1 text-lg mr-2 ml-2">{points}</div>
          </div>
        </div>
      </div>
      <hr className="m-2 mt-4 " />
    </>
  );
};

export default UserCard;
