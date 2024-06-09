import React, { useContext, useEffect, useState } from "react";
import {
  addressCrop,
  clearAllLocalStorageData,
  getAvatar,
  getFromLocalStorage,
} from "../../../../../utils";
import { useAccount, useDisconnect } from "wagmi";
import { toast } from "react-toastify";
import { Context } from "../../../../../providers/context/ContextProvider";
import {
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";

import { ClipboardIcon, PowerIcon } from "@heroicons/react/24/outline";
import { useSolanaWallet } from "../../../../../hooks/solana";
import { useLogout } from "../../../../../hooks/app";

const ProfileMenu = () => {
  const { solanaAddress } = useSolanaWallet();
  const { address } = useAccount();
  const { posthog } = useContext(Context);
  const { logout } = useLogout();

  const handleEVMAddressCopy = () => {
    navigator.clipboard.writeText(address);
    toast.success("address copied");
  };

  const handleSolanaAddressCopy = () => {
    navigator.clipboard.writeText(solanaAddress);
    toast.success("address copied");
  };

  const fnLogout = () => {
    logout();
    toast.success("Logout successful");

    // TODO: clear all local storage data + states
  };

  // state for profile menu items
  const profileMenuItems = [
    {
      label: address && addressCrop(address),
      icon: ClipboardIcon,
      onClick: handleEVMAddressCopy,
      shouldRender: address ? true : false,
    },
    {
      label: solanaAddress && addressCrop(solanaAddress),
      icon: ClipboardIcon,
      onClick: handleSolanaAddressCopy,
      shouldRender: solanaAddress ? true : false,
    },
    {
      label: "Logout",
      icon: PowerIcon,
      onClick: fnLogout,
      shouldRender: true,
    },
  ];

  return (
    <Menu placement="bottom-end">
      <MenuHandler>
        <Avatar
          variant="circular"
          alt="profile picture"
          className="cursor-pointer outline outline-black"
          src={getAvatar(address || solanaAddress)}
        />
      </MenuHandler>
      <MenuList className="p-1 mt-2">
        {profileMenuItems
          .filter((item) => item.shouldRender === true)
          .map(({ label, icon, onClick }, key) => {
            const isLastItem = label === "Logout";
            return (
              <div className="outline-none" key={label}>
                {isLastItem && <hr className="my-2 border-blue-gray-50" />}
                <MenuItem
                  key={label}
                  onClick={onClick}
                  className={`flex items-center gap-2 rounded ${
                    isLastItem
                      ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                      : ""
                  }`}
                >
                  {React.createElement(icon, {
                    className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                    strokeWidth: 2,
                  })}

                  <Typography
                    as="span"
                    variant="small"
                    className="font-normal"
                    color={isLastItem ? "red" : "inherit"}
                  >
                    {label}
                  </Typography>
                </MenuItem>
              </div>
            );
          })}
      </MenuList>
    </Menu>
  );
};

export default ProfileMenu;
