"use client";

import React from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = React.useState<{
    _id: string;
    username: string;
    email: string;
    isVerified?: boolean;
  } | null>(null);
  const [loading, setLoading] = React.useState(true);

  const router = useRouter();

  const logout = async () => {
    try {
      await axios.get("/api/logout");
      toast.success("Logout successful");
      router.push("/login");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const sendVerificationEmail = async () => {
    if (!user) return;
    try {
      await axios.post("/api/sendemailverify", {
        emailType: "VERIFY",
        userId: user._id,
        email: user.email,
      });
      toast.success("Verification email sent");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/me");
        setUser(response.data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch user info");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="bg-gray-950 min-h-screen flex items-center justify-center p-4">
      <div
        className="bg-gray-900 text-white rounded-2xl border border-gray-700 shadow-2xl p-8 w-full max-w-md flex flex-col items-center
                   transform transition-transform duration-300 hover:scale-105"
      >
        <h1 className="text-3xl font-bold mb-6">Profile</h1>

        <div className="space-y-2 mb-6 text-center w-full">
          {loading ? (
            <>
              <div className="h-5 bg-gray-700 rounded w-3/4 mx-auto animate-pulse"></div>
              <div className="h-5 bg-gray-700 rounded w-5/6 mx-auto animate-pulse"></div>
              <div className="h-5 bg-gray-700 rounded w-1/2 mx-auto animate-pulse"></div>
            </>
          ) : (
            <>
              <p>
                <span className="font-semibold">Username:</span> {user?.username}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {user?.email}
              </p>
              <p>
                <span className="font-semibold">Email Verified:</span>{" "}
                {user?.isVerified ? (
                  <span className="text-green-400 font-semibold">Yes</span>
                ) : (
                  <span className="text-red-400 font-semibold">No</span>
                )}
              </p>
            </>
          )}
        </div>

        {!loading && (
          <div className="flex flex-col w-full gap-3">
            <button
              onClick={logout}
              className="w-full bg-blue-600 hover:bg-blue-500 transition-colors text-white py-2 rounded-2xl font-medium"
            >
              Logout
            </button>

            {!user?.isVerified && (
              <button
                onClick={sendVerificationEmail}
                className="w-full bg-green-500 hover:bg-green-400 transition-colors text-white py-2 rounded-2xl font-medium"
              >
                Send Verification Email
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
