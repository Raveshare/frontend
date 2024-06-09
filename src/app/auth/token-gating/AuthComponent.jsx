import { useMutation, useQuery } from "@tanstack/react-query";
import { useAccount, useDisconnect } from "wagmi";
import { useContext, useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getIsUserWhitelisted } from "../../../services";
import {
  errorMessage,
  getFromLocalStorage,
  jsConfettiFn,
  saveToLocalStorage,
} from "../../../utils";
import { Button, Typography } from "@material-tailwind/react";
import { InputBox } from "../../editor/common";
import { redeemCode } from "../../../services/apis/BE-apis/utils";
import BisSend from "@meronex/icons/bi/BisSend";
import { ERROR } from "../../../data";
import {
  EVMWallets,
  SolanaWallets,
} from "../../editor/sections/top-section/auth/wallets";
import { useSolanaWallet } from "../../../hooks/solana";

const AuthComponent = () => {
  const getHasUserSeenTheApp = getFromLocalStorage("hasUserSeenTheApp");
  const getifUserEligible = getFromLocalStorage("ifUserEligible");
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { solanaDisconnect, solanaConnected, solanaAddress } =
    useSolanaWallet();
  const navigate = useNavigate();
  const [isUserEligible, setIsUserEligible] = useState(false);
  const [inviteCode, setInviteCode] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["isHolderOfCollection"],
    queryFn: () => getIsUserWhitelisted(address || solanaAddress),
    enabled: address || solanaAddress ? true : false,
    retry: 1,
  });

  // invite code mutuation
  const { mutateAsync } = useMutation({
    mutationKey: "inviteCode",
    mutationFn: redeemCode,
  });

  const redeemInviteCode = () => {
    if (!inviteCode) return toast.error("Please enter the invite code");
    mutateAsync({
      code: inviteCode,
      address: address || solanaAddress,
    })
      .then((res) => {
        if (res?.status === "success") {
          jsConfettiFn();

          saveToLocalStorage("ifUserEligible", {
            address: address || solanaAddress,
            isUserEligible: true,
          });

          toast.success(res?.message);
          setIsUserEligible(true);
        } else if (res?.status === "error") {
          toast.error(res?.message);
          setIsUserEligible(false);
        } else {
          toast.error(ERROR.SOMETHING_WENT_WRONG);
          setIsUserEligible(false);
        }
      })
      .catch((err) => {
        toast.error(errorMessage(err));
      });
  };

  const isUserEligibleFn = () => {
    if (
      getifUserEligible &&
      (getifUserEligible.address === address ||
        getifUserEligible.address === solanaAddress) &&
      getifUserEligible.isUserEligible === true
    ) {
      return true;
    } else if (getHasUserSeenTheApp && getHasUserSeenTheApp === true) {
      return true;
    } else {
      return false;
    }
  };

  const ifUserEligible = () => {
    if (data?.data) {
      setIsUserEligible(true);

      const jsConfetti = new JSConfetti();
      jsConfetti.addConfetti({
        emojis: ["🌈", "⚡️", "💥", "✨", "💫", "🌸"],
        confettiNumber: 100,
      });
      // user is whitelisted
      // store the address in local storage
      saveToLocalStorage("ifUserEligible", {
        address: address || solanaAddress,
        isUserEligible: true,
      });

      // redirect to the app
    } else {
      // user is not whitelisted
      // keep showing the login page
      setIsUserEligible(false);
    }
  };

  useEffect(() => {
    // if true redirect to home page
    if (isUserEligibleFn()) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    ifUserEligible();
  }, [data]);

  useEffect(() => {
    if (isError) {
      toast.error(errorMessage(error));
    }
  }, [isError]);

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div
        className="flex justify-center items-center h-screen"
        style={{
          background: "linear-gradient(90deg, #E598D8 10%, #E1F16B 100%)",
        }}
      >
        <div className="w-full md:w-3/4 lg:w-1/2">
          <div className="flex flex-col justify-between m-2 p-2">
            <div className="flex flex-col justify-center text-center flex-wrap m-4 rounded-md">
              <div className="m-2 text-lg">
                {" "}
                <img className="h-16 mb-8" src="/logo.png" alt="" />{" "}
              </div>
              {/* if wallet is disconnected */}
              {!isConnected && !solanaConnected && (
                <div className="m-2 text-lg">
                  {" "}
                  Welcome to the future of creating DOPE content with your
                  collectibles!
                  <br /> Word on the street is we’re THE WEB
                  <span className="text-xl">3 </span> Canva killer ;){" "}
                </div>
              )}

              {/* if wallet is connected but not eligible */}
              {!isUserEligible && (isConnected || solanaConnected) && (
                <>
                  <h1
                    className="text-3xl font-bold line"
                    style={{
                      letterSpacing: "0.1em",
                    }}
                  >
                    {!isLoading && "Oops! 🥲"}
                  </h1>
                  {isLoading ? (
                    <div className="m-2 text-lg italic">
                      {" "}
                      Checking your eligibility...{" "}
                    </div>
                  ) : (
                    <div className="flex flex-col text-center items-center justify-center m-2 text-lg">
                      <div>
                        {/* Opps! */}
                        Looks like you’re not eligible at this time!
                        <br /> Sign up for the waitlist and we’ll hook you up
                        shortly.
                      </div>

                      {/* Zootools Form Start */}
                      <div className="inline-table m-4 flex-col text-center align-middle justify-center">
                        <a
                          target="_blank"
                          href="https://form.zootools.co/go/VtPPU3VRY6t5cvhtLK3H"
                          data-waitlist-id="VtPPU3VRY6t5cvhtLK3H"
                          style={{ all: "unset" }}
                        >
                          <div
                            className="inline w-fit text-gray-50 rounded-md px-4 py-2 bg-[#2c346b]
                            hover:bg-[#2c346b] 
                            hover:shadow-xl      
                            hover:cursor-pointer "
                          >
                            {/* Very Important to add inline/ inline-table */}
                            Join the Waitlist
                          </div>
                        </a>
                      </div>

                      <Typography className="text-lg font-semibold">
                        or
                      </Typography>

                      <div className="w-1/2 py-2 flex gap-2">
                        <InputBox
                          className="bg-white"
                          label="Enter the invite code"
                          onChange={(e) => setInviteCode(e.target.value)}
                          value={inviteCode}
                        />
                        <div
                          onClick={redeemInviteCode}
                          className="bg-[#2c346b] rounded-md flex justify-center items-center w-1/3 hover:bg-[#2c346b] hover:shadow-xl hover:cursor-pointer"
                        >
                          <BisSend className="text-white" />
                        </div>
                      </div>
                      {/* Zootools Form End */}
                    </div>
                  )}
                </>
              )}

              {/* if wallet if connected and eligible */}
              {isUserEligible && (isConnected || solanaConnected) && (
                <>
                  <h1
                    className="text-3xl font-bold line"
                    style={{
                      letterSpacing: "0.1em",
                    }}
                  >
                    {!isLoading && "Congratulations! You’re in!  🥳"}
                  </h1>
                  {isLoading ? (
                    <div className="m-2 text-lg italic">
                      {" "}
                      Checking your eligibility...{" "}
                    </div>
                  ) : (
                    <>
                      <div className="m-2 text-lg">
                        {" "}
                        {/* Congratulations! You’re in!  */}
                        <br /> Come and Remix your NFTs, Share and monetize your
                        creations to lens and explore 1000s of creative assets!{" "}
                      </div>
                    </>
                  )}
                </>
              )}

              {/* {if wallet is connected but not eligible} */}
              {(isConnected || solanaConnected) && !isUserEligible && (
                <div className="mb-2 p-2 flex flex-row justify-center">
                  {/* {<ConnectButton showBalance={false} />} */}
                  <Button
                    className="bg-[#2c346b]"
                    onClick={() => {
                      disconnect();
                      solanaDisconnect();
                    }}
                  >
                    Disconnect
                  </Button>
                </div>
              )}

              {/* if disconnected */}
              {!isConnected && !solanaConnected && (
                <>
                  <Typography variant="h4" className="mt-6">
                    Connect your wallet
                  </Typography>
                  <div className="mb-2 p-2 flex flex-row justify-center gap-2">
                    {/* {<ConnectButton />} */}
                    <SolanaWallets title="Solana" />
                    <EVMWallets title="EVM" />
                  </div>
                </>
              )}

              {isUserEligible &&
                (isConnected || solanaConnected) &&
                !isLoading && (
                  <div className="mb-2 p-2 flex flex-row justify-center">
                    <button
                      onClick={() => navigate("/")}
                      className="bg-blue-500 py-3 px-5 rounded-md text-white hover:shadow-xl"
                    >
                      Launch App
                    </button>
                  </div>
                )}

              <div className=""></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AuthComponent;
