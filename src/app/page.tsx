"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const goToProfile = () => {
    router.push("/profile"); // assuming your profile page is at /profile
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-950 to-gray-900 p-6">
      <Card className="bg-gray-900 border border-gray-700  text-white max-w-md w-full shadow-xl rounded-3xl transform hover:scale-105 transition-transform duration-300">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold mb-2">Welcome Back!</CardTitle>
          <p className="text-gray-300">Manage your profile and account settings easily.</p>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6 mt-4">
          <Button
            onClick={goToProfile}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white py-3 rounded-2xl font-semibold shadow-lg transition-all"
          >
            View Profile
          </Button>
          <p className="text-gray-400 text-sm text-center">
            Explore your dashboard and manage your account securely.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
