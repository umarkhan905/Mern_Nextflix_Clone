import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import Logo from "../components/Logo";
import Input from "../components/Input";
import { LoaderCircle } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const SignUpPage = () => {
  const [searchParams] = useSearchParams();

  // Another way
  // const { searchParams } = new URL(window.location);
  // console.log(searchParams.get("email"));

  const [formData, setFormData] = useState({
    username: "",
    email: searchParams.get("email"),
    password: "",
  });

  const { signupLoading: isLoading, error, signup } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(formData);
      navigate("/verify-email");
    } catch (error) {
      console.log(error);
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
            Sign Up
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
              type="text"
              placeholder="johndoe6029"
              id="username"
              label="Username"
              name="username"
              value={formData.username}
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

            {error && <p className="text-red-500 text-sm">**{error}</p>}
            <button
              className="w-full py-2 bg-red-600 text-white font-semibold rounded-md
							hover:bg-red-700
						"
              disabled={isLoading}>
              {isLoading ? (
                <LoaderCircle className="animate-spin mx-auto" />
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
          <div className="text-center text-gray-400">
            Already a member?{" "}
            <Link to={"/login"} className="text-red-500 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
