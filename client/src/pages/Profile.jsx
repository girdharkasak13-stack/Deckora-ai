import { useState } from "react";
import { motion } from "framer-motion";

import {
  Mail,
  Bell,
  Lock,
  LogOut,
  Pencil,
  Check,
} from "lucide-react";

import {
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [name, setName] = useState(
    user?.displayName || user?.email?.split("@")[0] || "User"
  );

  const [editing, setEditing] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleSave = async () => {
    try {
      if (!user) return;

      await updateProfile(user, {
        displayName: name,
      });

      setEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile.");
    }
  };

  const handlePassword = async () => {
    try {
      if (!user?.email) return;

      await sendPasswordResetEmail(auth, user.email);

      alert("Password reset link sent to your email.");
    } catch (error) {
      console.error(error);
      alert("Unable to send password reset email.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);

      alert("Logged out successfully!");

      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-10 bg-[#FFF8F5] text-[#111827]">

      {/* Header */}
      <h1 className="text-5xl font-bold tracking-tight">
        My Profile
      </h1>

      <p className="text-gray-500 mt-3">
        Manage your account settings and preferences.
      </p>

      {/* Profile Card */}
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2 }}
        className="mt-12 rounded-3xl p-8 md:p-10 bg-white border border-orange-100 shadow-lg"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          <div className="flex items-center gap-6">

            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FF4D4D] via-[#FF3CAC] to-[#A855F7] flex items-center justify-center text-3xl font-bold text-white shadow-lg">
              {name.substring(0, 2).toUpperCase()}
            </div>

            <div>
              {editing ? (
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-2xl font-bold border rounded-lg px-3 py-2 text-gray-800"
                />
              ) : (
                <h2 className="text-3xl font-bold">
                  {name}
                </h2>
              )}

              <p className="text-gray-500 mt-2">
                {user?.metadata?.creationTime
                  ? `Member since ${new Date(user.metadata.creationTime).toLocaleDateString(undefined, { month: "long", year: "numeric" })}`
                  : "Deckora member"}
              </p>
            </div>

          </div>

          {/* Edit / Save */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={
              editing
                ? handleSave
                : () => setEditing(true)
            }
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-white font-medium hover:bg-cyan-600 transition"
          >
            {editing ? (
              <Check size={18} />
            ) : (
              <Pencil size={18} />
            )}

            {editing ? "Save Profile" : "Edit Profile"}
          </motion.button>

        </div>
      </motion.div>

      {/* Details */}
      <div className="grid md:grid-cols-2 gap-8 mt-10">

        {/* Personal Information */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="rounded-3xl p-8 bg-white border border-orange-100 shadow-lg"
        >
          <h2 className="text-2xl font-bold">
            Personal Information
          </h2>

          <div className="space-y-4 mt-8">

            {/* Email */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FFF8F5]">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
                <Mail
                  className="text-cyan-500"
                  size={21}
                />
              </div>

              <span className="text-gray-700">
                {user?.email || "No email available"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Settings */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="rounded-3xl p-8 bg-white border border-orange-100 shadow-lg"
        >
          <h2 className="text-2xl font-bold">
            Settings
          </h2>

          <div className="space-y-4 mt-8">

            {/* Notifications */}
            <button
              onClick={() =>
                setNotifications(!notifications)
              }
              className="w-full flex justify-between items-center bg-[#FFF8F5] rounded-2xl p-4 hover:bg-cyan-50 transition"
            >
              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
                  <Bell
                    className="text-cyan-500"
                    size={21}
                  />
                </div>

                <span className="font-medium text-gray-700">
                  Notifications
                </span>

              </div>

              <span className="text-cyan-500 font-semibold">
                {notifications ? "ON" : "OFF"}
              </span>
            </button>

            {/* Change Password */}
            <button
              onClick={handlePassword}
              className="w-full flex justify-between items-center bg-[#FFF8F5] rounded-2xl p-4 hover:bg-orange-50 transition"
            >
              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                  <Lock
                    className="text-orange-500"
                    size={21}
                  />
                </div>

                <span className="font-medium text-gray-700">
                  Change Password
                </span>

              </div>

              <span className="text-gray-500 text-xl">
                →
              </span>
            </button>

          </div>
        </motion.div>

      </div>

      {/* Logout */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleLogout}
        className="mt-10 flex items-center gap-3 px-8 py-4 rounded-2xl bg-red-500 text-white font-medium hover:bg-red-600 transition"
      >
        <LogOut size={20} />
        Logout
      </motion.button>

    </div>
  );
}

export default Profile;