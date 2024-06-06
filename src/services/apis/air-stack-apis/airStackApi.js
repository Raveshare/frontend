import { gql } from "@apollo/client";
import request from "graphql-request";
import { AIRSTACK_API_KEY } from "../../env/env";

export const AIRSTACK_API = "https://api.airstack.xyz/gql";

const getENSDomainQuery = gql`
  query MyQuery($owners: [Address!]) {
    Domains(
      input: {
        filter: { resolvedAddress: { _in: $owners }, isPrimary: { _eq: true } }
        blockchain: ethereum
      }
    ) {
      Domain {
        name
        owner
        resolvedAddress
      }
    }
  }
`;

export const getENSDomain = async (addresses) => {
  const variables = {
    owners: addresses, // array of addresses
  };

  try {
    const result = await request(AIRSTACK_API, getENSDomainQuery, variables, {
      headers: {
        "x-api-key": AIRSTACK_API_KEY,
      },
    });

    let arr = addresses.map((address) => {
      const matchedAddress = result?.Domains?.Domain.find(
        (d) => d.resolvedAddress.toLowerCase() === address.toLowerCase()
      );
      return matchedAddress ? matchedAddress.name : address;
    });

    return arr;
  } catch (error) {
    // console.log(error);
    return addresses;
  }
};

const getSocialDetailsQuery = gql`
  query MyQuery($identities: [Identity!], $dappName: SocialDappName) {
    Socials(
      input: {
        filter: { identity: { _in: $identities }, dappName: { _eq: $dappName } }
        blockchain: ethereum
      }
    ) {
      Social {
        dappName
        profileHandle
        userAddress
      }
    }
  }
`;

export const getSocialDetails = async (addresses, dappName) => {
  const variables = {
    identities: addresses, // array of addresses
    dappName,
  };

  try {
    const result = await request(
      AIRSTACK_API,
      getSocialDetailsQuery,
      variables,
      {
        headers: {
          "x-api-key": AIRSTACK_API_KEY,
        },
      }
    );

    let arr = addresses.map((address) => {
      const matchedAddress = result?.Socials?.Social.find(
        (d) => d.userAddress.toLowerCase() === address.toLowerCase()
      );
      return matchedAddress ? matchedAddress.profileHandle : address;
    });

    return arr;
  } catch (error) {
    // console.log(error);
    return addresses;
  }
};

// Top 5 Social Details

const getTop5SocialDetailsQuery = gql`
  query MyQuery($identities: [Identity!]) {
    SocialFollowers(
      input: {
        filter: {
          identity: { _in: $identities }
          dappName: { _eq: lens }
          dappSlug: { _eq: lens_v2_polygon }
          followerSince: { _lte: "2023-10-21T19:23:03Z" }
        }
        blockchain: ALL
        limit: 5
      }
    ) {
      Follower {
        followerAddress {
          socials {
            dappName
            profileName
            userAssociatedAddresses
            profileImageContentValue {
              image {
                small
              }
            }
          }
        }
      }
    }
  }
`;

export const getTop5SocialDetails = async ({ address }) => {
  console.log("getTop5SocialDetails");

  const variables = {
    identities: address,
  };

  try {
    const result = await request(
      AIRSTACK_API,
      getTop5SocialDetailsQuery,
      variables,
      {
        headers: {
          "x-api-key": AIRSTACK_API_KEY,
        },
      }
    );

    const socialDetails = result;

    if (socialDetails) {
      return socialDetails;
    }
  } catch (error) {
    console.log(error);
  }
};

// Profile Image Query

const getProfileImageQuery = gql`
  query MyQuery($identities: Identity!) {
    Socials(
      input: {
        filter: { dappName: { _eq: farcaster }, identity: { _eq: $identities } }
        blockchain: ethereum
      }
    ) {
      Social {
        profileImageContentValue {
          image {
            small
          }
        }
      }
    }
  }
`;

export const getProfileImage = async (address) => {
  
  const variables = {
    identities: address,
  };

  try {
    const result = await request(
      AIRSTACK_API,
      getProfileImageQuery,
      variables,
      {
        headers: {
          "x-api-key": AIRSTACK_API_KEY,
        },
      }
    );

    const profileImage =
      result?.Socials?.Social[0]?.profileImageContentValue?.image?.small;

    if (profileImage) {
      return profileImage;
    }
  } catch (error) {
    console.log(error);
  }
};

const getFarcasterDetailsQuery = gql`
  query MyQuery($identities: Identity!) {
    Socials(
      input: {
        blockchain: ethereum
        filter: { dappName: { _eq: farcaster }, identity: { _eq: $identities } }
      }
    ) {
      Social {
        profileName
        profileMetadata
        profileImage
        profileHandle
        profileDisplayName
        profileBio
        connectedAddresses {
          address
        }
        profileUrl
        twitterUserName
      }
    }
  }
`;

export const getFarcasterDetails = async (address) => {
  const variables = {
    identities: address,
  };

  try {
    const result = await request(
      AIRSTACK_API,
      getFarcasterDetailsQuery,
      variables,
      {
        headers: {
          "x-api-key": AIRSTACK_API_KEY,
        },
      }
    );

    console.log("farcaster airstack res", result);

    const profileDetails = result?.Socials;

    if (profileDetails) {
      return profileDetails;
    }
  } catch (error) {
    console.log(error);
  }
};
