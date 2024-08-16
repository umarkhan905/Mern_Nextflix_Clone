import dotenv from "dotenv";
dotenv.config();

export const ENV_VARS = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_LIFETIME: process.env.JWT_LIFETIME,
  NODE_ENV: process.env.NODE_ENV,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  PORT: process.env.PORT || 8000,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  FRONTEND_PATH: process.env.FRONTEND_PATH,
  TMDB_AUTH_TOKEN: process.env.TMDB_AUTH_TOKEN,
};
