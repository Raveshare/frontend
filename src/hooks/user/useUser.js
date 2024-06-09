import { useQuery } from "@tanstack/react-query";
import { useAppAuth, useLocalStorage } from "../app";
import { getUserProfile } from "../../services/apis/BE-apis";
import { getFarcasterDetails, getProfileImage } from "../../services";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { consoleLogonlyDev, getFromLocalStorage } from "../../utils";

const useUser = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [farcasterDetails, setFarcasterDetails] = useState({});
  const [userLevel, setUserLevel] = useState("Normie");
  const { userId } = useLocalStorage();
  const address = getFromLocalStorage("user.address");
  const { isAuthenticated } = useAppAuth();
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["user", { userId }],
    queryFn: getUserProfile,
    enabled: isAuthenticated ? true : false,
    refetchOnMount: false,
  });

  const fnGetUserLevel = async () => {
    if (data?.message?.points < 500) {
      setUserLevel("Normie");
    }
    if (data?.message?.points >= 500) {
      setUserLevel("Pleb");
    } else if (data?.message?.points >= 1000) {
      setUserLevel("Chad");
    }
  };

  const fnGetFarcasterDetails = async () => {
    if (!address) {
      consoleLogonlyDev("Address not found");
      return;
    }
    const result = await getFarcasterDetails(address, `farcaster`);
    setFarcasterDetails(result.Social[0]);
    setProfileImage(result.Social[0]?.profileImage);
  };

  useEffect(() => {
    fnGetUserLevel();
    fnGetFarcasterDetails();
  }, [data, address]);

  useEffect(() => {
    fnGetFarcasterDetails();
  }, [address]);

  return {
    address,
    username: data?.message?.username,
    email: data?.message?.mail,
    lensHandle: data?.message?.lens_handle,
    farcasterHandle: farcasterDetails?.profileHandle,
    points: data?.message?.points,
    profileImage: profileImage,
    error,
    isError,
    isLoading,
    userLevel,
  };
};

export default useUser;
