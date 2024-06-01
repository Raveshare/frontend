import React from "react";
import { utilXtimeAgo } from "../../../../../../../utils";
import BsClockHistory from "@meronex/icons/bs/BsClockHistory";
import BsCheck from "@meronex/icons/bs/BsCheck";

const RewardV1 = ({ pointsId, pointsReason, pointsAmt, pointsDate }) => {
  return (
    <>
      <div className="flex justify-between border-b-2 m-2 rounded-md">
        <div className="flex flex-col gap-1">
          <div className="flex ">
            <BsCheck className="m-1 mt-1.5" />
            {/* <div className="m-1">{pointsId}</div> */}
            <div className="m-1">{pointsReason}</div>
          </div>

          <div className="m-1 flex gap-1 align-middle opacity-50">
            {" "}
            <BsClockHistory className="m-0.5" /> {utilXtimeAgo(pointsDate)} ago
          </div>
        </div>
        <div className="m-2 p-2 text-red-500">{pointsAmt}</div>
      </div>
    </>
  );
};

export default RewardV1;
