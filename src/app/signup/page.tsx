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
  const router = useRouter()
  const [user,setuser] = useState({
    username:"",
    password:"",
    email:""
  });
  const [disable,setdisable] = useState(false);
  useEffect(() => {
    if(user.username.length>0 && user.password.length>0 && user.email.length>0){
      setdisable(false);
    }
    else{
      setdisable(true);
    }
  },[user])
  const onsignup = async() => {  
    try{
      await axios.post("/api/signup",user);
      toast.success("Signup Successful");
      router.push("/login");
      }
    catch(err: any){
      if (err.response) {
      if (err.response.status === 401) {
        toast.error("Username already exists");
      } else if (err.response.status === 402) {
        toast.error("Email already exists");
      }
      else {
        toast.error("Signup Failed");
      }
    }
    else{
    toast.error("server error"); 
    }
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-black">
      <div className="w-full max-w-sm">
        <Card className="bg-gray-900 text-white">
        <CardHeader>
          <CardTitle className="text-2xl text-center">SignUp</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); onsignup(); }}>
            <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="username">Username</Label>
                </div>
                <Input
                  id="username"
                  type="text"
                  value={user.username}
                  onChange={(e) => setuser({...user,username:e.target.value})}
                  placeholder="enter your username"
                  required
                  className="mb-6"
                />
              </div>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="enter your email"
                  value={user.email}
                  onChange={(e) => setuser({...user,email:e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password" 
                  type="password" 
                  value={user.password}
                  onChange={(e) => setuser({...user,password:e.target.value})}
                  required 
                  placeholder="enter your password"  
                  />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" disabled={disable} className="w-full bg-black hover:bg-gray-950 ">
                  Signup
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href={"/login"} className="underline underline-offset-4">Login</Link>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
