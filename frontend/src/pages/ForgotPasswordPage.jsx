import { Link } from "react-router-dom";
import { useState } from "react";
import Logo from "../components/Logo";
import Input from "../components/Input";
import { LoaderCircle, Mail } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const {
    forgotPassword,
    forgotLoading: isLoading,
    isForgotFormSubmitted,
  } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
    } catch (error) {
      console.log("Error in forgot password: ", error);
    }
  };

  return (
    <div className="min-h-screen w-full hero-bg">
      <header className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <Link to={"/"}>
          <Logo className="w-40" />
        </Link>
      </header>

      <div className="flex justify-center items-center mt-14 mx-3">
        <div className="w-full max-w-md p-8 space-y-6 bg-black/60 rounded-lg shadow-md">
          <h1 className="text-center text-white text-2xl font-bold mb-4">
            Forgot Password
          </h1>

          {!isForgotFormSubmitted ? (
            <>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <p className="text-gray-400 text-center text-sm">
                  Enter your email address and we&apos;ll send you a link to
                  reset your password.
                </p>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  id="email"
                  label="Email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <button
                  className="w-full py-2 bg-red-600 text-white font-semibold rounded-md
							hover:bg-red-700
						"
                  disabled={isLoading}
                  type="submit">
                  {isLoading ? (
                    <LoaderCircle className="animate-spin mx-auto" />
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
              <div className="text-center text-gray-400">
                Back to login your account?{" "}
                <Link to={"/login"} className="text-red-500 hover:underline">
                  Sign in
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <p className="text-gray-300 mb-6">
                Reset password link has been sent to {email}. Check your email
                box and click on the link.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
