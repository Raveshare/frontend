// ---- ----
// ---- Working yet - Under DEV - Created: 20Jul2023  Updated:27Jul2023 ----
// ---- This section is same as stable-diffusion-section.jsx ----
// ---- ----

import React, { useState, useEffect, useRef, useContext } from "react";
import { observer } from "mobx-react-lite";
import { InputGroup, Button, Icon } from "@blueprintjs/core";
import { SectionTab } from "polotno/side-panel";
import { getKey } from "polotno/utils/validate-key";
import { getImageSize } from "polotno/utils/image";
import FaBrain from "@meronex/icons/fa/FaBrain";
import { t } from "polotno/utils/l10n";
import { ImagesGrid } from "polotno/side-panel/images-grid";
import { useInfiniteAPI } from "polotno/utils/use-api";
import { getCrop } from "polotno/utils/image";
import { AIIcon } from "../../../../../assets/assets";
import axios from "axios";
import FormData from "form-data";
import {
  CustomImageComponent,
  LoadingAnimatedComponent,
  MessageComponent,
} from "../../../common";
import {
  Textarea,
  Button as MatButton,
  Input,
  Chip,
} from "@material-tailwind/react";
import {
  base64Stripper,
  consoleLogonlyDev,
  firstLetterCapital,
} from "../../../../../utils";
import Lottie from "lottie-react";
import animationData from "../../../../../assets/lottie/loaders/aiGeneration.json";
import { useStore } from "../../../../../hooks/polotno";
import { Context } from "../../../../../providers/context";
import { Tab, Tabs, TabsHeader, TabsBody } from "@material-tailwind/react";
import { getFalAiImage, getFalImgtoImg } from "../../../../../services";

// Tab1 - Search Tab

const RANDOM_QUERIES = [
  "A serene lakeside scene at sunset with vibrant orange and purple hues reflecting off the calm waters.",
  "An otherworldly forest with bioluminescent plants and colorful creatures lurking in the shadows.",
  "Sea turtles gracefully gliding through the water, and a hidden shipwreck waiting to be explored.",
];

// This array is to display other queries on the frontend - 22Jul2023
const RANDOM_QUERIES2 = [
  // "A bustling marketplace in a medieval fantasy setting",
  "Merchants selling exotic goods and performers entertaining the crowd.",
  "An underwater paradise with coral reefs teeming with colorful fish",
];

// This array is to display short words as prompts on the frontend - 22Jul2023
const RANDOM_QUERIES3 = ["Mountains", "Hearts", "Robots", "NFTS", "Elon"];

const CompSearch = () => {
  const store = useStore();
  // load data
  const [data, setData] = useState(null);
  const [stStatusCode, setStStatusCode] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState();
  // RANDOM_QUERIES[(RANDOM_QUERIES.length * Math.random()) | 0]

  const fnGenerateImages = async () => {
    if (!query) {
      return;
    }
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        setIsLoading(true);
        const response = await getFalAiImage(query);
        setStStatusCode(response.status);
        if (response.status === 200) {
          setIsLoading(false);
          setStStatusCode(200);
          setData(response.data);
        } else if (data.status === 429) {
          setIsLoading(false);
          setStStatusCode(429);
        }
      } catch (e) {
        console.log("err", e);
        // setError(e);
        setError(e.message);
        setIsLoading(false);
        // setStStatusCode(429);
      }
      setIsLoading(false);
    }
    load();
  };

  useEffect(() => {
    fnGenerateImages();
  }, []);

  useEffect(() => {
    consoleLogonlyDev(query);
  }, [query]);

  return (
    <>
      <div className="">
        <div className="flex flex-col">
          <Textarea
            // className="h-16 mb-2 border px-4 py-1 rounded-md w-full outline-none focus:ring-1 focus:ring-blue-500"
            leftIcon="search"
            // placeholder={query || "Search or Give a prompt"}
            label="Search or Give a prompt"
            // placeholder={query ||  "Search or Give a prompt"}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                // setQuery(e.target.value);
                fnGenerateImages();
              }
            }}
            value={query}
            type="search"
          />
          <MatButton className="mb-4" onClick={fnGenerateImages}>
            Generate
          </MatButton>
          {/* 
			<button className="bg-[#e1f16b] w-full px-4 p-1  mb-4 rounded-md hover:bg-[#e0f26cce]" onClick={fnGenerateImages}>Generate</button>
			*/}
        </div>
        <div className="hidden md:flex flex-row overflow-x-scroll">
          {RANDOM_QUERIES3.map((val, key) => {
            return (
              <div
                onClick={() => setQuery(val)}
                className="m-1 mb-2 px-2 py-1 text-xs rounded-md cursor-pointer bg-blue-50 hover:bg-blue-100"
              >
                {val}
              </div>
            );
          })}
        </div>

        {RANDOM_QUERIES2.map((val, key) => {
          return (
            <div
              onClick={() => setQuery(val)}
              className="m-1 mb-2 px-2 py-1 text-xs rounded-md cursor-pointer bg-blue-50 hover:bg-blue-100 overflow-x-scroll"
            >
              {val}
            </div>
          );
        })}
      </div>
      {/* {isLoading && <LoadingAnimatedComponent />} */}
      {isLoading && (
        <div className="mt-0 text-center text-blue-600">
          <Lottie animationData={animationData} className="h-64" />
          {/* Generating Image... */}
        </div>
      )}
      {query == "" ||
        (!data &&  !isLoading &&(
          <div className="p-2 pt-4  text-center text-gray-500">
            Give a prompt and click Generate to get started
          </div>
        ))}

      {!isLoading && stStatusCode === 200 && (
        <>
          {data?.images.map((val, key) => (
            <CustomImageComponent key={key} preview={val.url} />
          ))}
        </>
      )}

      {!isLoading && error && (
        <div className="mt-4 p-2 text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      {stStatusCode === 429 && (
        // <div className="mt-4 p-2 text-orange-600 bg-orange-100 rounded-md">
        //   You are Rate limited for now, Please check back after 60s
        // </div>
        <MessageComponent message="You are Rate limited for now, Please check back after 60s" />
      )}
      {/* {!data && "Start exploring"} */}
    </>
  );
};

