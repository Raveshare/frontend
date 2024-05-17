import React, { useContext, useState } from "react";
import { SharePanelHeaders } from "../components";
import { Tabs, Tab, TabsHeader } from "@material-tailwind/react";
import { Context } from "../../../../../../providers/context";
import DegenWithdrawContent from "./components/DegenWithdrawContent";

const DegenWithdraw = () => {
  const { lensTab, setLensTab } = useContext(Context);

  return (
    <>
      <SharePanelHeaders
        menuName={"share"}
        panelHeader={"Withdraw Degens"}
        panelContent={
          <>
            {/* Tabs for Smart Post / Normal */}
            <Tabs className="overflow-scroll my-2" value={lensTab}>
                <DegenWithdrawContent />
            </Tabs>
          </>
        }
      />
    </>
  );
};

export default DegenWithdraw;
