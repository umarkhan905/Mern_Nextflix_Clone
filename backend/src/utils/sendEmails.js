import { resend } from "../config/resend.js";

export const sendEmail = async (email, subject, html) => {
  const { data, error } = await resend.emails.send({
    from: "Netflix <onboarding@resend.dev>",
    to: email,
    subject,
    html,
  });
  if (error) {
    return error;
  }
  console.log("Email Sent successfully", data);
};
