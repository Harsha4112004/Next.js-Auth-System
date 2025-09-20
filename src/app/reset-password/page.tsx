"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function Page() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(true);
  const [isSame, setIsSame] = useState(false);

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  useEffect(() => {
    setIsSame(password === confirmPassword);
    setDisable(!(password.length > 0 && confirmPassword.length > 0 && token.length > 0));
  }, [password, confirmPassword, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!isSame) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await axios.post("/api/resetpassword", { token, password });
      toast.success("Password reset successfully");
      setPassword("");
      setConfirmPassword("");
      router.push("/login");
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("New password cannot be same as old password");
      } else {
        toast.error("Something went wrong");
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="w-full max-w-sm">
        <Card
          className="bg-gray-900 text-white rounded-2xl border border-gray-700 shadow-2xl
                     transform transition-transform duration-300 hover:scale-105"
        >
          <CardHeader>
            <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="password">Choose a New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="confirmpassword">Confirm Password</Label>
                <Input
                  id="confirmpassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
                {!isSame && confirmPassword.length > 0 && (
                  <span className="text-red-400 text-sm mt-1">Passwords do not match</span>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white py-3 rounded-2xl font-semibold shadow-lg transition-all"
                  disabled={disable || loading}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
