// --------
// Speed Dial - Clear Canvas, Resize, etc.. Utility Functions
// Bottom Bar
// --------

import {
  IconButton,
  SpeedDial,
  SpeedDialHandler,
  SpeedDialContent,
  SpeedDialAction,
  Typography,
} from "@material-tailwind/react";
import SuCreate from "@meronex/icons/su/SuCreate";
import SuChevronUp from "@meronex/icons/su/SuChevronUp";
import SuCapture from "@meronex/icons/su/SuCapture";
import SuReplicate from "@meronex/icons/su/SuReplicate";
import { fnPageHasElements } from "../../../../utils";
import { useStore } from "../../../../hooks/polotno";
import { useReset } from "../../../../hooks/app";
import { toast } from "react-toastify";
import { BgRemover } from "../../sections/bottom-section";

export function SpeedDialX() {
  const store = useStore();
  const { resetState } = useReset();

  const labelProps = {
    variant: "small",
    color: "blue-gray",
    className:
      "text-sm absolute top-2/4 -left-2/4 -translate-y-2/4 -translate-x-3/4 appFont font-weight-500",
  };

  const clearAllData = () => {
    // clear all the variables
    resetState();
    toast.success("Cleared successfully");
  };

  return (
    <div className="relative h-10 mb-1">
      <div className="md: absolute bottom-0 right-0">
        <SpeedDial>
          <SpeedDialHandler>
            <IconButton size="sm" className="rounded-full bg-white">
              <SuChevronUp className="h-5 w-5 transition-transform group-hover:rotate-90" />
            </IconButton>
          </SpeedDialHandler>

          {/* Content */}
          <SpeedDialContent>
            <div className="">
              <SpeedDialAction className="relative">
                <BgRemover inSpeedDial={true} />
                <Typography {...labelProps}>{`Remove BG`}</Typography>
              </SpeedDialAction>
            </div>

            <div className="" onClick={() => store.setSize(1080, 1080)}>
              <SpeedDialAction className="relative">
                <SuCapture className="h-5 w-5" />
                <Typography {...labelProps}>{`Resize`}</Typography>
              </SpeedDialAction>
            </div>

            <div className="" onClick={() => clearAllData()}>
              <SpeedDialAction className="relative">
                <SuCreate className="h-5 w-5" />
                <Typography {...labelProps}>{`Clear`}</Typography>
              </SpeedDialAction>
            </div>
          </SpeedDialContent>
        </SpeedDial>
      </div>
    </div>
  );
}
