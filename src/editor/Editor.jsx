import React, { useEffect, useRef, useState } from "react";
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from "polotno";
import { Toolbar } from "polotno/toolbar/toolbar";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import {
  SidePanel,
  DEFAULT_SECTIONS,
  // TemplatesSection,
  TextSection,
  BackgroundSection,
  UploadSection,
  LayersSection,
} from "polotno/side-panel";
import { Workspace } from "polotno/canvas/workspace";
import { loadFile } from "./file";
import { CustomSizesPanel } from "./sections/resize-section";
import { IconsSection } from "./sections/icons-section";
import { NFTSection } from "./sections/nft-section";
import { StableDiffusionSection } from "./sections/stable-diffusion-section";
import { MyDesignsSection } from "./sections/my-designs-section";
import { useProject } from "./project";

import Topbar from "./topbar/topbar";

import { TemplatesSection } from "./sections/templates-section";
import { useAccount } from "wagmi";
import {
  createCanvas,
  deleteCanvasById,
  getCanvasById,
  updateCanvas,
} from "../services/backendApi";

const sections = [
  TemplatesSection,
  NFTSection,
  TextSection,
  MyDesignsSection,
  IconsSection,
  BackgroundSection,
  UploadSection,
  LayersSection,
  CustomSizesPanel,
  StableDiffusionSection,
];

const useHeight = () => {
  const [height, setHeight] = React.useState(window.innerHeight);
  React.useEffect(() => {
    window.addEventListener("resize", () => {
      setHeight(window.innerHeight);
    });
  }, []);
  return height;
};

const Editor = ({ store, isLoading, text }) => {
  const project = useProject();
  const height = useHeight();
  const { address } = useAccount();
  const [canvasId, setCanvasId] = useState();
  const canvasIdRef = useRef(null);

  const load = () => {
    let url = new URL(window.location.href);
    // url example https://studio.polotno.com/design/5f9f1b0b
    const reg = new RegExp("design/([a-zA-Z0-9_-]+)").exec(url.pathname);
    const designId = (reg && reg[1]) || "local";
    project.loadById(designId);
  };

  const handleDrop = (ev) => {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    // skip the case if we dropped DOM element from side panel
    // in that case Safari will have more data in "items"
    if (ev.dataTransfer.files.length !== ev.dataTransfer.items.length) {
      return;
    }
    // Use DataTransfer interface to access the file(s)
    for (let i = 0; i < ev.dataTransfer.files.length; i++) {
      loadFile(ev.dataTransfer.files[i], store);
    }
  };

  useEffect(() => {
    if (!address) return;

    const fetchData = async () => {
      // Place the async logic here
      const storeData = store.toJSON();
      const canvasChildren = storeData.pages[0].children;

      // console.log("children", canvasChildren.length)
      // return
      if (canvasChildren.length === 0) {
        canvasIdRef.current = null;
      }

      if (canvasChildren.length > 0) {
        if (!canvasIdRef.current) {
          const res = await createCanvas(storeData, "hello", false, address);
          canvasIdRef.current = res.canvasId;
          // setCanvasId(res.canvasId);
          console.log("create canvas", res.canvasId);
        }

        if (canvasIdRef.current) {
          const res = await updateCanvas(
            canvasIdRef.current,
            storeData,
            "hello",
            false,
            address
          );
          console.log("update canvas", res);
        }
      }
    };

    const interval = setInterval(fetchData, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [address]);

  return (
    <>
      {isLoading && (
        // <div className="absolute w-full h-full z-40 bg-black opacity-30 flex items-center justify-center">
        //   {/* create a box to show loading */}
        //   <div className="flex flex-col justify-center items-center gap-5">
        //     <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
        //     <h1 className="font-bold text-2xl text-white">{text}</h1>
        //   </div>

        // </div>
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-40">
          <div className="w-max h-max px-8 py-8 bg-white rounded-lg flex flex-col gap-5 items-center justify-center shadow-xl">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black"></div>
            <h1 className="font-bold text-2xl text-black">{text}</h1>
          </div>
        </div>
      )}
      <div
        style={{
          width: "100vw",
          height: height + "px",
          display: "flex",
          flexDirection: "column",
        }}
        onDrop={handleDrop}
      >
        <div style={{ height: "calc(100% - 75px)" }}>
          <Topbar store={store} />
          <PolotnoContainer>
            <SidePanelWrap>
              <SidePanel store={store} sections={sections} />
            </SidePanelWrap>
            <WorkspaceWrap>
              <Toolbar store={store} />
              <Workspace store={store} />
              <ZoomButtons store={store} />
            </WorkspaceWrap>
          </PolotnoContainer>
        </div>
      </div>
    </>
  );
};

export default Editor;
