import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { SMALL_IMG_BASE_URL } from "../utils/constants";
import { Trash } from "lucide-react";
import { formatDate } from "../utils/dateFunction";

const SearchHistoryPage = () => {
  const [searchHistory, setSearchHistory] = useState([]);
  useEffect(() => {
    const getSearchHistory = async () => {
      try {
        const { data } = await axios.get("/api/v1/search/history");
        setSearchHistory(data.data);
      } catch (error) {
        console.log("Error in getSearchHistory: ", error);
        setSearchHistory([]);
      }
    };
    getSearchHistory();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/v1/search/history/${id}`);
      setSearchHistory(searchHistory.filter((entry) => entry.id !== id));
    } catch (error) {
      console.log("Error in handleDelete: ", error);
    }
  };

  if (searchHistory?.length === 0) {
    return (
      <div className="bg-black min-h-screen text-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Search History</h1>
          <div className="flex justify-center items-center h-96">
            <p className="text-xl">No search history found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Search History</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3  gap-4">
          {searchHistory?.map((entry) => (
            <div
              key={entry.id}
              className="bg-gray-800 p-4 rounded flex items-start">
              <img
                src={SMALL_IMG_BASE_URL + entry.image}
                alt="History image"
                className="size-16 rounded-full object-cover mr-4"
              />
              <div className="flex flex-col">
                <span className="text-white text-lg">{entry.title}</span>
                <span className="text-gray-400 text-sm">
                  {formatDate(entry.createdAt)}
                </span>
              </div>

              <span
                className={`py-1 px-3 min-w-20 text-center rounded-full text-sm  ml-auto ${
                  entry.type === "movie"
                    ? "bg-red-600"
                    : entry.type === "tv"
                    ? "bg-blue-600"
                    : "bg-green-600"
                }`}>
                {entry?.type[0].toUpperCase() + entry.type.slice(1)}
              </span>
              <Trash
                className="size-5 ml-4 cursor-pointer hover:fill-red-600 hover:text-red-600"
                onClick={() => handleDelete(entry.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchHistoryPage;
