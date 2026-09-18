import axios from "axios";

export const uploadToImageBB = async (file) => {
  try {
    if (!file) return null;

    const formData = new FormData();
    formData.append("image", file);

    const apiKey = import.meta.env.VITE_IMAGEBB_API_KEY;

    const { data } = await axios.post(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      formData,
    );

    return data.data.url;
  } catch (error) {
    console.log(error.message);
  }
};
