import React, { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { login, signUp, loading } = useAuth();
  const [, setLocation] = useLocation();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Don't allow form submission if already loading
    if (loading) {
      console.log("Form submission already in progress");
      return;
    }

    if (isSignUp) {
      // Handle sign up - validate inputs first
      if (!email) {
        setError("Email is required");
        return;
      }
      
      if (!email.includes('@') || !email.includes('.')) {
        setError("Please enter a valid email address");
        return;
      }
      
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
      
      // Use the username or extract one from email if not provided
      let username = name;
      if (!username || username.trim() === '') {
        username = email.split('@')[0];
      }
      
      try {
        console.log("Attempting to register new user...");
        
        // Use the signUp function from our auth context
        const success = await signUp(username, email, password);
        
        if (success) {
          console.log("Registration successful");
          
          // Store the username for the tour with proper capitalization for better greeting
          const formattedName = username.charAt(0).toUpperCase() + username.slice(1);
          localStorage.setItem('tourUserName', formattedName);
          
          // Also capture that this is a brand new user who should definitely see the tour
          localStorage.setItem('newUser', 'true');
          localStorage.removeItem('hasSeenTour'); // Explicitly ensure tour will be shown
          
          // Small delay to ensure everything is saved before redirecting
          setTimeout(() => {
            // Clear form fields
            setEmail("");
            setPassword("");
            setName("");
            setConfirmPassword("");
            
            console.log("Redirecting to home page after successful registration");
            setLocation("/");
          }, 300);
        } else {
          setError("This email is already registered. Please log in instead.");
        }
      } catch (error) {
        setError("An error occurred during sign up. Please try again.");
        console.error(error);
      }
    } else {
      // Handle login - validate inputs first
      if (!email) {
        setError("Email is required");
        return;
      }
      
      if (!password) {
        setError("Password is required");
        return;
      }
      
      try {
        console.log("Attempting to log in...");
        
        const success = await login(email, password);
        if (success) {
          console.log("Login successful");
          
          // Get username from email for the tour if not already set
          if (!localStorage.getItem('tourUserName')) {
            const username = email.split('@')[0];
            const formattedName = username.charAt(0).toUpperCase() + username.slice(1);
            localStorage.setItem('tourUserName', formattedName);
          }
          
          // Check if user has never completed the tour
          const hasSeenTour = localStorage.getItem('hasSeenTour');
          if (!hasSeenTour) {
            // Flag them to see the tour but don't force for returning users
            localStorage.setItem('showTourSuggestion', 'true');
          }
          
          // Small delay to ensure everything is saved before redirecting
          setTimeout(() => {
            // Clear form fields
            setEmail("");
            setPassword("");
            
            console.log("Redirecting to home page after successful login");
            setLocation("/");
          }, 300);
        } else {
          setError("Invalid credentials. Please try again.");
        }
      } catch (error) {
        setError("An error occurred. Please try again.");
        console.error(error);
      }
    }
  };

  // Create an alternate version of the component depending on signup or login state
  const showSignupForm = () => {
    // Clear fields and set signup mode
    setEmail("");
    setPassword("");
    setError("");
    setIsSignUp(true);
  };

  const showLoginForm = () => {
    // Clear fields and set login mode
    setEmail("");
    setPassword("");
    setName("");
    setConfirmPassword("");
    setError("");
    setIsSignUp(false);
  };

  // Conditionally render the login or signup form
  // But we do this using a condition to select which form fields to show
  // rather than using a different component for each

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 text-center p-4 sm:p-6">
      <div className="mb-6 sm:mb-10">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-700 mb-2">
          Life doesn't come with a manual—until now.
        </h2>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-orange-800">
          It's Fun. It's Fundamental... It's Fundamenta!
        </h1>
      </div>

      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xl w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          {isSignUp ? "Create an Account" : "Log In"}
        </h3>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {/* Single form that adapts based on isSignUp state */}
        <form onSubmit={handleSubmit} className="w-full space-y-3 md:space-y-4">
          {/* Name field only shown for signup */}
          {isSignUp && (
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 sm:p-4 text-base sm:text-lg border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          )}
          
          {/* Email field shown for both */}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 sm:p-4 text-base sm:text-lg border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          
          {/* Password field shown for both */}
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 sm:p-4 text-base sm:text-lg border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={isSignUp ? "new-password" : "current-password"}
          />
          
          {/* Confirm password field only shown for signup */}
          {isSignUp && (
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-3 sm:p-4 text-base sm:text-lg border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          )}
          
          {/* Submit button adapts text based on mode */}
          <button 
            type="submit" 
            className="w-full mt-4 bg-orange-600 text-white font-bold py-3 sm:py-4 px-4 text-base sm:text-lg rounded-xl hover:bg-orange-700 active:bg-orange-800 transition-all disabled:bg-orange-400 shadow-md hover:shadow-lg"
            disabled={loading}
          >
            {loading 
              ? (isSignUp ? "Creating Account..." : "Logging in...") 
              : (isSignUp ? "Create Account" : "Enter the World of Fundamenta")}
          </button>
        </form>
        
        {/* Demo credentials only shown on login */}
        {!isSignUp && (
          <div className="mt-4 text-xs text-gray-500">
            <p>For demo purposes:</p>
            <p>Email: admin@fundamenta.app</p>
            <p>Password: admin123</p>
          </div>
        )}
        
        {/* Switch between login/signup mode */}
        <div className="flex flex-col items-center mt-6">
          <p className="text-sm mb-2 text-gray-500">
            {isSignUp 
              ? "Already have an account?" 
              : "Don't have an account?"}
          </p>
          <button
            type="button"
            className="text-orange-600 bg-orange-50 hover:bg-orange-100 font-medium py-2 px-6 rounded-full border border-orange-200 text-sm sm:text-base transition-all active:scale-95 touch-manipulation"
            onClick={isSignUp ? showLoginForm : showSignupForm}
          >
            {isSignUp ? "Log in instead" : "Create a new account"}
          </button>
        </div>
      </div>
    </div>
  );
}