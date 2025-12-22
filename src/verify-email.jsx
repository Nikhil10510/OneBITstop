// import { useEffect, useState } from "react";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { useRef } from "react";
import { verifyEmail } from "./services/operations/userApi";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying...");
  const token = searchParams.get("token");
  const didCallRef = useRef(false);

  useEffect(() => {
    if (didCallRef.current) return;
    didCallRef.current = true;

    if (!token) {
      setStatus("Invalid or missing token.");
      toast(
        "Missing verification token.",
        {
          type: "error",
          duration: 3000,
          position: "bottom-right",
          icon: "❌",
        }
      );
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await verifyEmail(token);
        setStatus(response?.message || "Email verified successfully!");
        toast(
          "Email verified! You can now log in.",
          {
            type: "success",
            duration: 3000,
            position: "bottom-right",
            icon: "🎉",
          }
        );
        setTimeout(() => navigate("/"), 3000);
      } catch (err) {
        const message =
          err.response?.data?.message || "Verification failed. Try again.";
        setStatus(message);
        toast(
          "Verification failed.",
          {
            type: "error",
            duration: 3000,
            position: "bottom-right",
            icon: "❌",
          }
        );
      }
    };

    verifyToken();
  }, [token, navigate]);

 return (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 px-6 text-center">
    <Toaster position="top-center" reverseOrder={false} />
    <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-8 max-w-md w-full">
      <h1 className="text-3xl font-extrabold mb-6 text-blue-700 dark:text-blue-400">
        Email Verification
      </h1>
      <p
        className={`text-lg mb-4 ${
          status.toLowerCase().includes("success")
            ? "text-green-600"
            : status.toLowerCase().includes("failed") ||
              status.toLowerCase().includes("error")
            ? "text-red-600"
            : "text-gray-700 dark:text-gray-300"
        }`}
      >
        {status ||
          "Please wait while we verify your email. This should only take a moment."}
      </p>
      {status.toLowerCase().includes("success") && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          You will be redirected shortly...
        </p>
      )}
      {(status.toLowerCase().includes("failed") ||
        status.toLowerCase().includes("error") ||
        status.toLowerCase().includes("invalid")) && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          If the problem persists, please request a new verification email or
          contact support.
        </p>
      )}
    </div>
  </div>
);

}
