import React from "react";
import { ServerErrorImg } from "../../assets/assets";

const Error = () => {
  return (
    <div className="w-screen h-screen">
      <img src={ServerErrorImg} alt="" className="h-full w-full object-fill" />
    </div>
  );
};

export default Error;
