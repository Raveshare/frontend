import { useContext, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
// import { Dialog } from "@headlessui/react";
import EmojiPicker, { EmojiStyle, Emoji } from "emoji-picker-react";
import { DateTimePicker } from "@atlaskit/datetime-picker";
import { chainLogo, getFromLocalStorage } from "../../../../../utils";
import { Context } from "../../../../../providers/context/ContextProvider";
import BsX from "@meronex/icons/bs/BsX";
import { Textarea, Typography } from "@material-tailwind/react";
import logoSolana from "../../../../../assets/logos/logoSolana.png";
import logoZora from "../../../../../assets/logos/logoZora.png";
import logoFarcaster from "../../../../../assets/logos/logoFarcaster.jpg";
import { InputBox } from "../../../common";

const ShareSection = () => {
  const { address, isConnected } = useAccount();
  const { chains, chain } = useNetwork();
  const {
    setMenu,
    postName,
    setPostName,
    postDescription,
    setPostDescription,
    stFormattedDate,
    setStFormattedDate,
    stFormattedTime,
    setStFormattedTime,
    stCalendarClicked,
    setStCalendarClicked,

    isShareOpen,
    setIsShareOpen,
  } = useContext(Context);
  const getTwitterAuth = getFromLocalStorage("twitterAuth");
  const [stClickedEmojiIcon, setStClickedEmojiIcon] = useState(false);
  const [charLimitError, setCharLimitError] = useState("");

  const chainsArray = [
    {
      id: 1,
      name: "Ethereum",
    },
    {
      id: 8453,
      name: "Base",
    },
    {
      id: 7777777,
      name: "Zora",
    },
    {
      id: 10,
      name: "OP Mainnet",
    },
    {
      id: 42161,
      name: "Arbitrum One",
    },
  ];

  const filterChains = () => {
    if (chains?.length > 0) {
      return chains?.slice(0, -2);
    } else {
      return chainsArray;
    }
  };

  // Aurh for twitter
  const twitterAuth = async () => {
    const res = await twitterAuthenticate();
    if (res?.data) {
      // console.log(res?.data?.message);
      window.open(res?.data?.message, "_parent");
    } else if (res?.error) {
      toast.error(res?.error);
    }
  };

  const handleTwitterClick = () => {
    if (isConnected && getTwitterAuth) {
      sharePost("twitter");
    } else {
      twitterAuth();
    }
  };

  // Calendar Functions:
  const onCalChange = (value, dateString) => {
    const dateTime = new Date(value);

    // Format the date
    const dateOptions = { year: "numeric", month: "long", day: "numeric" };
    setStFormattedDate(dateTime.toLocaleDateString(undefined, dateOptions));

    // Format the time
    const timeOptions = {
      hour: "numeric",
      minute: "numeric",
      timeZoneName: "short",
    };
    setStFormattedTime(dateTime.toLocaleTimeString(undefined, timeOptions));
  };

  // Function to handle emoji click
  // Callback sends (data, event) - Currently using data only
  function fnEmojiClick(emojiData) {
    setPostDescription(postDescription + emojiData?.emoji); //Add emoji to description
  }

  const handleInputChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    const maxByteLimit = 195;
    const byteLength = new TextEncoder().encode(value).length;

    if (name === "title") {
      setPostName(value);
    } else if (name === "description") {
      if (byteLength > maxByteLimit) {
        setCharLimitError("Maximun character limit exceeded");
        setPostDescription(
          value.substring(0, value.length - (byteLength - maxByteLimit))
        );
      } else {
        setCharLimitError("");
        setPostDescription(value);
      }
    }
  };

  return (
    <>
      <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-md rounded-lg  rounded-r-none ">
        <div className="">
          {/* <Dialog.Title className="w-full text-white text-xl leading-6 p-6 fixed bg-gray-900 z-10">
          Share this Design
        </Dialog.Title> */}

          {/* Don't add - `fixed` solved major Bug */}
          <div className="flex flex-row justify-between top-0 w-full text-white text-xl leading-6 p-4 bg-gray-900 rounded-lg rounded-r-none ">
            {/* For alignment */}
            <div className=""> {""} </div>
            <div className="">Share this Design</div>
            <div
              className="z-100 cursor-pointer"
              onClick={() => setIsShareOpen(!isShareOpen)}
            >
              <BsX size="24" />
            </div>
          </div>
        </div>
        <div className="relative mt-0 px-4 pt-1 pb-1 sm:px-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between"></div>
            <InputBox
              label={"Title"}
              name="title"
              autoFocus={true}
              onChange={(e) => handleInputChange(e)}
              value={postName}
            />
            <div className="space-x-2">
              <Textarea
                label="Description"
                name="description"
                onChange={(e) => handleInputChange(e)}
                value={postDescription}
                // placeholder="Write a description..."
                // className="border border-b-4 w-full h-40 mb-2 text-lg outline-none p-2 ring-0 focus:ring-2 rounded-lg"
              />
              {charLimitError && (
                <div className="text-red-500 text-sm">{charLimitError}</div>
              )}

              <div className="flex flex-row">
                {/* Open the emoji panel - 22Jul2023 */}
                {/* Dynamic Emoji on the screen based on click */}

                <button
                  title="Open emoji panel"
                  className={`"m-2 p-2 rounded-md ${
                    stClickedEmojiIcon && "border border-red-400"
                  }"`}
                  onClick={() => setStClickedEmojiIcon(!stClickedEmojiIcon)}
                >
                  <Emoji
                    unified={stClickedEmojiIcon ? "274c" : "1f60a"}
                    emojiStyle={EmojiStyle.NATIVE}
                    size={24}
                  />
                </button>
                <div
                  onClick={() => {
                    setStCalendarClicked(!stCalendarClicked);
                    setStShareClicked(true);
                  }}
                  className=" ml-4 py-2 rounded-md cursor-pointer"
                >
                  {/* <MdcCalendarClock className="h-10 w-10" /> */}
                </div>
              </div>

              {/* Emoji Implementation - 21Jul2023 */}
              {stClickedEmojiIcon && (
                <div className="shadow-lg mt-2 absolute z-40">
                  <EmojiPicker
                    onEmojiClick={fnEmojiClick}
                    autoFocusSearch={true}
                    // width="96%"
                    className="m-2"
                    lazyLoadEmojis={true}
                    previewConfig={{
                      defaultCaption: "Pick one!",
                      defaultEmoji: "1f92a", // 🤪
                    }}
                    searchPlaceHolder="Search"
                    emojiStyle={EmojiStyle.NATIVE}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Calender For Schedule - 18Jun2023 */}
        <div className={`${!stCalendarClicked && "hidden"}`}>
          <div
            className={`
          ml-6 mr-6 mb-4`}
          >
            <div className="m-1">Choose schedule time and date</div>
            <DateTimePicker className="m-4" onChange={onCalChange} />
          </div>

          <div className={`flex flex-col m-2 ml-8`}>
            <div className="mt-1 mb-3">Schedule</div>
            <div className="flex flex-row border-l-8 border-l-[#e1f16b] p-4 rounded-md">
              <div className="flex flex-col">
                <div className="text-4xl text-[#E699D9]">
                  {stFormattedDate.slice(0, 2)}
                </div>
                <div className="text-lg text-[#2D346C]">
                  {stFormattedDate.slice(2)}
                </div>
              </div>

              <div className="flex flex-col ml-4">
                <div className="ml-2 mt-10">{stFormattedTime}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Share - Icons - 18Jun2023 */}
        <hr />
        <div className={`relative mt-6 px-4 sm:px-6`}>
          <p className="text-lg">Share on socials</p>
          <div className="flex ">
            <div className="flex items-center space-x-12 py-5">
              <div onClick={() => setMenu("lensmonetization")}>
                {" "}
                <img
                  className="w-10 cursor-pointer"
                  src="/other-icons/share-section/iconLens.png"
                  alt="Lens"
                />{" "}
              </div>
            </div>

            <div className="flex items-center space-x-12 py-5 ml-8">
              <div onClick={() => setMenu("farcasterShare")}>
                {" "}
                <img
                  className="w-10 cursor-pointer rounded-md"
                  src={logoFarcaster}
                  alt="Farcaster"
                />{" "}
              </div>
            </div>
          </div>
        </div>
        <hr />

        <hr />
        <div className={`relative mt-6 px-4 sm:px-6`}>
          <p className="text-lg">Mint as an NFT on EVM</p>
          <div className="flex flex-wrap items-center gap-10 my-3">
            {filterChains().map((item) => {
              return (
                <div
                  key={item?.id}
                  className="cursor-pointer flex flex-col items-center"
                  onClick={() => setMenu(item?.id)}
                >
                  {" "}
                  <img
                    className="w-10 h-10"
                    src={chainLogo(item?.id)}
                    alt={item?.name}
                  />{" "}
                  <Typography className="text-md font-semibold">
                    {item?.name}
                  </Typography>
                </div>
              );
            })}
          </div>
        </div>
        <hr />

        <div className={`relative mt-6 px-4 sm:px-6`}>
          <p className="text-lg">Mint as an NFT on Solana</p>
          <div className="flex flex-wrap items-center gap-10 my-3">
            <div
              className="cursor-pointer flex flex-col items-center"
              onClick={() => setMenu("solanaMint")}
            >
              {" "}
              <img className="w-10" src={logoSolana} alt="Solana" />{" "}
              <Typography className="text-md font-semibold">Solana</Typography>
            </div>
          </div>
        </div>
        <hr />
      </div>
    </>
  );
};

export default ShareSection;
