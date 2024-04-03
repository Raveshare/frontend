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
