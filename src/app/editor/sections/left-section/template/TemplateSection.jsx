import { useContext, useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { SectionTab } from "polotno/side-panel";
import {
  getAllTemplates,
  getUserPublicTemplates,
} from "../../../../../services";
import { Card } from "@blueprintjs/core";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  ConnectWalletMsgComponent,
  CompModal,
  ErrorComponent,
  MessageComponent,
  SearchComponent,
  CustomHorizontalScroller,
  LoadMoreComponent,
  CompCarousel,
} from "../../../common";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { Spinner, Icon } from "@blueprintjs/core";
import { useStore } from "../../../../../hooks/polotno";
import {
  assetsTrack,
  fnLoadJsonOnPage,
  fnLoadMore,
  randomThreeDigitNumber,
  replaceImageURL,
} from "../../../../../utils";
import { LoadingAnimatedComponent } from "../../../common";
import SuChevronRightDouble from "@meronex/icons/su/SuChevronRightDouble";
import { Context } from "../../../../../providers/context/ContextProvider";

// import CustomHorizontalScroller from "../../../common/";
import MdcImageMultipleOutline from "@meronex/icons/mdc/MdcImageMultipleOutline";
import Lottie from "lottie-react";
import animationData from "../../../../../assets/lottie/featured/featured1.json";
import { SecNameHeading } from "../../../common/elements/SecNameHeading";

import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { useAppAuth } from "../../../../../hooks/app";
import posthog from "posthog-js";

