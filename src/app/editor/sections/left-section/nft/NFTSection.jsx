import { ImagesGrid, SectionTab } from "polotno/side-panel";
import { NFTIcon } from "../../../../../assets/assets";
import { observer } from "mobx-react-lite";
import { useState, useEffect, useRef } from "react";
import { Button, Spinner } from "@blueprintjs/core";

import {
  getAllCollection,
  getNFTs,
  getNftById,
  getNftByCollection,
  getCollectionNftById,
  refreshNFT,
} from "../../../../../services";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import {
  ConnectWalletMsgComponent,
  CustomImageComponent,
  ErrorComponent,
  LoadMoreComponent,
  MessageComponent,
  SearchComponent,
  NFTReacTour,
  TabsWithArrows,
} from "../../../common";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fnLoadMore,
  errorMessage,
  replaceImageURL,
  firstLetterCapital,
  getFromLocalStorage,
} from "../../../../../utils";
import { lensCollect } from "./utils";
import { LoadingAnimatedComponent } from "../../../common";
import { useAppAuth } from "../../../../../hooks/app";
import {
  Tab,
  Tabs,
  TabsHeader,
  TabsBody,
  Typography,
} from "@material-tailwind/react";
import { LOCAL_STORAGE } from "../../../../../data";
import { EVMWallets, SolanaWallets } from "../../top-section/auth/wallets";

export const NFTPanel = () => {
  const [tab, setTab] = useState("wallet");
  const { isConnected } = useAccount();
  return (
    <div className="h-full flex flex-col">
      {/* <h1 className="text-lg">NFT</h1> */}
      <div className="flex items-center justify-center space-x-2 my-4">
        <button
          className={`w-1/2 border border-black px-2 py-1 rounded-md ${
            tab === "wallet" && "bg-[#1B1A1D]"
            // tab === "wallet" && "bg-[#ecf6a1]" //Brand Colors
          } ${tab === "wallet" && "text-white"}`}
          // } ${tab === "wallet" && "text-black"}`} //Brand Colors
          onClick={() => setTab("wallet")}
          id="walletNFTS"
        >
          My Wallet NFTs
        </button>

        <button
          className={`w-1/2 border px-2 py-1 border-black rounded-md ${
            tab === "lenspost" && "bg-[#1B1A1D]"
            // tab === "lenspost" && "bg-[#ecf6a1]" //Brand Colors
          } ${tab === "lenspost" && "text-white"}`}
          // } ${tab === "lenspost" && "text-black-100"}`} //Brand Colors
          onClick={() => setTab("lenspost")}
          id="cc0collections"
        >
          CC<span className="text-base">0</span> Collections
        </button>
      </div>

      {tab === "wallet" && <WalletNFT />}
      {tab === "lenspost" && <LenspostNFT />}
    </div>
  );
};

// define the new custom section
const NFTSection = {
  name: "NFT",
  Tab: (props) => (
    <SectionTab name="NFT" {...props}>
      <NFTIcon />
    </SectionTab>
  ),
  // we need observer to update component automatically on any store changes
  Panel: NFTPanel,
};

export default NFTSection;

// catogoery component (child component of LenspostNFT component)
const RenderCategories = ({ contractAddressRef, setActiveCat, searchId }) => {
  const { isAuthenticated } = useAppAuth();
  const { address, isDisconnected } = useAccount();
  const [query, setQuery] = useState("");
  const {
    data,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["lenspost-nft-collections"],
    getNextPageParam: (prevData) => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) => getAllCollection(pageParam),
    enabled: isAuthenticated ? true : false,
  });

  // run fetchNextPage() function when scroll to bottom
  useEffect(() => {
    if (!isAuthenticated) return;
    fnLoadMore(hasNextPage, fetchNextPage);
  }, [hasNextPage, fetchNextPage]);

  if (isLoading) {
    return <LoadingAnimatedComponent />;
  }

  return (
    <>
      <SearchComponent
        query={query}
        setQuery={setQuery}
        placeholder="Search collections"
      />
      {isError ? (
        <ErrorComponent error={error} />
      ) : data?.pages[0]?.data.length > 0 ? (
        <>
          {data?.pages
            .flatMap((item) => item?.data)
            .map((item, index) => (
              <div className="" key={index}>
                <div
                  className="flex items-center space-x-4 p-2 mb-4 cursor-pointer"
                  onClick={() => {
                    contractAddressRef.current = item.address;
                    setActiveCat(item.name);
                  }}
                >
                  <img
                    src={replaceImageURL(item.image)}
                    alt={item.name}
                    className="h-24 w-24 rounded-md"
                  />
                  <p className="text-lg font-normal">
                    {firstLetterCapital(item.name)}
                  </p>
                </div>
              </div>
            ))}
          <LoadMoreComponent
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </>
      ) : (
        <MessageComponent message="No Results" />
      )}
    </>
  );
};

