import { useContext, useState } from "react";
import { shareOnSocials } from "../../../../../../../services";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { Context } from "../../../../../../../providers/context/ContextProvider";
import {
  getFromLocalStorage,
  errorMessage,
  jsConfettiFn,
} from "../../../../../../../utils";
import { useLocalStorage, useReset } from "../../../../../../../hooks/app";
import { ERROR, LOCAL_STORAGE } from "../../../../../../../data";
import { Button } from "@material-tailwind/react";
import { EVMWallets } from "../../../../top-section/auth/wallets";
import FarcasterAuth from "./FarcasterAuth";
import FarcasterChannel from "./FarcasterChannel";
import { Switch } from "@headlessui/react";

const FarcasterNormalPost = () => {
  const { resetState } = useReset();
  const getEVMAuth = getFromLocalStorage(LOCAL_STORAGE.evmAuth);

  const {
    postDescription,
    contextCanvasIdRef,
    setFarcasterStates,
    farcasterStates, // don't remove this
    lensAuthState, // don't remove this
  } = useContext(Context);

  const [sharing, setSharing] = useState(false);
  const { isFarcasterAuth } = useLocalStorage();

  const { mutateAsync: shareOnLens } = useMutation({
    mutationKey: "shareOnFarcaster",
    mutationFn: shareOnSocials,
  });

  const monetizationSettings = () => {
    let canvasParams = {
      zoraMintLink: "",
      channelId: "",
    };

    if (farcasterStates.isChannel) {
      canvasParams = {
        ...canvasParams,
        zoraMintLink: "",
        channelId: farcasterStates.channel?.id,
      };
    }

    return canvasParams;
  };

  // share post on lens
  const sharePost = async (platform) => {
    // check if canvasId is provided
    if (contextCanvasIdRef.current === null) {
      toast.error("Please select a design");
      return;
    }
    // check if description is provided
    if (!postDescription) {
      toast.error("Please provide a description");
      return;
    }

    setSharing(true);

    const canvasData = {
      id: contextCanvasIdRef.current,
      name: "Farvaster post",
      content: postDescription,
    };

    const id = toast.loading(`Sharing on ${platform}...`);
    shareOnLens({
      canvasData: canvasData,
      canvasParams: monetizationSettings(),
      platform: platform,
    })
      .then((res) => {
        if (res?.txHash) {
          jsConfettiFn();

          toast.update(id, {
            render: `Successfully shared on ${platform}`,
            type: "success",
            isLoading: false,
            autoClose: 3000,
            closeButton: true,
          });

          // clear all the variables
          resetState();
        } else if (res?.error || res?.reason === "REJECTED") {
          toast.update(id, {
            render: res?.error || ERROR.SOMETHING_WENT_WRONG,
            type: "error",
            isLoading: false,
            autoClose: 3000,
            closeButton: true,
          });
          setSharing(false);
        }
      })
      .catch((err) => {
        toast.update(id, {
          render: errorMessage(err),
          type: "error",
          isLoading: false,
          autoClose: 3000,
          closeButton: true,
        });
        setSharing(false);
      });
  };

  return (
    <>
      <div className="mb-4 m-4">
        <div className="flex justify-between">
          <h2 className="text-lg mb-2"> Channel </h2>
          <Switch
            checked={farcasterStates.isChannel}
            onChange={() =>
              setFarcasterStates({
                ...farcasterStates,
                isChannel: !farcasterStates.isChannel,
              })
            }
            className={`${
              farcasterStates.isChannel ? "bg-[#00bcd4]" : "bg-gray-200"
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#00bcd4] focus:ring-offset-2`}
          >
            <span
              className={`${
                farcasterStates.isChannel ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />{" "}
          </Switch>
        </div>
        <div className="w-4/5 opacity-75">
          {" "}
          Share your post in the Farcaster channel.{" "}
        </div>
      </div>
      <div className={`m-4 ${!farcasterStates.isChannel && "hidden"}`}>
        <FarcasterChannel />
      </div>

      <div className="flex flex-col bg-white shadow-2xl rounded-lg rounded-r-none">
        {!getEVMAuth ? (
          <EVMWallets title="Login with EVM" className="mx-2" />
        ) : !isFarcasterAuth ? (
          <FarcasterAuth />
        ) : (
          <div className="mx-2 my-2 outline-none">
            <Button
              className="w-full outline-none"
              disabled={sharing}
              onClick={() => sharePost("farcaster")}
              color="teal"
            >
              Share
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default FarcasterNormalPost;
