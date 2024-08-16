import { Link, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useContentStore } from "../store/content";
import Navbar from "../components/Navbar";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReactPlayer from "react-player";
import { formatReleaseDate } from "../utils/dateFunction";
import { ORIGINAL_IMG_BASE_URL, SMALL_IMG_BASE_URL } from "../utils/constants";
import WatchPageSkeleton from "../components/skeletons/WatchPageSkeleton";

const WatchPage = () => {
  const { id } = useParams();
  const [trailers, setTrailers] = useState([]);
  const [currentTrailerIndex, setCurrentTrailerIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({});
  const [similarContent, setSimilarContent] = useState([]);
  const { contentType } = useContentStore();

  const sliderRef = useRef(null);

  // Use Effect for fetching trailers
  useEffect(() => {
    const getTrailers = async () => {
      try {
        const { data } = await axios.get(
          `/api/v1/${contentType}/${id}/trailers`
        );
        setTrailers(data.data);
      } catch (error) {
        if (error.message.includes("404")) {
          setTrailers([]);
        }
        console.log("Error in getTrailers: ", error);
      }
    };

    getTrailers();
  }, [contentType, id]);

  // Use Effect for fetching similar content
  useEffect(() => {
    const getSimilarContent = async () => {
      try {
        const { data } = await axios.get(
          `/api/v1/${contentType}/${id}/similar`
        );
        setSimilarContent(data.data);
      } catch (error) {
        if (error.message.includes("404")) {
          setSimilarContent([]);
        }
        console.log("Error in getSimilarContent: ", error);
      }
    };

    getSimilarContent();
  }, [contentType, id]);

  // Use Effect for fetching details
  useEffect(() => {
    const getContentDetails = async () => {
      try {
        const { data } = await axios.get(
          `/api/v1/${contentType}/${id}/details`
        );
        setContent(data.data);
        setLoading(false);
      } catch (error) {
        if (error.message.includes("404")) {
          setContent(null);
          setLoading(false);
        }
        console.log("Error in getContentDetails: ", error);
      } finally {
        setLoading(false);
      }
    };

    getContentDetails();
  }, [contentType, id]);

  const handleNext = () => {
    if (currentTrailerIndex < trailers.length - 1) {
      setCurrentTrailerIndex(currentTrailerIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentTrailerIndex > 0) {
      setCurrentTrailerIndex(currentTrailerIndex - 1);
    }
  };

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -sliderRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: sliderRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-10">
        <WatchPageSkeleton />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="bg-black text-white h-screen">
        <div className="max-w-6xl mx-auto">
          <Navbar />
          <div className="text-center mx-auto px-4 py-8 h-full mt-40">
            <h2 className="text-2xl sm:text-5xl font-bold text-balance">
              Content not found 😥
            </h2>
          </div>
        </div>
      </div>
    );
  }
  console.log(content);

  return (
    <div className="bg-black  min-h-screen text-white">
      <div className="mx-auto container px-4 py-8 h-full">
        <Navbar />

        {trailers.length > 0 && (
          <div className="flex items-center justify-between mb-4">
            <button
              className={`bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded ${
                currentTrailerIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={currentTrailerIndex === 0}
              onClick={handlePrev}>
              <ChevronLeft size={24} />
            </button>
            <button
              className={`bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded ${
                currentTrailerIndex === trailers.length - 1
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={currentTrailerIndex === trailers.length - 1}
              onClick={handleNext}>
              <ChevronRight size={24} />
            </button>
          </div>
        )}

        <div className="aspect-video mb-8 p-2 sm:px-10 md:px-32">
          {trailers.length > 0 && (
            <ReactPlayer
              controls
              width={"100%"}
              height={"70vh"}
              className="mx-auto overflow-hidden rounded-lg"
              url={`https://www.youtube.com/watch?v=${trailers[currentTrailerIndex].key}`}
            />
          )}

          {trailers.length === 0 && (
            <h2 className="text-xl text-center mt-5">
              No trailers available for{" "}
              <span className="font-bold text-red-600">
                {content?.title || content?.name}
              </span>{" "}
              😥
            </h2>
          )}
        </div>

        {/* Movie Details */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-20 
				max-w-6xl mx-auto">
          <div className="mb-4 md:mb-0">
            <h2 className="text-4xl font-bold text-balance">
              {content?.title || content?.name}
            </h2>

            <p className="mt-2 text-md">
              {formatReleaseDate(
                content?.release_date || content?.first_air_date
              )}{" "}
              |{" "}
              {content?.adult ? (
                <span className="text-red-600">18+</span>
              ) : (
                <span className="text-green-600">PG-13</span>
              )}{" "}
            </p>
            <p className="mt-4 text-md">{content?.overview}</p>
          </div>
          <img
            src={ORIGINAL_IMG_BASE_URL + content?.poster_path}
            alt="Poster image"
            className="max-h-[500px] rounded-md"
          />
        </div>

        {/* Similar Content */}
        {similarContent.length > 0 && (
          <div className="mt-12 max-w-5xl mx-auto relative">
            <h3 className="text-2xl font-bold mb-4">Similar Movies/Tv Shows</h3>

            <div
              className="flex overflow-x-scroll scrollbar-hide gap-4 pb-4 group"
              ref={sliderRef}>
              {similarContent.map((item) => {
                if (item.poster_path === null) return null;

                return (
                  <Link
                    to={`/watch/${item.id}`}
                    key={item.id}
                    className="w-52 flex-none">
                    <img
                      src={SMALL_IMG_BASE_URL + item.poster_path}
                      alt={item.title}
                      className="w-full h-80 rounded-md"
                    />
                    <h4 className="mt-2 text-lg font-semibold">
                      {item?.title || item?.name}
                    </h4>
                  </Link>
                );
              })}
              <ChevronRight
                className="absolute top-1/2 -translate-y-1/2 right-2 w-10 h-10
										opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer
										 bg-black/50 text-white rounded-full hover:bg-black/75"
                onClick={scrollRight}
              />
              <ChevronLeft
                className="absolute top-1/2 -translate-y-1/2 left-2 w-10 h-10 opacity-0 
								group-hover:opacity-100 transition-all duration-300 cursor-pointer bg-black/50 
								text-white rounded-full hover:bg-black/75"
                onClick={scrollLeft}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchPage;
