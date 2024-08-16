import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import Logo from "../components/Logo";
import { LoaderCircle } from "lucide-react";
import { useAuthStore } from "../store/authStore";
const VerifyEmailPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const {
    verifyLoading: isLoading,
    error,
    verifyEmail,
    resendEmail,
    resendLoading,
  } = useAuthStore();

  const handleChange = (index, value) => {
    const newCode = [...code];
    if (value.length > 1) {
      const pasteCode = value.slice(0, 6).split("");
      pasteCode.forEach((digit, i) => (newCode[i] = digit || ""));
      setCode(newCode);

      // Focus on the last non-empty input or the first empty one
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex]?.focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      // Move focus to the next input field if value is entered
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyEmail(code.join(""));
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
            Verify Your Email
          </h1>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <p className="text-center text-gray-400 text-sm">
              We have sent an email to your email account. Please check your
              email and enter the verification code here.
            </p>
            <div className="grid grid-cols-6 gap-4">
              {code.map((digit, index) => (
                <input
                  className="text-center col-span-1 px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                  key={index}
                  ref={(e) => (inputRefs.current[index] = e)}
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                />
              ))}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              className="w-full py-2 bg-red-600 text-white font-semibold rounded-md
							hover:bg-red-700
						"
              disabled={isLoading || code.some((digit) => !digit)}>
              {isLoading ? (
                <LoaderCircle className="animate-spin mx-auto" />
              ) : (
                "Verify Email"
              )}
            </button>
          </form>

          <div className="text-center text-gray-400">
            Did not receive the code?{" "}
            <span
              className="text-red-500 hover:underline cursor-pointer"
              onClick={resendEmail}>
              {resendLoading ? "Resending..." : "Resend code"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
