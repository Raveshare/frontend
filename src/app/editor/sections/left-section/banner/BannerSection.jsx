// Imports:
import React, { useEffect, useState } from "react";
import { Button } from "@blueprintjs/core";
import { SectionTab } from "polotno/side-panel";
import { Tabs as TabsCustom, TabsWithArrows } from "../../../common"; // Since Material already has builtin component `Tab`
import { firstLetterCapital } from "../../../../../utils";
import CgImage from "@meronex/icons/cg/CgImage";
import FeaturedTabs from "../../../common/core/FeaturedTabs";
import {
  getAssetByQuery,
  getAuthors,
  getFeaturedAssets,
} from "../../../../../services";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { useAppAuth } from "../../../../../hooks/app";
import { useQuery } from "@tanstack/react-query";

export const BannerPanel = () => {
  const { isAuthenticated } = useAppAuth();

  const { data } = useQuery({
    key: ["assets-authors"],
    queryFn: getAuthors,
    enabled: isAuthenticated ? true : false,
  });

  const tabArray = [];
  data?.data.map((tab) => {
    if (tab?.hasBackgrounds) {
      tabArray.push(tab);
    }
  });

  console.log("tabArray", tabArray);
  const [currentTab, setCurrentTab] = useState(tabArray?.[0]);

  useEffect(() => {
    if (data) {
      setCurrentTab(tabArray?.[0]);
    }
  }, [data]);

  return (
    <div className="h-full flex flex-col">
      {/* New Material Tailwind Buttons / Tabs : */}
      {/* Reference Link: https://www.material-tailwind.com/docs/react/tabs */}

      <Tabs id="custom-animation" value={currentTab?.author}>
        <div className="w-100 overflow-scroll">
          <TabsWithArrows
            tabsHeaders={
              <>
                <TabsHeader>
                  {tabArray.map((tab, index) => (
                    <Tab
                      key={index}
                      value={
                        tab?.campaign
                          ? tab?.campaign !== tab?.author
                            ? tab?.campaign
                            : tab?.author
                          : tab?.author
                      }
                      onClick={() => {
                        setCurrentTab(tab);
                      }}
                    >
                      <div className="appFont">
                        {" "}
                        {firstLetterCapital(
                          tab?.campaign ? tab?.campaign : tab?.author
                        )}
                      </div>
                    </Tab>
                  ))}
                </TabsHeader>
              </>
            }
          />
        </div>
        <div className="hCustom overflow-y-scroll">
          <TabsBody
            animate={{
              initial: { y: 250 },
              mount: { y: 0 },
              unmount: { y: 250 },
            }}
          >
            <TabsCustom
              defaultQuery={
                currentTab?.campaign ? currentTab?.campaign : currentTab?.author
              }
              author={currentTab?.campaign ? "" : currentTab?.author}
              campaignName={currentTab?.campaign}
              getAssetsFn={getAssetByQuery}
              type="background"
              changeCanvasDimension={true}
            />
          </TabsBody>
        </div>
      </Tabs>
      {/* )} */}
    </div>
  );
};

// define the new custom section
const BannerSection = {
  name: "Backgrounds2",
  Tab: (props) => (
    <SectionTab name={`NFT ${"\n"} Banners`} {...props}>
      <CgImage size="16" />
    </SectionTab>
  ),
  // we need observer to update component automatically on any store changes
  Panel: BannerPanel,
};

export default BannerSection;