// Design card component start
const DesignCard = ({
  item,
  id,
  preview,
  json,
  tab,
  isGated,
  gatedWith,
  referredFrom,
  modal,
  setModal,
  ownerAddress,
  assetsRecipientElementData,
}) => {
  const store = useStore();
  const { referredFromRef, preStoredRecipientDataRef } = useContext(Context);

  const [stPreviewIndex, setStPreviewIndex] = useState(0);
  const [stHovered, setStHovered] = useState(false);

  // TODO: if any public template has no refferedFrom, then add owneraddress to refferedFrom

  const handleClickOrDrop = () => {
    // Show Modal: if it's tokengated
    if (isGated && Object.keys(json).length === 0) {
      setModal({
        ...modal,
        isOpen: true,
        isTokengated: isGated,
        gatedWith: gatedWith,
      });
    } else {
      // Check if there are any elements on the page - to open the Modal or not
      if (store.activePage.children.length > 1) {
        setModal({
          ...modal,
          isOpen: true,
          isNewDesign: true,
          json: json,
          referredFrom: referredFrom,
          preStoredRecipientObj: assetsRecipientElementData,
        });
      } else {
        // If not load the clicked JSON
        fnLoadJsonOnPage(store, json);
        if (tab === "user") {
          referredFromRef.current = referredFrom;
          preStoredRecipientDataRef.current = assetsRecipientElementData;
        }
      }
    }

    // track community template assets selected
    assetsTrack(item, "community", null);
  };

  // Function to change the preview image on hover
  // Increment the index of the Preview image Array
  const fnChangePreview = (preview) => {
    if (stPreviewIndex < preview.length - 1) {
      setStPreviewIndex(stPreviewIndex + 1);
    } else {
      setStPreviewIndex(0);
    }
  };

  // After a certain interval, change the preview image
  // Using useEffect to capture mouse events & index change
  useEffect(() => {
    if (stHovered) {
      const interval = setInterval(() => {
        fnChangePreview(preview);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [stHovered, stPreviewIndex]);

  return (
    <Card
      className="rounded-lg h-fit"
      style={{ margin: "4px", padding: "0px", position: "relative" }}
      interactive
      onDragEnd={handleClickOrDrop}
      onClick={handleClickOrDrop}
      // To change Preview image on Hover - MouseEnter & MouseLeave
      onMouseEnter={() => {
        setStHovered(true);
      }}
      onMouseLeave={() => {
        setStPreviewIndex(0);
        setStHovered(false);
      }}
    >
      {/* <div className="rounded-lg overflow-hidden transition-transform duration-1000"> */}
      <div className="transition-transform ease-in-out duration-300 relative mb-3">
        {/* If there are more than 1 preview images, then `stPreviewIndex` is incremented */}
        {/* If not on user templates tab, just passing the `preview` - BE response */}

        <LazyLoadImage
          className="rounded-lg"
          placeholderSrc={replaceImageURL(preview)}
          effect="blur"
          src={
            tab === "user"
              ? replaceImageURL(preview[stPreviewIndex])
              : replaceImageURL(preview)
          }
          alt="Preview Image"
        />
      </div>
      {/* if tab === "user" and  modal.isTokengate === true */}
      {tab === "user" && isGated && (
        <div
          className="bg-white absolute top-2 left-2 p-1 rounded-md "
          // style={{ position: "absolute", top: "8px", left: "8px" }}
        >
          <Icon icon="endorsed" intent="primary" size={16} />
        </div>
      )}

      {/* Display that it contains multiple pages */}
      {tab === "user" && preview.length > 1 && (
        <div className="absolute bottom-2 right-2 bg-white px-1/2 py-1/2 rounded-md">
          <SuChevronRightDouble size="24" />
          {/* <BsChevronDoubleRight size="24" /> */}
        </div>
      )}
    </Card>
  );
};

// Design card component end

const TemplatePanel = () => {
  const [tab, setTab] = useState("lenspost");
  const [stIsModalOpen, setStIsModalOpen] = useState(false);

  return (
    <div className="h-full flex flex-col">
      {/* <h1 className="text-lg">Templates</h1> */}
      <div className="flex items-center justify-center space-x-2 my-4 mb-0">
        <button
          className={`w-1/2 border px-2 py-1 border-black rounded-md ${
            tab === "lenspost" && "bg-[#1B1A1D]"
          } ${tab === "lenspost" && "text-white"}`}
          onClick={() => setTab("lenspost")}
        >
          Lenspost Drops
        </button>
        <button
          className={`w-1/2 border border-black px-2 py-1 rounded-md ${
            tab === "user" && "bg-[#1B1A1D]"
          } ${tab === "user" && "text-white"}`}
          onClick={() => setTab("user")}
        >
          {/* User Templates */}
          Community Drops
        </button>
      </div>
      {tab === "lenspost" && <LenspostTemplates />}
      {tab === "user" && <UserTemplates />}
    </div>
    // <TabsCustomAnimation/>
  );
};

const LenspostTemplates = () => {
  const { isAuthenticated } = useAppAuth();
  const store = useStore();
  const { address, isDisconnected } = useAccount();
  const [query, setQuery] = useState("");

  const [modal, setModal] = useState({
    isOpen: false,
    isTokengated: false,
    gatedWith: "",
    isNewDesign: false,
    json: null,
    referredFrom: [],
  });
  const {
    data,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["lenspost-templates"],
    getNextPageParam: (prevData) => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) => getAllTemplates(pageParam),
    enabled: isAuthenticated ? true : false,
  });

  useEffect(() => {
    if (!isAuthenticated) return;
    fnLoadMore(hasNextPage, fetchNextPage);
  }, [hasNextPage, fetchNextPage]);

  if (!isAuthenticated) {
    return <ConnectWalletMsgComponent />;
  }

  if (isError) {
    return <ErrorComponent message={error} />;
  }

  if (isLoading) {
    return <LoadingAnimatedComponent />;
  }

  return (
    <>
      {modal?.isOpen && modal?.isNewDesign && (
        <CompModal
          modal={modal}
          setModal={setModal}
          ModalTitle={"Are you sure to replace the canvas with this template?"}
          ModalMessage={"This will remove all the content from your canvas"}
          onClickFunction={() => {
            fnLoadJsonOnPage(store, modal?.json);
            setModal({
              isOpen: false,
              isTokengated: false,
              isNewDesign: false,
              json: null,
            });
          }}
        />
      )}
      <SearchComponent
        query={query}
        setQuery={setQuery}
        placeholder={"Search templates"}
      />

      <div className="h-full overflow-y-scroll">
        {/*  Featured Panels :  */}

        {/* Tabs for Desktop [ Original one ] : Start */}
        <div className="hidden sm:block">
          {/*  Featured Panels : Templates */}
          <SecNameHeading
            animationData={animationData}
            name={"Featured Backgrounds"}
            hasSeeMore
            seeMoreFn={() => store.openSidePanel("Backgrounds2")}
          />
          <CompCarousel
            type="background"
            author="kitty"
            campaign="kitty"
          />

          {/*  Featured Panels : Stickers */}
          <SecNameHeading
            animationData={animationData}
            name={"Featured Stickers"}
            hasSeeMore
            seeMoreFn={() => store.openSidePanel("Elements")}
          />
          <CustomHorizontalScroller type="props" author="ham" campaign={null} />

          <div className="ml-2 mt-4 mb-1 "> Lenspost Templates </div>

          {/* <div className=" overflow-y-scroll">  */}
          {data?.pages[0]?.data?.length > 0 ? (
            <>
              <div className="columns-2 gap-1">
                {data?.pages
                  .flatMap((item) => item?.data)
                  .map((item, index) => {
                    return (
                      <DesignCard
                        item={item}
                        id={item?.id}
                        referredFrom={item?.referredFrom}
                        isGated={item?.isGated}
                        gatedWith={item?.gatedWith}
                        json={item?.data}
                        ownerAddress={item?.ownerAddress}
                        preview={item?.image}
                        key={index}
                        modal={modal}
                        setModal={setModal}
                      />
                    );
                  })}
              </div>
              <LoadMoreComponent
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
              />
            </>
          ) : (
            <MessageComponent message="No Results" />
          )}
          {/* </div> */}
        </div>
        {/* Tabs for Desktop [ Original one ] : End */}

        {/* -------------- */}

        {/* Tabs for Mobile : Start */}
        {/* Reference Link: https://www.material-tailwind.com/docs/react/tabs */}

        <div className="sm:hidden">
          <Tabs id="custom-animation" value="featStickers">
            <div className="m-3 mt-0 mb-0">
              <TabsHeader>
                <Tab value={"featStickers"}>
                  {" "}
                  <div className="appFont text-xs">
                    {" "}
                    Featured <br /> Stickers{" "}
                  </div>{" "}
                </Tab>
                <Tab value={"featBackgrounds"}>
                  {" "}
                  <div className="appFont text-xs">
                    {" "}
                    Featured <br /> Backgrounds{" "}
                  </div>
                </Tab>
                <Tab value={"lpTemplates"}>
                  {" "}
                  <div className="appFont text-xs">
                    {" "}
                    Lenspost <br /> Templates{" "}
                  </div>{" "}
                </Tab>
                {/* ))} */}
              </TabsHeader>
            </div>
            <TabsBody
              animate={{
                initial: { y: 250 },
                mount: { y: 0 },
                unmount: { y: 250 },
              }}
            >
              <TabPanel value={"featStickers"}>
                <SecNameHeading
                  hasSeeMore
                  seeMoreFn={() => store.openSidePanel("Elements")}
                />
                <CustomHorizontalScroller type="stickers" />
              </TabPanel>
              <TabPanel value={"featBackgrounds"}>
                <SecNameHeading
                  hasSeeMore
                  seeMoreFn={() => store.openSidePanel("Backgrounds2")}
                />
                <CompCarousel type="background" />
              </TabPanel>
              <TabPanel value={"lpTemplates"}>
                <div className="h-64 overflow-y-scroll">
                  {data?.pages[0]?.data?.length > 0 ? (
                    <>
                      <div className="columns-2 gap-1">
                        {data?.pages
                          .flatMap((item) => item?.data)
                          .map((item, index) => {
                            return (
                              <DesignCard
                                item={item}
                                id={item?.id}
                                referredFrom={item?.referredFrom}
                                isGated={item?.isGated}
                                gatedWith={item?.gatedWith}
                                json={item?.data}
                                ownerAddress={item?.ownerAddress}
                                preview={item?.image}
                                key={index}
                                modal={modal}
                                setModal={setModal}
                              />
                            );
                          })}
                      </div>
                      <LoadMoreComponent
                        hasNextPage={hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                      />
                    </>
                  ) : (
                    <MessageComponent message="No Results" />
                  )}
                </div>
              </TabPanel>
            </TabsBody>
          </Tabs>
        </div>
        {/* Tabs for Mobile : End */}
      </div>
    </>
  );
};

const UserTemplates = () => {
  const { isAuthenticated } = useAppAuth();
  const store = useStore();
  const { referredFromRef, preStoredRecipientDataRef } = useContext(Context);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState({
    isOpen: false,
    isTokengated: false,
    gatedWith: "",
    isNewDesign: false,
    json: null,
  });
  const {
    data,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["community-pool"],
    getNextPageParam: (prevData) => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) => getUserPublicTemplates(pageParam),
    enabled: isAuthenticated ? true : false,
  });

  useEffect(() => {
    if (!isAuthenticated) return;
    fnLoadMore(hasNextPage, fetchNextPage);
  }, [hasNextPage, fetchNextPage]);

  if (!isAuthenticated) {
    return <ConnectWalletMsgComponent />;
  }

  if (isError) {
    return <ErrorComponent message={error} />;
  }

  if (isLoading) {
    return <LoadingAnimatedComponent />;
  }

  return (
    <>
      {/* Show Modal only if it's tokengated, i.e: `isTokengated` & `stOpenTokengatedModal` === true */}
      {modal?.isOpen && modal?.isTokengated && (
        <CompModal
          modal={modal}
          setModal={setModal}
          icon={"disable"}
          ModalTitle={"Access Restricted for this template"}
          ModalMessage={`
          This is a tokengated Template, Please collect this post or buy the NFT to get the access.
          `}
        />
      )}

      {modal?.isOpen && modal?.isNewDesign && (
        <CompModal
          modal={modal}
          setModal={setModal}
          ModalTitle={"Are you sure to replace the canvas with this template?"}
          ModalMessage={"This will remove all the content from your canvas"}
          onClickFunction={() => {
            fnLoadJsonOnPage(store, modal?.json);
            referredFromRef.current = modal?.referredFrom;
            preStoredRecipientDataRef.current = modal?.preStoredRecipientObj;
            setModal({
              ...modal,
              isOpen: false,
              isTokengated: false,
              isNewDesign: false,
              json: null,
            });
          }}
        />
      )}
      <SearchComponent
        query={query}
        setQuery={setQuery}
        placeholder={"Search templates"}
      />
      {/* New Design card start - 23Jun2023 */}
      {/* For reference : design - array name, design.id - Key, design.preview - Url  */}
      {/*   Pass these onto Line 25 */}
      {data?.pages[0]?.data?.length > 0 ? (
        <div className="h-full overflow-y-auto">
          <div className="columns-2 gap-1">
            {data?.pages
              .flatMap((item) => item?.data)
              .map((item) => {
                return (
                  <DesignCard
                    item={item}
                    id={item?.id}
                    referredFrom={item?.referredFrom}
                    isGated={item?.isGated}
                    gatedWith={item?.gatedWith}
                    json={item?.data}
                    ownerAddress={item?.ownerAddress}
                    assetsRecipientElementData={
                      item?.assetsRecipientElementData
                    }
                    preview={
                      item?.imageLink != null &&
                      item?.imageLink.length > 0 &&
                      item?.imageLink
                    }
                    key={item?.id}
                    tab="user"
                    modal={modal}
                    setModal={setModal}
                  />
                );
              })}
          </div>
          <LoadMoreComponent
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </div>
      ) : (
        <MessageComponent message="No Results" />
      )}

      {/* New Design card end - 23Jun2023 */}
    </>
  );
};

// define the new custom section
const TemplateSection = {
  name: "Templates",
  Tab: (props) => (
    <SectionTab name="Templates" {...props}>
      <MdcImageMultipleOutline size="16" />
    </SectionTab>
  ),
  // we need observer to update component automatically on any store changes
  Panel: TemplatePanel,
};

export default TemplateSection;
