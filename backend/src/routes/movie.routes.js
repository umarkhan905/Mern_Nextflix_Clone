import { Router } from "express";

import {
  getTrendingMovie,
  getMovieTrailers,
  getMovieDetails,
  getMovieSimilar,
  getMoviesByCategory,
} from "../controllers/movie.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/trending").get(getTrendingMovie);
router.route("/:id/trailers").get(getMovieTrailers);
router.route("/:id/details").get(getMovieDetails);
router.route("/:id/similar").get(getMovieSimilar);
router.route("/:category").get(getMoviesByCategory);

export default router;