// nft component (child component of LenspostNFT component)
const RenderImages = ({ contractAddressRef, setActiveCat, activeCat }) => {
  const { isAuthenticated } = useAppAuth();
  const [query, setQuery] = useState("");
  const [delayedQuery, setDelayedQuery] = useState(query);
  const requestTimeout = useRef();
  const { address, isDisconnected } = useAccount();

  const {
    data,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["lenspost-nft-collections", contractAddressRef.current],
    getNextPageParam: (prevData) => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) =>
      getNftByCollection(contractAddressRef.current, pageParam),
    enabled: isAuthenticated ? true : false,
  });

  useEffect(() => {
    requestTimeout.current = setTimeout(() => {
      setDelayedQuery(query);
    }, 500);
    return () => {
      clearTimeout(requestTimeout.current);
    };
  }, [query]);

  function goBack() {
    setActiveCat(null);
  }

  // run fetchNextPage() function when scroll to bottom
  useEffect(() => {
    if (isDisconnected || !address) return;
    fnLoadMore(hasNextPage, fetchNextPage);
  }, [hasNextPage, fetchNextPage]);

  if (isLoading) {
    return <LoadingAnimatedComponent />;
  }

  return delayedQuery ? (
    <RenderSearchedNFTs
      activeCat={activeCat}
      contractAddress={contractAddressRef.current}
      goBack={goBack}
      delayedQuery={delayedQuery}
    />
  ) : (
    <>
      <SearchComponent
        query={query}
        setQuery={setQuery}
        placeholder="Search NFTs by id"
      />
      <div className="h-88">
        <div className="flex flex-row align-middle w-full bg-[#fff] sticky top-0 z-10">
          <Button
            className="mb-4 ml-1"
            icon="arrow-left"
            onClick={() => {
              goBack();
            }}
          ></Button>
          <h1 className="ml-4 align-middle text-lg font-bold">
            {firstLetterCapital(activeCat)}
          </h1>
        </div>
        {isError ? (
          <ErrorComponent error={error} />
        ) : data?.pages[0]?.data?.length > 0 ? (
          //  {/* CustomImage - LazyLoaded component - Definition for this is given above  */}
          <div className="h-full overflow-y-auto">
            <div className="columns-2 gap-1">
              {data?.pages
                .flatMap((item) => item?.data)
                .map((item, index) => {
                  return (
                    <CustomImageComponent
                      key={index}
                      item={item}
                      assetType="cc0"
                      collectionName={activeCat}
                      preview={item?.imageURL}
                      dimensions={null}
                      hasOptionBtn={null}
                      onDelete={null}
                      isLensCollect={null}
                      changeCanvasDimension={null}
                      recipientWallet={null}
                      showAuthor={null}
                      author={null}
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
      </div>
    </>
  );
};

// searched NFTs (child component of LenspostNFT component)
const RenderSearchedNFTs = ({
  contractAddress,
  activeCat,
  goBack,
  delayedQuery,
}) => {
  const { isAuthenticated } = useAppAuth();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      "lenspost-nft-collections",
      contractAddress,
      { tokenID: delayedQuery },
    ],
    queryFn: () => getCollectionNftById(delayedQuery, contractAddress),
    enabled: isAuthenticated ? true : false,
  });

  if (isLoading) {
    return <LoadingAnimatedComponent />;
  }

  return (
    <>
      {/* <SearchComponent query={query} setQuery={setQuery} /> */}
      <div className="h-88">
        <div className="flex flex-row align-middle w-full bg-[#fff] sticky top-0 z-10">
          <Button
            className="mb-4 ml-1"
            icon="arrow-left"
            onClick={() => {
              goBack();
            }}
          ></Button>
          <h1 className="ml-4 align-middle text-lg font-bold">
            {firstLetterCapital(activeCat)}
          </h1>
        </div>
        {isError ? (
          <ErrorComponent error={error} />
        ) : data ? (
          //  {/* CustomImage - LazyLoaded component - Definition for this is given above  */}
          <div className="h-full overflow-y-auto">
            <div className="grid grid-cols-2 overflow-y-auto">
              <CustomImageComponent
                item={data}
                assetType="cc0"
                collectionName={activeCat}
                preview={data?.imageURL}
                dimensions={null}
                hasOptionBtn={null}
                onDelete={null}
                isLensCollect={null}
                changeCanvasDimension={null}
                recipientWallet={null}
                showAuthor={null}
                author={null}
              />
            </div>
          </div>
        ) : (
          <MessageComponent message="No Results" />
        )}
      </div>
    </>
  );
};

const LenspostNFT = () => {
  const { isAuthenticated } = useAppAuth();
  const [activeCat, setActiveCat] = useState("");
  const { address, isDisconnected, isConnected } = useAccount();
  const contractAddressRef = useRef(null);

  if (!isAuthenticated) {
    return <ConnectWalletMsgComponent />;
  }

  return (
    <>
      <div className="overflow-y-auto overflow-x-hidden">
        {!activeCat ? (
          <RenderCategories
            contractAddressRef={contractAddressRef}
            setActiveCat={setActiveCat}
          />
        ) : (
          <RenderImages
            activeCat={activeCat}
            contractAddressRef={contractAddressRef}
            setActiveCat={setActiveCat}
          />
        )}
      </div>
    </>
  );
};

// searched nft component (child component of WalletNFT component)
const RenderSearchedWalletNFT = ({ goBack, delayedQuery }) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userNFTs", { tokenID: delayedQuery }],
    queryFn: () => getNftById(delayedQuery),
  });

  if (isLoading) {
    return <LoadingAnimatedComponent />;
  }

  return (
    <>
      {/* <SearchComponent query={query} setQuery={setQuery} /> */}
      <div className="h-88">
        <div className="flex flex-row align-middle w-full bg-[#fff] sticky top-0 z-10">
          <Button
            className="mb-4 ml-1"
            icon="arrow-left"
            onClick={() => {
              goBack();
            }}
          ></Button>
        </div>
        {isError ? (
          <ErrorComponent error={error} />
        ) : data ? (
          //  {/* CustomImage - LazyLoaded component - Definition for this is given above  */}
          <div className="h-full overflow-y-auto">
            <div className="grid grid-cols-2 overflow-y-auto">
              <CustomImageComponent
                item={data}
                assetType="cc0"
                collectionName={activeCat}
                preview={data?.imageURL}
                dimensions={null}
                hasOptionBtn={null}
                onDelete={null}
                isLensCollect={null}
                changeCanvasDimension={null}
                recipientWallet={null}
                showAuthor={null}
                author={null}
              />
            </div>
          </div>
        ) : (
          <MessageComponent message="No Results" />
        )}
      </div>
    </>
  );
};

