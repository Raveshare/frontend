export const resetAllVariables = (
  store,
  referredFromRef,
  contextCanvasIdRef,
  setPostDescription,
  setEnabled,
  setIsShareOpen,
  setMenu
) => {
  setPostDescription("");
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

  referredFromRef.current = [];
  contextCanvasIdRef.current = null;
  setEnabled({
    chargeForCollect: false,
    chargeForCollectPrice: "1",
    chargeForCollectCurrency: "WMATIC",

    mirrorReferralReward: false,
    mirrorReferralRewardFee: 25.0,

    splitRevenueRecipients: [
      {
        recipient: "",
        split: 0.0,
      },
    ],

    limitedEdition: false,
    limitedEditionNumber: "1",

    timeLimit: false,
    endTimestamp: {
      date: "",
      time: "",
    },

    whoCanCollect: false,
  });

  setIsShareOpen(false);
  setMenu("share");
};
