import { useState } from "react";
import {
  EditorIconAIPanel,
  EditorIconDraw,
  EditorIconHelp,
  EditorIconLeftRotate,
  EditorIconNFTS,
  EditorIconPointer,
  EditorIconRightRotate,
  EditorIconShape,
  EditorIconTemplates,
  EditorIconTextCursor,
  EditorIconUpload,
} from "../editorIcons/EditorIcons";
import { getGoogleFontsListAPI, getGoogleFontImage } from "polotno/config";
import { useStore } from "../../../hooks/polotno/";
import {
  Popover,
  PopoverHandler,
  PopoverContent,
  Button,
  Input,
  Tooltip,
} from "@material-tailwind/react";
import { SearchComponent } from "../common";
import { TemplatePanel } from "../sections/left-section/template/TemplateSection";
import { NFTPanel } from "../sections/left-section/nft/NFTSection";
import useOpenedPanel from "./hooks/useOpenedPanel";
import { MemePanel } from "../sections/left-section/meme/MemeSection";
import { SpeedDialX } from "../common/elements/SpeedDial";
import { DesignPanel } from "../sections/left-section/design/DesignSection";
import { TextSection } from "polotno/side-panel";
import { AIImagePanel } from "../sections/left-section/image/AIImageSection";
import { Shapes } from "polotno/side-panel/elements-panel";
import { Shape } from "polotno/model/shape-model";
import { ShapePanel } from "../sections/left-section/shape/ShapeSection";
import { ResizePanel } from "../sections/left-section/resize/ResizeSection";

