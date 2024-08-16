import { ENV_VARS } from "../config/envVars.config.js";

export class ApiError {
  constructor(statusCode, error = "something went wrong", stack = []) {
    this.statusCode = statusCode;
    this.error = error;
    this.data = null;
    this.success = false;

    if (stack && ENV_VARS.NODE_ENV !== "production") {
      this.stack = stack;
    }
  }
}
