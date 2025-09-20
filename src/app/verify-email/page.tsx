"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function EmailVerificationPage() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  const verifyEmail = async () => {
    try {
      await axios.post("/api/verifyemail", { token });
      setVerified(true);
    } catch (err) {
      console.log(err);
      setError(true);
    }
  };

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  useEffect(() => {
    if (token) verifyEmail();
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-950 to-gray-900 p-6">
      <div className="bg-gray-900 text-white rounded-2xl border border-gray-700 shadow-2xl p-8 max-w-md w-full text-center transform transition-transform duration-300 hover:scale-105">
        <h1 className="text-2xl font-bold mb-4">Email Verification</h1>

        {verified && <p className="text-green-500 font-semibold">Email verified successfully!</p>}
        {error && <p className="text-red-500 font-semibold">Invalid or expired token.</p>}
        {!verified && !error && <p className="text-gray-400">Verifying your email...</p>}

        {(verified || error) && (
          <Link
            href="/profile"
            className="inline-block mt-6 bg-blue-600 hover:bg-blue-500 text-white py-2 px-6 rounded-2xl transition-colors"
          >
            Go to Profile
          </Link>
        )}
      </div>
    </div>
  );
}
