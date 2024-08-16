import { Router } from "express";

import {
  getTrendingTvShow,
  getTvShowTrailers,
  getTvShowDetails,
  getTvShowSimilar,
  getTvShowsByCategory,
} from "../controllers/tv.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/trending").get(getTrendingTvShow);
router.route("/:id/trailers").get(getTvShowTrailers);
router.route("/:id/details").get(getTvShowDetails);
router.route("/:id/similar").get(getTvShowSimilar);
router.route("/:category").get(getTvShowsByCategory);

export default router;
