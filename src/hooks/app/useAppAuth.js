import { LOCAL_STORAGE } from "../../data";

const useAppAuth = () => {
  const isAuthenticated = localStorage.getItem(LOCAL_STORAGE.userAuthToken) || localStorage.getItem(LOCAL_STORAGE.privy)
  return { isAuthenticated };
};

export default useAppAuth;
