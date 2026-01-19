"use client";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (!error) {
      alert("Account created. Please login.");
      window.location.href = "/login";
    } else {
      alert(error.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-80 space-y-4">
        <h1 className="text-xl font-bold">Create Account</h1>
        <input
          className="border p-2 w-full"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-black text-white w-full p-2"
          onClick={signup}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
