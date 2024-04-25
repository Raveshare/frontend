import axios from "axios";
import { FAL_API_KEY } from "../../env/env";

export const getFalAiImage = async (ipPrompt) => {
  const result = await axios.post(
    `https://fal.run/fal-ai/fast-sdxl`,
    {
      prompt: ipPrompt,
    },
    {
      headers: {
        Authorization: `Key ${FAL_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return result;
};

export const getFalImgtoImg = async (ipImage, ipPrompt) => {
  const result = await axios.post(
    `https://fal.run/fal-ai/fast-sdxl/image-to-image`,
    {
      image_url: ipImage,
      prompt: ipPrompt,
    },
    {
      headers: {
        Authorization: `Key ${FAL_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return result;
};
