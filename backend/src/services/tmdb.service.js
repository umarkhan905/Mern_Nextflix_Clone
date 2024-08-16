import axios from "axios";
import { ENV_VARS } from "../config/envVars.config.js";

export const fetchFromTMDB = async (url) => {
  if (!url) {
    throw new Error("Please provide url to fetch from TMDB");
  }

  const options = {
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + ENV_VARS.TMDB_AUTH_TOKEN,
    },
  };

  const response = await axios.get(url, options);

  if (response.status !== 200) {
    throw new Error("Failed to fetch data from TMDB", response.statusText);
  }

  return response.data;
};
