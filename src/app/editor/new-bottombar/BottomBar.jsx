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

const BottomBar = () => {
  const store = useStore();
  // returns an URL to api.polotno.com

  const url = getGoogleFontsListAPI();
  console.log(url);

  // when you fetch the list you can show preview of every font in the list
  // to get image path you can use this:
  return (
    <>
      <div className="flex justify-between p-2 items-center h-[88px] overflow-x-scroll">
        <Popover
          placement="top-start"
          offset={16}
          animate={{
            mount: { scale: 1, y: 0, x: 0 },
            unmount: { scale: 0, y: 25 },
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
                    strokeColor="#323232"
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
                    strokeColor="#323232"
                    strokeWidth={2}
                  />
                </div>
              </Tooltip>
            </div>
          </div>
          <div className="border border-[#D6D6D6] h-[72px] rounded-3xl flex items-center align-middle gap-2 justify-between p-[8px]  bg-[#ffffff]">
            <PopoverHandler>
              <div className="hover:bg-[#F6F6F6] cursor-pointer selection:bg-[#DBCFFF] h-[56px] w-[56px] rounded-2xl flex items-center align-middle justify-center text-center ">
                <EditorIconPointer
                  width={40}
                  height={40}
                  strokeColor="#323232"
                />
              </div>
            </PopoverHandler>
            <div
              onClick={() => {
                store.toggleRulers();
              }}
              className="hover:bg-[#F6F6F6] cursor-pointer h-[56px] w-[56px] rounded-2xl flex items-center align-middle justify-center text-center"
            >
              <EditorIconUpload width={40} height={40} strokeColor="#323232" />
            </div>

            <div className="hover:bg-[#F6F6F6] cursor-pointer h-[56px] w-[56px] rounded-2xl flex items-center align-middle justify-center text-center">
              <EditorIconNFTS width={40} height={40} strokeColor="#323232" />
            </div>

            <div className="hover:bg-[#F6F6F6] cursor-pointer h-[56px] w-[56px] rounded-2xl flex items-center align-middle justify-center text-center">
              <EditorIconTextCursor
                width={40}
                height={40}
                strokeColor="#323232"
              />
            </div>

            <div className="hover:bg-[#F6F6F6] cursor-pointer h-[56px] w-[56px] rounded-2xl flex items-center align-middle justify-center text-center">
              <EditorIconTemplates
                width={40}
                height={40}
                strokeColor="#323232"
              />
            </div>

            <div className="hover:bg-[#F6F6F6] cursor-pointer h-[56px] w-[56px] rounded-2xl flex items-center align-middle justify-center text-center">
              <EditorIconAIPanel width={40} height={40} strokeColor="#323232" />
            </div>

            <div className="hover:bg-[#F6F6F6] cursor-pointer h-[56px] w-[56px] rounded-2xl flex items-center align-middle justify-center text-center">
              <EditorIconDraw width={40} height={40} strokeColor="#323232" />
            </div>

            <div className="hover:bg-[#F6F6F6] cursor-pointer h-[56px] w-[56px] rounded-2xl flex items-center align-middle justify-center text-center">
              <EditorIconShape width={40} height={40} strokeColor="#323232" />
            </div>
          </div>{" "}
          {/* Section Contents
        <img
          width={64}
          height={64}
          alt="Roboto"
          src={getGoogleFontImage("Roboto")}
        /> */}
          <PopoverContent className="sm:w-[96vw] md:w-[32vw] h-[64vh] p-4 rounded-2xl">
            {/* <Input
              shrink={true}
              color="[#e1f16b]"
              size="md"
              variant="standard"
              label="Search"
              placeholder="Search Icons, NFTs, Templates and more"
            /> */}

            <TemplatePanel />
          </PopoverContent>
        </Popover>
        <div className="border border-[#D6D6D6] h-[72px] rounded-3xl flex items-center align-middle gap-2 justify-between p-[8px]  bg-[#ffffff]">
          <div className="hover:bg-[#F6F6F6] cursor-pointer selection:bg-[#DBCFFF] h-[56px] w-[56px] rounded-2xl flex items-center align-middle justify-center text-center ">
            <EditorIconHelp width={40} height={40} strokeColor="#323232" />
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomBar;