const CompDesignify = () => {
  const callApi = async () => {
    const form = new FormData();
    // Assuming you have access to the image file through a file input element.
    const fileInput = document.getElementById("fileInput");
    form.append("image_file", fileInput.files[0]);

    try {
      const response = await axios({
        method: "post",
        url: "https://api.designify.com/v1.0/designify/:designId",
        data: form,
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "multipart/form-data",
          // "X-Api-Key": "9822b7f73ff3bea87eee20370ac3982e",
          "X-Api-Key": "2f9772c386495a636efc72709d1a312f",
        },
      });

      if (response.status !== 200) {
        console.error("Error:", response.status, response.statusText);
      } else {
        // Assuming you want to display the image or do something else with it.
        // For example, displaying it in an <img> tag:
        const blob = new Blob([response.data], { type: "image/png" });
        const imageUrl = URL.createObjectURL(blob);
        const imageElement = document.getElementById("imageElement");
        imageElement.src = imageUrl;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      {/* Input element for selecting the image file */}
      <input type="file" id="fileInput" />
      {/* Image element to display the retrieved image */}
      <img id="imageElement" src="" alt="Design" />
      <button onClick={callApi}>Generate</button>
    </div>
  );
};

const CompInstructImage = () => {
  const { fastPreview } = useContext(Context);

  const [responseImage, setResponseImage] = useState(""); // For Newly generated Image Preview
  const [uploadedImg, setUploadedImg] = useState(); //For Uploaded Preview
  const [clicked, setClicked] = useState(false);
  const [stImgPrompt, setStImgPrompt] = useState(
    "A serene lakeside scene at sunset with vibrant orange and purple hues reflecting off the calm waters."
  );
  const [stDisplayMessage, setStDisplayMessage] = useState(
    "Choose an Image & Click on GENERATE to customize image based on your prompt"
  );

  // Testing all the APIs from getimg.ai
  // Function : json to base64

  const fnJsonToBase64 = (json) => {
    return btoa(JSON.stringify(json));
  };

  const fnCallInstructImgAPI = async () => {
    setClicked(true);
    setResponseImage("");

    // const options = {
    //   method: "POST",
    //   headers: {
    //     accept: "application/json",
    //     "content-type": "application/json",
    //     authorization:
    //       "Bearer key-2ldCt5QwA0Jt9VxoHDWadZukBnQKqM9Rcj9UBZPRVR0eh8sbhLzMylCMmNreNR5GqwgsMJmoolcBGA5JBgUleuP2BqWNiYZ2",
    //     // "Bearer key-4tA8akcKtGFZQwipltBWJz3CCe1Jh6u7PX59uRJY9U6wEvareOdhlhWgCiMWnZeCz9CC6GIJLaddIJGbHr5crjfz6ROXTUXY"
    //   },
    //   body: JSON.stringify({
    //     // data: {
    //     prompt: stImgPrompt,
    //     // image: base64Stripper(uploadedImg),
    //     // image: `${base64Stripper(uploadedImg)}`,
    //     image: base64Stripper(uploadedImg),
    //   }),
    // };

    // await fetch("https://api.getimg.ai/v1/stable-diffusion/instruct", options)
    // await fetch(
    //   "https://api.getimg.ai/v1/stable-diffusion/image-to-image",
    //   options
    // )
    await getFalImgtoImg(uploadedImg, stImgPrompt)
      .then((response) => {
        if (!response.data.images) {
          setResponseImage("");
          setStDisplayMessage("It's not you, it's us. Please try again later.");
        }
        setResponseImage(response.data.images[0].url);
        setResponseImage(response.data.images[0].url);
        // }
        // if (response.status === 500) {
        //   setResponseImage("");
        //   setStDisplayMessage("It's not you, it's us. Please try again later.");
        // }
        // if (response.status > 400 && response.status < 500) {
        //   setResponseImage("");
        //   setStDisplayMessage(response.data.error.type);
        // }
        setClicked(false);
      })
      .catch((err) => {
        console.error("err", err);
        if (err.response.status == 401) {
          setResponseImage("");
          setStDisplayMessage(err.response.data.error.type);
        }
      });
    setClicked(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        // When the file has been read successfully, the result will be a Base64 encoded string
        const base64String = reader.result;
        setUploadedImg(base64String);
      };

      reader.readAsDataURL(file);
    }
  };

  const fnUseThisCanvas = () => {
    setUploadedImg(fastPreview[0]);
  };

  useEffect(() => {
    setUploadedImg(uploadedImg);
  }, [uploadedImg]);

  return (
    <>
      <div className="h-full overflow-y-auto">
        <div className="m-1 mb-2 ml-2">
          {" "}
          {/* <Chip color="blue" variant="ghost" value="Original Image" /> */}
          Original Image{" "}
        </div>

        {/* <Input onChange={(e) => setStOriginalImage(e.target.value)} type="file" name="" id="" accept="image/*" /> */}
        <div className="mb-4 rounded-md">
          <input
            className="mb-2 ml-2"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <div className="flex justify-center "> OR </div>
          <MatButton
            disabled={!fastPreview[0]}
            size="sm"
            color="deep-purple"
            variant="outlined"
            className="mt-4 p-2"
            fullWidth
            onClick={fnUseThisCanvas}
          >
            Use this Canvas
          </MatButton>
          {uploadedImg && (
            <div className="flex justify-center">
              <img
                className="m-2 rounded-md h-32 w-full object-contain"
                // src={`data:image/jpeg;base64, ${uploadedImg}`}
                src={uploadedImg}
                alt="Uploaded Image"
              />
            </div>
          )}
        </div>

        <Textarea
          required
          color="deep-purple"
          label="Prompt"
          onChange={(e) => setStImgPrompt(e.target.value)}
        />

        <MatButton
          disabled={!uploadedImg}
          className="mt-4 w-full"
          onClick={fnCallInstructImgAPI}
        >
          Generate
        </MatButton>

        {!responseImage && !clicked && (
          <div className="mt-4 text-center text-md text-green-600">
            {stDisplayMessage}
          </div>
        )}

        {!responseImage && clicked && (
          <div className="mt-0 text-center text-blue-600">
            <Lottie animationData={animationData} className="h-64" />
            {/* Generating Image... */}
          </div>
        )}

        {/* { responseImage && <img className="mt-4" src={`data:image/jpeg;base64, ${responseImage}`} alt="" /> } */}
        {responseImage && !clicked && (
          <div className="mt-4 h-32">
            <CustomImageComponent
              // preview={`data:image/jpeg;base64, ${responseImage}`} // if base64 Response
              preview={`${responseImage}`}
            />
          </div>
        )}
      </div>
    </>
  );
};

const AIImagePanel = () => {
  const [currentTab, setCurrentTab] = useState("prompt");

  const tabsArray = ["prompt", "instruct"];

  return (
    <div className="h-full">
      <Tabs
        id="custom-animation"
        className="overflow-y-auto h-full"
        value={currentTab}
      >
        <TabsHeader>
          {tabsArray.map((tab, index) => (
            <Tab key={index} value={tab} onClick={() => setCurrentTab(tab)}>
              <div className="appFont">{firstLetterCapital(tab)}</div>
            </Tab>
          ))}
        </TabsHeader>

        <TabsBody className="h-full">
          <div className="p-2"></div>
          {currentTab === "prompt" && <CompSearch />}
          {currentTab === "instruct" && <CompInstructImage />}
        </TabsBody>
      </Tabs>
    </div>
  );
};

// define the new custom section
const AIImageSection = {
  name: "AIImage",
  Tab: (props) => (
    <SectionTab name="AI Image" {...props}>
      <AIIcon />
    </SectionTab>
  ),
  // we need observer to update component automatically on any store changes
  Panel: AIImagePanel,
};

export default AIImageSection;
