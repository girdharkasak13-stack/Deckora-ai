import { motion } from "framer-motion";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);

      alert("Account created successfully!");
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFCFA] flex items-center justify-center p-8">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white border border-orange-100 rounded-3xl p-10 shadow-[0_10px_40px_rgba(255,107,53,.10)]"
      >

        {/* Logo */}

        <div className="flex justify-center mb-7">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF4D6D] via-[#EC4899] to-[#A855F7] flex items-center justify-center shadow-[0_8px_20px_rgba(236,72,153,.25)]">
            <span className="text-white text-2xl font-bold">
              D
            </span>
          </div>
        </div>

        {/* Heading */}

        <h1 className="text-4xl font-bold text-[#0B1020] text-center">
          Create Account 🚀
        </h1>

        <p className="text-gray-500 text-center mt-3">
          Join Deckora AI and start creating amazing presentations.
        </p>

        {/* Full Name */}

        <div className="mt-8">

          <label className="text-[#0B1020] font-medium">
            Full Name
          </label>

          <div className="mt-3 flex items-center bg-[#FFFCFA] rounded-2xl border border-orange-100 px-4 focus-within:border-orange-300 transition-all">

            <User
              className="text-[#FF6B35]"
              size={20}
            />

            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent p-4 outline-none text-[#0B1020] placeholder:text-gray-400"
            />

          </div>

        </div>

        {/* Email */}

        <div className="mt-6">

          <label className="text-[#0B1020] font-medium">
            Email
          </label>

          <div className="mt-3 flex items-center bg-[#FFFCFA] rounded-2xl border border-orange-100 px-4 focus-within:border-orange-300 transition-all">

            <Mail
              className="text-[#FF6B35]"
              size={20}
            />

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent p-4 outline-none text-[#0B1020] placeholder:text-gray-400"
            />

          </div>

        </div>

        {/* Password */}

        <div className="mt-6">

          <label className="text-[#0B1020] font-medium">
            Password
          </label>

          <div className="mt-3 flex items-center bg-[#FFFCFA] rounded-2xl border border-orange-100 px-4 focus-within:border-orange-300 transition-all">

            <Lock
              className="text-[#FF6B35]"
              size={20}
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent p-4 outline-none text-[#0B1020] placeholder:text-gray-400"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff
                  className="text-gray-400 hover:text-[#FF6B35] transition"
                  size={20}
                />
              ) : (
                <Eye
                  className="text-gray-400 hover:text-[#FF6B35] transition"
                  size={20}
                />
              )}
            </button>

          </div>

        </div>

        {/* Confirm Password */}

        <div className="mt-6">

          <label className="text-[#0B1020] font-medium">
            Confirm Password
          </label>

          <div className="mt-3 flex items-center bg-[#FFFCFA] rounded-2xl border border-orange-100 px-4 focus-within:border-orange-300 transition-all">

            <Lock
              className="text-[#FF6B35]"
              size={20}
            />

            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-transparent p-4 outline-none text-[#0B1020] placeholder:text-gray-400"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              {showConfirmPassword ? (
                <EyeOff
                  className="text-gray-400 hover:text-[#FF6B35] transition"
                  size={20}
                />
              ) : (
                <Eye
                  className="text-gray-400 hover:text-[#FF6B35] transition"
                  size={20}
                />
              )}
            </button>

          </div>

        </div>

        {/* Create Account */}

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSignup}
          className="w-full mt-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF5A36] via-[#EC4899] to-[#A855F7] text-white font-semibold text-lg shadow-[0_0_30px_rgba(236,72,153,.25)]"
        >
          Create Account
        </motion.button>

        {/* Divider */}

        <div className="flex items-center my-6">

          <div className="flex-1 h-px bg-orange-100"></div>

          <span className="px-4 text-gray-400 text-sm">
            OR
          </span>

          <div className="flex-1 h-px bg-orange-100"></div>

        </div>

        {/* Google */}

        <button
          type="button"
          className="w-full border border-orange-100 rounded-2xl py-4 text-[#0B1020] hover:bg-orange-50 transition"
        >
          Continue with Google
        </button>

        {/* Login */}

        <p className="text-center text-gray-500 mt-8">

          Already have an account?{" "}

          <span
            onClick={() => navigate("/login")}
            className="text-[#FF6B35] font-medium cursor-pointer hover:underline"
          >
            Login
          </span>

        </p>

      </motion.div>

    </div>
  );
}

export default Signup;