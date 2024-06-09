import React, { useEffect, useState } from "react";
import { NormieDP, NormieBadge, NormieHex } from "../../assets/svgs/Normie";
import { PlebDP, PlebBadge, PlebHex } from "../../assets/svgs/Pleb";
import { ChadDP, ChadBadge, ChadHex } from "../../assets/svgs/Chad";
import { useUser } from "../../../../../../../hooks/user";
import Coin from "../../assets/svgs/Coin.svg";
import iconReward from "../../assets/svgs/iconReward.svg";
import iconCheck from "../../assets/svgs/iconCheck.svg";
import iconLock from "../../assets/svgs/iconLock.svg";
const TaskCardV2 = ({
  taskId,
  taskName,
  taskDesc,
  taskAmount,
  isReward,
  isCompleted,
}) => {
  const { points, profileImage, userLevel } = useUser();
  const [stColor, setStColor] = useState("bg-green-50");

  const fnSetColor = () => {
    if (isCompleted) {
      setStColor("bg-green-50");
    }
    if (!isCompleted) {
      setStColor("bg-gray-200");
    }
    if (isReward) {
      setStColor("bg-yellow-100");
    }
  };

  useEffect(() => {
    fnSetColor();
  }, []);

  return (
    <>
      <div className="flex gap-2 ">
        <div className="flex gap-2 items-center m-2 mt-0 w-full ">
          <div
            className={`flex align-middle justify-center items-center text-center rounded-full ${stColor}`}
          >
            <div className="flex align-middle justify-center items-center w-16 h-16">
              {isReward ? (
                <img className="rounded-full" src={iconReward} alt="profile" />
              ) : isCompleted ? (
                <img className="rounded-full" src={iconCheck} alt="profile" />
              ) : (
                taskId
              )}
            </div>
          </div>
          <div
            className={`flex flex-col px-2 py-4 w-full rounded-md ${stColor}`}
          >
            <div className="text-md font-semibold">{taskName}</div>
            <div className="w-fulltext-gray-700 mt-2 ">{taskDesc}</div>
          </div>
        </div>
        <div className="flex gap-1 bg-blue-400 text-white w-fit h-5 px-2 rounded-full opacity-80 -ml-16 mt-4 shadow-md">
          <div className="flex align-middle items-center">
            <div className="">
              {isCompleted ? (
                <img className="h-4" src={iconCheck} alt="" />
              ) : isReward ? (
                <img className="h-4" src={iconLock} alt="" />
              ) : (
                <>
                  <div className="flex align-middle items-center gap-1 ">
                    <div className="">{taskAmount}</div>
                    <img className="h-4" src={Coin} alt="" />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskCardV2;
