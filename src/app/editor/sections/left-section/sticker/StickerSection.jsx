import React, { useEffect, useRef, useState } from "react";
import { Button, Icon } from "@blueprintjs/core";
import { isAlive } from "mobx-state-tree";
import { svgToURL } from "polotno/utils/svg";
import { SectionTab } from "polotno/side-panel";
import { getKey } from "polotno/utils/validate-key";
import styled from "polotno/utils/styled";
import { useInfiniteAPI } from "polotno/utils/use-api";
import { ImagesGrid } from "polotno/side-panel/images-grid";
import { getAssetByQuery, getFeaturedAssets } from "../../../../../services";
import {
  SearchComponent,
  StickerReacTour,
  Tabs as TabsCustom,
  TabsWithArrows,
} from "../../../common"; // Since Material already has builtin component `Tab`
import { useStore } from "../../../../../hooks/polotno";
import { LoadingAnimatedComponent } from "../../../common";
import { firstLetterCapital, fnLoadMore } from "../../../../../utils";
import FeaturedTabs from "../../../common/core/FeaturedTabs";

import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";

const API = "https://api.polotno.dev/api";
// const API = 'http://localhost:3001/api';

const iconToSrc = async (id) => {
  const req = await fetch(
    `${API}/download-nounproject?id=${id}&KEY=${getKey()}`
  );
  const text = await req.text();
  const base64 = await svgToURL(text);
  return base64;
};

const limit = 50;

const NounContainer = styled("div")`
  height: 100%;
  overflow: hidden;

  & img {
    filter: invert(1);
  }
`;

export const CompIcons = () => {
  const store = useStore();
  const requestTimeout = React.useRef();
  const [query, setQuery] = React.useState("");
  const [delayedQuery, setDelayedQuery] = React.useState(query);

  // load data
  const count = 50;
  const {
    data,
    isLoading,
    loadMore,
    setQuery: setApiQuery,
    error,
  } = useInfiniteAPI({
    getAPI: ({ page, query }) =>
      `${API}/get-iconfinder?query=${query}&offset=${
        (page - 1) * count
      }&count=${count}&KEY=${getKey()}`,
    getSize: (res) => {
      return Math.ceil(res.total_count / count);
    },
  });

  React.useEffect(() => {
    requestTimeout.current = setTimeout(() => {
      setDelayedQuery(query);
    }, 500);
    return () => {
      clearTimeout(requestTimeout.current);
    };
  }, [query]);

  React.useEffect(() => {
    setApiQuery(delayedQuery);
  }, [delayedQuery]);

  return (
    <>
      <div className="" id="stickerSearch">
        <SearchComponent
          query={query}
          setQuery={setQuery}
          placeholder="Search icons"
        />
      </div>
      <ImagesGrid
        shadowEnabled={false}
        images={data?.map((data) => data.icons).flat()}
        getPreview={(item) => item.raster_sizes[6].formats[0].preview_url}
        isLoading={isLoading}
        onSelect={async (item, pos, element) => {
          const { download_url } = item.vector_sizes[0].formats[0];
          if (element && element.type === "image" && !element.locked) {
            const req = await fetch(
              `${API}/download-iconfinder?download_url=${download_url}&KEY=${getKey()}`
            );
            const json = await req.json();
            const base64 = await svgToURL(json.content);
            element.set({ clipSrc: base64 });
            return;
          }
          // const { width, height } = await getImageSize(item.images['256']);
          const width = item.vector_sizes[0].size_width / 5;
          const height = item.vector_sizes[0].size_height / 5;

          store.history.transaction(async () => {
            const x = (pos?.x || store.width / 2) - width / 2;
            const y = (pos?.y || store.height / 2) - height / 2;
            const svg = store.activePage?.addElement({
              type: "svg",
              width,
              height,
              x,
              y,
            });

            const req = await fetch(
              `${API}/download-iconfinder?download_url=${download_url}&KEY=${getKey()}`
            );
            const json = await req.json();
            const base64 = await svgToURL(json.content);
            if (isAlive(svg)) {
              await svg.set({ src: base64 });
            }
          });
        }}
        rowsNumber={4}
        error={error}
        loadMore={loadMore}
      />
    </>
  );
};

