import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  IconButton,
  Spinner,
  Checkbox,
} from "@material-tailwind/react";
import { useReset } from "../../../../../../../hooks/app";
import { useNetwork } from "wagmi";
import BiCopy from "@meronex/icons/bi/BiCopy";
import { toast } from "react-toastify";
import { zoraURLErc721 } from "../utils";
import { FRAME_LINK } from "../../../../../../../data";

const ZoraDialog = ({
  title,
  icon,
  isError,
  isLoading,
  isPending,
  data,
  farTxHash,
  isSuccess,
  isCreatingSplit,
  isUploadingToIPFS,
  isShareLoading,
  isShareSuccess,
  isOpenAction,
  isFarcaster,
  isFrame,
  frameId,
  isStoringFrameData,
  isDeployingZoraContract
}) => {
  const [open, setOpen] = useState(false);
  const { resetState } = useReset();
  const { chain } = useNetwork();
  const [isCopy, setIsCopy] = useState({
    id: null,
  });

  const handleOpen = () => setOpen(!open);

  const farConversationUrl = `https://warpcast.com/~/conversations/`;

  // if loading show the dialog
  useEffect(() => {
    if (isUploadingToIPFS || isShareLoading) {
      setOpen(true);
    }
  }, [isUploadingToIPFS, isShareLoading]);

  // if error close the dialog
  useEffect(() => {
    if (isError) {
      setOpen(false);
    }
  }, [isError]);

  return (
    <>
      <Dialog
        size="sm"
        open={open}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        className="outline-none"
      >
        <DialogHeader className="gap-2 border-b border-gray-300">
          <img src={icon} alt="zora logo" className="h-10 w-10" />
          <Typography variant="h5" color="blue-gray">
            {title}
          </Typography>
        </DialogHeader>
        <DialogBody>
          <div className="flex items-center gap-2 justify-between">
            <Typography variant="h6" color="blue-gray">
              {isUploadingToIPFS && "Uploading to IPFS..."}
              {isCreatingSplit &&
                "Confirm the transaction to create the split..."}
              {isLoading && "Confirm the transaction to create the Edition..."}
              {isPending && "Transaction is pending..."}
              {isDeployingZoraContract && "Deploying collection..."}
              {isStoringFrameData && "Storing Frame data..."}
              {isOpenAction && isShareLoading && "Creating Lens open action..."}
              {isFarcaster && isShareLoading && "Sharing on Farcaster..."}
              {isOpenAction
                ? isShareSuccess && <>Open Action is created successfully.</>
                : isFarcaster
                ? isShareSuccess && (
                    <>
                      Successfully shared.
                      <span className="flex gap-1 items-center">
                        Check your post on
                        <a
                          href={farConversationUrl + farTxHash}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-500"
                        >
                          Warpcast
                        </a>
                        <BiCopy
                          onClick={() => {
                            navigator.clipboard.writeText(
                              farConversationUrl + farTxHash
                            );
                            setIsCopy({
                              id: 1,
                            });
                          }}
                          className="cursor-pointer"
                        />
                        {isCopy?.id === 1 && (
                          <span className="text-green-500">Copied</span>
                        )}
                      </span>
                      {isFrame && (
                        <span className="flex gap-1 items-center">
                          Check your
                          <a
                            href={FRAME_LINK + frameId}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-500"
                          >
                            Frame
                          </a>
                          <BiCopy
                            onClick={() => {
                              navigator.clipboard.writeText(
                                FRAME_LINK + frameId
                              );
                              setIsCopy({
                                id: 2,
                              });
                            }}
                            className="cursor-pointer"
                          />
                          {isCopy?.id === 2 && (
                            <span className="text-green-500">Copied</span>
                          )}
                        </span>
                      )}
                    </>
                  )
                : isSuccess && (
                    <>
                      Transaction is successful. <br />
                      <span className="text-md flex items-center gap-1">
                        Check your edition on{" "}
                        <a
                          href={zoraURLErc721(
                            data?.logs[0]?.address,
                            chain?.id
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-500"
                        >
                          Zora
                        </a>
                        <BiCopy
                          onClick={() => {
                            navigator.clipboard.writeText(
                              zoraURLErc721(data?.logs[0]?.address, chain?.id)
                            );
                            setIsCopy(true);
                          }}
                          className="cursor-pointer"
                        />
                        {isCopy && (
                          <span className="text-green-500">Copied</span>
                        )}
                      </span>
                    </>
                  )}
            </Typography>
            {(isUploadingToIPFS ||
              isCreatingSplit ||
              isLoading ||
              isPending ||
              isShareLoading) && <Spinner color="blue" />}
          </div>
        </DialogBody>

        <DialogFooter>
          <Button
            disabled={
              isUploadingToIPFS ||
              isCreatingSplit ||
              isLoading ||
              isPending ||
              isShareLoading ||
              isStoringFrameData
            }
            // color="teal"
            onClick={() => {
              handleOpen();
              resetState();
            }}
            ripple="light"
            className="ml-4 outline-none"
          >
            Ok
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default ZoraDialog;
