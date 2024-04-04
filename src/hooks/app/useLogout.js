import { useDisconnect } from "wagmi";
import { useSolanaWallet } from "../solana";
import { useContext } from "react";
import { Context } from "../../providers/context";
import { clearAllLocalStorageData } from "../../utils";
import useReset from "./useReset";
import * as Sentry from "@sentry/react";

const useLogout = () => {
  const { solanaDisconnect } = useSolanaWallet();
  const { disconnect } = useDisconnect();
  const { posthog } = useContext(Context);
  const { resetState } = useReset();

  const logout = () => {
    resetState();
    disconnect();
    solanaDisconnect();
    posthog.reset();
    Sentry.setUser(null);
    clearAllLocalStorageData();
  };

  return {
    logout,
  };
};

export default useLogout;
