import React, { useState, useContext } from "react";
import {
  Button,
  Position,
  Menu,
  HTMLSelect,
  Slider,
  ProgressBar,
} from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import * as unit from "polotno/utils/unit";
import { ExportIcon } from "../../../../../assets/assets";
import { useStore } from "../../../../../hooks/polotno";
import posthog from "posthog-js";
import { Context } from "../../../../../providers/context";
import { downloadFile } from "polotno/utils/download";
import { POLOTNO_API_KEY } from "../../../../../services";

const DownloadBtn = () => {
  const store = useStore();
  const [saving, setSaving] = useState(false);
  const [quality, setQuality] = useState(1);
  const [type, setType] = useState("png");
  const [fps, setFPS] = useState(10);
  const { contextCanvasIdRef } = useContext(Context);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState("");

  const getName = () => {
    const texts = [];
    store.pages.forEach((p) => {
      p.children.forEach((c) => {
        if (c.type === "text") {
          texts.push(c.text);
        }
      });
    });
    const allWords = texts.join(" ").split(" ");
    const words = allWords.slice(0, 6);
    return "lenspost" || words.join(" ").replace(/\s/g, "-").toLowerCase();
    // return "lenspost";
  };

  const captureEvent = () => {
    posthog.capture("downloaded design", {
      canvas_id: contextCanvasIdRef.current,
      fileType: type,
      quality,
      fps,
    });
  };

  const saveAsVideo = async ({ store, pixelRatio, fps, onProgress }) => {
    const json = store.toJSON();
    const req = await fetch(
      `https://api.polotno.dev/api/renders?KEY=${POLOTNO_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          design: json,
          pixelRatio,
          format: "mp4",
        }),
      }
    );
    const job = await req.json();
    while (true) {
      const jobReq = await fetch(
        `https://api.polotno.dev/api/renders/${job.id}?KEY=${POLOTNO_API_KEY}`
      );
      const jobData = await jobReq.json();
      if (jobData.status === "done") {
        downloadFile(jobData.output, "posterdotfun.mp4");
        break;
      } else if (jobData.status === "error") {
        throw new Error("Failed to render video");
      } else {
        onProgress(jobData.progress, jobData.status);
      }
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  };

  return (
    <Popover2
      content={
        <Menu className="p-4 border border-gray-300 shadow-2xl">
          <li class="bp4-menu-header">
            <h6 class="bp4-heading mb-2">File type</h6>
          </li>
          <HTMLSelect
            fill
            onChange={(e) => {
              setType(e.target.value);
              setQuality(1);
            }}
            value={type}
          >
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
            <option value="pdf">PDF</option>
            <option value="gif">GIF</option>
            <option value="mp4">MP4 Video (Beta)</option>
          </HTMLSelect>

          <>
            <li class="bp4-menu-header mt-4">
              <h6 class="bp4-heading">Size</h6>
            </li>
            <div style={{ padding: "10px" }}>
              <Slider
                value={quality}
                labelRenderer={false}
                // labelStepSize={0.4}
                onChange={(quality) => {
                  setQuality(quality);
                }}
                stepSize={0.2}
                min={0.2}
                max={3}
                showTrackFill={false}
              />

              {type === "pdf" && (
                <div>
                  {unit.pxToUnitRounded({
                    px: store.width,
                    dpi: store.dpi / quality,
                    precious: 0,
                    unit: "mm",
                  })}{" "}
                  x{" "}
                  {unit.pxToUnitRounded({
                    px: store.height,
                    dpi: store.dpi / quality,
                    precious: 0,
                    unit: "mm",
                  })}{" "}
                  mm
                </div>
              )}
              {type !== "pdf" && (
                <div>
                  {Math.round(store.width * quality)} x{" "}
                  {Math.round(store.height * quality)} px
                </div>
              )}
              {type === "gif" && (
                <>
                  <li class="bp4-menu-header">
                    <h6 class="bp4-heading">FPS</h6>
                  </li>
                  <div style={{ padding: "10px" }}>
                    <Slider
                      value={fps}
                      // labelRenderer={false}
                      labelStepSize={5}
                      onChange={(fps) => {
                        setFPS(fps);
                      }}
                      stepSize={1}
                      min={5}
                      max={30}
                      showTrackFill={false}
                    />
                  </div>
                </>
              )}
              {type === "mp4" && (
                <>
                  {saving && (
                    <div
                      style={{
                        padding: "10px",
                        maxWidth: "180px",
                        opacity: 0.8,
                      }}
                    >
                      <ProgressBar value={Math.max(3, progress) / 100} />
                    </div>
                  )}
                </>
              )}
            </div>
          </>

          <Button
            fill
            intent="primary"
            loading={saving}
            onClick={async () => {
              if (type === "pdf") {
                setSaving(true);
                await store.saveAsPDF({
                  fileName: getName() + ".pdf",
                  dpi: store.dpi / quality,
                  pixelRatio: 2 * quality,
                });
                setSaving(false);
              } else if (type === "html") {
                setSaving(true);
                await store.saveAsHTML({
                  fileName: getName() + ".html",
                });
                setSaving(false);
              } else if (type === "gif") {
                setSaving(true);
                await store.saveAsGIF({
                  //   fileName: getName() + ".gif",
                  fileName: "lenspost" + ".gif",
                  pixelRatio: quality,
                  fps,
                });
                setSaving(false);
              } else if (type === "mp4") {
                setSaving(true);
                setProgressStatus("scheduled");
                await saveAsVideo({
                  store,
                  pixelRatio: quality,
                  onProgress: (progress, status) => {
                    setProgress(progress);
                    setProgressStatus(status);
                  },
                });
                setProgressStatus("done");
                setProgress(0);
                setSaving(false);
              } else {
                store.pages.forEach((page, index) => {
                  // do not add index if we have just one page
                  const indexString =
                    store.pages.length > 1 ? "-" + (index + 1) : "";
                  store.saveAsImage({
                    pageId: page.id,
                    pixelRatio: quality,
                    mimeType: "image/" + type,
                    fileName: getName() + indexString + "." + type,
                  });
                });
              }

              captureEvent();
            }}
          >
            Download {type.toUpperCase()}
          </Button>
        </Menu>
      }
      position={Position.BOTTOM_RIGHT}
    >
      <ExportIcon
        className="inline-flex w-full justify-center border-none px-4 py-2 text-sm font-medium "
        loading={saving}
        onClick={() => {
          setQuality(1);
        }}
      />
    </Popover2>
  );
};

export default DownloadBtn;
