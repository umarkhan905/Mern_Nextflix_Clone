import { Router } from "express";

import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  searchPerson,
  searchMovie,
  searchTvShow,
  getSearchHistory,
  deleteItemFromSearchHistory,
} from "../controllers/search.controllers.js";

const router = Router();

router.use(verifyJWT);

router.route("/person/:query").get(searchPerson);
router.route("/movie/:query").get(searchMovie);
router.route("/tv/:query").get(searchTvShow);

router.route("/history").get(getSearchHistory);
router.route("/history/:id").delete(deleteItemFromSearchHistory);

export default router;
