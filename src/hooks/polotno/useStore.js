import createStore from "polotno/model/store";
import { POLOTNO_API_KEY } from "../../services";

const store = createStore({ key: POLOTNO_API_KEY });
store.addPage();

const useStore = () => {
  return store;
};

export default useStore;
