import { useContext } from "react";
import { useStore } from "../polotno";
import { Context } from "../../providers/context";

const useResetLensState = () => {
  const store = useStore();

  const {
    setSharing,
    setIsLoading,
    setText,
    setMenu,
    setPostDescription,
    setEnabled,
    setStCalendarClicked,
    setStFormattedDate,
    setStFormattedTime,
    setIsShareOpen,
    setPriceError,
    setSplitError,
    setEditionError,
    setReferralError,
    referredFromRef,
    lensCollectRecipientRef,
    assetsRecipientRef,
    parentRecipientRef,
    preStoredRecipientObjRef,
    contextCanvasIdRef,
    parentRecipientObjRef,
  } = useContext(Context);

  const resetLensState = () => {
    store.clear({ keepHistory: true });
    store.addPage();

        // Add a logo to the bottom right corner of the canvas
        let h = store.activePage.computedHeight;
        let w = store.activePage.computedWidth;
        store.activePage.addElement({
          x: w - 100,
          y: h - 100,
          type: "image",
          src: "/logo_16x16.png",
          selectable: false,
          alwaysOnTop: true,
          showInExport: true,
        });

    setSharing(false);
    setIsLoading(false);
    setText("");
    setMenu("main");
    setPostDescription("");
    setEnabled(false);
    setStCalendarClicked(false);
    setStFormattedDate("");
    setStFormattedTime("");
    setIsShareOpen(false);
    setPriceError(false);
    setSplitError(false);
    setEditionError(false);
    setReferralError(false);
    referredFromRef.current = [];
    lensCollectRecipientRef.current = [];
    assetsRecipientRef.current = [];
    parentRecipientRef.current = [];
    preStoredRecipientObjRef.current = [];
    contextCanvasIdRef.current = null;
    parentRecipientObjRef.current = [];
  };

  return { resetLensState };
};

export default useResetLensState;
