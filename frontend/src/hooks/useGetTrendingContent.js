import { useState, useEffect } from "react";
import { useContentStore } from "../store/content";
import axios from "axios";

export const useGetTrendingContent = () => {
  const { contentType } = useContentStore();

  const [trendingContent, setTrendingContent] = useState([]);

  useEffect(() => {
    const fetchTrendingContent = async () => {
      try {
        const response = await axios.get(`/api/v1/${contentType}/trending`);
        setTrendingContent(response.data.data);
      } catch (error) {
        console.log("Error in useGetTrendingContent", error);
      }
    };

    fetchTrendingContent();
  }, [contentType]);

  return { trendingContent };
};
