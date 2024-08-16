import axios from "axios";
import { useContentStore } from "../store/content";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { SMALL_IMG_BASE_URL } from "../utils/constants";
import { ChevronLeft, ChevronRight } from "lucide-react";
const ContentSlider = ({ category }) => {
  const [content, setContent] = useState([]);
  const [showArrows, setShowArrows] = useState(false);
  const { contentType } = useContentStore();
  const sliderRef = useRef(null);

  const formattedContentType = contentType === "movies" ? "movies" : "tv shows";
  const formattedCategory =
    category.replaceAll("_", " ")[0].toUpperCase() +
    category.replaceAll("_", " ").slice(1);

  useEffect(() => {
    const getContent = async () => {
      try {
        const res = await axios.get(`/api/v1/${contentType}/${category}`);
        setContent(res.data.data);
      } catch (error) {
        console.log("Error in getContent: ", error);
      }
    };
    getContent();
  }, [contentType, category]);

  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -sliderRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: sliderRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className="bg-black text-white relative px-5 md:px-20"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}>
      <h2 className="mb-4 text-xl font-bold">
        {formattedCategory} {formattedContentType}
      </h2>
      <div
        className="flex space-x-4 overflow-x-scroll scrollbar-hide"
        ref={sliderRef}>
        {content?.map((item) => (
          <Link
            key={item?.id}
            to={`/watch/${item?.id}`}
            className="min-w-[220px] relative group">
            <div className="rounded-lg overflow-hidden">
              <img
                src={SMALL_IMG_BASE_URL + item?.backdrop_path}
                alt={item?.title || item?.name}
                className="transition-transform duration-500 ease-in-out group-hover:scale-125"
              />
            </div>

            <p className="mt-2 text-center">{item?.title || item?.name}</p>
          </Link>
        ))}
      </div>

      {showArrows && (
        <>
          <button
            className="absolute left-5 md:left-24 top-1/2 -translate-y-1/2 flex items-center justify-center size-10 rounded-full bg-black/50 hover:bg-black/75 text-white z-10"
            onClick={slideLeft}>
            <ChevronLeft size={24} />
          </button>
          <button
            className="absolute right-5 md:right-24 top-1/2 -translate-y-1/2 flex items-center justify-center size-10 rounded-full bg-black/50 hover:bg-black/75 text-white z-10"
            onClick={slideRight}>
            <ChevronRight size={24} />
          </button>
        </>
      )}
    </div>
  );
};

export default ContentSlider;
