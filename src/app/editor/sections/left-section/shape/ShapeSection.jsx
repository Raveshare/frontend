import React from "react";

import { SectionTab } from "polotno/side-panel";
import { Shapes } from "polotno/side-panel/elements-panel";
import { Icon } from "@blueprintjs/core";
import { useStore } from "../../../../../hooks/polotno";

export const ShapePanel = () => {
  const store = useStore();
  return <Shapes store={store} />;
};

// // define the new custom section
 const ShapeSection = {
  name: "shapes",
  Tab: (props) => (
    <SectionTab name="Shapes" {...props}>
      <Icon icon="shapes" />
    </SectionTab>
  ),
  // we need observer to update component automatically on any store changes
  Panel: ShapePanel,
};

export default ShapeSection;