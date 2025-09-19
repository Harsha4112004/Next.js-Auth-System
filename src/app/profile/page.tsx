"use client"
import React from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function page() {
  const[user,setUser]=React.useState({
    _id:"",
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

  const verify = async () => {
    try {
      await axios.post('/api/sendemailverify', { emailType: "VERIFY", userId: user._id, email: user.email });
      toast.success("Verification email sent");
    }catch (error:any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
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
        {!user.isVerified && <button className='bg-blue-600 text-white p-2 m-3 rounded-2xl hover:bg-blue-400' onClick={verify}>Verify Email</button>}
    </div>
  )
}
