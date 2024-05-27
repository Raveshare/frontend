import React, { useEffect, useState } from "react";
import LogoutBtn from "../LogoutBtn";
import { useAccount } from "wagmi";
import { useUser } from "../../../../../../../hooks/user";
import { addressCrop } from "../../../../../../../utils";
import Coin from "../../assets/svgs/Coin.svg";
import BiCopy from "@meronex/icons/bi/BiCopy";
import { NormieDP, NormieBadge, NormieHex } from "../../assets/svgs/Normie";
import { PlebDP, PlebBadge, PlebHex } from "../../assets/svgs/Pleb";
import { ChadDP, ChadBadge, ChadHex } from "../../assets/svgs/Chad";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { getInviteCode } from "../../../../../../../services/apis/BE-apis";

const UserCardV2 = ({ username }) => {
  const { address } = useAccount();
  const { points, profileImage, userLevel } = useUser();
  const [inviteCodesArr, setInviteCodesArr] = useState([]);

  const { data, isLoading } = useQuery({
    queryKey: ["getInviteCode"],
    queryFn: getInviteCode,
  });

  const inviteCodeList = data?.message;

  const handleCopy = (copyParam) => {
    navigator.clipboard.writeText(copyParam);
    toast.success(`${copyParam} copied`);
  };

  useEffect(() => {
    setInviteCodesArr(inviteCodeList);
  }, [inviteCodeList, data]);

  return (
    <>
      <div className="shadow-md rounded-md">
        <div className="flex justify-around m-2 mx-4">
          {/* <div className="flex flex-col gap-8 justify-normal align-baseline"> */}
          <div className="flex flex-col gap-8 justify-center align-middle items-center">
            <div className="inline-flex flex-col items-center justify-center relative">
              <div
                style={{
                  border: `1px solid ${
                    userLevel === "Pleb"
                      ? PlebHex
                      : userLevel === "Chad"
                      ? ChadHex
                      : NormieHex
                  }`,
                }}
                className={`relative w-[80px] h-[80px] rounded-[64px] overflow-hidden shadow-[0px_4px_4px_#00000040]`}
              >
                <img
                  src={
                    profileImage
                      ? profileImage
                      : userLevel === "Pleb"
                      ? PlebDP
                      : userLevel === "Chad"
                      ? ChadDP
                      : NormieDP
                  }
                  alt=""
                  className="absolute w-[72px] h-[72px] top-[4px] left-[4px] object-cover"
                />
              </div>
              <div className="relative w-[32px] h-[32px] mt-[-16px]">
                <img
                  src={
                    userLevel === "Pleb"
                      ? PlebBadge
                      : userLevel === "Chad"
                      ? ChadBadge
                      : NormieBadge
                  }
                  alt=""
                />
              </div>
            </div>
            {/* <div className="">
              {(userLevel === "Normie" || userLevel === "Pleb") && (
                <>
                  <div className="text-gray-600">
                    Get{" "}
                    {userLevel === "Normie"
                      ? "500"
                      : userLevel === "Pleb"
                      ? "1000"
                      : "1000"}{" "}
                    Points to reach{" "}
                    {userLevel === "Normie"
                      ? "Pleb"
                      : userLevel === "Pleb"
                      ? "Chad"
                      : "Normie"}
                  </div>


                  <div className="flex gap-1 w-48 items-center">
                    <div
                      style={{
                        backgroundColor:
                          userLevel === "Pleb"
                            ? PlebHex
                            : userLevel === "Chad"
                            ? ChadHex
                            : NormieHex,
                        width: `${(points / 500) * 100}%`,
                      }}
                      className="h-2 rounded-tl-full rounded-bl-full"
                    />
                    <div
                      style={{ width: "100%" }}
                      className="h-2 bg-gray-300 rounded-tr-full rounded-br-full"
                    />
                    <div className="-ml-4 w-8 h-8">
                      <img
                        className="w-8 h-8"
                        src={
                          userLevel === "Normie"
                            ? PlebBadge
                            : userLevel === "Pleb"
                            ? ChadBadge
                            : NormieBadge
                        }
                        alt=""
                      />
                    </div>
                  </div>

                  <div className="text-gray-600">
                    {points} / {userLevel === "Normie" ? "500" : "1000"}
                  </div>
                </>
              )}
            </div> */}
          </div>
          <div className="flex flex-col mt-2">
            <div className="">@{username ? username : "posteruser"}</div>
            <div
              onClick={() => handleCopy(address)}
              className="flex align-middle mt-2 bg-blue-gray-50 p-1 pl-2 pr-2 rounded-md cursor-pointer w-fit"
            >
              {address && addressCrop(address)}
              <BiCopy className="ml-1 mt-0.5 " />
            </div>
            <div className="text-gray-600 mt-8">$POSTER</div>
            <div className="flex align-middle justify-between border border-gray-200 rounded-md w-26 mt-1">
              <div className="m-1 text-lg mr-2 ml-2">{points}</div>
              <div className="m-1">
                <img className="h-6" src={Coin} alt="Coin" />
              </div>
            </div>

            <div className="flex gap-2 mt-4 ">
              <div className=""> Invites : </div>
              <div
                className="flex items-center"
                onClick={() => handleCopy(inviteCodesArr)}
              >
                <div className="cursor-pointer"> {inviteCodesArr} </div>
                <BiCopy className="ml-1 cursor-pointer" size={12} />
              </div>
            </div>
            <LogoutBtn />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserCardV2;
