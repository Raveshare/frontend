import React, { useContext } from "react";
import { SharePanelHeaders } from "../components";
import { Tabs, Tab, TabsHeader, Typography } from "@material-tailwind/react";
import { CompressedNft, MasterEdition } from "./Components";
import { Context } from "../../../../../../providers/context";

const SolanaMintWrapper = () => {
  const { solanaTab, setSolanaTab } = useContext(Context);

  return (
    <>
      <SharePanelHeaders
        menuName={"solanaShare"}
        panelHeader={"Mint Options"}
        panelContent={
          <>
            {/* tabs for cnft / master edition */}
            <Tabs className="overflow-scroll my-2" value={solanaTab}>
              <TabsHeader className="relative top-0">
                <Tab
                  value={"cnft"}
                  className="appFont"
                  onClick={() => setSolanaTab("cnft")}
                >
                  {" "}
                  Compressed NFT{" "}
                </Tab>
                <Tab
                  value={"masterEdition"}
                  className="appFont"
                  onClick={() => setSolanaTab("masterEdition")}
                >
                  {" "}
                  Master Edition{" "}
                </Tab>
              </TabsHeader>

              {/* add components */}
              {solanaTab === "cnft" && <CompressedNft />}
              {solanaTab === "masterEdition" && (
                <MasterEdition />
                // <Typography className="text-center text-xl mt-10" variant="h5">Coming Soon!</Typography>
              )}
            </Tabs>
          </>
        }
      />
    </>
  );
};

export default SolanaMintWrapper;
