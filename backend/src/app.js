import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// import routes
import userRoutes from "./routes/user.routes.js";
import movieRoutes from "./routes/movie.routes.js";
import tvRoutes from "./routes/tv.routes.js";
import searchRoutes from "./routes/search.routes.js";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/movies", movieRoutes);
app.use("/api/v1/tv", tvRoutes);
app.use("/api/v1/search", searchRoutes);

export default app;
