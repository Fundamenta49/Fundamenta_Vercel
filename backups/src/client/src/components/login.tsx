import React, { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [_, setLocation] = useLocation();
  
  // Get auth context functions
  const { login, signUp, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isSignUp) {
      // Handle sign up
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
      
      // Use the username or extract one from email if not provided
      const username = name || email.split('@')[0];
      
      // Use the signUp function from our auth context
      const success = await signUp(username, email, password);
      
      if (success) {
        // Store the username for the tour
        localStorage.setItem('tourUserName', username);
        
        // Registration successful, redirect to home page
        setLocation("/");
      } else {
        setError("This email is already registered. Please log in instead.");
      }
    } else {
      // Handle login using our auth context
      const success = await login(email, password);
      
      if (success) {
        // Get user info to set tour name - this will be pulled from auth context
        // The auth context will later set the userName in the tour context
        
        // Login successful, redirect to home page
        setLocation("/");
      } else {
        setError("Invalid credentials. Please try again.");
      }
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
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          {isSignUp ? "Create an Account" : "Log In"}
        </h3>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <input
              type="text"
              placeholder="Your Name"
              className="w-full mb-3 p-3 border border-gray-300 rounded-xl"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          
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
            className="w-full mb-3 p-3 border border-gray-300 rounded-xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          {isSignUp && (
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full mb-3 p-3 border border-gray-300 rounded-xl"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}
          
          <button 
            type="submit" 
            className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition-all disabled:bg-orange-400"
            disabled={loading}
          >
            {loading 
              ? (isSignUp ? "Creating Account..." : "Logging in...") 
              : (isSignUp ? "Create Account" : "Enter the World of Fundamenta")}
          </button>
        </form>
        
        {!isSignUp && (
          <div className="mt-4 text-xs text-gray-500">
            <p>For demo purposes:</p>
            <p>Email: admin@fundamenta.app</p>
            <p>Password: admin123</p>
          </div>
        )}
        
        <p className="text-sm mt-4 text-gray-500">
          {isSignUp 
            ? "Already have an account? " 
            : "Don't have an account? "}
          <span 
            className="text-orange-600 font-medium hover:underline cursor-pointer"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
            }}
          >
            {isSignUp ? "Log in here" : "Sign up here"}
          </span>
        </p>
      </div>
    </div>
  );
}