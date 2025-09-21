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
  const [user, setUser] = useState({ username: "", password: "", email: "" });
  const router = useRouter();
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(false); // new loading state

  useEffect(() => {
    setDisable(!(user.username.length > 0 && user.password.length > 0));
  }, [user]);

  const onLogin = async () => {
    setLoading(true); // start loading
    try {
      await axios.post("/api/login", {
        username: user.username,
        password: user.password,
      });
      toast.success("Login Successful");
      router.push("/profile");
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 402) {
        toast.error("Invalid Credentials");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="w-full max-w-sm">
        <Card
          className="bg-gray-900 text-white rounded-2xl border border-gray-700 shadow-2xl
                     transform transition-transform duration-300 hover:scale-105"
        >
          <CardHeader>
            <CardTitle className="text-2xl text-center">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onLogin();
              }}
            >
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={user.username}
                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                    placeholder="Enter your username"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/forgot-password"
                      className="ml-auto inline-block text-sm text-blue-400 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    required
                    placeholder="Enter your password"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    disabled={disable || loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white py-3 rounded-2xl font-semibold shadow-lg transition-all flex items-center justify-center"
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="underline underline-offset-4 text-blue-400 hover:text-blue-300">
                  SignUp
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
