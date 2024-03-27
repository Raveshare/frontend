import createStore from "polotno/model/store";
import { POLOTNO_API_KEY } from "../../services";

const store = createStore({ key: POLOTNO_API_KEY });
store.addPage();

// Add a logo to the bottom right corner of the canvas
let h = store.activePage.computedHeight;
let w = store.activePage.computedWidth;
store.activePage.addElement({
  x: w - 100,
  y: h - 100,
  type: "image",
  src: "/logo_16x16.png",
  selectable: false,
  alwaysOnTop: true,
  showInExport: true,
});

const useStore = () => {
  return store;
};

export default useStore;
