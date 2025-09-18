"use client"
import React from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function page() {
  const[user,setUser]=React.useState({
    username:"",
    email:"",
    isVerified:undefined
  });
  const router = useRouter();
  const logout = async () => {
    try {
      await axios.get('/api/logout');
      toast.success("Logout successful");
      router.push('/login');
    } catch (error) {
      toast.error("Something went wrong");
    }
  }
  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/me');
        setUser(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchUser();
  }, []);
  return (
    <div className='text-white bg-gray-950 min-h-screen flex items-center justify-center flex-col'>
        <h1 className='font-bold text-2xl'>Profile</h1>
        <h1>Username: {user.username}</h1>
        <h1>Email: {user.email}</h1>
        <h1>Email Verified: {user.isVerified ? "Yes" : "No"}</h1>
        <button className='bg-blue-600 text-white p-2 m-3 rounded-2xl hover:bg-blue-400' onClick={logout}>Logout</button>

    </div>
  )
}
