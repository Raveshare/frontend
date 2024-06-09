
import { useQuery } from "@tanstack/react-query";
import { useAppAuth, useLocalStorage } from "../app";
import { getUserProfile } from "../../services/apis/BE-apis";
import { getProfileImage } from "../../services";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

const useUser = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [userLevel, setUserLevel] = useState("Normie");
  const { userId } = useLocalStorage();
  const { address } = useAccount();
  const { isAuthenticated } = useAppAuth();
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["user", { userId }],
    queryFn: getUserProfile,
    enabled: isAuthenticated ? true : false,
    refetchOnMount: false,
  });

  const res = async () => {
    const data = await getProfileImage(address);
    console.log(data);
    setProfileImage(data);
  };

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
  
  useEffect(() => {
    res();
  }, [address]);

  useEffect(() => {
    fnGetUserLevel();
  }, [data]);

  return {
    username: data?.message?.username,
    email: data?.message?.mail,
    lensHandle: data?.message?.lens_handle,
    points: data?.message?.points,
    profileImage: profileImage,
    error,
    isError,
    isLoading,
    userLevel,
  };
};

export default useUser;
