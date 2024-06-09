import React, { useContext, useEffect, useState } from "react";
import Coin from "../../assets/svgs/Coin.svg";
import { Context } from "../../../../../../../providers/context";
import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
} from "@material-tailwind/react";
import { InputBox } from "../../../../../common";
import TiTick from "@meronex/icons/ti/TiTick";
import { ComplProfileModal, InviteModal } from "../Modals/blueprintjs";

const TasksCard = ({
  CardHead,
  CardSubHead,
  NoOfPoints,
  isCompleted,
  modalName,
}) => {

  const { setOpenedProfileModal, openedModalName, setOpenedModalName } = useContext(Context);

  const handleClick = () => {
    if (!isCompleted) {
      setOpenedModalName(modalName);
      setOpenedProfileModal(true);
    }
  };
  return (
    <>
      <div
        onClick={() => handleClick()}
        className={`flex flex-col bg-[#F7F7F7] m-4 mt-2 rounded-md  ${
          isCompleted ? "" : "hover:bg-[#f3f2f2] cursor-pointer"
        }`}
      >
        <div className="font-semibold text-lg p-4 pb-1 pt-4 text-[#313131]">
          {CardHead}
        </div>
        <div className="flex justify-between pb-4">
          <div className="text-base p-4 w-52">{CardSubHead}</div>

          {!isCompleted ? (
            <div className="m-2 mr-2 mt-4 p-1 bg-[#fdc14832] w-24 h-fit flex align-middle justify-around rounded-sm">
              <div className="p-1">
                {" "}
                <img className="h-6" src={Coin} alt="" />
              </div>
              <div className="text-base p-1">+{NoOfPoints}</div>
            </div>
          ) : (
            <div className="m-2 mr-2 mt-4 p-1 bg-[#48fd8a32] w-24 h-fit flex align-middle justify-around rounded-sm">
              <TiTick className="text-green-500 h-6" />
              <div className="text-base p-0.5 text-green-500">Claimed</div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Start */}

      {/* {modalName === "invite" && <InviteModal handleOpen={handleOpenModal} open={openedModal} />} */}
      {openedModalName === "Profile" && (
        <ComplProfileModal modalHead={CardHead} modalSubHead={CardSubHead} />
      )}
      {openedModalName === "Invite" && <InviteModal />}
      {/* {modalName === "complProfile" && <ComplProfileModal />} */}
    </>
  );
};

export default TasksCard;
