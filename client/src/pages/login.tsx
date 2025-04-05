import React, { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, loading } = useAuth();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const success = await login(email, password);
      if (success) {
        setLocation("/");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 text-center p-6">
      <div className="mb-10">
        <h2 className="text-2xl md:text-3xl font-medium text-gray-700 mb-2">
          Life doesn't come with a manual—until now.
        </h2>
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-800">
          It's Fun. It's Fundamental... It's Fundamenta!
        </h1>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Log In</h3>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-3 p-3 border border-gray-300 rounded-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 p-3 border border-gray-300 rounded-xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            type="submit" 
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all disabled:bg-indigo-400"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Enter the World of Fundamenta"}
          </button>
        </form>
        
        <div className="mt-4 text-xs text-gray-500">
          <p>For demo purposes:</p>
          <p>Email: admin@fundamenta.app</p>
          <p>Password: admin123</p>
        </div>
        
        <p className="text-sm mt-4 text-gray-500">
          Don't have an account? <span className="text-indigo-600 font-medium hover:underline cursor-pointer">Sign up here</span>
        </p>
      </div>
    </div>
  );
}