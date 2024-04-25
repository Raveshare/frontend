import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  IconButton,
  Spinner,
  Checkbox,
} from "@material-tailwind/react";
import { LOCAL_STORAGE } from "../../../../data";
import { BraveLogo } from "../../../../assets";

const UpdateAvailable = () => {
  const [open, setOpen] = useState(true);

  const handleOpen = () => setOpen(!open);

  const handleUpdateClick = () => {
    window.location.reload();
  };

  return (
    <>
      <Dialog
        size="sm"
        open={open}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        className="outline-none"
      >
        <DialogHeader className="gap-2 border-b border-gray-300">
          <img
            src="/OGlogo.png"
            alt="brave logo"
            className="h-10 w-10 rounded-lg"
          />
          <Typography variant="h5" color="blue-gray">
            Update Available
          </Typography>
        </DialogHeader>
        <DialogBody>
          <Typography variant="h6" color="blue-gray">
            A new version of Poster is available. Please refresh the page to get
            the latest version.
          </Typography>
        </DialogBody>

        <DialogFooter>
          <Button
            color="red"
            onClick={handleOpen}
            ripple="light"
            className="ml-4 outline-none text-black"
          >
            Cancel
          </Button>

          <Button
            color="lenspostLime"
            onClick={handleUpdateClick}
            ripple="light"
            className="ml-4 outline-none bg-[#e1f16b] text-black"
          >
            Ok
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default UpdateAvailable;
