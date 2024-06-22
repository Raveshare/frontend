import React from "react";
import { useLogout } from "../../../../../../hooks/app";
import { Typography } from "@material-tailwind/react";
import { toast } from "react-toastify";
import FiLogOut from "@meronex/icons/fi/FiLogOut";

const LogoutBtn = () => {
  const { logout } = useLogout();

  const fnLogout = () => {
    logout();
    toast.success("Logout successful");
  };

  return (
    <div onClick={fnLogout}>
      <div className="text-red-400 flex p-1 pl-2 pr-2 mt-4 cursor-pointer hover:bg-red-50 w-fit rounded-md">
        {" "}
        <FiLogOut className="mt-0.5" /> <div className="ml-2">Logout</div>{" "}
      </div>
    </div>
  );
};

export default LogoutBtn;
