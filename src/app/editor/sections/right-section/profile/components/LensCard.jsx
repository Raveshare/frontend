import React from "react";
import LensLogo from "../assets/svgs/LogoLens.svg";
import chadText from "../assets/svgs/Chad/ChadText.svg";
import chadStar from "../assets/svgs/Chad/ChadStar.svg";
import Coin from "../assets/pngs/Coin.png";

const LensCard = () => {
  return (
    <>
      <div className="flex flex-col bg-[#9bea1d30] m-4 mt-2 rounded-md ">
        <div className="flex ">
          <div className="font-semibold text-lg p-4 pb-1 pt-4 text-[#313131]">
            {" "}
            Claim your Lens Handle
          </div>
          <div className="mt-2">
            {" "}
            <img src={LensLogo} alt="" />
          </div>
        </div>

        <div className="flex ml-4 mb-4">
          <div className=" text-base ">Become a </div>
          <div className="ml-2">
            {" "}
            <img src={chadText} alt="" />{" "}
          </div>
          <div className="">
            {" "}
            <img src={chadStar} alt="" />
            <img src={chadStar} alt="" />
            <img src={chadStar} alt="" />{" "}
          </div>
        </div>

        <div className="flex align-middle ml-4 mb-4">
          <div className="text-base">
            Get 100 <img className="h-4" src={Coin} alt="" /> to claim your Lens
            handle from Lenspost{" "}
          </div>
        </div>
      </div>
    </>
  );
};

export default LensCard;
