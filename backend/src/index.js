import app from "./app.js";
import { connectDB } from "./db/index.js";
import { ENV_VARS } from "./config/envVars.config.js";

const port = ENV_VARS.PORT;

connectDB()
  .then(() => {
    app.listen(port, () => console.log(`Listening on port ${port}`));
    app.on("error", (err) => console.log("Express runtime  Error: ", err));
    console.log("MongoDB Connected successfully :)");
  })
  .catch((err) => console.log("MongoDB Connection Error: ", err));
