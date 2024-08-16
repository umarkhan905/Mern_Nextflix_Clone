import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { fetchFromTMDB } from "../services/tmdb.service.js";
import { User } from "../models/user.model.js";

const searchPerson = async (req, res) => {
  try {
    const { query } = req.params;
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=1`
    );

    if (data.results.length === 0) {
      return res.status(404).json(new ApiError(404, "Person not found"));
    }
    // Check if we have already searched this person
    const isSearchedPrev = req.user.searchHistory.some(
      (item) => item.id === data.results[0].id
    );

    // Save search history
    if (!isSearchedPrev) {
      await User.findByIdAndUpdate(req.user._id, {
        $push: {
          searchHistory: {
            id: data.results[0].id,
            title: data.results[0].name,
            image: data.results[0].profile_path,
            type: "person",
            createdAt: new Date(),
          },
        },
      });
    }

    return res
      .status(200)
      .json(new ApiResponse(200, data.results, "Person Fetched Successfully"));
  } catch (error) {
    console.log("Error in searchPerson: ", error);
    return res
      .status(500)
      .json(new ApiError(500, "Internal server error", error.stack));
  }
};

const searchMovie = async (req, res) => {
  try {
    const { query } = req.params;
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`
    );

    if (data.results.length === 0) {
      return res.status(404).json(new ApiError(404, "Movie not found"));
    }

    // Check if we have already searched this movie
    const isSearchedPrev = req.user.searchHistory.some(
      (item) => item.id === data.results[0].id
    );

    // Save search history
    if (!isSearchedPrev) {
      await User.findByIdAndUpdate(req.user._id, {
        $push: {
          searchHistory: {
            id: data.results[0].id,
            title: data.results[0].title,
            image: data.results[0].poster_path,
            type: "movie",
            createdAt: new Date(),
          },
        },
      });
    }

    return res
      .status(200)
      .json(new ApiResponse(200, data.results, "Movie Fetched Successfully"));
  } catch (error) {
    console.log("Error in searchMovie: ", error);
    return res.status(500).json(new ApiError(500, "Internal server error"));
  }
};

const searchTvShow = async (req, res) => {
  try {
    const { query } = req.params;
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`
    );

    if (data.results.length === 0) {
      return res.status(404).json(new ApiError(404, "Tv Show not found"));
    }

    // Check if we have already searched this person
    const isSearchedPrev = req.user.searchHistory.some(
      (item) => item.id === data.results[0].id
    );

    // Save search history
    if (!isSearchedPrev) {
      await User.findByIdAndUpdate(req.user._id, {
        $push: {
          searchHistory: {
            id: data.results[0].id,
            title: data.results[0].name,
            image: data.results[0].poster_path,
            type: "tv",
            createdAt: new Date(),
          },
        },
      });
    }

    return res
      .status(200)
      .json(new ApiResponse(200, data.results, "Tv Show Fetched Successfully"));
  } catch (error) {
    console.log("Error in searchTvShow: ", error);
    return res.status(500).json(new ApiError(500, "Internal server error"));
  }
};

const getSearchHistory = async (req, res) => {
  try {
    return res
      .status(200)
      .json(
        new ApiResponse(200, req.user.searchHistory, "Search History Fetched")
      );
  } catch (error) {
    console.log("Error in getSearchHistory: ", error);
    return res.status(500).json(new ApiError(500, "Internal server error"));
  }
};

const deleteItemFromSearchHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await User.findByIdAndUpdate(req.user._id, {
      $pull: {
        searchHistory: { id: Number(id) },
      },
    });

    if (!data) {
      return res.status(404).json(new ApiError(404, "Item not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Item deleted from search history"));
  } catch (error) {
    console.log("Error in deleteItemFromSearchHistory: ", error);
    return res.status(500).json(new ApiError(500, "Internal server error"));
  }
};
export {
  searchMovie,
  searchPerson,
  searchTvShow,
  getSearchHistory,
  deleteItemFromSearchHistory,
};
