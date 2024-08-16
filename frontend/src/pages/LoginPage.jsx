import { Link } from "react-router-dom";
import { useState } from "react";
import Logo from "../components/Logo";
import Input from "../components/Input";
import { LoaderCircle } from "lucide-react";
import { useAuthStore } from "../store/authStore";
const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { loginLoading: isLoading, error, login } = useAuthStore();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
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
            Sign In
          </h1>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="you@example.com"
              id="email"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />

            <Input
              type="password"
              placeholder="•••••••"
              id="password"
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <Link
              to={"/forgot-password"}
              className="font-medium text-gray-300 text-sm ">
              Forgot Password?
            </Link>

            {error && <p className="text-red-500 text-sm">**{error}</p>}
            <button
              className="w-full py-2 bg-red-600 text-white font-semibold rounded-md
							hover:bg-red-700
						"
              disabled={isLoading}>
              {isLoading ? (
                <LoaderCircle className="animate-spin mx-auto" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>
          <div className="text-center text-gray-400">
            Don&apos;t have an account?{" "}
            <Link to={"/signup"} className="text-red-500 hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
