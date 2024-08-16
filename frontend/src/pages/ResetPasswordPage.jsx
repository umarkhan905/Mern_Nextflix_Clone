import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import Logo from "../components/Logo";
import Input from "../components/Input";
import { LoaderCircle } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const { resetPassword, resetLoading, error } = useAuthStore();
  const { token } = useParams();

  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(formData, token);
      navigate("/login");
    } catch (error) {
      console.log("Error in reset password: ", error);
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
            Reset Your Password
          </h1>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              type="password"
              placeholder="•••••••"
              id="newPassword"
              label="New Password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
            />

            <Input
              type="password"
              placeholder="•••••••"
              id="confirmPassword"
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            {error && <p className="text-red-500 text-sm">**{error}</p>}

            <button
              className="w-full py-2 bg-red-600 text-white font-semibold rounded-md
							hover:bg-red-700
						"
              disabled={resetLoading}>
              {resetLoading ? (
                <LoaderCircle className="animate-spin mx-auto" />
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
          <div className="text-center text-gray-400">
            Back to login your account?{" "}
            <Link to={"/login"} className="text-red-500 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
