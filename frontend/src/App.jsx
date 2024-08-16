import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import {
  HomePage,
  LoginPage,
  SignUpPage,
  VerifyEmailPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  WatchPage,
  SearchPage,
  SearchHistoryPage,
  NotFoundPage,
  ProfilePage,
} from "./pages";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import { useAuthStore } from "./store/authStore";
import { LoaderCircle } from "lucide-react";

const ProtectedRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated && !user && !user?.isVerified) {
    return <Navigate to="/login" replace />;
  }

  if (user && !user?.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  const { getCurrentUser, isCheckingAuth, isLoading } = useAuthStore();
  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  if (isCheckingAuth || isLoading) {
    return (
      <div className="h-screen">
        <div className="flex items-center justify-center bg-[#232323]">
          <LoaderCircle className="w-10 h-10 animate-spin" />
        </div>
      </div>
    );
  }
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <SignUpPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/verify-email"
          element={
            <RedirectAuthenticatedUser>
              <VerifyEmailPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <RedirectAuthenticatedUser>
              <ForgotPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <RedirectAuthenticatedUser>
              <ResetPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="watch/:id"
          element={
            <ProtectedRoute>
              <WatchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <SearchHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
      <Toaster />
    </>
  );
};

export default App;
