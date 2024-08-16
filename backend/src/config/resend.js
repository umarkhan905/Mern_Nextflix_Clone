import { Resend } from "resend";
import { ENV_VARS } from "../config/envVars.config.js";

export const resend = new Resend(ENV_VARS.RESEND_API_KEY);
