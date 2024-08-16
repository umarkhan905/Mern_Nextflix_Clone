import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { fetchFromTMDB } from "../services/tmdb.service.js";

const getTrendingMovie = async (req, res) => {
  try {
    const data = await fetchFromTMDB(
      "https://api.themoviedb.org/3/trending/movie/day?language=en-US"
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
        new ApiResponse(200, randomMovie, "Trending Movie Fetched Successfully")
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", error.stack));
  }
};

const getMovieTrailers = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, data.results, "Movie Trailer Fetched Successfully")
      );
  } catch (error) {
    if (error.message.includes("404")) {
      return res
        .status(404)
        .json(new ApiError(404, "Movie trailers with this id not found"));
    }

    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", error.stack));
  }
};

const getMovieDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${id}?language=en-US`
    );

    return res
      .status(200)
      .json(new ApiResponse(200, data, "Movie Details Fetched Successfully"));
  } catch (error) {
    if (error.message.includes("404")) {
      return res
        .status(404)
        .json(new ApiError(404, "Movie details with this id not found"));
    }

    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", error.stack));
  }
};

const getMovieSimilar = async (req, res) => {
  try {
    const { id, page = 1 } = req.params;
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=${page}`
    );
    return res
      .status(200)
      .json(
        new ApiResponse(200, data.results, "Movie Similar Fetched Successfully")
      );
  } catch (error) {
    if (error.message.includes("404")) {
      return res
        .status(404)
        .json(new ApiError(404, "Movie similar with this id not found"));
    }
  }
  return res.status(500).json(new ApiError(500, "Internal Server Error"));
};

const getMoviesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`
    );
    return res
      .status(200)
      .json(new ApiResponse(200, data.results, "Movies Fetched Successfully"));
  } catch (error) {
    if (error.message.includes("404")) {
      return res
        .status(404)
        .json(404, "Movies are not found with this category");
    }
    return res.status(500).json(500, "Internal Server Error");
  }
};

export {
  getTrendingMovie,
  getMovieTrailers,
  getMovieDetails,
  getMovieSimilar,
  getMoviesByCategory,
};
