// Imports:
import React, { useEffect, useState } from "react";
import { SectionTab } from "polotno/side-panel";
import AiOutlineFire from "@meronex/icons/ai/AiOutlineFire";
import { Button, IconButton, Input } from "@material-tailwind/react";
import {
  apiGetAllMemes,
  apiSearchMemes,
} from "../../../../../services/apis/meme-apis/memeApi";
import {
  ConnectWalletMsgComponent,
  CustomImageComponent,
  ErrorComponent,
  LoadingAnimatedComponent,
  MessageComponent,
  SearchComponent,
} from "../../../common";
import BiSearch from "@meronex/icons/bi/BiSearch";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAppAuth } from "../../../../../hooks/app";

export const MemePanel = () => {
  const { isAuthenticated } = useAppAuth();
  const [query, setQuery] = useState("");

  const {
    data: memeData,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useQuery({
    queryKey: ["meme"],
    queryFn: apiGetAllMemes,
    enabled: isAuthenticated ? true : false,
  });

  const {
    data: mutateData,
    mutateAsync,
    isLoading: isMutating,
    isError: isMutatingError,
    error: mutateError,
  } = useMutation({
    mutationKey: "meme",
    mutationFn: apiSearchMemes,
  });

  const memes = memeData?.data?.memes || [];

  if (!isAuthenticated) {
    return <ConnectWalletMsgComponent />;
  }

  if (mutateData?.data?.memes?.length > 0) {
    return (
      <SearchMemes
        error={mutateError}
        isError={isMutatingError}
        isLoading={isMutating}
        memes={mutateData?.data?.memes || []}
        query={query}
        setQuery={setQuery}
        mutateAsync={mutateAsync}
      />
    );
  } else {
    return (
      <>
        <div className="h-full overflow-hidden">
          <div className="" id="stickerSearch">
            <SearchComponent
              query={query}
              setQuery={setQuery}
              placeholder="Search memes"
              funtion={() => mutateAsync(query)}
            />
          </div>
          {isLoading ? (
            <LoadingAnimatedComponent />
          ) : isError ? (
            <ErrorComponent message={error} />
          ) : memes?.length > 0 ? (
            <>
              <div className=" h-full overflow-auto">
                <div className="columns-2 gap-1">
                  {memes.map((item, index) => (
                    <CustomImageComponent
                      key={index}
                      item={item}
                      assetType="meme"
                      // collectionName={null}
                      preview={item?.url}
                      dimensions={item?.dimensions != null && item.dimensions}
                      // hasOptionBtn={null}
                      // onDelete={null}
                      // isLensCollect={null}
                      changeCanvasDimension={true}
                      // recipientWallet={item?.wallet}
                      // showAuthor={campaignName === "halloween" ? true : false}
                      // author={item?.author}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <MessageComponent message="No Results" />
          )}
        </div>
      </>
    );
  }
};

// define the new custom section
const MemeSection = {
  name: "Memes",
  Tab: (props) => (
    <SectionTab name={`Memes`} {...props}>
      <AiOutlineFire size={16} />
    </SectionTab>
  ),
  // we need observer to update component automatically on any store changes
  Panel: MemePanel,
};

export default MemeSection;

const SearchMemes = ({
  query,
  setQuery,
  isLoading,
  isError,
  error,
  memes,
  mutateAsync,
}) => {
  return (
    <>
      <div className="h-full overflow-hidden">
        <div className="" id="stickerSearch">
          <SearchComponent
            query={query}
            setQuery={setQuery}
            placeholder="Search icons"
            funtion={() => mutateAsync(query)}
          />
        </div>
        {isLoading ? (
          <LoadingAnimatedComponent />
        ) : isError ? (
          <ErrorComponent message={error} />
        ) : memes?.length > 0 ? (
          <>
            <div className=" h-full overflow-auto">
              <div className="columns-2 gap-1">
                {memes.map((item, index) => (
                  <CustomImageComponent
                    key={index}
                    item={item}
                    assetType="meme"
                    // collectionName={null}
                    preview={item?.url}
                    dimensions={item?.dimensions != null && item.dimensions}
                    // hasOptionBtn={null}
                    // onDelete={null}
                    // isLensCollect={null}
                    // changeCanvasDimension={changeCanvasDimension}
                    // recipientWallet={item?.wallet}
                    // showAuthor={campaignName === "halloween" ? true : false}
                    // author={item?.author}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <MessageComponent message="No Results" />
        )}
      </div>
    </>
  );
};
