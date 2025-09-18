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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function Page() {
  const [user,setuser] = useState({
    username:"",
    password:"",
    email:""
  });
  const router = useRouter();
  const [disable,setdisable] = useState(false);
  useEffect(() => {
    if(user.username.length>0 && user.password.length>0){
      setdisable(false);
    }else{
      setdisable(true);
    }
  }, [user]);
  const onlogin = async() => {
    try {
        await axios.post("/api/login",{
        username: user.username,
        password: user.password,
      });
        toast.success("Login Successful");
        router.push("/profile");

  } catch (error:any) {
      if(error.response.status === 402 || error.response.status === 401){
        toast.error("Invalid Credentials");
      }else{
        toast.error("Something went wrong");
      }
    }
}

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-black">
      <div className="w-full max-w-sm">
        <Card className="bg-gray-900 text-white">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); onlogin(); }}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={user.username}
                  onChange={(e) => setuser({...user,username:e.target.value})}
                  placeholder="enter your username"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input 
                  id="password"
                  type="password"
                  value={user.password}
                  onChange={(e) => setuser({...user,password:e.target.value})}
                  required 
                  placeholder="enter your password" />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full bg-black hover:bg-gray-950" disabled={disable}>
                  Login
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href={"/signup"} className="underline underline-offset-4">SignUp</Link>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
