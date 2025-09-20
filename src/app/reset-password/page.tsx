"use client";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function Page() {
    const router = useRouter();
    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [disable, setDisable] = useState(true);
    const [isSame, setIsSame] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!isSame) {
                toast.error("Passwords do not match");
                setLoading(false);
                return;
            }
            await axios.post('/api/resetpassword', { token, password });
            toast.success("Password reset successfully");
            setToken("");
            setPassword("");
            router.push('/login');
        }   catch (error: any) {
            console.log(error);
            if(error.response.status === 400){
              toast.error("New password cannot be same as old password");
            }else{
            toast.error("Something went wrong");
            }
        }
        setLoading(false);
    }

    useEffect(() => {
        if (password === confirmPassword) {
            setIsSame(true);
        } else {
            setIsSame(false);
        }
    }, [confirmPassword]);

     useEffect(() => {
        const urltoken = window.location.search.split("=")[1];
        console.log(urltoken);
        setToken(urltoken || "");
    }, []);

    useEffect(() => {
        if (token.length > 0 && password.length > 0) {
            setDisable(false);
        } else {
            setDisable(true);
        }
    }, [password]);
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-black">
      <div className="w-full max-w-sm">
        <Card className="bg-gray-900 text-white">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="password">Choose a New Password</Label>
                <Input
                  id="password"
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="enter new password"
                  required
                />
              </div>
              <div className="grid gap-3">
              <Label htmlFor="confirmpassword">Confirm Password</Label>
                <Input 
                  id="confirmpassword"
                  type="password"
                  value={confirmPassword }
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required 
                  placeholder="Confirm new password" />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full bg-black hover:bg-gray-950" disabled={disable}>
                    Reset Password
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
    )
}