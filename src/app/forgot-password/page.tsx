"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(true);

  useEffect(() => {
    setDisable(email.length === 0);
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/sendresetpassword", { emailType: "RESET", email });
      toast.success("Reset link sent to your email");
      setEmail("");
      router.push("/login");
    } catch (error: any) {
      console.log(error);
      if (error.response?.status === 404) {
        toast.error("Email not registered");
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
            <CardTitle className="text-2xl text-center">Forgot Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Enter Your Email</Label>
                  <Input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="abc@gmail.com"
                    required
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white py-3 rounded-2xl font-semibold shadow-lg transition-all"
                    disabled={disable}
                  >
                    Send Reset Link
                  </Button>
                </div>
              </div>
            </form>
            {loading && (
              <div className="mt-4 text-center text-gray-300">Processing...</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
