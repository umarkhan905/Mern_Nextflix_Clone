import { useState } from "react";
import { useContentStore } from "../store/content";
import Navbar from "../components/Navbar";
import { LoaderCircle, Search } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
const SearchPage = () => {
  const [activeTab, setActiveTab] = useState("movie");
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { setContentType } = useContentStore();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    tab === "movie" ? setContentType("movies") : setContentType("tv");
    setResults([]);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/v1/search/${activeTab}/${searchTerm}`
      );
      setResults(data.data);
      setLoading(false);
    } catch (error) {
      if (error.message.includes("404")) {
        toast.error(
          "Nothing found, make sure you are searching for a valid category"
        );
      } else {
        toast.error("Something went wrong, please try again later");
      }
      setResults([]);
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center gap-3 mb-4">
          <button
            className={`py-2 px-4 rounded ${
              activeTab === "movie" ? "bg-red-600" : "bg-gray-800"
            } hover:bg-red-700`}
            onClick={() => handleTabClick("movie")}>
            Movies
          </button>
          <button
            className={`py-2 px-4 rounded ${
              activeTab === "tv" ? "bg-red-600" : "bg-gray-800"
            } hover:bg-red-700`}
            onClick={() => handleTabClick("tv")}>
            Tv Shows
          </button>
          <button
            className={`py-2 px-4 rounded ${
              activeTab === "person" ? "bg-red-600" : "bg-gray-800"
            } hover:bg-red-700`}
            onClick={() => handleTabClick("person")}>
            Person
          </button>
        </div>

        <form
          className="flex gap-2 items-stretch mb-8 max-w-2xl mx-auto"
          onSubmit={handleSearch}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={"Search for a " + activeTab}
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
          <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded">
            <Search className="size-6" />
          </button>
        </form>

        {loading ? (
          <div className="max-w-6xl mx-auto flex items-center justify-center h-[300px]">
            <LoaderCircle className="size-16 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {results.map((result) => {
              if (!result.poster_path && !result.profile_path) return null;

              return activeTab === "person" ? (
                <div className="flex flex-col bg-gray-800 px-2 py-2">
                  <img
                    src={ORIGINAL_IMG_BASE_URL + result.profile_path}
                    alt={result.name}
                    className="max-h-72 rounded mx-auto w-full object-cover"
                  />
                  <h2 className="mt-2 text-lg font-medium">{result.name}</h2>
                </div>
              ) : (
                <Link
                  to={"/watch/" + result.id}
                  onClick={() => {
                    activeTab === "movie"
                      ? setContentType("movies")
                      : setContentType(activeTab);
                  }}
                  className="flex flex-col bg-gray-800 px-2 py-2">
                  <img
                    src={ORIGINAL_IMG_BASE_URL + result.poster_path}
                    alt={result.title || result.name}
                    className="max-h-96 rounded mx-auto w-full object-cover"
                  />
                  <h2 className="mt-2 text-xl font-medium">
                    {result.title || result.name}
                  </h2>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
