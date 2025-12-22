import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { resetPassword } from "./services/operations/userApi";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await resetPassword(token, { password });

      setMsg(res.message);
      toast(
        "Password reset successful. Redirecting to login...",
        {
          type: "success",
          duration: 3000,
          position: "bottom-right",
          icon: "🎉",
        }
      );

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Something went wrong";
      setMsg(errorMsg);
      toast(
        errorMsg,
        {
          type: "error",
          duration: 3000,
          position: "bottom-right",
          icon: "❌",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-black dark:to-zinc-900 px-4 py-10">
      <Toaster position="top-center" />
      <div className="w-full max-w-md p-6 sm:p-8 bg-white dark:bg-zinc-900 rounded-xl shadow-lg transition-all duration-300 border dark:border-zinc-800">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
          🔐 Reset Password
        </h2>
        <p className="text-sm text-center text-gray-600 dark:text-gray-300 mb-6">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="••••••••"
              className="mt-1 w-full px-4 py-2 pr-10 rounded-md border border-gray-300 dark:border-zinc-700 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 top-[30px] flex items-center text-gray-500 dark:text-gray-300"
            >
              {showPassword ? (
                <EyeIcon className="h-5 w-5" />
              ) : (
                <EyeSlashIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Use at least 8 characters, one uppercase letter, and one number.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-200 font-semibold shadow-md disabled:opacity-60"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {msg && (
          <div className="mt-4 text-sm text-center text-blue-600 dark:text-blue-400 animate-fade-in">
            {msg}
            {msg.toLowerCase().includes("success") && " Redirecting..."}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
