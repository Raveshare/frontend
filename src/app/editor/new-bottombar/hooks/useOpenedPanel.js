import React, { useState } from "react";

const useOpenedPanel = () => {
  const [openedPanel, setOpenedPanel] = useState("");
  return { openedPanel, setOpenedPanel };
};

export default useOpenedPanel;
