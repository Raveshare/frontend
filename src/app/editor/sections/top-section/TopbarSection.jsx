import {  useAccount, useSwitchChain } from "wagmi";
import ShareButton from "./share/ShareButton";
import DownloadBtn from "./download/DownloadBtn";
import { ENVIRONMENT } from "../../../../services";
import ProfileMenu from "./user/ProfileMenu";
import LoginBtn from "./auth/LoginBtn";
import { useAppAuth } from "../../../../hooks/app";
import { Typography } from "@material-tailwind/react";
import { EVMWallets, SolanaWallets } from "./auth/wallets";
import Logo from "./logo/Logo";
import PointsBtn from "./PointsBtn/PointsBtn";
const TopbarSection = () => {
  const { isAuthenticated } = useAppAuth();
  const { chain } = useAccount();
  const { switchChain } = useSwitchChain();

  const isSupportedChain = () => {
    if (ENVIRONMENT === "production") {
      if (chain?.id === 137) return true;
    } else {
      if (chain?.id === 80001) return true;
    }
  };

  return (
    <div className="bg-white mb-2 w-full px-3 py-2 sm:overflow-x-auto sm:overflow-y-hidden sm:max-w-[100vw] sticky border">
      <div className="flex items-center justify-between">
        <Logo />

        {!isAuthenticated && (
          <div className="flex items-center gap-3">
            <Typography className="font-semibold text-lg">
              Login with
            </Typography>
            <SolanaWallets title="Solana" />
            <EVMWallets title="EVM" />
          </div>
        )}

        {isAuthenticated ? (
          <div className="flex items-center justify-center space-x-6">
            {/* Discord Links - 19Jul2023 */}
            <a
              className="md:w-8 h-8 text-gray-600 transition-transform transform-gpu hover:scale-125 hover:rotate-180 hover:duration-2000"
              target="_blank"
              href="https://discord.gg/yHMXQE2DNb"
            >
              {" "}
              <img src="/topbar-icons/iconDiscord.svg" alt="" />
            </a>

            <div id="fifth-step">
              <ShareButton />
            </div>
            <DownloadBtn />

            <div className="" id="first-step">
              <ProfileMenu />
              {/* <PointsBtn/> */}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TopbarSection;