const WalletNFT = () => {
  const { isAuthenticated } = useAppAuth();
  const { isDisconnected, address } = useAccount();
  const [query, setQuery] = useState("");
  const [delayedQuery, setDelayedQuery] = useState(query);
  const requestTimeout = useRef();
  const [currentTab, setCurrentTab] = useState("polygon");
  const tabsArray = ["polygon", "ethereum", "zora", "base", "OP", "solana"];
  const getSolanaAuth = getFromLocalStorage(LOCAL_STORAGE.solanaAuth);
  const getEVMAuth = getFromLocalStorage(LOCAL_STORAGE.evmAuth);

  const isSolana = "solana";
  const isEVM = "ethereum" || "polygon" || "zora";

  const chainNamrToID = {
    ethereum: 1,
    polygon: 137,
    solana: 2,
    zora: 7777777,
    base: 8453,
    OP: 10,
  };

  const getChainId = () => {
    return chainNamrToID[currentTab];
  };

  const queryClient = useQueryClient();
  const {
    data,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["userNFTs", delayedQuery || currentTab || "userNFTs"],
    getNextPageParam: (prevData) => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) =>
      getNFTs(delayedQuery || "", pageParam, getChainId()),
    enabled: isAuthenticated ? true : false,
  });

  const { mutateAsync } = useMutation({
    mutationKey: "refreshNFT",
    mutationFn: refreshNFT,
    onSuccess: () => {
      queryClient.invalidateQueries(["userNFTs"], { exact: true });
    },
  });

  useEffect(() => {
    requestTimeout.current = setTimeout(() => {
      setDelayedQuery(query);
    }, 500);
    return () => {
      clearTimeout(requestTimeout.current);
    };
  }, [query]);

  const refreshNFTs = () => {
    const id = toast.loading(
      "Hang on, While we fetch your NFTs, check out some cool stickers from the menu."
    );
    mutateAsync()
      .then((res) => {
        toast.update(id, {
          render: res?.data,
          type: "success",
          isLoading: false,
          autoClose: 3000,
          closeButton: true,
        });
      })
      .catch((err) => {
        toast.update(id, {
          render: errorMessage(err),
          type: "error",
          isLoading: false,
          autoClose: 3000,
          closeButton: true,
        });
      });
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    fnLoadMore(hasNextPage, fetchNextPage);
  }, [hasNextPage, fetchNextPage]);

  useEffect(() => {
    refetch();
  }, [currentTab]);

  const goBack = () => {
    setDelayedQuery("");
    setQuery("");
  };

  if (!isAuthenticated) {
    return <ConnectWalletMsgComponent />;
  }

  if (isLoading) {
    return <LoadingAnimatedComponent />;
  }

  return (
    <>
      <SearchComponent
        query={query}
        setQuery={setQuery}
        placeholder="Search NFTs by id"
        onClick={refreshNFTs}
      />
      <Tabs
        className="overflow-y-auto"
        id="custom-animation"
        value={currentTab}
      >
        <TabsWithArrows
          tabsHeaders={
            <>
              <TabsHeader className="overflow-x-auto gap-3">
                {tabsArray.map((tab, index) => (
                  <Tab
                    key={index}
                    value={tab}
                    onClick={() => setCurrentTab(tab)}
                  >
                    <div className="appFont">{firstLetterCapital(tab)}</div>
                  </Tab>
                ))}
              </TabsHeader>
            </>
          }
        />
        {/* Render Tabs body in Here or in TabPanel */}
        <TabsBody>
          <div className="mt-3">
            {isError ? (
              <ErrorComponent error={error} />
            ) : data?.pages[0]?.data?.length > 0 ? (
              //  {/* CustomImage - LazyLoaded component - Definition for this is given above  */}
              <>
                <div className="columns-2 gap-1">
                  {data?.pages
                    .flatMap((item) => item?.data)
                    .map((item, index) => {
                      return (
                        <CustomImageComponent
                          key={index}
                          item={item}
                          assetType="nft"
                          collectionName={null}
                          preview={item?.imageURL || item?.permaLink}
                          dimensions={null}
                          hasOptionBtn={null}
                          onDelete={null}
                          isLensCollect={lensCollect(
                            item?.title,
                            item?.id,
                            item
                          )}
                          changeCanvasDimension={null}
                          recipientWallet={null}
                          showAuthor={null}
                          author={null}
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
              <>
                <MessageComponent message="No Results" />
                {currentTab === "solana" && !getSolanaAuth ? (
                  <>
                    <Typography color="blueGray" className="text-center my-3">
                      Or connect the Solana Wallet to see your NFTs
                    </Typography>
                    <div className=" flex justify-center">
                      <SolanaWallets title="Solana" />
                    </div>
                  </>
                ) : (currentTab === "ethereum" ||
                    currentTab === "polygon" ||
                    currentTab === "zora") &&
                  !getEVMAuth ? (
                  <>
                    <Typography color="blueGray" className="text-center my-3">
                      Or connect the EVM Wallet to see your NFTs
                    </Typography>
                    <div className=" flex justify-center">
                      <EVMWallets title="EVM" />
                    </div>
                  </>
                ) : null}
              </>
            )}
          </div>
        </TabsBody>
      </Tabs>
    </>
  );
};
