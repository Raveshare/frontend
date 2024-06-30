import React, { useContext, useState } from "react";
import { SharePanelHeaders } from "../components";
import { Button } from "@material-tailwind/react";
import { useMutation } from "@tanstack/react-query";
import { postFrame } from "../../../../../../services/apis/BE-apis";
import { Context } from "../../../../../../providers/context";
import { useSolanaWallet } from "../../../../../../hooks/solana";

const XShare = () => {
  const { postName, postDescription, contextCanvasIdRef } = useContext(Context);
  const { solanaAddress } = useSolanaWallet();
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync: postFrameData } = useMutation({
    mutationKey: "postFrameData",
    mutationFn: postFrame,
  });

  const ACTION_URL = `https://www.dial.to/?action=solana-action:https://solana-actions-beta.vercel.app/api/actions/`;

  const handleSubmit = () => {
    // setIsLoading(true);

    // const params = {
    //   canvasId: contextCanvasIdRef.current,
    //   owners: solanaAddress,
    //   isTopUp: false,
    //   allowedMints: 10,
    //   metadata: {
    //     name: postName,
    //     description: postDescription,
    //   },
    //   isLike: false,
    //   isRecast: false,
    //   isFollow: false,
    //   redirectLink: "https://x.com",
    //   contractAddress: "0x0",
    //   chainId: null,
    //   creatorSponsored: false,
    //   gatedChannels: false,
    //   gatedCollections: false,
    // };

    // postFrameData(params)
    //   .then((res) => {
    //     if (res?.status === "success") {
    //       setIsLoading(false);
    //       setFrameId(res?.frameId);
    //     } else if (res?.error) {
    //       setIsLoading(false);
    //       toast.error(res?.error);
    //     }
    //   })
    //   .catch((err) => {
    //     setIsLoading(false);
    //     toast.error(errorMessage(err));
    //   });

    window.open(
      `https://x.com/intent/post?text=https://dev-frames.vercel.app/api/action/1051`,
      "_blank"
    );
  };
  return (
    <>
      <SharePanelHeaders
        menuName={"X"}
        panelHeader={"Share Options"}
        panelContent={
          <>
            <div className="mx-2 my-2 outline-none">
              <Button className="w-full outline-none" onClick={handleSubmit}>
                {isLoading ? "Sharing..." : "Share"}
              </Button>
            </div>
          </>
        }
      />
    </>
  );
};

export default XShare;
