import React, { useContext, useState } from "react";
import { useStore } from "../../../../../hooks/polotno";
import { Button } from "@blueprintjs/core";
import { replaceImageURL } from "../../../../../utils";
import { getRemovedBgS3Link } from "../../../../../services";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import { useAppAuth } from "../../../../../hooks/app";
import { Context } from "../../../../../providers/context";
import SuReplicate from "@meronex/icons/su/SuReplicate";
import { Typography } from "@material-tailwind/react";

const BgRemover = ({ inSpeedDial }) => {
  const store = useStore();
  const { isAuthenticated } = useAppAuth();
  const [stActivePageNo, setStActivePageNo] = useState(0);
  const { parentRecipientDataRef, bgRemoverRecipientDataRef } =
    useContext(Context);
  var varActivePageNo = 0;

  const handleRemoveBg = async () => {
    const varImageUrl = store.selectedElements[0]?.src;
    const elementId = store.selectedElements[0]?.id;
    const removedBgURL = await fnRemoveBg(varImageUrl, elementId);

    if (removedBgURL?.error) {
      return { error: removedBgURL.error };
    }

    fnAddImageToCanvas(removedBgURL.url);
    fnUpdateRecipientDataRef(removedBgURL.elementId, elementId);

    return { url: removedBgURL.url };
  };

  const fnRemoveBg = async (varImageUrl, elementId) => {
    const res = await getRemovedBgS3Link(varImageUrl, elementId);
    return res?.data
      ? { url: res.data.s3link, elementId: res.data.id }
      : { error: res?.error };
  };

  const fnAddImageToCanvas = async (removedBgUrl) => {
    const activePageIndex = store.pages.findIndex(
      (page) => page.identifier === store._activePageId
    );
    if (activePageIndex !== -1) {
      const selectedElement = store.selectedElements[0];
      await store.pages[activePageIndex].addElement({
        type: "image",
        x: 0.5 * store.width,
        y: 0.5 * store.height,
        width: selectedElement.width,
        height: selectedElement.height,
        src: removedBgUrl,
        selectable: true,
        draggable: true,
        removable: true,
        resizable: true,
        showInExport: true,
      });
    }
  };

  const fnCallToast = async () => {
    const varImageUrl = store.selectedElements[0]?.src;
    if (!varImageUrl) {
      toast.error("Please select an image to remove background");
      return;
    }

    const loadingToastId = toast.loading("Removing Background", {
      autoClose: false,
    }); // Keep loading toast open indefinitely

    try {
      const res = await handleRemoveBg();
      if (res.url) {
        toast.success("Removed Background", { autoClose: 3000 });
      } else if (res.error) {
        toast.error(res.error || "Error removing background", {
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("An error occurred while removing background", {
        autoClose: 3000,
      });
    } finally {
      // Close the loading toast regardless of success or failure
      toast.dismiss(loadingToastId);
    }
  };

  // fumction to update the parentRecipientDataRef with the removed bg nft/asset/image data
  const fnUpdateRecipientDataRef = async (preElementId, newElementId) => {
    // check if preElementId is present in the parentRecipientDataRef
    const arr = parentRecipientDataRef.current;

    // if preElementId is present in the parentRecipientDataRef, then add the newElementId to the parentRecipientDataRef with that recipient
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].elementId == preElementId) {
        bgRemoverRecipientDataRef.current.push({
          elementId: newElementId,
          recipient: arr[i].recipient,
        });
        break;
      }
    }
  };

  return (
    <div className="">
      {!inSpeedDial && (
        <Button
          id="fourth-step"
          icon="clean"
          onClick={fnCallToast}
          title={!isAuthenticated ? "" : "Please connect your wallet"}
          disabled={!isAuthenticated}
          className="mt-2 mb-2 ml-3 py-1 px-4"
        >
          {`Remove background`}
        </Button>
      )}

      {/* For Speed dial display */}
      {inSpeedDial && (
        <div className="" onClick={fnCallToast}>
          <SuReplicate className="h-5 w-5" />
        </div>
      )}
    </div>
  );
};

export default BgRemover;
