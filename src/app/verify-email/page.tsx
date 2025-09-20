"use client";
import axios from "axios";
import {useState,useEffect} from "react";
import Link from "next/link";

export default function page() {
    const [token, setToken] = useState("");
    const [verified,setverified] = useState(false);
    const [error, setError] = useState(false);
    const verifyEmail = async () => {
        try {
            await axios.post('/api/verifyemail', { token });
            setverified(true);   
        } catch (error) {
            setError(true);
            console.log(error);
        }
    }

    useEffect(() => {
        const urltoken = window.location.search.split("=")[1];
        console.log(urltoken);
        setToken(urltoken || "");
    }, []);

    useEffect(() => {
        if (token.length > 0 ) {
            verifyEmail();
        }
    }, [token]);
    return (
        <div className="text-white bg-gray-950 min-h-screen flex items-center justify-center flex-col">
            <h1 className="font-bold text-2xl">Email Verification</h1>
            {verified && <h1 className="text-green-500">Email verified successfully</h1>}
            {error && <h1 className="text-red-500">Invalid or expired token</h1>}
            {(error || verified) && <Link href="/profile" className="bg-blue-600 text-white p-2 m-3 rounded-2xl hover:bg-blue-400">Go to Profile</Link>}
        </div>
    );
}