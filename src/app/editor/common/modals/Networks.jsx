import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  Typography,
  Spinner,
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
} from "@material-tailwind/react";
import HiOutlineSwitchHorizontal from "@meronex/icons/hi/HiOutlineSwitchHorizontal";
import AiOutlineCloseCircle from "@meronex/icons/ai/AiOutlineCloseCircle";
import FaRegDotCircle from "@meronex/icons/fa/FaRegDotCircle";
import { useAccount, useSwitchChain } from "wagmi";
import { chainLogo } from "../../../../utils";

const Networks = ({ className, chains, isUnsupportedChain }) => {
  const { chain } = useAccount();
  const { isError, error, isLoading, isSuccess, switchChain, variables } =
    useSwitchChain();
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  useEffect(() => {
    if (isSuccess) {
      handleOpen();
    }
  }, [isSuccess]);

  return (
    <>
      <Button
        onClick={handleOpen}
        color={isUnsupportedChain ? "red" : ""}
        className={`${className}`}
      >
        {isUnsupportedChain ? "Unsupported Network" : chain?.name}
      </Button>

      <Dialog
        size="sm"
        open={open}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        handler={handleOpen}
        className="outline-none"
      >
        <DialogHeader className="gap-2 border-b flex justify-between items-center border-gray-300">
          <div className="flex items-center gap-2">
            <HiOutlineSwitchHorizontal />
            <Typography variant="h5" color="blue-gray">
              Switch Networks
            </Typography>
          </div>
          <AiOutlineCloseCircle
            onClick={handleOpen}
            className="cursor-pointer text-red-500"
          />
        </DialogHeader>
        <DialogBody>
          {chains?.map((network, index) => (
            <>
              <List className="border rounded-lg my-2 p-0">
                <ListItem
                  onClick={() => {
                    network?.id !== chain?.id &&
                      switchChain({
                        chainId: network?.id,
                      });
                  }}
                  className="p-2 hover:shadow-lg"
                >
                  <div className="w-full flex justify-between items-center">
                    <div className="flex items-center">
                      <ListItemPrefix>
                        <Avatar
                          variant="circular"
                          alt={network?.name}
                          src={chainLogo(network?.id)}
                          className="w-10 h-10"
                        />
                      </ListItemPrefix>
                      <Typography variant="h6" color="blue-gray">
                        {network?.name}
                      </Typography>
                    </div>
                    {isLoading && variables?.chainId === network?.id && (
                      <Spinner color="red" />
                    )}
                    {!isLoading && network?.id === chain?.id && (
                      <div className="flex items-center gap-2">
                        <Typography variant="h6" color="blue-gray">
                          Connected
                        </Typography>
                        <FaRegDotCircle className="text-green-500" />
                      </div>
                    )}
                  </div>
                </ListItem>
              </List>
            </>
          ))}
        </DialogBody>
      </Dialog>
    </>
  );
};

export default Networks;
