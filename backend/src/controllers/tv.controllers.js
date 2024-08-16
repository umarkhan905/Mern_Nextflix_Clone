import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { fetchFromTMDB } from "../services/tmdb.service.js";

const getTrendingTvShow = async (req, res) => {
  try {
    const data = await fetchFromTMDB(
      "https://api.themoviedb.org/3/trending/tv/day?language=en-US"
    );

    if (!data) {
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            "Something went wrong while fetching data from TMDB"
          )
        );
    }

    const randomMovie =
      data.results[Math.floor(Math.random() * data.results?.length)];

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          randomMovie,
          "Trending Tv Show Fetched Successfully"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", error.stack));
  }
};

const getTvShowTrailers = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/tv/${id}/videos?language=en-US`
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          data.results,
          "Tv Show Trailer Fetched Successfully"
        )
      );
  } catch (error) {
    if (error.message.includes("404")) {
      return res
        .status(404)
        .json(new ApiError(404, "Tv Show trailers with this id not found"));
    }

    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", error.stack));
  }
};

const getTvShowDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/tv/${id}?language=en-US`
    );

    return res
      .status(200)
      .json(new ApiResponse(200, data, "Tv Show Details Fetched Successfully"));
  } catch (error) {
    if (error.message.includes("404")) {
      return res
        .status(404)
        .json(new ApiError(404, "Tv Show details with this id not found"));
    }

    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", error.stack));
  }
};

const getTvShowSimilar = async (req, res) => {
  try {
    const { id, page = 1 } = req.params;
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/tv/${id}/similar?language=en-US&page=${page}`
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          data.results,
          "Tv Show Similar Fetched Successfully"
        )
      );
  } catch (error) {
    if (error.message.includes("404")) {
      return res
        .status(404)
        .json(new ApiError(404, "Tv Show similar with this id not found"));
    }
  }
  return res.status(500).json(new ApiError(500, "Internal Server Error"));
};

const getTvShowsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/tv/${category}?language=en-US&page=1`
    );
    return res
      .status(200)
      .json(
        new ApiResponse(200, data.results, "Tv Shows Fetched Successfully")
      );
  } catch (error) {
    if (error.message.includes("404")) {
      return res
        .status(404)
        .json(404, "Tv Shows are not found with this category");
    }
    return res.status(500).json(500, "Internal Server Error");
  }
};

export {
  getTrendingTvShow,
  getTvShowTrailers,
  getTvShowDetails,
  getTvShowSimilar,
  getTvShowsByCategory,
};
