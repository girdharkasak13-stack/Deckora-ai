import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  EmailAuthProvider,
  linkWithCredential,
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Check Google redirect result
  useEffect(() => {
    const checkGoogleLogin = async () => {
      try {
        const result = await getRedirectResult(auth);

        if (!result) return;

        const user = result.user;

        // Check if Email/Password is already linked
        const hasPassword = user.providerData.some(
          (provider) => provider.providerId === "password"
        );

        // If password is not linked, create one
        if (!hasPassword) {
          const newPassword = window.prompt(
            "Google login successful!\n\nCreate a password so you can also login with Email + Password:"
          );

          if (!newPassword) {
            alert("Google login successful! You can set a password later.");
            navigate("/dashboard");
            return;
          }

          if (newPassword.length < 6) {
            alert("Password must be at least 6 characters.");
            navigate("/dashboard");
            return;
          }

          const credential = EmailAuthProvider.credential(
            user.email,
            newPassword
          );

          await linkWithCredential(user, credential);

          alert(
            "Success! You can now login with Google OR Email + Password."
          );
        } else {
          alert("Google login successful!");
        }

        navigate("/dashboard");
      } catch (error) {
        console.error("GOOGLE LOGIN ERROR:", error);

        if (error.code === "auth/credential-already-in-use") {
          alert(
            "This email already has another account with a password. Please use that account."
          );
        } else if (error.code === "auth/provider-already-linked") {
          alert("Email + Password is already linked.");
          navigate("/dashboard");
        } else {
          alert(error.message);
        }
      }
    };

    checkGoogleLogin();
  }, [navigate]);

  // Email + Password Login
  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);

      alert("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error("EMAIL LOGIN ERROR:", error);

      if (error.code === "auth/invalid-credential") {
        alert(
          "Invalid email or password.\n\nIf you created this account using Google, first login with Google and set a password."
        );
      } else {
        alert(error.message);
      }
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();

      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("GOOGLE REDIRECT ERROR:", error);
      alert(error.message);
    }
  };

  // Forgot Password
  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email first.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);

      alert("Password reset link sent to your email.");
    } catch (error) {
      console.error("PASSWORD RESET ERROR:", error);

      if (error.code === "auth/user-not-found") {
        alert("No account found with this email.");
      } else {
        alert(error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F6] flex items-center justify-center p-6">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-[28px] border border-orange-100 p-10 shadow-[0_15px_45px_rgba(255,120,70,0.12)]"
      >

        {/* Heading */}
        <div className="text-center">

          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF4D4D] via-[#FF3CAC] to-[#A855F7] flex items-center justify-center shadow-lg">
            <span className="text-white text-xl font-bold">
              D
            </span>
          </div>

          <h1 className="text-4xl font-bold text-[#111827] mt-6">
            Welcome Back 👋
          </h1>

          <p className="text-gray-500 mt-3">
            Login to continue using Deckora AI.
          </p>

        </div>

        {/* Email */}
        <div className="mt-10">

          <label className="text-[#374151] font-medium">
            Email
          </label>

          <div className="mt-3 flex items-center bg-[#FFFCFA] rounded-2xl border border-orange-100 px-4 focus-within:border-orange-300 focus-within:shadow-[0_0_20px_rgba(255,140,80,0.12)] transition-all">

            <Mail
              className="text-[#FF6B35]"
              size={20}
            />

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent p-4 outline-none text-[#111827] placeholder:text-gray-400"
            />

          </div>

        </div>

        {/* Password */}
        <div className="mt-6">

          <label className="text-[#374151] font-medium">
            Password
          </label>

          <div className="mt-3 flex items-center bg-[#FFFCFA] rounded-2xl border border-orange-100 px-4 focus-within:border-orange-300 focus-within:shadow-[0_0_20px_rgba(255,140,80,0.12)] transition-all">

            <Lock
              className="text-[#FF6B35]"
              size={20}
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent p-4 outline-none text-[#111827] placeholder:text-gray-400"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-[#FF6B35] transition"
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>

          </div>

        </div>

        {/* Forgot Password */}
        <div className="flex justify-end mt-4">

          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-[#FF6B35] text-sm font-medium hover:underline"
          >
            Forgot Password?
          </button>

        </div>

        {/* Login */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogin}
          className="w-full mt-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF6B35] via-[#FF3CAC] to-[#A855F7] text-white font-semibold text-lg shadow-[0_10px_30px_rgba(255,80,100,0.25)]"
        >
          Login
        </motion.button>

        {/* Divider */}
        <div className="flex items-center my-7">

          <div className="flex-1 h-px bg-orange-100"></div>

          <span className="px-4 text-gray-400 text-sm">
            OR
          </span>

          <div className="flex-1 h-px bg-orange-100"></div>

        </div>

        {/* Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-4 rounded-2xl border border-orange-100 bg-white text-[#374151] font-medium hover:bg-[#FFF9F6] hover:border-orange-200 transition"
        >
          Continue with Google
        </button>

        {/* Sign Up */}
        <p className="text-center text-gray-500 mt-8">

          Don't have an account?{" "}

          <span
            onClick={() => navigate("/signup")}
            className="text-[#FF6B35] font-semibold cursor-pointer hover:underline"
          >
            Sign Up
          </span>

        </p>

      </motion.div>

    </div>
  );
}

export default Login;