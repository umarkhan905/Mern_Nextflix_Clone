import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/dateFunction";
import axios from "axios";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";

const ProfilePage = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      const confirmDelete = window.confirm(
        "Are you sure you want to delete your account?"
      );
      if (!confirmDelete) {
        setLoading(false);
        return;
      }
      const { data } = await axios.delete(`/api/v1/users/delete-account`);
      toast.success(data.message);
      setLoading(false);

      window.location.reload();
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Error deleting account:", error);
      setLoading(false);
    }
  };
  return (
    <div className="text-white bg-black min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-medium mb-4">@{user?.username}</h1>
        <div className="flex">
          <div className="overflow-hidden mr-4">
            <img
              src={`${user?.profilePicture}`}
              alt="Profile"
              className="size-32 object-cover rounded-md"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{user?.name}</h2>
            <p className="text-gray-400 mb-2">{user?.email}</p>
            <p className="text-gray-400 mb-4">
              Date Joined: {formatDate(user?.createdAt)}
            </p>
            <button
              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"
              onClick={handleDeleteAccount}>
              {loading ? (
                <LoaderCircle className="w-5 h-5 animate-spin" />
              ) : (
                "Delete Account"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