export const StickerPanel = () => {
  // Halloween use 'H' and not 'h' - BE Response
  const tabArray = [
    {
      name: "Base",
      author: "base",
      campaign: null,
    },
    {
      name: "Cybershakti",
      author: "cybershakti",
      campaign: "shakti",
    },
    {
      name: "Gloom",
      author: "$GLOOM",
      campaign: "Gloom",
    },
    {
      name: "Chicken",
      author: "chicken",
      campaign: "chicken",
    },
    {
      name: "Otto",
      author: "otto",
      campaign: "otto",
    },
    {
      name: "Monniverse",
      author: "monniverse",
      campaign: "monniverse",
    },
    {
      name: "Enjoy",
      author: "enjoy",
      campaign: "enjoy",
    },
    {
      name: "Frame",
      author: "FRAME",
      campaign: "$frame",
    },
    {
      name: "Mfermojis",
      author: "mfermojis",
      campaign: "explore",
    },
    {
      name: "Degen",
      author: null,
      campaign: "degen",
    },
    {
      name: "Huddle",
      author: "huddle",
      campaign: "huddle",
    },
    {
      name: "Wgmis",
      author: "wgmis",
      campaign: "wgmis",
    },
    {
      name: "LOVE on LEVERAGE",
      author: "UNLONELY",
      campaign: "LOVE on LEVERAGE",
    },
    {
      name: "Simp",
      author: "$simp",
      campaign: null,
    },
    {
      name: "Christmas",
      author: null,
      campaign: "christmas",
    },
    {
      name: "Firefly",
      author: "Firefly",
      campaign: "firefly",
    },
    {
      name: "Halloween",
      author: null,
      campaign: "halloween",
    },
    {
      name: "Lensjump",
      author: "lensjump",
      campaign: "lensjump",
    },
    {
      name: "Supducks",
      author: "supducks",
      campaign: null,
    },
    {
      name: "Lens",
      author: "lens",
      campaign: null,
    },
    {
      name: "Nouns",
      author: "nouns",
      campaign: null,
    },
    {
      name: "FLS",
      author: "fls",
      campaign: null,
    },
    {
      name: "Assorted",
      author: "assorted",
      campaign: null,
    },
    {
      name: "Explore",
      author: null,
      campaign: "explore",
    },
    {
      name: "Icons",
      author: null,
      campaign: null,
    },
  ];
  const [currentTab, setCurrentTab] = useState(tabArray[0]);
  const store = useStore();

  return (
    <>
      <div className="flex flex-col h-full">
        {/* New Material Tailwind Buttons / Tabs : */}
        {/* Reference Link: https://www.material-tailwind.com/docs/react/tabs */}
        <Tabs id="custom-animation" value={currentTab?.name}>
          <TabsWithArrows
            tabsHeaders={
              <>
                <TabsHeader className="overflow-x-auto">
                  {tabArray.map((tab, index) => (
                    <Tab
                      key={index}
                      value={tab?.name}
                      onClick={() => {
                        setCurrentTab(tab);
                      }}
                    >
                      <div className="appFont"> {tab?.name} </div>
                    </Tab>
                  ))}
                </TabsHeader>
              </>
            }
          />
          {/* </div> */}
          <div className="hCustom overflow-y-scroll">
            {currentTab?.name === "Icons" ? (
              <CompIcons />
            ) : (
              <TabsCustom
                defaultQuery={currentTab?.name}
                author={currentTab?.author}
                campaignName={currentTab?.campaign}
                getAssetsFn={
                  currentTab?.author === "lensjump"
                    ? getFeaturedAssets
                    : getAssetByQuery
                }
                type="props"
              />
            )}
          </div>
        </Tabs>
      </div>
    </>
  );
};

// define the new custom section
const StickerSection = {
  name: "Elements",
  Tab: (props) => (
    <SectionTab name="Stickers" {...props}>
      <Icon icon="emoji" />
    </SectionTab>
  ),
  // we need observer to update component automatically on any store changes
  Panel: StickerPanel,
};

export default StickerSection;