const BottomBar = () => {
  const store = useStore();
  const { openedPanel, setOpenedPanel } = useOpenedPanel();
  // returns an URL to api.polotno.com

  const url = getGoogleFontsListAPI();
  console.log(url);

  // when you fetch the list you can show preview of every font in the list
  // to get image path you can use this:
  return (
    <>
      <div className="flex justify-between p-2 items-center h-[88px] overflow-x-scroll">
        <Popover
          placement="top-end"
          offset={16}
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 1, y: 16 },
          }}
        >
          <div className="border border-[#D6D6D6] h-[72px] rounded-3xl bg-[#ffffff]">
            <div className="flex items-center align-middle gap-2 justify-between p-[8px]">
              <Tooltip content="Undo">
                <div
                  onClick={() => store.history.undo()}
                  className="hover:bg-[#F6F6F6] cursor-pointer border border-[#D6D6D6] selection:bg-[#DBCFFF] h-[56px] w-[56px] rounded-2xl flex items-center align-middle justify-center text-center "
                >
                  <EditorIconLeftRotate
                    width={40}
                    height={40}
                    // strokeColor={
                    //   openedPanel === "Memes" ? "#8D67FF" : "#323232"
                    // }
                    // fill={openedPanel === "Memes" ? "#8D67FF" : "#fff"}
                    strokeWidth={2}
                  />
                </div>
              </Tooltip>

              <Tooltip content="Redo">
                <div
                  onClick={() => store.history.redo()}
                  className="hover:bg-[#F6F6F6] cursor-pointer border border-[#D6D6D6] selection:bg-[#DBCFFF] h-[56px] w-[56px] rounded-2xl flex items-center align-middle justify-center text-center "
                >
                  <EditorIconRightRotate
                    width={40}
                    height={40}
                    // strokeColor={
                    //   openedPanel === "Memes" ? "#8D67FF" : "#323232"
                    // }
                    // fill={openedPanel === "Memes" ? "#8D67FF" : "#fff"}
                    strokeWidth={2}
                  />
                </div>
              </Tooltip>
            </div>
          </div>
          <div className="border border-[#D6D6D6] h-[72px] rounded-3xl flex items-center align-middle gap-2 justify-between p-[8px]  bg-[#ffffff]">
            <PopoverHandler onClick={() => setOpenedPanel("Memes")}>
              <div
                className={`hover:bg-[#F6F6F6] cursor-pointer selection:bg-[#DBCFFF] h-[56px] w-[56px] rounded-2xl flex items-center align-middle justify-center text-center ${
                  openedPanel === "Memes" ? "bg-[#DBCFFF]" : ""
                }`}
              >
                <EditorIconPointer
                  width={40}
                  height={40}
                  //  strokeColor={openedPanel === "Memes" ? "#8D67FF" : "#323232"}
                  fill={openedPanel === "Memes" ? "#8D67FF" : "#fff"}
                  strokeColor={openedPanel === "Memes" ? "#8D67FF" : "#323232"}
                />
              </div>
            </PopoverHandler>

            <PopoverHandler onClick={() => setOpenedPanel("Upload")}>
              <div
                className={`hover:bg-[#F6F6F6] cursor-pointer h-[56px] w-[56px] rounded-2xl flex items-center align-middle justify-center text-center ${
                  openedPanel === "Upload" ? "bg-[#FFB55F]" : ""
                }`}
              >
                <EditorIconUpload
                  width={40}
                  height={40}
                  strokeColor={openedPanel === "Upload" ? "#FFB55F" : "#323232"}
                  fill={openedPanel === "Upload" ? "#BF6906" : "#fff"}
                />
              </div>
            </PopoverHandler>

            <PopoverHandler onClick={() => setOpenedPanel("NFTs")}>
              <div
                className={`hover:bg-[#F6F6F6] cursor-pointer h-[56px] w-[56px] rounded-2xl flex items-center align-middle justify-center text-center ${
                  openedPanel === "NFTs" ? "bg-[#FEC4FF]" : ""
                }`}
              >
                <EditorIconNFTS
                  width={40}
                  height={40}
                  strokeColor={openedPanel === "NFTs" ? "#FEC4FF" : "#323232"}
                  fill={openedPanel === "NFTs" ? "#FC46FF" : "#fff"}
                />
              </div>
            </PopoverHandler>

            <PopoverHandler onClick={() => setOpenedPanel("Text")}>
              <div
                className={`hover:bg-[#F6F6F6] cursor-pointer h-[56px] w-[56px] rounded-2xl flex items-center align-middle justify-center text-center ${
                  openedPanel === "Text" ? "bg-[#D9FAFF]" : ""
                }`}
              >
                <EditorIconTextCursor
                  width={40}
                  height={40}
                  strokeColor={openedPanel === "Text" ? "#03CFEB" : "#323232"}
                  fill={openedPanel === "Text" ? "#03CFEB" : "#fff"}
                />
              </div>
            </PopoverHandler>

            <PopoverHandler onClick={() => setOpenedPanel("Templates")}>
              <div
                className={`hover:bg-[#F6F6F6] cursor-pointer h-[56px] w-[56px] rounded-2xl flex items-center align-middle justify-center text-center ${
                  openedPanel === "Templates" ? "bg-[#EDFEE6]" : ""
                }`}
              >
                <EditorIconTemplates
                  width={40}
                  height={40}
                  strokeColor={
                    openedPanel === "Templates" ? "#009F00" : "#323232"
                  }
                  fill={openedPanel === "Templates" ? "#009F00" : "#fff"}
                />
              </div>
            </PopoverHandler>

            <PopoverHandler onClick={() => setOpenedPanel("AI")}>
              <div
                className={`hover:bg-[#F6F6F6] cursor-pointer h-[56px] w-[56px] rounded-2xl flex items-center align-middle justify-center text-center ${
                  openedPanel === "AI" ? "bg-[#fed1493f]" : ""
                }`}
              >
                <EditorIconAIPanel
                  width={40}
                  height={40}
                  strokeColor={openedPanel === "AI" ? "#FED249" : "#323232"}
                  fill={openedPanel === "AI" ? "#FED249" : "#fff"}
                />
              </div>
            </PopoverHandler>

            <PopoverHandler onClick={() => setOpenedPanel("Sizes")}>
              <div
                className={`hover:bg-[#F6F6F6] cursor-pointer h-[56px] w-[56px] rounded-2xl flex items-center align-middle justify-center text-center ${
                  openedPanel === "Sizes" ? "bg-[#DBCFFF]" : ""
                }`}
              >
                <EditorIconDraw
                  width={40}
                  height={40}
                  strokeColor={openedPanel === "Sizes" ? "#8D67FF" : "#323232"}
                  fill={openedPanel === "Sizes" ? "#8D67FF" : "#fff"}
                />
              </div>
            </PopoverHandler>

            <PopoverHandler onClick={() => setOpenedPanel("Shapes")}>
              <div
                className={`hover:bg-[#F6F6F6] cursor-pointer h-[56px] w-[56px] rounded-2xl flex items-center align-middle justify-center text-center ${
                  openedPanel === "Shapes" ? "bg-[#DBCFFF]" : ""
                }`}
              >
                <EditorIconShape
                  width={40}
                  height={40}
                  strokeColor={openedPanel === "Shapes" ? "#8D67FF" : "#323232"}
                  fill={openedPanel === "Shapes" ? "#8D67FF" : "#fff"}
                />
              </div>
            </PopoverHandler>
          </div>

          {/* Panel Content - Start */}

          {/* The content that is displayed on the popover : 
          reactive based on the opened panel custom hook - useOpenedPanel */}
          <PopoverContent className="z-50  sm:w-[96vw] md:w-[32vw] h-[64vh] p-4 rounded-2xl">
            {openedPanel === "Memes" && <MemePanel />}
            {openedPanel === "Upload" && <DesignPanel />}
            {openedPanel === "NFTs" && <NFTPanel />}

            {/* The below method is used to extract the built in TextSection's Panel Component */}
            {openedPanel === "Text" && TextSection.Panel({ store })}
            {openedPanel === "Templates" && <TemplatePanel />}
            {openedPanel === "AI" && <AIImagePanel />}
            {openedPanel === "Sizes" && <ResizePanel />}
            {openedPanel === "Shapes" && <ShapePanel />}
          </PopoverContent>

          {/* Panel Content - End */}
        </Popover>

        {/* <div className="z-200border border-[#D6D6D6] h-[72px] rounded-3xl flex items-center align-middle gap-2 justify-between p-[8px]  bg-[#ffffff]">
          <div className="hover:bg-[#F6F6F6] cursor-pointer selection:bg-[#DBCFFF] h-[56px] w-[56px] rounded-2xl flex items-center align-middle justify-center text-center ">
            <EditorIconHelp width={40} height={40}  strokeColor={openedPanel === "Memes" ? "#8D67FF" : "#323232"}
                  fill={openedPanel === "Memes" ? "#8D67FF" : "#fff"} />
          </div>
        </div> */}

        <div className="m-2 p-4">
          <SpeedDialX />
        </div>
      </div>
    </>
  );
};

export default BottomBar;
