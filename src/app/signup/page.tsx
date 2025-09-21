"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState({ username: "", password: "", email: "" });
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    const isUsernameValid = user.username.length >= 6;
    const isPasswordValid = user.password.length >= 8;
    const isEmailValid = user.email.length > 0;

    setDisable(!(isUsernameValid && isPasswordValid && isEmailValid));
  }, [user]);

  const onSignup = async () => {
    setLoading(true); // Start loading
    try {
      await axios.post("/api/signup", user);
      toast.success("Signup Successful");
      router.push("/login");
    } catch (err: any) {
      if (err.response) {
        if (err.response.status === 401) {
          toast.error("Username already exists");
        } else if (err.response.status === 402) {
          toast.error("Email already exists");
        } else {
          toast.error("Signup Failed");
        }
      } else {
        toast.error("Server error");
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="w-full max-w-sm">
        <Card className="bg-gray-900 text-white rounded-2xl border border-gray-700 shadow-2xl transform transition-transform duration-300 hover:scale-105">
          <CardHeader>
            <CardTitle className="text-2xl text-center">SignUp</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSignup();
              }}
              className="flex flex-col gap-6"
            >
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={user.username}
                  onChange={(e) => setUser({ ...user, username: e.target.value })}
                  placeholder="Enter your username"
                  required
                />
                {user.username && user.username.length < 6 && (
                  <p className="text-red-400 text-sm mt-1">Username must be at least 6 characters</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={user.password}
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  placeholder="Enter your password"
                  required
                />
                {user.password && user.password.length < 8 && (
                  <p className="text-red-400 text-sm mt-1">Password must be at least 8 characters</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={disable || loading} // Disable button while loading
                className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white py-3 rounded-2xl font-semibold shadow-lg transition-all flex items-center justify-center"
              >
                {loading ? "Signing up..." : "Signup"} {/* Show loading text */}
              </Button>

              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4 text-blue-400 hover:text-blue-300">
                  Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
